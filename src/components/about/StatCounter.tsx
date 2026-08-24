import React, { useEffect, useRef } from "react";

// How long the digits churn before the last one settles.
const DURATION = 1200;

/**
 * Scrambles every digit that has not been locked in yet. Digits lock from the
 * left, so the number resolves rather than simply stopping — and anything that
 * is not a digit ($ , + ) is left alone throughout, so the shape of the value
 * never changes and nothing reflows while it runs.
 */
const scramble = (value: string, progress: number) => {
  const digits = value.replace(/\D/g, "").length;
  const settled = Math.floor(progress * digits);

  let seen = 0;
  return value.replace(/\d/g, (digit) => {
    const locked = seen < settled;
    seen += 1;
    return locked ? digit : String(Math.floor(Math.random() * 10));
  });
};

const StatCounter: React.FC<{
  value: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ value, className = "", style }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf: number | null = null;

    const run = () => {
      // Restart cleanly if it is still mid-churn from a previous pass.
      if (raf !== null) cancelAnimationFrame(raf);

      const start = performance.now();
      const tick = (now: number) => {
        const progress = (now - start) / DURATION;
        if (progress >= 1) {
          node.textContent = value;
          raf = null;
          return;
        }
        // Written straight to the node: this runs every frame and has no
        // business re-rendering the page.
        node.textContent = scramble(value, progress);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    // Runs again on every entry rather than only the first, so the numbers
    // churn each time you scroll back to them. The observer stays connected.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) run();
      },
      { threshold: 0.5 },
    );

    node.textContent = scramble(value, 0);
    observer.observe(node);

    return () => {
      observer.disconnect();
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    // tabular-nums so the width does not jitter as the digits change.
    <span ref={ref} className={`tabular-nums ${className}`} style={style}>
      {value}
    </span>
  );
};

export default StatCounter;
