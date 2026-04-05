import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface AdwWindowProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  content?: ReactNode;
}

/**
 * AdwWindow — An Adwaita-styled top-level window.
 *
 * Extends GtkWindow with: dialog hosting, breakpoint system,
 * no traditional titlebar (managed by content).
 *
 * CSS node: window.background.csd (inherited from GtkWindow)
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.Window.html
 */
export const AdwWindow = forwardRef<HTMLDivElement, AdwWindowProps>(function AdwWindow(
  { content, children, className, style, ...rest },
  ref,
) {
  const classes = ["gtk-window", "background", "csd"];
  if (className) classes.push(className);

  return (
    <div ref={ref} className={classes.join(" ")} style={style} {...rest}>
      <div className="gtk-dialog-host">
        <div
          className="gtk-breakpointbin"
          style={{ display: "flex", flexDirection: "column", flex: 1 }}
        >
          {content ?? children}
        </div>
      </div>
    </div>
  );
});
