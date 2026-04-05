import React, { forwardRef, type HTMLAttributes, type ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { GtkPositionType } from "../types.ts";

export interface GtkPopoverProps extends HTMLAttributes<HTMLDivElement> {
  /** Content of the popover. */
  children?: ReactNode;
  /** Whether the popover is visible. */
  visible?: boolean;
  /** Whether the popover has an arrow. Default: true. */
  hasArrow?: boolean;
  /** Preferred position relative to anchor. Default: "bottom". */
  position?: GtkPositionType;
  /** Close on click outside or Escape. Default: true. */
  autohide?: boolean;
  /** Portal target. false=inline, true=document.body, HTMLElement=custom. Default: false. */
  portal?: boolean | HTMLElement;
  /** Callback when the popover should close. */
  onClosed?: () => void;
}

/**
 * GtkPopover — A floating popup attached to a widget.
 *
 * CSS node:
 *   popover.background
 *     ├── arrow
 *     └── contents
 *
 * @see https://docs.gtk.org/gtk4/class.Popover.html
 */
export const GtkPopover = forwardRef<HTMLDivElement, GtkPopoverProps>(function GtkPopover(
  {
    children,
    visible = false,
    hasArrow = true,
    position = "bottom",
    autohide = true,
    portal = false,
    onClosed,
    className,
    style,
    ...rest
  },
  ref,
) {
  const popoverRef = useRef<HTMLDivElement>(null);

  // Handle click outside
  useEffect(() => {
    if (!visible || !autohide) return;

    const handleClickOutside = (e: MouseEvent) => {
      const el = popoverRef.current;
      if (el && !el.contains(e.target as Node)) {
        onClosed?.();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClosed?.();
    };

    // Delay to avoid catching the opening click
    const timeout = setTimeout(() => {
      document.addEventListener("pointerdown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }, 0);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("pointerdown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [visible, autohide, onClosed]);

  if (!visible) return null;

  const classes = ["gtk-popover", "background"];
  if (className) classes.push(className);

  const positionStyle: React.CSSProperties = {
    position: "absolute",
    zIndex: 1000,
    ...(position === "bottom" && { top: "100%", left: "50%", transform: "translateX(-50%)" }),
    ...(position === "top" && { bottom: "100%", left: "50%", transform: "translateX(-50%)" }),
    ...(position === "left" && { right: "100%", top: "50%", transform: "translateY(-50%)" }),
    ...(position === "right" && { left: "100%", top: "50%", transform: "translateY(-50%)" }),
    ...style,
  };

  const content = (
    <div ref={ref ?? popoverRef} className={classes.join(" ")} style={positionStyle} {...rest}>
      {hasArrow && <div className="gtk-arrow" />}
      <div className="gtk-contents">{children}</div>
    </div>
  );

  if (portal === true) {
    return createPortal(content, document.body);
  }
  if (portal instanceof HTMLElement) {
    return createPortal(content, portal);
  }
  return content;
});
