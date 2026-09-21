import http from "node:http";
import { isIP } from "node:net";
import { timingSafeEqual } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  Store,
  acquireLock,
  atomicWrite,
  id,
  getProject,
  getRelease,
  isMissing,
} from "./store.js";
import { Workbench, draftEML } from "./actions.js";
import { repoView, safeRead } from "./git.js";
import type { ViteDevServer } from "vite";

export interface Session {
  url: string;
  token: string;
}
export interface ServerOptions {
  dir: string;
  host?: string;
  port?: number;
  dev?: boolean;
}
const root = fileURLToPath(new URL("../../", import.meta.url));
export function isLoopback(host: string) {
  return Boolean(isIP(host)) && (host === "::1" || host.startsWith("127."));
}
const json = (response: http.ServerResponse, value: unknown) => {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(value));
};
async function requestJSON(request: http.IncomingMessage) {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1 << 20) throw new Error("JSON request exceeds 1 MiB");
    chunks.push(chunk as Buffer);
  }
  return JSON.parse(
    Buffer.concat(chunks)
      .toString("utf8")
      .replace(/^\uFEFF/, ""),
  ) as unknown;
}
async function rejectLiveSession(dir: string) {
  let previous: Session;
  try {
    previous = JSON.parse(
      await fs.readFile(path.join(dir, "session.json"), "utf8"),
    ) as Session;
  } catch (error) {
    if (isMissing(error)) return;
    throw error;
  }
  const url = new URL(previous.url);
  if (
    url.protocol !== "http:" ||
    !isLoopback(url.hostname.replace(/^\[|\]$/g, ""))
  )
    throw new Error("Invalid saved local session URL");
  let running = false;
  try {
    const response = await fetch(`${previous.url}/api/state`, {
      headers: { Authorization: `Bearer ${previous.token}` },
      signal: AbortSignal.timeout(1200),
      redirect: "error",
    });
    running = response.ok;
    await response.body?.cancel();
  } catch {
    /* Old server is no longer reachable. */
  }
  if (running)
    throw new Error(
      "An IRA server already uses this data directory. Stop it before migrating or restarting.",
    );
}
export async function startServer(options: ServerOptions) {
  const host = options.host || "127.0.0.1";
  if (!isLoopback(host))
    throw new Error("IRA only binds a numeric loopback address");
  const store = await Store.open(options.dir);
  await rejectLiveSession(store.dir);
  const unlock = await acquireLock(store.dir);
  const workbench = new Workbench(store);
  const token = id() + id();
  let expectedHost = "";
  let vite: ViteDevServer | undefined;
  const server = http.createServer(async (request, response) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("Cache-Control", "no-store");
    response.setHeader(
      "Content-Security-Policy",
      `default-src 'self'; script-src 'self'; style-src 'self'${options.dev ? " 'unsafe-inline'" : ""}; img-src 'self' data:; connect-src 'self'${options.dev ? " ws:" : ""}; frame-ancestors 'none'; base-uri 'none'; form-action 'self'`,
    );
    if (
      request.headers.host !== expectedHost ||
      (request.headers.origin &&
        request.headers.origin !== `http://${expectedHost}`)
    ) {
      response.writeHead(403);
      response.end("invalid host or origin");
      return;
    }
    const url = new URL(request.url || "/", "http://localhost");
    try {
      if (url.pathname.startsWith("/api/")) {
        const supplied = Buffer.from(
            (request.headers.authorization || "").replace(/^Bearer /, ""),
          ),
          expected = Buffer.from(token);
        if (
          supplied.length !== expected.length ||
          !timingSafeEqual(supplied, expected)
        ) {
          response.statusCode = 401;
          json(response, {
            error: "会话已过期，请打开终端中本次启动的完整链接。",
          });
          return;
        }
        if (url.pathname === "/api/action") {
          if (request.method !== "POST") throw new Error("POST required");
          json(response, await workbench.action(await requestJSON(request)));
          return;
        }
        if (request.method !== "GET") throw new Error("GET required");
        const query = url.searchParams,
          state = store.snapshot();
        switch (url.pathname) {
          case "/api/state":
            json(response, { state, dataDir: store.dir, runtime: "node" });
            return;
          case "/api/project":
            json(
              response,
              await repoView(getProject(state, query.get("id") || "")),
            );
            return;
          case "/api/file":
            json(response, {
              text: (
                await safeRead(
                  getProject(state, query.get("projectId") || "").path,
                  query.get("path") || "",
                )
              ).toString("utf8"),
            });
            return;
          case "/api/notes":
            json(response, {
              text: await store.notes(query.get("projectId") || ""),
            });
            return;
          case "/api/packet":
            json(
              response,
              await workbench.packet(
                query.get("releaseId") || "",
                query.get("jobId") || "",
              ),
            );
            return;
          case "/api/progress":
            json(
              response,
              await workbench.progress(query.get("releaseId") || ""),
            );
            return;
          case "/api/draft": {
            const draft = getRelease(
              state,
              query.get("releaseId") || "",
            ).drafts.find((d) => d.id === query.get("id"));
            if (!draft) throw new Error("draft not found");
            response.setHeader("Content-Type", "message/rfc822");
            response.setHeader(
              "Content-Disposition",
              'attachment; filename="ira-draft.eml"',
            );
            response.end(draftEML(draft));
            return;
          }
          default:
            response.statusCode = 404;
            json(response, { error: "unknown API route" });
            return;
        }
      }
      if (request.method !== "GET" && request.method !== "HEAD") {
        response.statusCode = 405;
        response.end("method not allowed");
        return;
      }
      if (vite) {
        vite.middlewares(request, response, () => {
          response.statusCode = 404;
          response.end("not found");
        });
        return;
      }
      const webRoot = path.join(root, "dist", "web"),
        relative =
          decodeURIComponent(url.pathname).replace(/^\//, "") || "index.html";
      const file = path.resolve(webRoot, relative);
      if (!file.startsWith(webRoot + path.sep)) {
        response.statusCode = 403;
        response.end("invalid path");
        return;
      }
      const mime: Record<string, string> = {
        ".html": "text/html; charset=utf-8",
        ".js": "text/javascript; charset=utf-8",
        ".css": "text/css; charset=utf-8",
        ".svg": "image/svg+xml",
        ".json": "application/json",
        ".map": "application/json",
      };
      response.setHeader(
        "Content-Type",
        mime[path.extname(file)] || "application/octet-stream",
      );
      response.end(await fs.readFile(file));
    } catch (error) {
      if (!response.headersSent) {
        response.statusCode = isMissing(error) ? 404 : 400;
        json(response, {
          error: error instanceof Error ? error.message : String(error),
        });
      } else response.destroy();
    }
  });
  server.headersTimeout = 5000;
  server.requestTimeout = 30000;
  server.keepAliveTimeout = 5000;
  try {
    if (options.dev) {
      const { createServer } = await import("vite");
      vite = await createServer({
        configFile: false,
        root: path.join(root, "web"),
        server: {
          middlewareMode: true,
          hmr: { server },
          fs: {
            strict: true,
            allow: [path.join(root, "web"), path.join(root, "src", "shared")],
          },
        },
      });
    } else {
      await fs.access(path.join(root, "dist", "web", "index.html"));
    }
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(options.port ?? 8787, host, () => {
        server.removeListener("error", reject);
        resolve();
      });
    });
    const address = server.address();
    if (!address || typeof address === "string")
      throw new Error("No TCP listener");
    expectedHost = `${host.includes(":") ? `[${host}]` : host}:${address.port}`;
    const session: Session = { url: `http://${expectedHost}`, token };
    await atomicWrite(
      path.join(store.dir, "session.json"),
      JSON.stringify(session, null, 2),
    );
    let closed = false;
    const close = async () => {
      if (closed) return;
      closed = true;
      await vite?.close();
      await new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
        server.closeAllConnections();
      });
      await unlock();
    };
    return { store, workbench, session, server, close };
  } catch (error) {
    await vite?.close();
    server.close();
    await unlock();
    throw error;
  }
}
