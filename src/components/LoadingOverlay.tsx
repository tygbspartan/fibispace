import React, { useEffect, useRef, useState } from "react";
import StarField from "./StarField";
import Sparkle from "./icons/Sparkle";
import { HERO_BACKGROUND } from "./NewHero";

const MONTSERRAT = "Montserrat, sans-serif";
const INTER = "Inter, sans-serif";

// One full there-and-back pass of the sparkle.
const SWEEP_MS = 3400;
// How wide the soft edge either side of the sparkle is, as a percentage of the
// wordmark. The letters give way to it and come back over the same distance,
// rather than being cut off at a line.
const SWEEP_FEATHER = 16;
// How far past each end the sparkle travels, so it clears the word entirely at
// the extremes instead of stopping on top of the first and last letters.
const SWEEP_OVERSHOOT = 0.14;
// The least time the screen is shown for. Without it a warm cache means the
// whole thing flashes past before anyone can read it.
const MIN_SHOW_MS = 1800;
// How long the panel takes to lift away once the question is answered.
const LEAVE_MS = 1200;
const LEAVE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

/**
 * The first thing anyone sees: the hero's own sky, the name being swept over by
 * a sparkle, and then a single question before the site opens.
 *
 * The sweep and the wipe are one movement — the sparkle carries the edge of a
 * mask across the wordmark, so the name is eaten as the sparkle passes over it
 * and comes back as it returns. Both are written straight to the nodes from one
 * rAF loop rather than being two animations that have to be kept in step.
 */
