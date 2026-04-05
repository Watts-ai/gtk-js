import { forwardRef, type HTMLAttributes } from "react";
import { useIcon } from "../icon-context.tsx";

export interface GtkSpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  /** Whether the spinner is animating. Default: false. */
  spinning?: boolean;
}

/**
 * GtkSpinner — A widget that shows a spinning animation.
 *
 * CSS node: spinner
 * Uses :checked pseudo-class when spinning (mapped to data attribute).
 * Animation: 1s linear infinite rotation (defined in Adwaita CSS).
 * Icon: process-working-symbolic from icon theme.
 *
 * @see https://docs.gtk.org/gtk4/class.Spinner.html
 */
export const GtkSpinner = forwardRef<HTMLSpanElement, GtkSpinnerProps>(function GtkSpinner(
  { spinning = false, className, ...rest },
  ref,
) {
  const Icon = useIcon("ProcessWorking");

  const classes = ["gtk-spinner"];
  if (className) classes.push(className);

  return (
    <span
      ref={ref}
      role="progressbar"
      aria-busy={spinning}
      className={classes.join(" ")}
      data-checked={spinning || undefined}
      {...rest}
    >
      {Icon && <Icon size={16} />}
    </span>
  );
});
