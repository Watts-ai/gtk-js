import type { Server } from "bun";
import { type Browser, chromium, firefox } from "playwright";
import { startTestServer } from "./server";

declare global {
  var __testBrowsers: Record<string, Browser>;
  var __testServer: Server;
}

// Build native test binary upfront so tests don't pay compilation cost
const cargoBuild = Bun.spawn(["cargo", "build", "--manifest-path", "tests/native/Cargo.toml"], {
  stdout: "inherit",
  stderr: "inherit",
});
const cargoBuildExit = await cargoBuild.exited;
if (cargoBuildExit !== 0) {
  throw new Error(`cargo build failed (exit ${cargoBuildExit})`);
}

// Start the test server (non-blocking, port 0 = OS picks a free port)
const server = startTestServer();

// Launch browsers in parallel
const [chromiumBrowser, firefoxBrowser] = await Promise.all([
  chromium.launch({ headless: true }),
  firefox.launch({ headless: true }),
]);

globalThis.__testBrowsers = {
  chromium: chromiumBrowser,
  firefox: firefoxBrowser,
};
globalThis.__testServer = server;

process.on("exit", () => {
  server.stop();
});

// Browsers must be closed async — use beforeExit which fires before final exit
process.on("beforeExit", async () => {
  await Promise.all([chromiumBrowser.close(), firefoxBrowser.close()]);
});
