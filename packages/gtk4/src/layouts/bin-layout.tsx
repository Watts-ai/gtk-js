import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface GtkBinLayoutProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

/**
 * GtkBinLayout — Stacks all children on top of each other (overlay).
 *
 * Each child occupies the full area. Size is the maximum of all children.
 * Used by GtkButton, GtkActionBar, GtkHeaderBar (outer), etc.
 *
 * @see https://docs.gtk.org/gtk4/class.BinLayout.html
 */
export const GtkBinLayout = forwardRef<HTMLDivElement, GtkBinLayoutProps>(function GtkBinLayout(
  { className, children, ...rest },
  ref,
) {
  const classes = ["gtk-bin-layout"];
  if (className) classes.push(className);

  return (
    <div ref={ref} className={classes.join(" ")} {...rest}>
      {children}
    </div>
  );
});
