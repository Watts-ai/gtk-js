import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface GtkWindowProps extends HTMLAttributes<HTMLDivElement> {
  /** The titlebar widget (typically a GtkHeaderBar). */
  titlebar?: ReactNode;
  /** Main content of the window. */
  children?: ReactNode;
}

/**
 * GtkWindow — A top-level window.
 *
 * CSS node: window.background.csd
 *
 * In native GTK, the window manager controls sizing. On the web, the
 * window takes the size of its content by default — the user controls
 * sizing via style/className props.
 *
 * @see https://docs.gtk.org/gtk4/class.Window.html
 */
export const GtkWindow = forwardRef<HTMLDivElement, GtkWindowProps>(function GtkWindow(
  { titlebar, children, className, style, ...rest },
  ref,
) {
  const classes = ["gtk-window", "background", "csd"];
  if (className) classes.push(className);

  return (
    <div ref={ref} className={classes.join(" ")} style={style} {...rest}>
      {titlebar && <div className="titlebar">{titlebar}</div>}
      <div className="gtk-box gtk-box-layout vertical" style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
});
