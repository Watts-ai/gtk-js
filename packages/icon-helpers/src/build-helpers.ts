/**
 * Shared helpers for building GTK icon packages.
 * Used by both @gtk-js/gtk4-icons and @gtk-js/adwaita-icons build scripts.
 */

import { existsSync, mkdirSync, readdirSync, statSync } from "fs";

// Attributes to strip (GTK/namespace-specific)
const STRIP_ATTR_PREFIXES = ["gpa:", "xmlns:", "xml:", "cc:", "dc:", "rdf:"];
const STRIP_ATTRS = new Set(["id", "class", "xmlns"]);

export function toPascalCase(str: string): string {
  return str
    .replace(/-symbolic$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-") // replace non-alphanumeric chars with hyphens
    .split(/[-_]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

export function toKebabCase(str: string): string {
  return str
    .replace(/-symbolic$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-") // replace non-alphanumeric chars with hyphens
    .replace(/[-_]+/g, "-") // collapse multiple hyphens/underscores
    .replace(/^-|-$/g, ""); // trim leading/trailing hyphens
}

interface SvgChild {
  tag: string;
  attrs: Record<string, string>;
}

export function parseSvgChildren(svg: string): SvgChild[] {
  const children: SvgChild[] = [];

  const tagRegex = /<(path|circle|rect|ellipse|line|polyline|polygon)\s([^>]*?)\/?\s*>/g;
  let match;

  while ((match = tagRegex.exec(svg)) !== null) {
    const tag = match[1]!;
    const attrString = match[2]!;
    const attrs: Record<string, string> = {};

    const attrRegex = /([a-zA-Z][a-zA-Z0-9:_-]*)\s*=\s*"([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrString)) !== null) {
      const name = attrMatch[1]!;
      const value = attrMatch[2]!;

      if (STRIP_ATTRS.has(name)) continue;
      if (STRIP_ATTR_PREFIXES.some((p) => name.startsWith(p))) continue;

      // Normalize fill colors to currentColor
      if (name === "fill" && value !== "none") {
        attrs[name] = "currentColor";
        continue;
      }

      // Normalize stroke to currentColor
      if (name === "stroke" && value !== "none") {
        attrs[name] = "currentColor";
        continue;
      }

      // Convert kebab-case attrs to camelCase for React
      const reactName = name.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
      attrs[reactName] = value;
    }

    children.push({ tag, attrs });
  }

  return children;
}

/**
 * Recursively find all .svg files in a directory.
 */
export function findSvgFiles(dir: string): string[] {
  const results: string[] = [];

  for (const entry of readdirSync(dir)) {
    const full = `${dir}/${entry}`;
    if (statSync(full).isDirectory()) {
      results.push(...findSvgFiles(full));
    } else if (entry.endsWith(".svg")) {
      results.push(full);
    }
  }

  return results;
}

/**
 * Build icon components from a directory of SVGs.
 *
 * @param iconsDir - directory containing SVG files (can be nested)
 * @param outDir - output directory for generated .ts files
 * @param createGtkIconImport - import path for createGtkIcon
 * @returns array of export statements for index.ts
 */
export async function buildIconComponents(
  iconsDir: string,
  outDir: string,
  createGtkIconImport: string,
): Promise<string[]> {
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const svgFiles = findSvgFiles(iconsDir);
  const exports: string[] = [];
  const seenNames = new Set<string>();

  for (const filePath of svgFiles) {
    const fileName = filePath.split("/").pop()!;
    const iconName = fileName.replace(".svg", "");
    const kebabName = toKebabCase(iconName);
    const pascalName = toPascalCase(iconName);

    // Skip duplicates (same icon name in different subdirectories)
    if (seenNames.has(kebabName)) continue;
    seenNames.add(kebabName);

    const svg = await Bun.file(filePath).text();
    const children = parseSvgChildren(svg);

    if (children.length === 0) {
      continue;
    }

    const childrenLiteral = JSON.stringify(children.map((c) => [c.tag, c.attrs]));

    const code = `import { createGtkIcon } from "${createGtkIconImport}";

export const ${pascalName} = createGtkIcon("${kebabName}", ${childrenLiteral});
`;

    await Bun.write(`${outDir}/${kebabName}.ts`, code);
    exports.push(`export { ${pascalName} } from "./icons/${kebabName}.ts";`);
  }

  return exports;
}
