import React, { useEffect, useRef } from "react";

/**
 * Canvas star field for the hero. One canvas rather than 150 DOM nodes — each
 * star needs its own size, brightness and glow, and that many elements with
 * box-shadows would cost far more to composite than drawing them.
 *
 * Stars drift with scroll at a rate set by their own depth, and a few of them
 * break into shooting stars when you scroll quickly.
 */

const MAX_DPR = 2;
// Stars per million square pixels, so density holds across screen sizes.
const DENSITY = 135;
// Scroll speed, in px per frame, above which streaks start being thrown.
const SHOOT_THRESHOLD = 16;
const MAX_SHOOTING = 18;
// Frames between unprompted streaks, picked fresh each time so they never fall
// into a rhythm. The sky is alive whether or not anyone is scrolling.
const IDLE_GAP = [90, 300];

type Star = {
  x: number;
  y: number;
  r: number;
  base: number; // resting brightness
  glow: boolean;
  twinkle: number; // 0 = steady
  phase: number;
  depth: number; // parallax rate
  lag: number; // how late this one starts dissolving, 0-1 of the band
};

type Streak = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  length: number;
  width: number;
};

const random = (min: number, max: number) => min + Math.random() * (max - min);

interface StarFieldProps {
  className?: string;
  /** 0-1. Driven by the hero on the way into Projects: the field eases out
   *  past the viewer while the light comes up, and stars bloom out into it. A
   *  ref rather than a prop value, because it changes every frame and must not
   *  re-render. */
  travelRef?: React.MutableRefObject<number>;
  /** False stops the loop entirely. The loading screen draws a field of its
   *  own, and the hero's is still running behind it — two canvases of a couple
   *  of hundred stars each, drawing every frame, while the screen also plays
   *  its own animation. */
  active?: boolean;
}

