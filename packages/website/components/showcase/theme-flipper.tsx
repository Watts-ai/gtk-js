"use client";

import { AdwaitaProvider } from "@gtk-js/adwaita";
import * as adwaitaIcons from "@gtk-js/adwaita-icons";
import { type ReactNode, useEffect, useState } from "react";

export interface ThemeFlipperProps {
  interval?: number;
  children: ReactNode;
}

export function ThemeFlipper({ interval = 8000, children }: ThemeFlipperProps) {
  const [scheme, setScheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const timer = setInterval(() => {
      setScheme((s) => (s === "light" ? "dark" : "light"));
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <div
      style={{
        transition: "background-color 600ms ease, color 600ms ease",
        borderRadius: 12,
        overflow: "visible",
      }}
    >
      <AdwaitaProvider colorScheme={scheme} icons={adwaitaIcons}>
        {children}
      </AdwaitaProvider>
    </div>
  );
}
