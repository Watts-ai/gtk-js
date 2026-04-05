import { Children, forwardRef, type HTMLAttributes, type ReactNode } from "react";

export interface AdwPreferencesGroupProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  headerSuffix?: ReactNode;
  separateRows?: boolean;
  children?: ReactNode;
}

/**
 * AdwPreferencesGroup — A group of preference rows with title/description.
 *
 * CSS node:
 *   preferencesgroup > box
 *     ├── box.header[.single-line]
 *     │   └── box.labels > label#title + label#description
 *     └── listbox.boxed-list
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.PreferencesGroup.html
 */
export const AdwPreferencesGroup = forwardRef<HTMLDivElement, AdwPreferencesGroupProps>(
  function AdwPreferencesGroup(
    { title, description, headerSuffix, separateRows = false, children, className, ...rest },
    ref,
  ) {
    const hasTitle = !!title;
    const hasDescription = !!description;
    const hasHeader = hasTitle || hasDescription || headerSuffix;
    const singleLine = hasTitle && !hasDescription;
    const childCount = Children.count(children);

    const classes = ["gtk-preferencesgroup"];
    if (className) classes.push(className);

    return (
      <div ref={ref} className={classes.join(" ")} {...rest}>
        <div className="gtk-box gtk-box-layout vertical" style={{ gap: 6 }}>
          {hasHeader && (
            <div
              className={`gtk-box gtk-box-layout horizontal header ${singleLine ? "single-line" : ""}`}
              style={{ alignItems: "center", gap: 6 }}
            >
              <div className="gtk-box gtk-box-layout vertical labels" style={{ flex: 1, gap: 6 }}>
                {hasTitle && <span className="gtk-label heading h4">{title}</span>}
                {hasDescription && (
                  <span className="gtk-label body dimmed description">{description}</span>
                )}
              </div>
              {headerSuffix}
            </div>
          )}
          {childCount > 0 && (
            <div
              className={`gtk-list ${separateRows ? "boxed-list-separate" : "boxed-list"}`}
              role="list"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    );
  },
);
