import { gtkToWeb, preprocess } from "./transform.ts";

/**
 * Compiles a GTK/libadwaita SCSS file to web-compatible CSS.
 *
 * Uses sassc (the C implementation of Sass) to match upstream's build system,
 * then runs text preprocessing + PostCSS transforms to convert GTK-specific
 * CSS to web-compatible CSS.
 */
export async function compileGtkCSS(scssPath: string): Promise<string> {
  // Step 1: Compile SCSS → raw CSS using sassc (matches upstream)
  const result = Bun.spawnSync({
    cmd: ["sassc", "-t", "expanded", scssPath],
    stdout: "pipe",
    stderr: "pipe",
  });

  if (result.exitCode !== 0) {
    throw new Error(
      `sassc compilation failed (exit ${result.exitCode}):\n${result.stderr.toString()}`,
    );
  }

  const rawCSS = result.stdout.toString();

  // Step 2: Text preprocessing — strip @define-color and other non-CSS syntax
  const preprocessed = preprocess(rawCSS);

  // Step 3: PostCSS transforms — remap selectors, pseudo-classes, properties
  const transformed = await gtkToWeb.process(preprocessed, { from: scssPath });

  return transformed.css;
}
