import type { Color, Corners, Sides } from "./harness";
import { DEFAULT_COLOR_TOLERANCE, DEFAULT_NUMBER_TOLERANCE, normalizeTransparent } from "./harness";

interface CloseOptions {
  tolerance: number;
  /** Why this tolerance is needed — required so relaxed checks are always documented. */
  reason: string;
}

function formatColor(c: Color | null): string {
  if (c === null) return "null";
  return `(${c.r.toFixed(4)}, ${c.g.toFixed(4)}, ${c.b.toFixed(4)}, ${c.a.toFixed(4)})`;
}

function fail(msg: string): never {
  throw new Error(msg);
}

export const gtkAssert = {
  numbersEqual(native: number, web: number, label?: string) {
    gtkAssert.numbersClose(
      native,
      web,
      { tolerance: DEFAULT_NUMBER_TOLERANCE, reason: "default" },
      label,
    );
  },

  numbersClose(native: number, web: number, opts: CloseOptions, label?: string) {
    const delta = Math.abs(native - web);
    if (delta > opts.tolerance) {
      fail(
        `${label ?? "number"}: native=${native}, web=${web}, delta=${delta.toFixed(4)} exceeds tolerance ${opts.tolerance} (${opts.reason})`,
      );
    }
  },

  colorsEqual(native: Color | null, web: Color | null, label?: string) {
    gtkAssert.colorsClose(
      native,
      web,
      { tolerance: DEFAULT_COLOR_TOLERANCE, reason: "default" },
      label,
    );
  },

  colorsClose(native: Color | null, web: Color | null, opts: CloseOptions, label?: string) {
    const prefix = label ?? "color";
    native = normalizeTransparent(native);
    web = normalizeTransparent(web);
    if (native === null && web === null) return;
    if (native === null || web === null) {
      fail(`${prefix}: native=${formatColor(native)}, web=${formatColor(web)} (${opts.reason})`);
    }
    for (const ch of ["r", "g", "b", "a"] as const) {
      const delta = Math.abs(native[ch] - web[ch]);
      if (delta > opts.tolerance) {
        fail(
          `${prefix}.${ch}: native=${native[ch]}, web=${web[ch]}, delta=${delta.toFixed(6)} exceeds tolerance ${opts.tolerance} (${opts.reason})`,
        );
      }
    }
  },

  sidesEqual(native: Sides, web: Sides, label?: string) {
    const prefix = label ?? "sides";
    for (const side of ["top", "right", "bottom", "left"] as const) {
      gtkAssert.numbersEqual(native[side], web[side], `${prefix}.${side}`);
    }
  },

  cornersEqual(native: Corners, web: Corners, label?: string) {
    const prefix = label ?? "corners";
    for (const corner of ["top_left", "top_right", "bottom_right", "bottom_left"] as const) {
      gtkAssert.numbersEqual(native[corner], web[corner], `${prefix}.${corner}`);
    }
  },
};
