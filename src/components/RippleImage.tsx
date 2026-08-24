import React, { useEffect, useRef, useState } from "react";

// Sim runs at 1/SCALE of the canvas resolution and is upscaled on draw —
// water is blurry anyway, and this is 4x less work per frame.
const SCALE = 2;
const MAX_DPR = 2;
const RESIZE_DEBOUNCE = 150;

// Refraction / specular tuning
const REFRACT = 14;
const MAX_OFFSET = 12;
const SPECULAR = 7;

// Disturbance
const MOVE_RADIUS = 3;
const CLICK_RADIUS = 9;
const MOVE_SPACING = 2; // one drop every ~2 sim pixels
const MAX_DROPS_PER_EVENT = 12;

export interface RippleImageProps {
  src: string;
  alt: string;
  /** Wrapper element classes — controls the layout box. */
  className?: string;
  /** Classes for the underlying <img>, which defines the size. */
  imgClassName?: string;
  /** Inline overrides for the wrapper — use this to reposition it, since an
   *  inline style beats the wrapper's own `relative inline-block` classes. */
  wrapperStyle?: React.CSSProperties;
  /** How the source is fitted into the canvas. Must match the object-fit used
   *  on imgClassName, or the static fallback will not line up with the sim. */
  fit?: "cover" | "contain";
  /** Disturbance amplitude. */
  strength?: number;
  /** Wave decay per step; higher ripples for longer. */
  damping?: number;
}

const isEnabled = () => {
  if (typeof window === "undefined") return false;
  // Cursor distortion is a vestibular trigger.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  // Pointer-driven, so pointless on touch.
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  return window.innerWidth >= 768;
};

