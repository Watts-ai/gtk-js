import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { AdwResponseAppearance } from "../types.ts";

export interface AdwAlertDialogResponse {
  id: string;
  label: string;
  appearance?: AdwResponseAppearance;
  enabled?: boolean;
}

export interface AdwAlertDialogProps extends HTMLAttributes<HTMLDivElement> {
  heading?: string;
  headingUseMarkup?: boolean;
  body?: string;
  bodyUseMarkup?: boolean;
  extraChild?: ReactNode;
  preferWideLayout?: boolean;
  responses?: AdwAlertDialogResponse[];
  defaultResponse?: string;
  closeResponse?: string;
  visible?: boolean;
  portal?: boolean | HTMLElement;
  onResponse?: (id: string) => void;
}

/**
 * AdwAlertDialog — A modal alert with heading, body, and response buttons.
 *
 * CSS node: dialog.alert
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.AlertDialog.html
 */
export const AdwAlertDialog = forwardRef<HTMLDivElement, AdwAlertDialogProps>(
  function AdwAlertDialog(
    {
      heading,
      headingUseMarkup = false,
      body,
      bodyUseMarkup = false,
      extraChild,
      preferWideLayout = false,
      responses = [],
      defaultResponse,
      closeResponse = "close",
      visible = false,
      portal = false,
      onResponse,
      className,
      ...rest
    },
    ref,
  ) {
    if (!visible) return null;

    const handleResponse = (id: string) => onResponse?.(id);
    const handleClose = () => onResponse?.(closeResponse);

    const classes = ["gtk-dialog", "alert", "background"];
    if (className) classes.push(className);

    const content = (
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="dimming"
          style={{
            position: "absolute",
            inset: 0,
            background: "var(--shade-color, rgba(0,0,0,0.3))",
          }}
          onClick={handleClose}
        />
        <div
          ref={ref}
          className={classes.join(" ")}
          style={{ position: "relative", maxWidth: preferWideLayout ? 600 : 372 }}
          {...rest}
        >
          <div className="gtk-contents">
            <div className="gtk-windowhandle">
              <div className="gtk-box gtk-box-layout vertical">
                <div className="body-scrolled-window" style={{ overflow: "auto" }}>
                  <div
                    className="message-area gtk-box gtk-box-layout vertical"
                    style={{ gap: heading && body ? 10 : 24, padding: "32px 24px 9px" }}
                  >
                    {heading && <span className="gtk-label title-2 heading-bin">{heading}</span>}
                    {body && <span className="gtk-label body">{body}</span>}
                    {extraChild}
                  </div>
                </div>
                <div
                  className="response-area gtk-box gtk-box-layout horizontal"
                  style={{ gap: 12, padding: "12px 24px 24px", justifyContent: "center" }}
                >
                  {responses.map((resp) => {
                    const btnClasses = ["gtk-button"];
                    if (resp.appearance === "suggested") btnClasses.push("suggested-action");
                    if (resp.appearance === "destructive") btnClasses.push("destructive-action");
                    if (resp.id === defaultResponse) btnClasses.push("default");
                    return (
                      <button
                        key={resp.id}
                        type="button"
                        className={btnClasses.join(" ")}
                        disabled={resp.enabled === false}
                        onClick={() => handleResponse(resp.id)}
                        style={{ flex: 1, minWidth: 60 }}
                      >
                        <span className="gtk-label">{resp.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    if (portal === true) return createPortal(content, document.body);
    if (portal instanceof HTMLElement) return createPortal(content, portal);
    return content;
  },
);
