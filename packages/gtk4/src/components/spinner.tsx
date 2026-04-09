import { forwardRef, type HTMLAttributes } from "react";

export interface GtkSpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Whether the spinner is animating. Default: false. */
  spinning?: boolean;
  /** Whether the widget is insensitive (disabled). Default: false. */
  disabled?: boolean;
}

/**
 * GtkSpinner — A widget that shows a spinning animation.
 *
 * CSS node: spinner
 * Uses :checked pseudo-class when spinning (mapped to [data-checked] attribute).
 * Uses :disabled pseudo-class when insensitive (mapped to [data-disabled] attribute
 * because <span> does not support the native :disabled pseudo-class).
 * Animation: 1s linear infinite rotation (defined in Adwaita CSS via spin keyframe).
 * Visual: CSS border spinner (GTK uses -gtk-icon-source: process-working-symbolic,
 * which has no direct web equivalent; we replicate with a border-based circle).
 *
 * @see https://docs.gtk.org/gtk4/class.Spinner.html
 * @see upstream/libadwaita/src/stylesheet/widgets/_spinner.scss
 */
export const GtkSpinner = forwardRef<HTMLSpanElement, GtkSpinnerProps>(function GtkSpinner(
  { spinning = false, disabled = false, className, ...rest },
  ref,
) {
  const classes = ["gtk-spinner"];
  if (className) classes.push(className);

  return (
    <span
      ref={ref}
      role="progressbar"
      aria-busy={spinning}
      aria-disabled={disabled || undefined}
      className={classes.join(" ")}
      data-checked={spinning || undefined}
      data-disabled={disabled || undefined}
      {...rest}
    />
  );
});
