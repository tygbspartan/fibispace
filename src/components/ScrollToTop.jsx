import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { jumpToTop } from "../lib/jumpToTop";

// How long the top is held after a route change. Long enough to cover a fetch
// landing and the pinned sections measuring themselves, short enough that it
// cannot be felt if nothing needs it.
const HOLD_MS = 700;

/**
 * Puts every route change back at the top, and keeps it there while the new
 * page settles.
 *
 * Resetting once is not enough, and the reason is worth writing down: several
 * things move the scroll position back after a route change, and they do it at
 * different moments. The page that just mounted is shorter than the one being
 * left — its data has not arrived, so any section that renders nothing until it
 * has data is still absent — and it grows over the next few hundred
 * milliseconds. ScrollTrigger records the scroll position when it refreshes and
 * restores it afterwards, which on a page with a pinned section means the old
 * position being put back. The browser's own scroll anchoring adjusts for
 * content appearing above the viewport.
 *
 * So rather than trying to be the last one to write, this holds the top for a
 * short window and gives it up the moment the reader actually scrolls.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    jumpToTop();

    let raf = 0;
    let released = false;
    const until = performance.now() + HOLD_MS;

    // Any deliberate input ends the hold immediately: a reader who scrolls in
    // the first moment should not be dragged back.
    const release = () => {
      released = true;
    };

    const hold = (now) => {
      if (released) return;

      if (window.scrollY !== 0) jumpToTop();

      if (now < until) {
        raf = requestAnimationFrame(hold);
        return;
      }

      // Measured once the page has stopped changing shape, so the triggers on
      // it are set up against its real height rather than its arriving one.
      ScrollTrigger.refresh();
    };

    raf = requestAnimationFrame(hold);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    window.addEventListener("keydown", release);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("keydown", release);
    };
  }, [pathname]);

  // On first load and on reload. Scroll restoration is turned off in the same
  // breath: left on, the browser puts you back where you were and everything
  // above then has to undo it.
  useLayoutEffect(() => {
    window.history.scrollRestoration = "manual";
    jumpToTop();
  }, []);

  return null;
};

export default ScrollToTop;