const StarField: React.FC<StarFieldProps> = ({
  className = "",
  travelRef,
  active = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let streaks: Streak[] = [];
    let raf: number | null = null;
    let running = true;

    // Canvas shadowBlur is re-rasterised per shape and is by far the most
    // expensive thing available here — with a few hundred stars carrying one
    // each, it is the whole frame budget. The glow is drawn once into a small
    // offscreen canvas instead and stamped where it is needed, which is a
    // straight blit.
    const sprite = document.createElement("canvas");
    const SPRITE = 64;
    sprite.width = SPRITE;
    sprite.height = SPRITE;
    const spriteCtx = sprite.getContext("2d");
    if (spriteCtx) {
      const halo = spriteCtx.createRadialGradient(
        SPRITE / 2,
        SPRITE / 2,
        0,
        SPRITE / 2,
        SPRITE / 2,
        SPRITE / 2,
      );
      halo.addColorStop(0, "rgba(255,255,255,0.85)");
      halo.addColorStop(0.35, "rgba(255,255,255,0.22)");
      halo.addColorStop(1, "rgba(255,255,255,0)");
      spriteCtx.fillStyle = halo;
      spriteCtx.fillRect(0, 0, SPRITE, SPRITE);
    }

    let lastScroll = window.scrollY;
    let scrollVelocity = 0;
    let drift = 0;
    let idleCountdown = random(IDLE_GAP[0], IDLE_GAP[1]);

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.round((width * height * DENSITY) / 1_000_000);
      stars = Array.from({ length: count }, () => {
        // A minority are larger and glow; most are faint pinpricks.
        const bright = Math.random() < 0.16;
        return {
          x: random(0, width),
          y: random(0, height),
          r: bright ? random(1.1, 2.1) : random(0.35, 1),
          base: bright ? random(0.7, 1) : random(0.18, 0.55),
          glow: bright,
          twinkle: Math.random() < 0.45 ? random(0.004, 0.016) : 0,
          phase: random(0, Math.PI * 2),
          depth: random(0.15, 1),
          // Without this every star in a horizontal line would bloom and go
          // out on the same frame, which reads as a wipe rather than a sky
          // dissolving.
          lag: random(0, 0.42),
        };
      });
    };

    const spawnStreak = (direction: number) => {
      if (streaks.length >= MAX_SHOOTING) return;
      // Launched from a random star's neighbourhood, travelling diagonally.
      const speed = random(9, 17);
      const angle = random(0.25, 0.6) * direction;
      streaks.push({
        x: random(-0.1, 0.9) * width,
        y: random(-0.05, 0.7) * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed * direction,
        life: 0,
        maxLife: random(45, 80),
        length: random(60, 170),
        width: random(0.8, 1.6),
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const travel = travelRef?.current ?? 0;
      const midX = width / 2;
      const midY = height / 2;

      // --- stars ---
      for (const star of stars) {
        star.phase += star.twinkle;
        let alpha = star.twinkle
          ? star.base * (0.55 + 0.45 * Math.sin(star.phase))
          : star.base;

        // Nearer stars slide further as the page scrolls.
        let y = star.y - drift * star.depth;
        // Wrap so the field never runs out.
        y = ((y % height) + height) % height;

        let x = star.x;
        let radiusScale = 1;
        let soften = 0;

        if (travel > 0) {
          // Moving forward: the field opens outward past the viewer. Near
          // stars pass much faster than distant ones, which is the whole of
          // the effect — the distances involved are deliberately small, 26% at
          // the very end, because the depth is doing the work, not the travel.
          const passing = travel * 0.26 * (0.35 + star.depth);
          x = midX + (star.x - midX) * (1 + passing);
          y = midY + (y - midY) * (1 + passing);

          // Growing and going out of focus as they pass.
          radiusScale = 1 + travel * 0.85 * star.depth;
          soften = travel * star.depth;

          // Each has its own share of the crossing, so they do not all go on
          // the same frame. They brighten into the light before they are lost
          // in it rather than simply being switched off.
          const own = Math.min(
            Math.max((travel - star.lag) / (1 - star.lag), 0),
            1,
          );
          if (own >= 1) continue;
          const bloom = Math.sin(own * Math.PI);
          alpha = alpha * (1 - own) * (1 + bloom * 0.9);
          radiusScale *= 1 + bloom * 0.7;
          soften += bloom;
        }

        if (alpha <= 0.01) continue;

        // The bloom is what spreads light into the sky around it — the glow
        // of the last stars is where the ambient light at the horizon comes
        // from, rather than a separate layer painted over them.
        const radius = star.r * radiusScale;

        // The halo stands in for defocus: a star passing the viewer softens
        // rather than staying a hard point.
        const glow = (star.glow ? 0.55 : 0) + soften * 0.8;
        if (glow > 0.03) {
          const size = radius * (7 + soften * 9);
          ctx.globalAlpha = Math.min(alpha * glow, 1);
          ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size);
          ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${Math.min(alpha, 1)})`;
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- shooting stars ---
      streaks = streaks.filter((s) => s.life < s.maxLife);
      for (const streak of streaks) {
        streak.life += 1;
        streak.x += streak.vx;
        streak.y += streak.vy;

        // Fade in fast, out slowly.
        const t = streak.life / streak.maxLife;
        const alpha = t < 0.15 ? t / 0.15 : 1 - (t - 0.15) / 0.85;

        const tailX = streak.x - streak.vx * (streak.length / 10);
        const tailY = streak.y - streak.vy * (streak.length / 10);

        const gradient = ctx.createLinearGradient(
          streak.x,
          streak.y,
          tailX,
          tailY,
        );
        gradient.addColorStop(0, `rgba(255,255,255,${alpha})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = streak.width;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(streak.x, streak.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      }

      // A slow trickle of streaks with no scrolling involved.
      if (!reduceMotion) {
        idleCountdown -= 1;
        if (idleCountdown <= 0) {
          spawnStreak(Math.random() < 0.75 ? 1 : -1);
          idleCountdown = random(IDLE_GAP[0], IDLE_GAP[1]);
        }
      }

      // Velocity bleeds off so streaks stop being thrown once scrolling ends.
      scrollVelocity *= 0.9;

      if (running) raf = requestAnimationFrame(draw);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScroll;
      lastScroll = y;
      drift += delta * 0.25;
      scrollVelocity = Math.abs(delta);

      if (!reduceMotion && scrollVelocity > SHOOT_THRESHOLD) {
        // Only some of them shoot, and only occasionally.
        if (Math.random() < 0.7) spawnStreak(delta > 0 ? 1 : -1);
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      running = entry.isIntersecting;
      if (running && raf === null) raf = requestAnimationFrame(draw);
      else if (!running && raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    });

    // The canvas itself is fixed, so it is always "in view" and would never
    // pause. Watch the hero instead: once it has scrolled away the field is
    // buried under the sections above it and there is nothing to draw for.
    const watched = document.querySelector("[data-hero]") ?? canvas;

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(build, 150);
    };

    build();
    observer.observe(watched);
    raf = requestAnimationFrame(draw);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      observer.disconnect();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf !== null) cancelAnimationFrame(raf);
    };
    // travelRef is a ref: its identity is stable, and the loop reads .current
    // every frame rather than closing over a value.
    // travelRef is a ref: its identity is stable, and the loop reads .current
    // every frame rather than closing over a value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
    />
  );
};

export default StarField;
