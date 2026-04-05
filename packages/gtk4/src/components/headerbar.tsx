import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { useIcon } from "../icon-context.tsx";

export interface GtkHeaderBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Widget displayed in the title position (center). */
  titleWidget?: ReactNode;
  /** Whether to show window controls (close/minimize/maximize). Default: true. */
  showWindowControls?: boolean;
  /**
   * Window button layout string, matching GTK's decoration-layout format.
   * Colon separates start from end. Default: "appmenu:minimize,maximize,close".
   */
  decorationLayout?: string;
  /** Start-side children (before title). */
  start?: ReactNode;
  /** End-side children (after title). */
  end?: ReactNode;
}

/** Maps decoration-layout button names to icon component PascalCase names. */
const controlIconNames: Record<string, string> = {
  close: "WindowClose",
  minimize: "WindowMinimize",
  maximize: "WindowMaximize",
};

function WindowControlButton({ name }: { name: string }) {
  const iconName = controlIconNames[name];
  const Icon = useIcon(iconName ?? "");

  if (!Icon) return null;

  return (
    <button className={`gtk-button image-button ${name}`} type="button">
      <span className="gtk-image">
        <Icon size={16} />
      </span>
    </button>
  );
}

function WindowControls({ side, layout }: { side: "start" | "end"; layout: string }) {
  const [startPart = "", endPart = ""] = layout.split(":");
  const part = side === "start" ? startPart : endPart;
  const buttons = part.split(",").filter((b) => b && b !== "appmenu");

  if (buttons.length === 0) {
    return <div className={`gtk-windowcontrols ${side} empty`} />;
  }

  return (
    <div className={`gtk-windowcontrols gtk-box-layout horizontal ${side}`} style={{ gap: 3 }}>
      {buttons.map((name) => (
        <WindowControlButton key={name} name={name} />
      ))}
    </div>
  );
}

/**
 * GtkHeaderBar — A bar for window titles and controls.
 *
 * Outer: GtkBinLayout. Inner: GtkCenterLayout via windowhandle > box.
 *
 * CSS node tree (must match for theme selectors):
 *   headerbar
 *     └── windowhandle
 *         └── box (CenterLayout)
 *             ├── box.start
 *             ├── <title widget>
 *             └── box.end
 *
 * @see https://docs.gtk.org/gtk4/class.HeaderBar.html
 */
export const GtkHeaderBar = forwardRef<HTMLDivElement, GtkHeaderBarProps>(function GtkHeaderBar(
  {
    titleWidget,
    showWindowControls = true,
    decorationLayout = "appmenu:minimize,maximize,close",
    start,
    end,
    className,
    children,
    ...rest
  },
  ref,
) {
  const classes = ["gtk-headerbar"];
  if (className) classes.push(className);

  return (
    <div ref={ref} className={classes.join(" ")} {...rest}>
      <div className="gtk-windowhandle">
        <div className="gtk-box gtk-center-layout">
          <div className="gtk-box gtk-box-layout horizontal start gtk-center-layout-start">
            {showWindowControls && <WindowControls side="start" layout={decorationLayout} />}
            {start}
          </div>

          <div className="gtk-center-layout-center">{titleWidget ?? children}</div>

          <div className="gtk-box gtk-box-layout horizontal end gtk-center-layout-end">
            {end}
            {showWindowControls && <WindowControls side="end" layout={decorationLayout} />}
          </div>
        </div>
      </div>
    </div>
  );
});
