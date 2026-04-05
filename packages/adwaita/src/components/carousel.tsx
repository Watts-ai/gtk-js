import type { GtkOrientation } from "@gtk-js/gtk4";
import {
  Children,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from "react";

export interface AdwCarouselProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  spacing?: number;
  allowMouseDrag?: boolean;
  allowScrollWheel?: boolean;
  allowLongSwipes?: boolean;
  orientation?: GtkOrientation;
  onPageChanged?: (index: number) => void;
  children?: ReactNode;
}

/**
 * AdwCarousel — A swipeable/scrollable page container.
 *
 * CSS node: carousel[.horizontal|.vertical]
 *
 * @see https://gnome.pages.gitlab.gnome.org/libadwaita/doc/1-latest/class.Carousel.html
 */
export const AdwCarousel = forwardRef<HTMLDivElement, AdwCarouselProps>(function AdwCarousel(
  {
    interactive = true,
    spacing = 0,
    allowMouseDrag = true,
    allowScrollWheel = true,
    allowLongSwipes = false,
    orientation = "horizontal",
    onPageChanged,
    children,
    className,
    style,
    ...rest
  },
  ref,
) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const childCount = Children.count(children);

  const classes = ["gtk-carousel", orientation];
  if (className) classes.push(className);

  const isHoriz = orientation === "horizontal";

  const _scrollToPage = useCallback(
    (index: number) => {
      const el = scrollRef.current;
      if (!el) return;
      const clamped = Math.max(0, Math.min(childCount - 1, index));
      const size = isHoriz ? el.clientWidth : el.clientHeight;
      const pos = clamped * (size + spacing);
      el.scrollTo({
        [isHoriz ? "left" : "top"]: pos,
        behavior: "smooth",
      });
      setCurrentPage(clamped);
      onPageChanged?.(clamped);
    },
    [childCount, spacing, isHoriz, onPageChanged],
  );

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const size = isHoriz ? el.clientWidth : el.clientHeight;
    const pos = isHoriz ? el.scrollLeft : el.scrollTop;
    const page = Math.round(pos / (size + spacing));
    if (page !== currentPage) {
      setCurrentPage(page);
      onPageChanged?.(page);
    }
  }, [isHoriz, spacing, currentPage, onPageChanged]);

  return (
    <div ref={ref} className={classes.join(" ")} style={style} {...rest}>
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          flexDirection: isHoriz ? "row" : "column",
          gap: spacing,
          overflow: "hidden",
          scrollSnapType: `${isHoriz ? "x" : "y"} mandatory`,
          overflowX: isHoriz && interactive ? "auto" : "hidden",
          overflowY: !isHoriz && interactive ? "auto" : "hidden",
          scrollbarWidth: "none",
        }}
        onScroll={handleScroll}
      >
        {Children.map(children, (child, i) => (
          <div
            key={i}
            style={{
              flexShrink: 0,
              width: isHoriz ? "100%" : undefined,
              height: !isHoriz ? "100%" : undefined,
              scrollSnapAlign: "start",
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
});

export interface AdwCarouselIndicatorDotsProps extends HTMLAttributes<HTMLDivElement> {
  nPages: number;
  position: number;
}

export const AdwCarouselIndicatorDots = forwardRef<HTMLDivElement, AdwCarouselIndicatorDotsProps>(
  function AdwCarouselIndicatorDots({ nPages, position, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={`gtk-carouselindicatordots ${className ?? ""}`}
        style={{ display: "flex", gap: 7, justifyContent: "center", padding: 6 }}
        {...rest}
      >
        {Array.from({ length: nPages }, (_, i) => (
          <div
            key={i}
            style={{
              width: i === position ? 8 : 6,
              height: i === position ? 8 : 6,
              borderRadius: "50%",
              background: "currentColor",
              opacity: i === position ? 0.9 : 0.3,
              transition: "all 200ms",
            }}
          />
        ))}
      </div>
    );
  },
);

export interface AdwCarouselIndicatorLinesProps extends HTMLAttributes<HTMLDivElement> {
  nPages: number;
  position: number;
}

export const AdwCarouselIndicatorLines = forwardRef<HTMLDivElement, AdwCarouselIndicatorLinesProps>(
  function AdwCarouselIndicatorLines({ nPages, position, className, ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={`gtk-carouselindicatorlines ${className ?? ""}`}
        style={{ display: "flex", gap: 5, justifyContent: "center", padding: 2 }}
        {...rest}
      >
        {Array.from({ length: nPages }, (_, i) => (
          <div
            key={i}
            style={{
              width: 35,
              height: 3,
              borderRadius: 2,
              background: "currentColor",
              opacity: i === position ? 0.9 : 0.3,
              transition: "opacity 200ms",
            }}
          />
        ))}
      </div>
    );
  },
);
