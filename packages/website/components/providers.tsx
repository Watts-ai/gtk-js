"use client";

import { AdwaitaProvider } from "@gtk-js/adwaita";
import * as adwaitaIcons from "@gtk-js/adwaita-icons";
import type { ReactNode } from "react";

export function GtkProviders({ children }: { children: ReactNode }) {
  return <AdwaitaProvider icons={adwaitaIcons}>{children}</AdwaitaProvider>;
}
