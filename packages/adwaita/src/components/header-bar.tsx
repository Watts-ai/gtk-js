import { useIcon } from "@gtk-js/gtk4";
import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import type { AdwCenteringPolicy } from "../types.ts";

export interface AdwHeaderBarProps extends HTMLAttributes<HTMLDivElement> {
  titleWidget?: ReactNode;
  showStartTitleButtons?: boolean;
  showEndTitleButtons?: boolean;
  showBackButton?: boolean;
  showTitle?: boolean;
  decorationLayout?: string;
  centeringPolicy?: AdwCenteringPolicy;
  start?: ReactNode;
  end?: ReactNode;
}

function WindowControlButton({ name }: { name: string }) {
  const iconMap: Record<string, string> = {
    close: "WindowClose",
    minimize: "WindowMinimize",
    maximize: "WindowMaximize",
  };
  const Icon = useIcon(iconMap[name] ?? "");
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
  const buttons = part.split(",").filter((b) => b && b !== "appmenu" && b !== "icon");
  if (buttons.length === 0) return <div className={`gtk-windowcontrols ${side} empty`} />;
  return (
    <div className={`gtk-windowcontrols gtk-box-layout horizontal ${side}`} style={{ gap: 3 }}>
      {buttons.map((name) => (
        <WindowControlButton key={name} name={name} />
      ))}
    </div>
  );
}

/**
 * AdwHeaderBar — An adaptive header bar with navigation integration.
 *
 * Differences from GtkHeaderBar:
 * - Independent start/end title button control
 * - Built-in back button for NavigationView
 * - show-title property
 * - centering-policy (LOOSE/STRICT)
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.HeaderBar.html
 */
export const AdwHeaderBar = forwardRef<HTMLDivElement, AdwHeaderBarProps>(function AdwHeaderBar(
  {
    titleWidget,
    showStartTitleButtons = true,
    showEndTitleButtons = true,
    showBackButton = true,
    showTitle = true,
    decorationLayout = "appmenu:minimize,maximize,close",
    centeringPolicy = "loose",
    start,
    end,
    className,
    children,
    ...rest
  },
  ref,
) {
  const BackIcon = useIcon("GoPrevious");
  const classes = ["gtk-headerbar"];
  if (className) classes.push(className);

  return (
    <div ref={ref} className={classes.join(" ")} {...rest}>
      <div className="gtk-windowhandle">
        <div className="gtk-box gtk-center-layout">
          <div className="gtk-box gtk-box-layout horizontal start gtk-center-layout-start">
            {showStartTitleButtons && <WindowControls side="start" layout={decorationLayout} />}
            {showBackButton && BackIcon && (
              <button className="gtk-button image-button back flat" type="button">
                <span className="gtk-image">
                  <BackIcon size={16} />
                </span>
              </button>
            )}
            {start}
          </div>
          <div className="gtk-center-layout-center">{showTitle && (titleWidget ?? children)}</div>
          <div className="gtk-box gtk-box-layout horizontal end gtk-center-layout-end">
            {end}
            {showEndTitleButtons && <WindowControls side="end" layout={decorationLayout} />}
          </div>
        </div>
      </div>
    </div>
  );
});
