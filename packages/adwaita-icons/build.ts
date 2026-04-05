import { buildIconComponents } from "@gtk-js/icon-helpers/build";

const ICONS_DIR = new URL("../../upstream/adwaita-icon-theme/Adwaita/symbolic/", import.meta.url)
  .pathname;
const OUT_DIR = new URL("src/icons/", import.meta.url).pathname;

const exports = await buildIconComponents(ICONS_DIR, OUT_DIR, "@gtk-js/icon-helpers");

await Bun.write(
  new URL("src/index.ts", import.meta.url).pathname,
  `export type { GtkIconProps, GtkIcon } from "@gtk-js/icon-helpers";

${exports.sort().join("\n")}
`,
);

console.log(`Built ${exports.length} icon components`);
