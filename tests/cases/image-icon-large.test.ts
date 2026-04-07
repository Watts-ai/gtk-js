import { gtkAssert } from "../assert";
import { gtkTest } from "../harness";

// GtkImage: the native extractor picks up the icon's SVG fill as background_color
// (the first large ColorNode in the render tree). On the web, the span's
// background is transparent. This is a known extractor artifact for icon-only
// widgets — skip background_color and check the remaining structural properties.
gtkTest("image-icon-large", (native, web) => {
  gtkAssert.sidesEqual(native.padding, web.padding, "padding");
  gtkAssert.sidesEqual(native.border_widths, web.border_widths, "border_widths");
  gtkAssert.colorsEqual(native.color, web.color, "color");
});
