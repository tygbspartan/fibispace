import { useEffect, useRef } from "react";

/**
 * Entrances for sections as they scroll into view.
 *
 * Two deliberate choices, both learned the hard way on this page:
 *
 * - An IntersectionObserver rather than a scroll listener. Sections whose
 *   content arrives from a fetch are frequently already on screen by the time
 *   they mount, and a scroll listener only ever hears about a scroll that comes
 *   after it — so those sections would simply never reveal.
 *
 * - The Web Animations API rather than a CSS transition. A transition only runs
 *   if the browser painted the starting value first, which is not guaranteed
 *   when an element mounts and reveals inside the same frame. animate()
 *   interpolates from the keyframes given, whatever happened to be painted.
 *
 * Every element must carry its starting state in the markup — REVEAL_HIDDEN or
 * REVEAL_FLAT below — so there is no flash of content before the observer
 * fires.
 */

// Small numbers on purpose. The motion should be something you notice only
// afterwards — a long, slow settle rather than an entrance.

// Barely a pause. A long delay makes an element feel triggered; the point is
// that it appears to have been arriving as you scrolled to it.
export const REVEAL_DELAY = 80;
// Slow. Most of the duration is spent almost still, which is what reads as
// weight rather than as a slow animation.
export const REVEAL_MS = 1100;
// A connector drawing itself is quicker — it is punctuation between two things,
// not a thing in its own right.
export const LINE_MS = 520;
// Any of the element on screen is enough. Waiting for a fraction of it means
// the element is already well into view before it starts, which is what makes
// a reveal feel late and abrupt.
const REVEAL_THRESHOLD = 0;
// Held back from the very bottom edge, so things do not begin the moment a
// sliver appears.
const REVEAL_MARGIN = "0px 0px -12% 0px";
// A short travel. Anything further reads as sliding in.
const REVEAL_RISE = 14;
// Decelerating hard: quick to leave, then a long glide into place.
const REVEAL_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
// The heading's extra emphasis. Just off 1 — enough to feel, not to see.
const POP_FROM = 0.985;

/** Starting state for an element that fades up. Spread into its style. */
export const REVEAL_HIDDEN = { opacity: 0 } as const;

/** Starting state for a connector, which draws itself left to right. */
export const REVEAL_FLAT = {
  transform: "scaleX(0)",
  transformOrigin: "left center",
} as const;

interface ViewOptions {
  /** Added to REVEAL_DELAY, for staggering several elements off one arrival. */
  delay?: number;
  /** Fraction of the element that must be visible. */
  threshold?: number;
  /** Anything that has to land before the element exists — a fetch, usually. */
  deps?: unknown[];
  /** Held back while false. The element stays in its hidden starting state,
   *  and nothing is observed — for content that is on screen but not yet meant
   *  to be seen. */
  enabled?: boolean;
}

/**
 * The shared machinery: watch an element, play the given keyframes when it
 * arrives, and cancel them when it leaves so the next arrival replays it.
 * Cancelling is what puts the inline starting state back.
 */
function useAnimateOnView<T extends HTMLElement>(
  frames: (gentle: boolean) => Keyframe[],
  duration: number,
  {
    delay = 0,
    threshold = REVEAL_THRESHOLD,
    deps = [],
    enabled = true,
  }: ViewOptions,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || !enabled) return;

    // The rise and the scale are the motion; the fade is the point. Under
    // reduce only the fade is kept.
    const gentle = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let animation: Animation | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (animation) return;
          animation = node.animate(frames(gentle), {
            duration,
            delay: REVEAL_DELAY + delay,
            easing: REVEAL_EASE,
            // Holds both ends: the starting frame through the delay, and the
            // finished state afterwards so the inline style never returns.
            fill: "both",
          });
          return;
        }

        if (animation) {
          animation.cancel();
          animation = null;
        }
      },
      { threshold, rootMargin: REVEAL_MARGIN },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (animation) animation.cancel();
    };
    // delay, duration and threshold belong here: the observer closes over
    // them, so a caller that changes its delay — a step whose place in the row
    // changes when the grid goes from four columns to two — would otherwise
    // keep animating on the timing it was given at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, delay, duration, threshold, ...deps]);

  return ref;
}

interface RevealOptions extends ViewOptions {
  /** Also scales up slightly — a little more emphasis, for headings. */
  pop?: boolean;
  /** How far it travels, in px. Defaults to the shared REVEAL_RISE. */
  rise?: number;
  /** Resolves from this much blur, in px. Text materialising out of the
   *  atmosphere rather than sliding in. 0 for none. */
  blur?: number;
}

/** Fades an element up whenever it comes into view. */
export function useRevealOnView<T extends HTMLElement>({
  pop = false,
  rise = REVEAL_RISE,
  blur = 0,
  ...options
}: RevealOptions = {}) {
  return useAnimateOnView<T>(
    (gentle) => [
      {
        opacity: 0,
        transform: gentle
          ? "none"
          : `translate3d(0, ${rise}px, 0)${pop ? ` scale(${POP_FROM})` : ""}`,
        // Under reduce the travel and the softness both go; the fade stays.
        filter: gentle || !blur ? "none" : `blur(${blur}px)`,
      },
      { opacity: 1, transform: "none", filter: "none" },
    ],
    REVEAL_MS,
    options,
  );
}

/**
 * Draws a rule out from its left edge. Used for the connectors between the
 * process steps, so each line visibly travels to the step it points at.
 */
export function useGrowOnView<T extends HTMLElement>(
  options: ViewOptions = {},
) {
  return useAnimateOnView<T>(
    () => [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
    LINE_MS,
    options,
  );
}