const RippleImage: React.FC<RippleImageProps> = ({
  src,
  alt,
  className = "",
  imgClassName = "",
  wrapperStyle,
  fit = "cover",
  strength = 4,
  damping = 0.93,
}) => {
  const hostRef = useRef<HTMLSpanElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [enabled, setEnabled] = useState(isEnabled);
  // Flipped off if the source canvas turns out to be tainted.
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const onResize = () => setEnabled(isEnabled());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!enabled || failed) return;

    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- everything the loop touches lives here, never in state ---
    let W = 0;
    let H = 0;
    let a: Float32Array | null = null;
    let b: Float32Array | null = null;
    let srcData: Uint8ClampedArray | null = null;
    let out: ImageData | null = null;
    let raf: number | null = null;
    let running = false;
    let inView = true;
    let source: HTMLImageElement | null = null;

    let lastX = -1;
    let lastY = -1;

    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    // ---------------------------------------------------------------
    // Allocation — also runs on resize
    // ---------------------------------------------------------------
    const build = () => {
      if (!source) return;

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const cssW = img.clientWidth;
      const cssH = img.clientHeight;
      if (cssW === 0 || cssH === 0) return;

      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      canvas.width = Math.max(1, Math.round(cssW * dpr));
      canvas.height = Math.max(1, Math.round(cssH * dpr));

      W = Math.max(4, Math.floor(canvas.width / SCALE));
      H = Math.max(4, Math.floor(canvas.height / SCALE));

      a = new Float32Array(W * H);
      b = new Float32Array(W * H);

      off.width = W;
      off.height = H;

      // cover: scale to fill, centre-crop the overflow.
      // contain: scale to fit, centre with transparent margins.
      const fitScale = fit === "contain" ? Math.min : Math.max;
      const scale = fitScale(W / source.naturalWidth, H / source.naturalHeight);
      const dw = source.naturalWidth * scale;
      const dh = source.naturalHeight * scale;
      offCtx.clearRect(0, 0, W, H);
      offCtx.drawImage(source, (W - dw) / 2, (H - dh) / 2, dw, dh);

      try {
        const snapshot = offCtx.getImageData(0, 0, W, H);
        srcData = snapshot.data;
        out = offCtx.createImageData(W, H);
        // Seed the output so the untouched 1px border shows real pixels.
        out.data.set(snapshot.data);
      } catch (err) {
        // Cross-origin image without CORS headers taints the canvas.
        console.error(
          `RippleImage: cannot read pixels from "${src}". The image must be ` +
            `same-origin or served with CORS headers. Falling back to a static image.`,
          err,
        );
        setFailed(true);
      }
    };

    // ---------------------------------------------------------------
    // Disturbance
    // ---------------------------------------------------------------
    const drop = (
      cx: number,
      cy: number,
      radius: number,
      amplitude: number,
    ) => {
      if (!a) return;
      const x0 = Math.max(1, Math.floor(cx - radius));
      const x1 = Math.min(W - 2, Math.ceil(cx + radius));
      const y0 = Math.max(1, Math.floor(cy - radius));
      const y1 = Math.min(H - 2, Math.ceil(cy + radius));

      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > radius) continue;
          // Cosine falloff — a flat disc gives square artifacts.
          a[y * W + x] -=
            amplitude * (0.5 + 0.5 * Math.cos((Math.PI * dist) / radius));
        }
      }
    };

    const toSim = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * W,
        y: ((e.clientY - rect.top) / rect.height) * H,
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!a) return;
      const { x, y } = toSim(e);

      if (lastX < 0) {
        drop(x, y, MOVE_RADIUS, strength * 0.05);
      } else {
        // Interpolate, or a fast cursor leaves a dotted line.
        const dist = Math.hypot(x - lastX, y - lastY);
        const steps = Math.min(
          MAX_DROPS_PER_EVENT,
          Math.max(1, Math.round(dist / MOVE_SPACING)),
        );
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          drop(
            lastX + (x - lastX) * t,
            lastY + (y - lastY) * t,
            MOVE_RADIUS,
            strength * 0.05,
          );
        }
      }

      lastX = x;
      lastY = y;
    };

    const onPointerDown = (e: PointerEvent) => {
      const { x, y } = toSim(e);
      drop(x, y, CLICK_RADIUS, strength * 0.28);
    };

    // Otherwise re-entering draws a streak across the hero.
    const onPointerLeave = () => {
      lastX = -1;
      lastY = -1;
    };

    // ---------------------------------------------------------------
    // Simulation
    // ---------------------------------------------------------------
    const step = () => {
      if (!a || !b) return;
      for (let y = 1; y < H - 1; y++) {
        const row = y * W;
        for (let x = 1; x < W - 1; x++) {
          const i = row + x;
          const v = (a[i - 1] + a[i + 1] + a[i - W] + a[i + W]) * 0.5 - b[i];
          b[i] = v * damping;
        }
      }
      const t = a;
      a = b;
      b = t;
    };

    const render = () => {
      if (!a || !srcData || !out) return;
      const data = out.data;

      for (let y = 1; y < H - 1; y++) {
        const row = y * W;
        for (let x = 1; x < W - 1; x++) {
          const i = row + x;

          let dx = (a[i - 1] - a[i + 1]) * REFRACT;
          let dy = (a[i - W] - a[i + W]) * REFRACT;
          if (dx > MAX_OFFSET) dx = MAX_OFFSET;
          else if (dx < -MAX_OFFSET) dx = -MAX_OFFSET;
          if (dy > MAX_OFFSET) dy = MAX_OFFSET;
          else if (dy < -MAX_OFFSET) dy = -MAX_OFFSET;

          let sx = x + (dx | 0);
          let sy = y + (dy | 0);
          if (sx < 0) sx = 0;
          else if (sx > W - 1) sx = W - 1;
          if (sy < 0) sy = 0;
          else if (sy > H - 1) sy = H - 1;

          const s = (sy * W + sx) * 4;
          const d = i * 4;
          const spec = (dx + dy) * SPECULAR;

          let r = srcData[s] + spec;
          let g = srcData[s + 1] + spec;
          let bl = srcData[s + 2] + spec;
          data[d] = r < 0 ? 0 : r > 255 ? 255 : r;
          data[d + 1] = g < 0 ? 0 : g > 255 ? 255 : g;
          data[d + 2] = bl < 0 ? 0 : bl > 255 ? 255 : bl;
          // Carry alpha across so transparent artwork stays transparent.
          data[d + 3] = srcData[s + 3];
        }
      }

      offCtx.putImageData(out, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(off, 0, 0, W, H, 0, 0, canvas.width, canvas.height);
    };

    const frame = () => {
      step();
      render();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (running || !srcData) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
    };

    const sync = () => {
      if (inView && !document.hidden) start();
      else stop();
    };

    // ---------------------------------------------------------------
    // Wiring
    // ---------------------------------------------------------------
    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        stop();
        build();
        lastX = -1;
        lastY = -1;
        sync();
      }, RESIZE_DEBOUNCE);
    };

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });

    // The <img> defines the box, so rebuild whenever it settles on a new one —
    // this also covers the case where it had no layout size yet on first load.
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(img);

    const loader = new Image();
    loader.crossOrigin = "anonymous";
    loader.onload = () => {
      source = loader;
      build();
      if (hostRef.current) observer.observe(hostRef.current);
      sync();
    };
    loader.onerror = () => {
      console.error(`RippleImage: failed to load "${src}".`);
      setFailed(true);
    };
    loader.src = src;

    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", sync);

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      observer.disconnect();
      resizeObserver.disconnect();
      loader.onload = null;
      loader.onerror = null;
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", sync);
      a = null;
      b = null;
      srcData = null;
      out = null;
    };
  }, [enabled, failed, src, fit, strength, damping]);

  const active = enabled && !failed;

  return (
    <span
      ref={hostRef}
      className={`relative inline-block ${className}`}
      style={wrapperStyle}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={imgClassName}
        style={active ? { opacity: 0 } : undefined}
      />
      {active && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 pointer-events-auto"
        />
      )}
    </span>
  );
};

export default RippleImage;
