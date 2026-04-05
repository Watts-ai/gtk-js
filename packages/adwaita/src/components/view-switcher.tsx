import { forwardRef, type HTMLAttributes } from "react";

export interface AdwViewSwitcherPage {
  name: string;
  title: string;
  iconName?: string;
  needsAttention?: boolean;
  badgeNumber?: number;
}

export interface AdwViewSwitcherProps extends HTMLAttributes<HTMLDivElement> {
  pages: AdwViewSwitcherPage[];
  activePageName?: string;
  policy?: "narrow" | "wide";
  onPageChanged?: (name: string) => void;
}

/**
 * AdwViewSwitcher — Tab buttons for switching views.
 *
 * CSS node: viewswitcher[.wide|.narrow]
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.ViewSwitcher.html
 */
export const AdwViewSwitcher = forwardRef<HTMLDivElement, AdwViewSwitcherProps>(
  function AdwViewSwitcher(
    { pages, activePageName, policy = "narrow", onPageChanged, className, ...rest },
    ref,
  ) {
    const classes = ["gtk-viewswitcher", policy];
    if (className) classes.push(className);

    return (
      <div ref={ref} role="tablist" className={classes.join(" ")} {...rest}>
        {pages.map((page) => {
          const isActive = page.name === activePageName;
          return (
            <button
              key={page.name}
              type="button"
              className={`gtk-button toggle ${isActive ? "" : ""}`}
              role="tab"
              aria-selected={isActive}
              data-checked={isActive || undefined}
              onClick={() => onPageChanged?.(page.name)}
            >
              <div className={`gtk-box ${policy === "wide" ? "wide" : "narrow"}`}>
                {page.iconName && <span className="gtk-image" />}
                <span className="gtk-label">{page.title}</span>
              </div>
            </button>
          );
        })}
      </div>
    );
  },
);

export interface AdwViewSwitcherBarProps extends HTMLAttributes<HTMLDivElement> {
  pages: AdwViewSwitcherPage[];
  activePageName?: string;
  reveal?: boolean;
  onPageChanged?: (name: string) => void;
}

/**
 * AdwViewSwitcherBar — A bottom bar containing a ViewSwitcher.
 *
 * CSS node: viewswitcherbar
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.ViewSwitcherBar.html
 */
export const AdwViewSwitcherBar = forwardRef<HTMLDivElement, AdwViewSwitcherBarProps>(
  function AdwViewSwitcherBar(
    { pages, activePageName, reveal = false, onPageChanged, className, ...rest },
    ref,
  ) {
    if (!reveal || pages.length < 2) return null;

    const classes = ["gtk-viewswitcherbar"];
    if (className) classes.push(className);

    return (
      <div ref={ref} className={classes.join(" ")} {...rest}>
        <div className="gtk-actionbar">
          <div className="gtk-revealer">
            <AdwViewSwitcher
              pages={pages}
              activePageName={activePageName}
              policy="narrow"
              onPageChanged={onPageChanged}
            />
          </div>
        </div>
      </div>
    );
  },
);
