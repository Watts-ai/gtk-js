import { forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface AdwOverlaySplitViewProps extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  content?: ReactNode;
  sidebar?: ReactNode;
  collapsed?: boolean;
  showSidebar?: boolean;
  sidebarPosition?: "start" | "end";
  sidebarWidthFraction?: number;
  minSidebarWidth?: number;
  maxSidebarWidth?: number;
  pinSidebar?: boolean;
  onShowSidebarChanged?: (show: boolean) => void;
}

/**
 * AdwOverlaySplitView — A split view with collapsible overlay sidebar.
 *
 * CSS node: overlay-split-view
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.OverlaySplitView.html
 */
export const AdwOverlaySplitView = forwardRef<HTMLDivElement, AdwOverlaySplitViewProps>(
  function AdwOverlaySplitView(
    {
      content,
      sidebar,
      collapsed = false,
      showSidebar = true,
      sidebarPosition = "start",
      sidebarWidthFraction = 0.25,
      minSidebarWidth = 180,
      maxSidebarWidth = 280,
      pinSidebar = false,
      onShowSidebarChanged,
      className,
      style,
      ...rest
    },
    ref,
  ) {
    const classes = ["gtk-overlay-split-view"];
    if (collapsed) classes.push("collapsed");
    if (sidebarPosition === "start") classes.push("sidebar-start");
    else classes.push("sidebar-end");
    if (className) classes.push(className);

    const sidebarVisible = collapsed ? showSidebar : true;

    if (collapsed) {
      return (
        <div
          ref={ref}
          className={classes.join(" ")}
          style={{ position: "relative", ...style }}
          {...rest}
        >
          <div className="widget content-pane" style={{ width: "100%", height: "100%" }}>
            {content}
          </div>
          {sidebarVisible && (
            <>
              <div
                className="dimming"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--shade-color, rgba(0,0,0,0.3))",
                }}
                onClick={() => onShowSidebarChanged?.(false)}
              />
              <div
                className="widget background sidebar-pane"
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  [sidebarPosition === "start" ? "left" : "right"]: 0,
                  width: `clamp(${minSidebarWidth}px, 100%, ${maxSidebarWidth}px)`,
                }}
              >
                {sidebar}
              </div>
            </>
          )}
        </div>
      );
    }

    const isStart = sidebarPosition === "start";
    return (
      <div ref={ref} className={classes.join(" ")} style={{ display: "flex", ...style }} {...rest}>
        {isStart && sidebarVisible && (
          <div
            className="widget sidebar-pane"
            style={{
              width: `clamp(${minSidebarWidth}px, ${sidebarWidthFraction * 100}%, ${maxSidebarWidth}px)`,
              flexShrink: 0,
            }}
          >
            {sidebar}
          </div>
        )}
        <div className="widget content-pane" style={{ flex: 1 }}>
          {content}
        </div>
        {!isStart && sidebarVisible && (
          <div
            className="widget sidebar-pane"
            style={{
              width: `clamp(${minSidebarWidth}px, ${sidebarWidthFraction * 100}%, ${maxSidebarWidth}px)`,
              flexShrink: 0,
            }}
          >
            {sidebar}
          </div>
        )}
      </div>
    );
  },
);
