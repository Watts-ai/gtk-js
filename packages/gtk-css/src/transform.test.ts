import { describe, expect, test } from "bun:test";
import { gtkToWeb } from "./transform.ts";

describe("remapPseudoClasses", () => {
  async function transform(css: string) {
    const result = await gtkToWeb.process(css, { from: undefined });
    return result.css;
  }

  test(":checked → [data-checked]", async () => {
    const out = await transform(".gtk-button:checked { color: red; }");
    expect(out).toContain(".gtk-button[data-checked]");
    expect(out).not.toContain(":checked");
  });

  test(":visited → [data-visited]", async () => {
    const out = await transform(".gtk-button.link:visited { color: blue; }");
    expect(out).toContain(".gtk-button.link[data-visited]");
    expect(out).not.toContain(":visited");
  });

  test(":backdrop → [data-backdrop]", async () => {
    const out = await transform(".gtk-window:backdrop { opacity: 0.5; }");
    expect(out).toContain(".gtk-window[data-backdrop]");
    expect(out).not.toContain(":backdrop");
  });

  test(":drop(active) → [data-drop-active]", async () => {
    const out = await transform(".gtk-row:drop(active) { background: blue; }");
    expect(out).toContain(".gtk-row[data-drop-active]");
    expect(out).not.toContain(":drop(active)");
  });

  test(":selected → [aria-selected]", async () => {
    const out = await transform(".gtk-row:selected { background: blue; }");
    expect(out).toContain('[aria-selected="true"]');
    expect(out).not.toContain(":selected");
  });
});
