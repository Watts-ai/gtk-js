import { useIcon } from "@gtk-js/gtk4";
import React, {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { AdwToastPriority } from "../types.ts";

export interface AdwToast {
  title: string;
  buttonLabel?: string;
  timeout?: number;
  priority?: AdwToastPriority;
  useMarkup?: boolean;
  onButtonClicked?: () => void;
  onDismissed?: () => void;
}

export interface AdwToastOverlayProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface AdwToastOverlayRef {
  addToast: (toast: AdwToast) => void;
}

/**
 * AdwToastOverlay — A container that displays toast notifications.
 *
 * CSS node:
 *   toastoverlay
 *     ├── [child]
 *     └── toast (bottom-center, animated)
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.ToastOverlay.html
 */
export const AdwToastOverlay = forwardRef<
  HTMLDivElement,
  AdwToastOverlayProps & { toastRef?: React.Ref<AdwToastOverlayRef> }
>(function AdwToastOverlay({ children, toastRef, className, ...rest }, ref) {
  const [queue, setQueue] = useState<AdwToast[]>([]);
  const [current, setCurrent] = useState<AdwToast | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const CloseIcon = useIcon("WindowClose");

  const dismiss = useCallback(() => {
    current?.onDismissed?.();
    setCurrent(null);
  }, [current]);

  // Process queue
  useEffect(() => {
    if (current || queue.length === 0) return;
    const [next, ...rest] = queue;
    setCurrent(next!);
    setQueue(rest);
  }, [current, queue]);

  // Auto-dismiss timeout
  useEffect(() => {
    if (!current) return;
    const timeout = current.timeout ?? 5;
    if (timeout === 0) return;
    timeoutRef.current = setTimeout(dismiss, timeout * 1000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, dismiss]);

  const addToast = useCallback(
    (toast: AdwToast) => {
      if (toast.priority === "high" && current) {
        setQueue((q) => [current, ...q]);
        setCurrent(toast);
      } else {
        setQueue((q) => [...q, toast]);
      }
    },
    [current],
  );

  // Expose addToast via ref
  React.useImperativeHandle(toastRef, () => ({ addToast }), [addToast]);

  const classes = ["gtk-toastoverlay"];
  if (className) classes.push(className);

  return (
    <div ref={ref} className={classes.join(" ")} style={{ position: "relative" }} {...rest}>
      {children}
      {current && (
        <div
          className="gtk-toast"
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            zIndex: 100,
          }}
        >
          <span className="gtk-label heading" style={{ margin: "0 6px" }}>
            {current.title}
          </span>
          {current.buttonLabel && (
            <button
              type="button"
              className="gtk-button flat"
              onClick={() => {
                current.onButtonClicked?.();
                dismiss();
              }}
            >
              <span className="gtk-label">{current.buttonLabel}</span>
            </button>
          )}
          <button type="button" className="gtk-button circular flat" onClick={dismiss}>
            <span className="gtk-image">{CloseIcon && <CloseIcon size={16} />}</span>
          </button>
        </div>
      )}
    </div>
  );
});
