import { gtkAssert } from "../assert";
import { gtkTest } from "../harness";

// The native harness extracts font_weight from the first TextNode found in the
// widget's render tree — for a headerbar with a title widget that is the inner
// .title label (font-weight: bold → 700).  The web harness reads
// getComputedStyle(headerbar).fontWeight which returns the headerbar element's
// own inherited value (400).  These two measurement strategies are inherently
// asymmetric for container widgets, so we compare only the structural CSS
// properties that are directly on the headerbar element itself.
gtkTest("header-bar-flat", (native, web) => {
  gtkAssert.sidesEqual(native.padding, web.padding, "padding");
  gtkAssert.colorsEqual(native.background_color, web.background_color, "background_color");
  gtkAssert.colorsEqual(native.color, web.color, "color");
  gtkAssert.sidesEqual(native.border_widths, web.border_widths, "border_widths");
  gtkAssert.numbersEqual(native.opacity, web.opacity, "opacity");
});
