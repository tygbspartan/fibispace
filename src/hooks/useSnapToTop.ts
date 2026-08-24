import { useEffect, useRef } from "react";

/**
 * Once you are far enough into a section, guides it up so the whole of it is on
 * screen — the section comes to rest with its top edge at the top of the
 * window.
 *
 * It waits for scrolling to actually stop before doing anything. Guiding while
 * the wheel is still turning means competing with the browser's own scrolling,
 * and with trackpad momentum in particular, which is how this sort of thing
 * ends up feeling like it is fighting you.
 *
 * The travel is animated here rather than handed to scrollBy({ behavior:
 * "smooth" }): the native easing is short and front-loaded, which over half a
 * screen reads as a jerk. This is a long, slow-in slow-out glide instead, and
 * it yields the moment you touch the wheel.
 */

// How close the section's top edge has to be to the top of the window, as a
// fraction of the window height, before it gets guided the rest of the way.
// Half a screen either side, so it works scrolling up as well as down.
const SNAP_RANGE = 0.5;
// Past this it is considered a different part of the page, and the section is
// armed to be guided again next time.
const RESET_RANGE = 0.75;
// How long scrolling has to have stopped for.
const QUIET_MS = 140;
// How long the glide takes, and the least it can take for a short hop — a
// fixed duration would make a 40px correction crawl.
const GLIDE_MS = 900;
const GLIDE_MIN_MS = 380;
// How long to leave it alone afterwards, so its own scrolling is not read as
// the user arriving all over again.
const COOLDOWN_MS = 400;

// Slow in, slow out. The slow start is what stops it feeling like a jump.
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function useSnapToTop<T extends HTMLElement>(deps: unknown[] = []) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const root = document.documentElement;
    const instant = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let armed = true;
    let quiet: number | undefined;
    let cooldownUntil = 0;
    let raf: number | null = null;

    const stopGlide = () => {
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      // index.css sets scroll-behavior: smooth on <html>; left on, every frame
      // of the glide below would start its own animated scroll and they would
      // queue up and fight each other.
      root.style.scrollBehavior = "";
    };

    const glide = (distance: number) => {
      const from = window.scrollY;
      // Long journeys get the full duration, short ones proportionally less.
      const span = Math.min(
        GLIDE_MS,
        Math.max(
          GLIDE_MIN_MS,
          (Math.abs(distance) / window.innerHeight) * GLIDE_MS * 2,
        ),
      );

      root.style.scrollBehavior = "auto";
      const begun = performance.now();

      const tick = (now: number) => {
        const t = Math.min((now - begun) / span, 1);
        window.scrollTo(0, from + distance * ease(t));

        if (t < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          stopGlide();
          cooldownUntil = performance.now() + COOLDOWN_MS;
        }
      };

      raf = requestAnimationFrame(tick);
    };

    const check = () => {
      if (raf !== null) return;
      if (performance.now() < cooldownUntil) return;

      const offset = node.getBoundingClientRect().top;
      const viewport = window.innerHeight;

      // Well away from the top edge — arm it for next time.
      if (Math.abs(offset) > viewport * RESET_RANGE) {
        armed = true;
        return;
      }

      if (!armed) return;
      if (Math.abs(offset) > viewport * SNAP_RANGE) return;
      // Already there.
      if (Math.abs(offset) < 2) return;

      armed = false;

      if (instant) {
        window.scrollBy({ top: offset, behavior: "auto" });
        cooldownUntil = performance.now() + COOLDOWN_MS;
        return;
      }

      // offset is exactly the distance from the window's top edge to the
      // section's, so travelling it lands the section flush.
      glide(offset);
    };

    const onScroll = () => {
      // Our own frames also fire this; the guard in check() covers that.
      window.clearTimeout(quiet);
      quiet = window.setTimeout(check, QUIET_MS);
    };

    // Any deliberate input cancels the glide. It should feel like a suggestion,
    // not somewhere you are being held.
    const yield_ = () => {
      if (raf === null) return;
      stopGlide();
      cooldownUntil = performance.now() + COOLDOWN_MS;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", yield_, { passive: true });
    window.addEventListener("touchstart", yield_, { passive: true });
    window.addEventListener("keydown", yield_);

    return () => {
      window.clearTimeout(quiet);
      stopGlide();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", yield_);
      window.removeEventListener("touchstart", yield_);
      window.removeEventListener("keydown", yield_);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
