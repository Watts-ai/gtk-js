import { useIcon } from "@gtk-js/gtk4";
import { forwardRef, type HTMLAttributes } from "react";
import { createPortal } from "react-dom";

export interface AdwAboutDialogProps extends HTMLAttributes<HTMLDivElement> {
  applicationName: string;
  applicationIcon?: string;
  developerName?: string;
  version?: string;
  releaseNotes?: string;
  releaseNotesVersion?: string;
  comments?: string;
  website?: string;
  supportUrl?: string;
  issueUrl?: string;
  debugInfo?: string;
  debugInfoFilename?: string;
  copyright?: string;
  licenseType?: string;
  license?: string;
  developers?: string[];
  designers?: string[];
  artists?: string[];
  documenters?: string[];
  translatorCredits?: string;
  visible?: boolean;
  portal?: boolean | HTMLElement;
  onClosed?: () => void;
}

/**
 * AdwAboutDialog — An about dialog for applications.
 *
 * CSS node: dialog.about
 *
 * Multi-page dialog showing app info, credits, legal, etc.
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.AboutDialog.html
 */
export const AdwAboutDialog = forwardRef<HTMLDivElement, AdwAboutDialogProps>(
  function AdwAboutDialog(
    {
      applicationName,
      applicationIcon,
      developerName,
      version,
      releaseNotes,
      comments,
      website,
      supportUrl,
      issueUrl,
      copyright,
      licenseType,
      license,
      developers,
      designers,
      artists,
      documenters,
      visible = false,
      portal = false,
      onClosed,
      className,
      ...rest
    },
    ref,
  ) {
    const AppIcon = useIcon(applicationIcon ?? "");

    if (!visible) return null;

    const classes = ["gtk-dialog", "about", "background"];
    if (className) classes.push(className);

    const dialog = (
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
          onClick={onClosed}
        />
        <div
          ref={ref}
          className={classes.join(" ")}
          style={{ position: "relative", maxWidth: 450, width: "90%" }}
          {...rest}
        >
          <div className="gtk-contents" style={{ overflow: "auto", maxHeight: "80vh" }}>
            <div className="main-page" style={{ padding: "12px", textAlign: "center" }}>
              <div
                className="gtk-box gtk-box-layout vertical"
                style={{ gap: 6, alignItems: "center" }}
              >
                {AppIcon && (
                  <span className="gtk-image icon-dropshadow" style={{ marginBottom: 12 }}>
                    <AppIcon size={128} />
                  </span>
                )}
                <span className="gtk-label title-1">{applicationName}</span>
                {developerName && <span className="gtk-label">{developerName}</span>}
                {version && (
                  <button
                    type="button"
                    className="gtk-button flat app-version"
                    onClick={() => navigator.clipboard?.writeText(version)}
                  >
                    <span className="gtk-label">{version}</span>
                  </button>
                )}
              </div>
              <div className="gtk-box gtk-box-layout vertical" style={{ marginTop: 18, gap: 18 }}>
                {comments && <span className="gtk-label body">{comments}</span>}
                {website && (
                  <a
                    href={website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gtk-button link"
                  >
                    <span className="gtk-label">{website}</span>
                  </a>
                )}
                {(developers?.length ||
                  designers?.length ||
                  artists?.length ||
                  documenters?.length) && (
                  <div className="gtk-preferencesgroup">
                    <span className="gtk-label heading">Credits</span>
                    {developers && (
                      <div>
                        <strong>Developers</strong>: {developers.join(", ")}
                      </div>
                    )}
                    {designers && (
                      <div>
                        <strong>Designers</strong>: {designers.join(", ")}
                      </div>
                    )}
                    {artists && (
                      <div>
                        <strong>Artists</strong>: {artists.join(", ")}
                      </div>
                    )}
                    {documenters && (
                      <div>
                        <strong>Documenters</strong>: {documenters.join(", ")}
                      </div>
                    )}
                  </div>
                )}
                {(copyright || license) && (
                  <div className="gtk-preferencesgroup">
                    <span className="gtk-label heading">Legal</span>
                    {copyright && <span className="gtk-label">{copyright}</span>}
                    {license && (
                      <span className="gtk-label body" style={{ whiteSpace: "pre-wrap" }}>
                        {license}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    if (portal === true) return createPortal(dialog, document.body);
    if (portal instanceof HTMLElement) return createPortal(dialog, portal);
    return dialog;
  },
);
