"use client";

import { AdwaitaProvider } from "@gtk-js/adwaita";
import * as adwaitaIcons from "@gtk-js/adwaita-icons";
import { GtkButton } from "@gtk-js/gtk4";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AudioProvider, ShowcasePlayer, windowSteps } from "./scenes";
import { SyntaxHighlight } from "./syntax-highlight";

const CHARS_PER_SEC = 240;
const START_DELAY_MS = 800;

function useSteppedTyping() {
  const steps = windowSteps;
  const [stepIndex, setStepIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [completedCode, setCompletedCode] = useState("");
  const [visibleSteps, setVisibleSteps] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  const step = steps[stepIndex];
  const stepCode = step?.code ?? "";

  useEffect(() => {
    if (started) return;
    const t = setTimeout(() => setStarted(true), START_DELAY_MS);
    return () => clearTimeout(t);
  }, [started]);

  useEffect(() => {
    if (!started || done || !step) return;
    if (charIndex >= stepCode.length) {
      const newCompleted = completedCode + (completedCode ? "\n" : "") + stepCode;
      setCompletedCode(newCompleted);
      setVisibleSteps(stepIndex + 1);
      if (stepIndex + 1 < steps.length) {
        setStepIndex((i) => i + 1);
        setCharIndex(0);
      } else {
        setDone(true);
      }
      return;
    }
    const t = setTimeout(() => setCharIndex((i) => i + 1), 1000 / CHARS_PER_SEC);
    return () => clearTimeout(t);
  }, [started, charIndex, stepCode, stepIndex, steps.length, step, done, completedCode]);

  const displayCode =
    completedCode + (completedCode && charIndex > 0 ? "\n" : "") + stepCode.slice(0, charIndex);

  return { displayCode, cursor: done ? undefined : "▎", visibleSteps };
}

export function ShowcasePage() {
  const codeRef = useRef<HTMLDivElement>(null);
  const { displayCode, cursor, visibleSteps } = useSteppedTyping();

  useEffect(() => {
    const el = codeRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [displayCode]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <div style={{ textAlign: "center", padding: "64px 24px 32px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0 0 8px" }}>
          GTK4 &amp; Adwaita for the Web
        </h1>
        <p style={{ fontSize: "1.1rem", opacity: 0.7, margin: "0 0 32px" }}>
          Pixel-faithful GNOME desktop components, powered by React
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/docs/getting-started" style={{ textDecoration: "none" }}>
            <GtkButton label="Get Started" className="suggested-action" />
          </Link>
          <Link href="/docs/gtk4/button" style={{ textDecoration: "none" }}>
            <GtkButton label="View Components" />
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: "0 auto", padding: "0 24px 48px" }}>
        <AdwaitaProvider icons={adwaitaIcons}>
          <AudioProvider>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                minHeight: 420,
                borderRadius: 12,
              }}
            >
              <div
                ref={codeRef}
                style={{
                  padding: 20,
                  overflowY: "auto",
                  overflowX: "auto",
                  maxHeight: 420,
                  borderRight: "1px solid rgba(128,128,128,0.15)",
                  scrollBehavior: "smooth",
                  background: "#0d1117",
                  borderRadius: 12,
                }}
              >
                <SyntaxHighlight code={"// app.tsx\n" + displayCode} cursor={cursor} />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  padding: 24,
                  overflow: "visible",
                }}
              >
                <div className="showcase-preview">
                  <ShowcasePlayer visibleSteps={visibleSteps} />
                </div>
              </div>
            </div>
          </AudioProvider>
        </AdwaitaProvider>
      </div>

      <style>{`
        @keyframes sc-slide-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sc-scale-in {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes sc-slide-down {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sc-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .showcase-preview .gtk-window {
          animation: sc-scale-in 350ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .showcase-preview .gtk-headerbar {
          animation: sc-slide-down 250ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .showcase-preview .gtk-windowtitle .title,
        .showcase-preview .gtk-windowtitle .subtitle {
          animation: sc-fade 200ms ease-out both;
        }
        .showcase-preview .gtk-label {
          animation: sc-slide-up 250ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .showcase-preview .gtk-button {
          animation: sc-slide-up 250ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .showcase-preview .gtk-scale {
          animation: sc-slide-up 250ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
}
