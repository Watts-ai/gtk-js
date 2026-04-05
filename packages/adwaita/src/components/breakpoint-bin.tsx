import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export interface AdwBreakpointCondition {
  /** Condition string: "max-width: 500px", "min-height: 300px", "max-aspect-ratio: 3/2". */
  condition: string;
}

export interface AdwBreakpoint {
  /** Condition that triggers this breakpoint. */
  condition: AdwBreakpointCondition;
  /** Callback when breakpoint becomes active. */
  onApply?: () => void;
  /** Callback when breakpoint becomes inactive. */
  onUnapply?: () => void;
}

export interface AdwBreakpointBinProps extends HTMLAttributes<HTMLDivElement> {
  /** Breakpoint definitions (last matching wins). */
  breakpoints?: AdwBreakpoint[];
  children?: ReactNode;
}

function parseCondition(cond: string): (w: number, h: number) => boolean {
  const parts = cond.split(/\s+and\s+/);
  const checks = parts.map((part) => {
    const match = part.trim().match(/^(min|max)-(width|height|aspect-ratio):\s*(.+)$/);
    if (!match) return () => true;
    const [, minmax, prop, valStr] = match;
    if (prop === "aspect-ratio") {
      const [w, h] = valStr!.split("/").map(Number);
      const ratio = (w ?? 1) / (h ?? 1);
      return (width: number, height: number) => {
        const ar = width / height;
        return minmax === "min" ? ar >= ratio : ar <= ratio;
      };
    }
    const px = parseFloat(valStr!);
    return (width: number, height: number) => {
      const size = prop === "width" ? width : height;
      return minmax === "min" ? size >= px : size <= px;
    };
  });
  return (w, h) => checks.every((check) => check(w, h));
}

/**
 * AdwBreakpointBin — A container that applies breakpoints based on its own size.
 *
 * Like CSS container queries, but evaluates the bin's own width/height.
 * Last matching breakpoint wins.
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.BreakpointBin.html
 */
export const AdwBreakpointBin = forwardRef<HTMLDivElement, AdwBreakpointBinProps>(
  function AdwBreakpointBin({ breakpoints = [], children, className, style, ...rest }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(-1);
    const prevActiveRef = useRef(-1);

    useEffect(() => {
      const el = containerRef.current;
      if (!el || breakpoints.length === 0) return;

      const matchers = breakpoints.map((bp) => parseCondition(bp.condition.condition));

      const observer = new ResizeObserver(([entry]) => {
        if (!entry) return;
        const { width, height } = entry.contentRect;
        let lastMatch = -1;
        for (let i = 0; i < matchers.length; i++) {
          if (matchers[i]!(width, height)) lastMatch = i;
        }
        setActiveIndex(lastMatch);
      });

      observer.observe(el);
      return () => observer.disconnect();
    }, [breakpoints]);

    // Fire apply/unapply callbacks
    useEffect(() => {
      const prev = prevActiveRef.current;
      if (prev === activeIndex) return;
      if (prev >= 0) breakpoints[prev]?.onUnapply?.();
      if (activeIndex >= 0) breakpoints[activeIndex]?.onApply?.();
      prevActiveRef.current = activeIndex;
    }, [activeIndex, breakpoints]);

    const classes = ["gtk-breakpointbin"];
    if (className) classes.push(className);

    return (
      <div
        ref={ref ?? containerRef}
        className={classes.join(" ")}
        style={{ overflow: "hidden", ...style }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
