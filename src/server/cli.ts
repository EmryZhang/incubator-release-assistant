import { parseArgs } from "node:util";
import { promises as fs } from "node:fs";
import path from "node:path";
import { startServer, isLoopback, type Session } from "./server.js";
import { defaultDir } from "./store.js";
import { runIRA } from "./providers/ira.js";

async function main() {
  const command = process.argv[2] || "serve";
  if (command === "ira") {
    await runIRA(process.argv.slice(3));
    return;
  }
  const normalized = process.argv
    .slice(3)
    .map((arg) =>
      ["-data", "-addr", "-path", "-body"].includes(arg) ? "-" + arg : arg,
    );
  const { values } = parseArgs({
    args: normalized,
    options: {
      data: { type: "string", default: defaultDir() },
      addr: { type: "string", default: "127.0.0.1:8787" },
      path: { type: "string", default: "/api/state" },
      body: { type: "string" },
      dev: { type: "boolean", default: false },
    },
  });
  const dir = path.resolve(values.data);
  if (command === "api") {
    const session = JSON.parse(
      await fs.readFile(path.join(dir, "session.json"), "utf8"),
    ) as Session;
    const url = new URL(session.url);
    if (
      url.protocol !== "http:" ||
      !isLoopback(url.hostname.replace(/^\[|\]$/g, "")) ||
      url.username ||
      url.password
    )
      throw new Error("Session must point to local ISA");
    if (!values.path.startsWith("/api/"))
      throw new Error("path must start with /api/");
    const body = values.body
      ? (await fs.readFile(values.body, "utf8")).replace(/^\uFEFF/, "")
      : undefined;
    const response = await fetch(session.url + values.path, {
      method: body === undefined ? "GET" : "POST",
      headers: {
        Authorization: `Bearer ${session.token}`,
        "Content-Type": "application/json",
      },
      body,
      redirect: "error",
      signal: AbortSignal.timeout(120000),
    });
    const result = await response.text();
    if (!response.ok) throw new Error(`ISA ${response.status}: ${result}`);
    console.log(result);
    return;
  }
  if (command !== "serve")
    throw new Error(
      "Commands: serve [--dev] [--data DIR] [--addr 127.0.0.1:8787] | api --path /api/state [--body FILE] | ira <read-only command>",
    );
  const address = new URL(`http://${values.addr}`),
    host = address.hostname.replace(/^\[|\]$/g, "");
  const port = Number(address.port || 80);
  if (!Number.isInteger(port) || port < 0 || port > 65535)
    throw new Error("invalid port");
  const app = await startServer({ dir, host, port, dev: values.dev });
  console.log(
    `ISA Node.js workbench${values.dev ? " · development / Vite hot reload" : ""}\nOpen: ${app.session.url}/#token=${app.session.token}\nLocal data: ${app.store.dir}\nPress Ctrl+C to stop.`,
  );
  for (const signal of ["SIGINT", "SIGTERM"] as const)
    process.once(signal, () => {
      void app.close().then(
        () => process.exit(0),
        (error) => {
          console.error(error);
          process.exit(1);
        },
      );
    });
}
main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