export default function LoadingOverlay({
  isActive,
  backendReady,
  onFinish,
}: {
  isActive: boolean;
  backendReady: boolean;
  /** Called as the panel starts to lift, so the page behind can be shown. */
  onFinish?: () => void;
}) {
  const [phase, setPhase] = useState<"loading" | "ask" | "leaving" | "done">(
    "loading",
  );

  const panelRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const sparkRef = useRef<HTMLSpanElement>(null);

  // --- the sweep -----------------------------------------------------------
  useEffect(() => {
    // Only while it is actually loading. Once the question is up the sparkle
    // parks to the left of the name and the wordmark is left whole.
    if (!isActive || phase !== "loading") return;

    const word = wordRef.current;
    const spark = sparkRef.current;
    if (!word || !spark) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const begun = performance.now();

    const tick = (now: number) => {
      const span = word.offsetWidth;
      // 0 → 1 → 0, smoothly, with no corner at either end.
      const cycle = ((now - begun) % SWEEP_MS) / SWEEP_MS;
      const p = (1 - Math.cos(cycle * Math.PI * 2)) / 2;

      // Travels a little past both ends, so at the extremes it is clear of the
      // word rather than sitting on the F or the final e.
      const from = -SWEEP_OVERSHOOT;
      const to = 1 + SWEEP_OVERSHOOT;
      const at = from + p * (to - from);

      spark.style.transform = `translate(${at * span - spark.offsetWidth / 2}px, -50%)`;

      // The letters give way at the sparkle and fade back in behind it.
      //
      // Which side the fade sits on has to follow the direction of travel. A
      // band centred on the sparkle is partly transparent on both sides of it,
      // so on the way back the word was already showing through ahead of where
      // the sparkle had reached. Here the hard edge is always at the sparkle
      // and the soft one always behind: going right the word fades out to the
      // left of it, coming back it fades in to the right.
      const rising = Math.sin(cycle * Math.PI * 2) > 0;
      const cut = at * 100;
      const soft = rising ? cut - SWEEP_FEATHER : cut + SWEEP_FEATHER;
      const mask =
        "linear-gradient(to right," +
        ` transparent ${Math.min(cut, soft).toFixed(2)}%,` +
        ` #000 ${Math.max(cut, soft).toFixed(2)}%)`;
      word.style.maskImage = mask;
      word.style.webkitMaskImage = mask;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      // Park it off the left edge and give the name back in full — the cleanup
      // runs as the phase changes, which is exactly when that should happen.
      spark.style.transform = "translate(calc(-100% - 14px), -50%)";
      word.style.maskImage = "";
      word.style.webkitMaskImage = "";
    };
  }, [isActive, phase]);

  // --- loading finishes, the question arrives ------------------------------
  useEffect(() => {
    if (!isActive || !backendReady || phase !== "loading") return;

    // Held open for a moment even if the backend was instant.
    const timer = window.setTimeout(() => setPhase("ask"), MIN_SHOW_MS);
    return () => window.clearTimeout(timer);
  }, [isActive, backendReady, phase]);

  // --- answered ------------------------------------------------------------
  const answer = (withSound: boolean) => {
    if (phase !== "ask") return;

    // Dispatched synchronously inside the click, so the audio element is
    // started while the page still counts as user-activated — start it in a
    // later tick and the browser blocks it.
    if (withSound) {
      window.dispatchEvent(new CustomEvent("fibi:sound"));
    }

    setPhase("leaving");
    onFinish?.();

    const panel = panelRef.current;
    if (!panel) {
      setPhase("done");
      return;
    }

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still) {
      setPhase("done");
      return;
    }

    // The whole screen travels up and takes the sky with it, so the hero
    // underneath is uncovered rather than faded to.
    const lift = panel.animate(
      [
        { transform: "translate3d(0, 0, 0)" },
        { transform: "translate3d(0, -100%, 0)" },
      ],
      { duration: LEAVE_MS, easing: LEAVE_EASE, fill: "both" },
    );
    lift.onfinish = () => setPhase("done");
  };

  if (!isActive || phase === "done") return null;

  const asking = phase === "ask" || phase === "leaving";

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[9999] overflow-hidden"
      style={{ background: HERO_BACKGROUND }}
    >
      <div aria-hidden="true" className="absolute inset-0">
        <StarField />
      </div>

      <div className="relative h-full flex flex-col items-center justify-center px-6">
        {/* ---------- The name, being swept ---------- */}
        <div
          ref={markRef}
          className="relative transition-transform duration-700 ease-out"
          style={{ transform: asking ? "translateY(-28px)" : "none" }}
        >
          <span
            ref={wordRef}
            className="relative z-0 block text-[20px] md:text-[25px] whitespace-nowrap"
            style={{
              fontFamily: MONTSERRAT,
              fontWeight: 300,
              letterSpacing: "0.02em",
              color: "#FFFFFF",
            }}
          >
            Fibi Space
          </span>

          {/* Sits on the word's own line, starting off its left edge. */}
          <span
            ref={sparkRef}
            aria-hidden="true"
            className="absolute left-0 top-1/2 z-10 text-white transition-transform duration-500 ease-out [&>svg]:w-[18px] [&>svg]:h-[18px] md:[&>svg]:w-[22px] md:[&>svg]:h-[22px]"
            style={{ transform: "translate(calc(-100% - 14px), -50%)" }}
          >
            <Sparkle size={22} />
          </span>
        </div>

        {/* ---------- The question ---------- */}
        <div
          className="absolute left-0 right-0 flex flex-col items-center gap-4 md:gap-6 px-6 text-center transition-opacity duration-700"
          style={{
            // Under the wordmark's resting place, so the two do not move
            // relative to each other as the panel settles.
            top: "calc(50% + 12px)",
            opacity: asking ? 1 : 0,
            pointerEvents: asking ? "auto" : "none",
          }}
        >
          <p
            className="text-[15px] md:text-[22px]"
            style={{
              fontFamily: INTER,
              fontWeight: 300,
              color: "#B4B3B3",
            }}
          >
            Would you like to experience the site with sound?
          </p>

          <div className="flex items-center gap-8 md:gap-10">
            {[
              { label: "Yes", sound: true },
              { label: "No", sound: false },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => answer(option.sound)}
                className="text-[15px] md:text-[22px] text-white/70 hover:text-primary transition-colors"
                style={{ fontFamily: INTER, fontWeight: 400 }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
