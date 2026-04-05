import { GtkProvider, type GtkProviderProps } from "@gtk-js/gtk4";
import { type ReactNode } from "react";
import adwaitaCSS from "../dist/adwaita.css" with { type: "text" };

export interface AdwaitaProviderProps extends Omit<GtkProviderProps, "cssHref" | "cssText"> {
  children: ReactNode;
}

/**
 * AdwaitaProvider — Initializes the Adwaita theme, analogous to adw_init().
 *
 * Replaces GtkProvider — use one or the other, not both.
 * Automatically injects the Adwaita CSS theme (no external file needed).
 */
export function AdwaitaProvider(props: AdwaitaProviderProps) {
  return <GtkProvider cssText={adwaitaCSS} {...props} />;
}
