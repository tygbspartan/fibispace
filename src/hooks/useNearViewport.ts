import { useEffect, useRef, useState } from "react";

/**
 * True while the element is anywhere near the screen.
 *
 * A CSS animation runs whether or not anyone can see it: the marquee and the
 * cloud drift are both infinite, so on any page that contains them the
 * compositor is doing work on every frame for the entire visit. Pausing them
 * off screen costs nothing visually — by definition no one is looking — and
 * takes that work back.
 *
 * The margin is generous on purpose. Resuming exactly at the edge would mean
 * an animation starting from wherever it was left, in view; a screen of warning
 * means it is already running by the time it can be seen.
 */
const NEAR = "100% 0px 100% 0px";

export function useNearViewport<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: NEAR },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, near] as const;
}
