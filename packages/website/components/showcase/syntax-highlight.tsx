"use client";

import { useEffect, useMemo, useState } from "react";
import { createHighlighter, type Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["github-dark"],
      langs: ["tsx"],
    });
  }
  return highlighterPromise;
}

const CURSOR_HTML =
  '<span style="font-style:normal;font-weight:normal;animation:blink 1s step-end infinite">▎</span>';

function injectCursor(html: string, cursor?: string): string {
  if (!cursor) return html;
  const lastCode = html.lastIndexOf("</code>");
  if (lastCode === -1) return html + CURSOR_HTML;
  return html.slice(0, lastCode) + CURSOR_HTML + html.slice(lastCode);
}

function stripBg(html: string): string {
  return html
    .replace(/background-color:\s*#[0-9a-fA-F]+/g, "background-color:transparent")
    .replace(/background-color:\s*rgb[^;"]*/g, "background-color:transparent");
}

interface SyntaxHighlightProps {
  code: string;
  cursor?: string;
}

export function SyntaxHighlight({ code, cursor }: SyntaxHighlightProps) {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);

  useEffect(() => {
    getHighlighter().then(setHighlighter);
  }, []);

  const html = useMemo(() => {
    if (!highlighter || !code) return "";
    return highlighter.codeToHtml(code, {
      lang: "tsx",
      theme: "github-dark",
    });
  }, [highlighter, code]);

  const lines = (code || "").split("\n");

  if (!html) {
    return (
      <div
        style={{ fontFamily: "monospace", fontSize: "0.85rem", lineHeight: 1.6, whiteSpace: "pre" }}
      >
        {code}
        {cursor}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 16, fontSize: "0.85rem", lineHeight: 1.6 }}>
      <div
        style={{
          fontFamily: "monospace",
          color: "rgba(255,255,255,0.25)",
          textAlign: "right",
          userSelect: "none",
          minWidth: 20,
          flexShrink: 0,
        }}
      >
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <div style={{ flex: 1, minWidth: 0, overflowX: "auto" }}>
        <div
          dangerouslySetInnerHTML={{ __html: injectCursor(stripBg(html), cursor) }}
          style={{ fontFamily: "monospace" }}
        />
      </div>
      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        .shiki { background-color: transparent !important; }
        .shiki code { white-space: pre !important; }
        .shiki span { font-style: normal !important; }
      `}</style>
    </div>
  );
}
