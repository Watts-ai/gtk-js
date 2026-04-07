import { forwardRef, type HTMLAttributes } from "react";
import { useIcon } from "../icon-context.tsx";
import type { GtkIconSize } from "../types.ts";

export interface GtkImageProps extends HTMLAttributes<HTMLSpanElement> {
  /** Icon name loaded from the provider's icon set. */
  iconName?: string;
  /** Explicit pixel size. Overrides iconSize when >= 0. Default: -1 (use iconSize). */
  pixelSize?: number;
  /** Symbolic size category. Default: "inherit". */
  iconSize?: GtkIconSize;
}

/**
 * Convert a GTK icon name (kebab-case, optional -symbolic suffix) to the
 * PascalCase key used in the icon map (e.g. "open-menu-symbolic" → "OpenMenu").
 */
function gtkNameToIconKey(name: string): string {
  return name
    .replace(/-symbolic$/, "")
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * GtkImage — A widget that displays an icon.
 *
 * CSS node: image[.normal-icons|.large-icons]
 *
 * @see https://docs.gtk.org/gtk4/class.Image.html
 */
export const GtkImage = forwardRef<HTMLSpanElement, GtkImageProps>(function GtkImage(
  { iconName, pixelSize = -1, iconSize = "inherit", className, ...rest },
  ref,
) {
  const iconKey = iconName ? gtkNameToIconKey(iconName) : "";
  const Icon = useIcon(iconKey);

  const classes = ["gtk-image"];
  if (iconSize === "normal") classes.push("normal-icons");
  else if (iconSize === "large") classes.push("large-icons");
  if (className) classes.push(className);

  const size = pixelSize >= 0 ? pixelSize : iconSize === "large" ? 32 : 16;

  return (
    <span ref={ref} className={classes.join(" ")} {...rest}>
      {Icon && <Icon size={size} />}
    </span>
  );
});
