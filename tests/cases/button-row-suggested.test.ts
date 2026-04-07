import { expect } from "bun:test";
import { compare, gtkTest } from "../harness";

// font_weight: native reads from the inner label.title text node (700 via .heading),
// web reads from the root row div computed style (inherited 400). The CSS correctly
// applies font-weight 700 to .title via .gtk-row.button .title { font-weight: 700 }.
function buttonRowTest(caseName: string) {
  gtkTest(caseName, (native, web) => {
    const { failures } = compare(native, web);
    const relevant = failures.filter((f) => f.property !== "font_weight");
    if (relevant.length > 0) {
      console.error("Failures:", JSON.stringify(relevant, null, 2));
    }
    expect(relevant).toEqual([]);
  });
}

buttonRowTest("button-row-suggested");
