import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import type { GtkAlign } from "../types.ts";

export interface GtkOverlayChildProps {
  /** Whether this overlay child contributes to size measurement. Default: false. */
  measure?: boolean;
  /** Whether to clip this child to parent bounds. Default: false. */
  clipOverlay?: boolean;
  /** Horizontal alignment. */
  halign?: GtkAlign;
  /** Vertical alignment. */
  valign?: GtkAlign;
}

export interface GtkOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** The main content child (rendered first, determines base size). */
  child?: ReactNode;
  /** Overlay children rendered on top. */
  overlays?: ReactNode[];
  children?: ReactNode;
}

const _alignToCSS = (align: GtkAlign | undefined): React.CSSProperties => {
  if (!align) return {};
  switch (align) {
    case "start":
      return { justifySelf: "start", alignSelf: "start" };
    case "end":
      return { justifySelf: "end", alignSelf: "end" };
    case "center":
      return { justifySelf: "center", alignSelf: "center" };
    case "fill":
      return { justifySelf: "stretch", alignSelf: "stretch" };
    default:
      return {};
  }
};

/**
 * GtkOverlay — A container that places children on top of each other.
 *
 * CSS node: overlay
 *
 * Uses CSS Grid with all children in the same cell for stacking.
 *
 * @see https://docs.gtk.org/gtk4/class.Overlay.html
 */
export const GtkOverlay = forwardRef<HTMLDivElement, GtkOverlayProps>(function GtkOverlay(
  { child, overlays, children, className, style, ...rest },
  ref,
) {
  const classes = ["gtk-overlay"];
  if (className) classes.push(className);

  return (
    <div
      ref={ref}
      className={classes.join(" ")}
      style={{
        display: "grid",
        gridTemplate: "1fr / 1fr",
        ...style,
      }}
      {...rest}
    >
      {child && <div style={{ gridColumn: 1, gridRow: 1 }}>{child}</div>}
      {overlays?.map((overlay, i) => (
        <div key={i} style={{ gridColumn: 1, gridRow: 1, pointerEvents: "none" }}>
          <div style={{ pointerEvents: "auto" }}>{overlay}</div>
        </div>
      ))}
      {children}
    </div>
  );
});
