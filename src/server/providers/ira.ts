import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

// An optional subprocess boundary; the workbench never imports or rewrites Go.
// Mutating release commands continue through the existing confirmed wrappers.
export async function runIRA(args: string[]) {
  if (
    !["version", "adapters", "validate", "plan", "queue-status"].includes(
      args[0] || "",
    )
  )
    throw new Error(
      "IRA bridge supports version, adapters, validate, plan and queue-status. Use ira.ps1 / ira.sh for prepare, signing and ASF writes.",
    );
  const module = fileURLToPath(
    new URL(
      "../../../skills/incubator-release-assistant/scripts/ira/",
      import.meta.url,
    ),
  );
  await new Promise<void>((resolve, reject) => {
    const child = spawn("go", ["run", "./cmd/ira", ...args], {
      cwd: module,
      stdio: "inherit",
      windowsHide: true,
    });
    child.once("error", (error) =>
      reject(
        new Error(`Optional IRA adapter needs Go installed: ${error.message}`),
      ),
    );
    child.once("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`IRA exited with ${code}`)),
    );
  });
}
