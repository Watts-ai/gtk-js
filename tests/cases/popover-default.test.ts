import { gtkTest } from "../harness";

// Extract CSS from the popover's `contents` child node — this is where all
// the visible styling lives (background, border, padding, border-radius).
// The root `popover.background` node is intentionally transparent.
gtkTest("popover-default", { childSelector: ".gtk-contents" });
