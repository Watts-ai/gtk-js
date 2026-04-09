import type { Server } from "bun";
import { type Browser, type Page, chromium, firefox } from "playwright";
import { startTestServer } from "./server";

declare global {
  var __testBrowsers: Record<string, Browser>;
  var __testPages: Record<string, Page>;
  var __testServer: Server;
  var __nativeServerPort: number;
  var __nativeServerProcess: Bun.Subprocess;
}

function debugEnabled(): boolean {
  return Bun.env.GTK_JS_TEST_DEBUG != null;
}

function debugLog(message: string): void {
  if (debugEnabled()) {
    console.error(`[setup] ${message}`);
  }
}

async function readLine(stream: ReadableStream<Uint8Array> | null | undefined): Promise<string> {
  if (!stream) {
    throw new Error("Native server stdout is unavailable");
  }

  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      throw new Error(`Native server exited before reporting a port.\nPartial output: ${buffer}`);
    }

    buffer += decoder.decode(value, { stream: true });
    const newlineIndex = buffer.indexOf("\n");
    if (newlineIndex === -1) {
      continue;
    }

    const line = buffer.slice(0, newlineIndex).trim();
    reader.releaseLock();
    return line;
  }
}

async function waitForNativeReady(port: number): Promise<void> {
  const startedAt = Date.now();

  while (Date.now() - startedAt < 15000) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/ready`, {
        signal: AbortSignal.timeout(1000),
      });

      if (response.ok) {
        debugLog(`native server ready on ${port}`);
        return;
      }
    } catch {
      // Keep polling until the server is ready or times out.
    }

    await Bun.sleep(100);
  }

  throw new Error(`Native server on port ${port} did not become ready within 15s`);
}

async function createHostPage(browser: Browser): Promise<Page> {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1200 },
    deviceScaleFactor: 1,
  });
  return page;
}

// Start the test server (non-blocking, port 0 = OS picks a free port)
const server = startTestServer();
debugLog(`web test server listening on ${server.port}`);

// Build native binary, launch browsers concurrently
const cargoBuild = Bun.spawn(["cargo", "build", "--manifest-path", "tests/native/Cargo.toml"], {
  stdout: "inherit",
  stderr: "inherit",
});

const [cargoBuildExit, chromiumBrowser, firefoxBrowser] = await Promise.all([
  cargoBuild.exited,
  chromium.launch({ headless: true }),
  firefox.launch({ headless: true }),
]);

if (cargoBuildExit !== 0) {
  throw new Error(`cargo build failed (exit ${cargoBuildExit})`);
}
debugLog("native binary build finished");

const nativeServer = Bun.spawn(
  ["xvfb-run", "-a", "tests/native/target/debug/gtk-js-test", "serve"],
  { stdout: "pipe", stderr: "inherit" },
);
debugLog(`spawned native server pid=${nativeServer.pid ?? "unknown"}`);

const portLine = await readLine(nativeServer.stdout);
const portMatch = /^LISTENING:(\d+)$/.exec(portLine);
if (!portMatch) {
  nativeServer.kill();
  throw new Error(`Native server failed to report port: ${portLine}`);
}
debugLog(`native server listening on ${portMatch[1]}`);

const [chromiumHostPage, firefoxHostPage] = await Promise.all([
  createHostPage(chromiumBrowser),
  createHostPage(firefoxBrowser),
]);
await Promise.all([
  chromiumHostPage.goto(`http://localhost:${server.port}/gallery`),
  firefoxHostPage.goto(`http://localhost:${server.port}/gallery`),
]);
await Promise.all([
  chromiumHostPage.waitForSelector(`[data-case="button-text-default"] [data-testid="target"]`),
  firefoxHostPage.waitForSelector(`[data-case="button-text-default"] [data-testid="target"]`),
]);

globalThis.__testBrowsers = {
  chromium: chromiumBrowser,
  firefox: firefoxBrowser,
};
globalThis.__testPages = {
  chromium: chromiumHostPage,
  firefox: firefoxHostPage,
};
globalThis.__testServer = server;
globalThis.__nativeServerPort = Number(portMatch[1]);
globalThis.__nativeServerProcess = nativeServer;

await waitForNativeReady(globalThis.__nativeServerPort);

process.on("exit", () => {
  debugLog("process exit; stopping native server and web server");
  nativeServer.kill();
  server.stop();
});

// Browsers must be closed async — use beforeExit which fires before final exit
process.on("beforeExit", async () => {
  await Promise.all([chromiumBrowser.close(), firefoxBrowser.close()]);
});
