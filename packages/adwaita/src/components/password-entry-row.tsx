import { useIcon } from "@gtk-js/gtk4";
import { forwardRef, type HTMLAttributes, type ReactNode, useState } from "react";

export interface AdwPasswordEntryRowProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  text?: string;
  showApplyButton?: boolean;
  maxLength?: number;
  prefixWidget?: ReactNode;
  suffixWidget?: ReactNode;
  onChanged?: (text: string) => void;
  onApply?: () => void;
}

/**
 * AdwPasswordEntryRow — An EntryRow for passwords with peek toggle.
 *
 * CSS node: row.entry.password
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.PasswordEntryRow.html
 */
export const AdwPasswordEntryRow = forwardRef<HTMLDivElement, AdwPasswordEntryRowProps>(
  function AdwPasswordEntryRow(
    {
      title,
      text,
      showApplyButton,
      maxLength,
      prefixWidget,
      suffixWidget,
      onChanged,
      onApply,
      className,
      ...rest
    },
    ref,
  ) {
    const [visible, setVisible] = useState(false);
    const [capsLock, setCapsLock] = useState(false);
    const RevealIcon = useIcon("ViewReveal");
    const ConcealIcon = useIcon("ViewConceal");
    const CapsLockIcon = useIcon("CapsLock");
    const PeekIcon = visible ? ConcealIcon : RevealIcon;

    const classes = ["gtk-row", "entry", "password"];
    if (className) classes.push(className);

    return (
      <div ref={ref} className={classes.join(" ")} {...rest}>
        <div
          className="gtk-box gtk-box-layout horizontal header"
          style={{ gap: 0, alignItems: "center" }}
        >
          {prefixWidget && <div className="gtk-box prefixes">{prefixWidget}</div>}
          <div className="editable-area" style={{ flex: 1, padding: "0 6px" }}>
            <span className="gtk-label title subtitle" style={{ fontSize: "smaller" }}>
              {title}
            </span>
            <input
              className="gtk-text"
              type={visible ? "text" : "password"}
              value={text}
              maxLength={maxLength && maxLength > 0 ? maxLength : undefined}
              onChange={(e) => onChanged?.(e.target.value)}
              onKeyDown={(e) => {
                setCapsLock(e.getModifierState("CapsLock"));
                if (e.key === "Enter" && showApplyButton) onApply?.();
              }}
            />
            {capsLock && !visible && CapsLockIcon && (
              <span className="gtk-image caps-lock-indicator">
                <CapsLockIcon size={16} />
              </span>
            )}
          </div>
          <div className="gtk-box suffixes" style={{ gap: 6 }}>
            {PeekIcon && (
              <button
                type="button"
                className="gtk-button flat"
                title={visible ? "Hide Text" : "Show Text"}
                onClick={() => setVisible(!visible)}
              >
                <span className="gtk-image">
                  <PeekIcon size={16} />
                </span>
              </button>
            )}
            {suffixWidget}
          </div>
        </div>
      </div>
    );
  },
);
