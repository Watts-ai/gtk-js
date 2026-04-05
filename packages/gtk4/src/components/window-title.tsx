import { forwardRef, type HTMLAttributes } from "react";

export interface GtkWindowTitleProps extends HTMLAttributes<HTMLDivElement> {
  /** The main title text. */
  title: string;
  /** Optional subtitle text displayed below the title. */
  subtitle?: string;
}

/**
 * GtkWindowTitle — A title/subtitle widget for headerbars.
 *
 * CSS node:
 *   windowtitle
 *     ├── .title (label)
 *     └── .subtitle (label, optional)
 *
 * @see https://docs.gtk.org/gtk4/class.WindowTitle.html
 */
export const GtkWindowTitle = forwardRef<HTMLDivElement, GtkWindowTitleProps>(
  function GtkWindowTitle({ title, subtitle, className, ...rest }, ref) {
    const classes = ["gtk-windowtitle"];
    if (className) classes.push(className);

    return (
      <div
        ref={ref}
        className={classes.join(" ") + " gtk-box-layout vertical"}
        style={{ alignItems: "center" }}
        {...rest}
      >
        <span className="title">{title}</span>
        {subtitle && <span className="subtitle">{subtitle}</span>}
      </div>
    );
  },
);
