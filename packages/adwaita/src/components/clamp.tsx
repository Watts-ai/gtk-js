import type { GtkOrientation } from "@gtk-js/gtk4";
import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import type { AdwLengthUnit } from "../types.ts";

export interface AdwClampProps extends HTMLAttributes<HTMLDivElement> {
  /** Maximum allocated size. Default: 600. */
  maximumSize?: number;
  /** Threshold above which clamping tightens. Default: 400. */
  tighteningThreshold?: number;
  /** Unit for size values. Default: "sp". */
  unit?: AdwLengthUnit;
  /** Layout direction. Default: "horizontal". */
  orientation?: GtkOrientation;
  children?: ReactNode;
}

/**
 * AdwClamp — A container that constrains its child to a maximum size.
 *
 * CSS node: clamp[.small|.medium|.large]
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.Clamp.html
 */
export const AdwClamp = forwardRef<HTMLDivElement, AdwClampProps>(function AdwClamp(
  {
    maximumSize = 600,
    tighteningThreshold = 400,
    unit = "sp",
    orientation = "horizontal",
    children,
    className,
    style,
    ...rest
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sizeClass, setSizeClass] = useState<"small" | "medium" | "large">("large");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      const size =
        orientation === "horizontal" ? entry.contentRect.width : entry.contentRect.height;

      if (size <= tighteningThreshold) setSizeClass("small");
      else if (size < maximumSize) setSizeClass("medium");
      else setSizeClass("large");
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [orientation, tighteningThreshold, maximumSize]);

  const classes = ["gtk-clamp", sizeClass];
  if (className) classes.push(className);

  const isHoriz = orientation === "horizontal";
  const clampStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isHoriz ? "row" : "column",
    justifyContent: "center",
    ...style,
  };

  const childStyle: React.CSSProperties = isHoriz
    ? { maxWidth: maximumSize, width: "100%" }
    : { maxHeight: maximumSize, height: "100%" };

  return (
    <div ref={ref ?? containerRef} className={classes.join(" ")} style={clampStyle} {...rest}>
      <div style={childStyle}>{children}</div>
    </div>
  );
});
