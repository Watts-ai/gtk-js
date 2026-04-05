import { type GtkInputPurpose, useIcon } from "@gtk-js/gtk4";
import React, {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";

export interface AdwEntryRowProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  text?: string;
  showApplyButton?: boolean;
  inputPurpose?: GtkInputPurpose;
  maxLength?: number;
  prefixWidget?: ReactNode;
  suffixWidget?: ReactNode;
  onChanged?: (text: string) => void;
  onApply?: () => void;
  onEntryActivated?: () => void;
}

/**
 * AdwEntryRow — A list row with an integrated text entry.
 *
 * CSS node: row.entry
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.EntryRow.html
 */
export const AdwEntryRow = forwardRef<HTMLDivElement, AdwEntryRowProps>(function AdwEntryRow(
  {
    title,
    text: controlledText,
    showApplyButton = false,
    inputPurpose = "free-form",
    maxLength = 0,
    prefixWidget,
    suffixWidget,
    onChanged,
    onApply,
    onEntryActivated,
    className,
    ...rest
  },
  ref,
) {
  const [internalText, setInternalText] = useState("");
  const [focused, setFocused] = useState(false);
  const [textChanged, setTextChanged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const text = controlledText ?? internalText;
  const hasContent = text.length > 0;

  const ApplyIcon = useIcon("AdwEntryApply");
  const EditIcon = useIcon("DocumentEdit");

  const classes = ["gtk-row", "entry"];
  if (focused) classes.push("focused");
  if (className) classes.push(className);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      if (controlledText === undefined) setInternalText(val);
      setTextChanged(true);
      onChanged?.(val);
    },
    [controlledText, onChanged],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        if (showApplyButton && textChanged) {
          onApply?.();
          setTextChanged(false);
        } else {
          onEntryActivated?.();
        }
      }
    },
    [showApplyButton, textChanged, onApply, onEntryActivated],
  );

  return (
    <div
      ref={ref}
      className={classes.join(" ")}
      onClick={() => inputRef.current?.focus()}
      {...rest}
    >
      <div
        className="gtk-box gtk-box-layout horizontal header"
        style={{ gap: 0, alignItems: "center" }}
      >
        {prefixWidget && (
          <div className="gtk-box prefixes" style={{ gap: 6 }}>
            {prefixWidget}
          </div>
        )}
        <div className="editable-area" style={{ flex: 1, padding: "0 6px" }}>
          <span
            className={`gtk-label title ${hasContent || focused ? "subtitle" : "dimmed"}`}
            style={{ fontSize: hasContent || focused ? "smaller" : undefined }}
          >
            {title}
          </span>
          <input
            ref={inputRef}
            className="gtk-text"
            type={inputPurpose === "password" ? "password" : "text"}
            value={text}
            maxLength={maxLength > 0 ? maxLength : undefined}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {!focused && !hasContent && EditIcon && (
            <span className="gtk-image edit-icon">
              <EditIcon size={16} />
            </span>
          )}
          {showApplyButton && textChanged && ApplyIcon && (
            <button
              type="button"
              className="gtk-button suggested-action circular apply-button"
              onClick={(e) => {
                e.stopPropagation();
                onApply?.();
                setTextChanged(false);
              }}
            >
              <span className="gtk-image">
                <ApplyIcon size={16} />
              </span>
            </button>
          )}
        </div>
        {suffixWidget && (
          <div className="gtk-box suffixes" style={{ gap: 6 }}>
            {suffixWidget}
          </div>
        )}
      </div>
    </div>
  );
});
