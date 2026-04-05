import React, {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
import { createPortal } from "react-dom";
import type { AdwDialogPresentationMode } from "../types.ts";

export interface AdwDialogProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  child?: ReactNode;
  visible?: boolean;
  canClose?: boolean;
  presentationMode?: AdwDialogPresentationMode;
  contentWidth?: number;
  contentHeight?: number;
  followsContentSize?: boolean;
  portal?: boolean | HTMLElement;
  onClosed?: () => void;
  onCloseAttempt?: () => void;
}

/**
 * AdwDialog — An adaptive dialog (floating on desktop, bottom-sheet on mobile).
 *
 * CSS node: dialog[.floating|.bottom-sheet]
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.Dialog.html
 */
export const AdwDialog = forwardRef<HTMLDivElement, AdwDialogProps>(function AdwDialog(
  {
    title,
    child,
    visible = false,
    canClose = true,
    presentationMode = "auto",
    contentWidth = -1,
    contentHeight = -1,
    followsContentSize = false,
    portal = false,
    onClosed,
    onCloseAttempt,
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const close = useCallback(() => {
    if (!canClose) {
      onCloseAttempt?.();
      return;
    }
    onClosed?.();
  }, [canClose, onClosed, onCloseAttempt]);

  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [visible, close]);

  if (!visible) return null;

  const classes = ["gtk-dialog", "background", "floating"];
  if (className) classes.push(className);

  const sheetStyle: React.CSSProperties = {
    width: contentWidth > 0 ? contentWidth : undefined,
    height: contentHeight > 0 ? contentHeight : undefined,
    ...style,
  };

  const content = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="dimming"
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--shade-color, rgba(0,0,0,0.3))",
        }}
        onClick={close}
      />
      <div
        ref={ref}
        className={classes.join(" ")}
        style={{ position: "relative", ...sheetStyle }}
        {...rest}
      >
        {child ?? children}
      </div>
    </div>
  );

  if (portal === true) return createPortal(content, document.body);
  if (portal instanceof HTMLElement) return createPortal(content, portal);
  return content;
});
