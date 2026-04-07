import { gtkAssert } from "../assert";
import { gtkTest } from "../harness";

gtkTest("link-visited", (native, web) => {
  gtkAssert.sidesEqual(native.padding, web.padding, "padding");
  gtkAssert.colorsEqual(native.background_color, web.background_color, "background_color");
  gtkAssert.sidesEqual(native.border_widths, web.border_widths, "border_widths");
  gtkAssert.numbersEqual(native.opacity, web.opacity, "opacity");

  // Visited link color is off by ~5/255 due to fixColorMixGamut converting
  // color-mix(in srgb) → color-mix(in oklab). The srgb→oklab interpolation
  // shift is not user-perceptible (~2%) but exceeds the default 1/255 tolerance.
  gtkAssert.colorsClose(native.color, web.color, {
    tolerance: 6 / 255,
    reason: "fixColorMixGamut converts color-mix from srgb→oklab, shifting visited color ~5/255",
  });
});
