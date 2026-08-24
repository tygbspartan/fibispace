import React, { useEffect, useRef, useState } from "react";
import contentData from "../data/content.json";

// The rotating 01…08 wheel on the arc. With it off, a static dot marks the
// active position instead.
const SHOW_NUMBERS = true;
// Width of the band the numbers occupy outside the arc.
const NUMBER_BAND = SHOW_NUMBERS ? "var(--num-w)" : "0px";

// Angle between two consecutive numbers on the dial (degrees)
const STEP_ANGLE = 26;
// How much page scroll (in vh) advances the dial by one service
const SCROLL_PER_ITEM = 65;
// Width below which the pinned dial is replaced by a plain stacked list
const PIN_BREAKPOINT = 1024;

// Every measurement the pinned layout depends on, per breakpoint. Declared as
// custom properties because they feed calc() on elements whose other values
// are computed in JS.
const DIAL_VARS = [
  "[--dial-cx:20px] xl:[--dial-cx:30px] 2xl:[--dial-cx:40px] slg:[--dial-cx:60px]",
  "[--dial-r:clamp(180px,min(38vh,20vw),460px)]",
  "xl:[--dial-r:clamp(200px,min(40vh,20vw),460px)]",
  "2xl:[--dial-r:clamp(220px,min(42vh,21vw),460px)]",
  "slg:[--dial-r:clamp(240px,min(43vh,22vw),460px)]",
  "[--num-w:34px] xl:[--num-w:42px] 2xl:[--num-w:50px] slg:[--num-w:60px]",
  "[--gap:70px] xl:[--gap:100px] 2xl:[--gap:140px] slg:[--gap:230px]",
].join(" ");

// The phone arc: the same wheel, hung above the screen so only its lower edge
// shows and the numbers ride along the top of the layout.
const MOBILE_RADIUS = "clamp(240px, 78vw, 420px)";
// How much of the circle is left visible below the top edge.
const MOBILE_ARC = 96;
// How far the whole wheel is dropped down the screen. The arc strip keeps its
// height; only the circle inside it moves, so nothing below shifts.
const MOBILE_DROP = 5;

// Soft left/right edges for the phone copy, which slides across rather than up.
const EDGE_FADE_X =
  "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)";

// Soft top/bottom edges for the copy column
const EDGE_FADE =
  "linear-gradient(to bottom, transparent 0%, #000 20%, #000 80%, transparent 100%)";

const Services: React.FC = () => {
  const { services } = contentData;
  const total = services.length;

  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const currentRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [isWide, setIsWide] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= PIN_BREAKPOINT,
  );

  // Track viewport size — the pinned dial needs room for three columns
  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= PIN_BREAKPOINT);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Map scroll position inside the tall wrapper onto a fractional index,
  // then ease towards it every frame so the dial glides instead of snapping.
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let inView = true;

    const tick = () => {
      const wrapper = wrapperRef.current;
      if (wrapper) {
        const rect = wrapper.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
        const ratio = scrollable > 0 ? scrolled / scrollable : 0;
        targetRef.current = ratio * (total - 1);
      }

      const diff = targetRef.current - currentRef.current;
      currentRef.current += reduceMotion ? diff : diff * 0.12;

      if (Math.abs(diff) < 0.0004) currentRef.current = targetRef.current;
      setProgress((prev) =>
        Math.abs(prev - currentRef.current) > 0.0004
          ? currentRef.current
          : prev,
      );

      rafRef.current = inView ? requestAnimationFrame(tick) : null;
    };

    // Only burn frames while the section is anywhere near the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && rafRef.current === null) {
          rafRef.current = requestAnimationFrame(tick);
        } else if (!inView && rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      },
      { rootMargin: "100px" },
    );

    if (wrapperRef.current) observer.observe(wrapperRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [total]);

  // ----- Phone and tablet -----
  // The same dial, re-laid vertically: wheel across the top, the copy through
  // the middle, the artwork along the bottom.
  if (!isWide) {
    return (
      <section
        id="services"
        ref={wrapperRef}
        className="relative z-10"
        style={{ height: `${100 + (total - 1) * SCROLL_PER_ITEM}vh` }}
      >
        <div
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col"
          style={{ ["--dial-r" as string]: MOBILE_RADIUS }}
        >
          {/* ---------- The wheel, hung above the screen ---------- */}
          <div
            className="relative shrink-0"
            style={{ height: `${MOBILE_ARC}px` }}
          >
            {/* Guide circle. Its centre sits above the top edge, so only the
                bottom of the arc is on screen. */}
            <div
              className="absolute rounded-full border border-black/[0.09]"
              style={{
                left: "50%",
                top: `calc(${MOBILE_ARC}px - var(--dial-r) + ${MOBILE_DROP}px)`,
                width: "calc(2 * var(--dial-r))",
                height: "calc(2 * var(--dial-r))",
                marginLeft: "calc(-1 * var(--dial-r))",
                marginTop: "calc(-1 * var(--dial-r))",
              }}
            />

            {/* The numbers ride that circle; the wheel counter-rotates. */}
            <div
              className="absolute"
              style={{
                left: "50%",
                top: `calc(${MOBILE_ARC}px - var(--dial-r) + ${MOBILE_DROP}px)`,
                width: 0,
                height: 0,
                transformOrigin: "0 0",
                transform: `rotate(${progress * STEP_ANGLE}deg)`,
                willChange: "transform",
              }}
            >
              {services.map((service, index) => {
                const distance = Math.abs(index - progress);
                const nearness = Math.max(0, 1 - distance);
                const dotOpacity = Math.max(0, 1 - distance * 3);

                return (
                  <div
                    key={service.id}
                    className="absolute top-0 left-0 w-0 h-0"
                    style={{
                      transformOrigin: "0 0",
                      // 90deg puts the active slot at the bottom of the circle,
                      // which is the point nearest the copy below it.
                      transform: `rotate(${90 - index * STEP_ANGLE}deg) translateX(var(--dial-r))`,
                    }}
                  >
                    <span
                      className="absolute top-0 left-0 flex flex-col items-center gap-1.5"
                      style={{
                        // Held upright against both rotations above, so the
                        // numbers read level wherever they are on the arc.
                        transform: `translate(-50%, -50%) rotate(${-(90 - (index - progress) * STEP_ANGLE)}deg)`,
                      }}
                    >
                      <span
                        className="tabular-nums text-[18px] sm:text-[20px]"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 300,
                          color: `rgba(17, 17, 17, ${0.18 + nearness * 0.82})`,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="w-[7px] h-[7px] rounded-full bg-[#12A89C]"
                        style={{
                          opacity: dotOpacity,
                          boxShadow: `0 0 ${5 + dotOpacity * 8}px ${1 + dotOpacity * 2}px rgba(18, 168, 156, ${dotOpacity * 0.45})`,
                        }}
                      />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------- The copy ---------- */}
          <div
            className="relative flex-1 overflow-hidden"
            style={{ maskImage: EDGE_FADE_X, WebkitMaskImage: EDGE_FADE_X }}
          >
            {services.map((service, index) => {
              const offset = index - progress;
              const distance = Math.abs(offset);

              return (
                <div
                  key={service.id}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 sm:px-10"
                  style={{
                    // A full width per step, so each one is centred as it
                    // arrives and the next is waiting just off screen. Each one
                    // enters from the left and leaves to the right, and the
                    // wheel above turns to match — the two have to agree or the
                    // number and the words it belongs to pull apart.
                    transform: `translateX(${offset * 100}%)`,
                    opacity: Math.max(0, 1 - distance * 1.9),
                    pointerEvents:
                      index === Math.round(progress) ? "auto" : "none",
                    willChange: "transform, opacity",
                  }}
                >
                  <h3
                    className="capitalize text-[20px] sm:text-[32px]"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 400,
                      lineHeight: 1.15,
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="mt-3 max-w-md leading-relaxed text-[12px] sm:text-[15px]"
                    style={{ fontWeight: 300, color: "#898080" }}
                  >
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ---------- The artwork ---------- */}
          <div className="relative shrink-0 h-[34vh] mb-6">
            {services.map((service, index) => {
              const offset = index - progress;
              const distance = Math.abs(offset);

              return (
                <img
                  key={service.id}
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    transform: `translateX(${offset * 18}%) scale(${1 + Math.min(distance, 1) * 0.04})`,
                    opacity: Math.max(0, 1 - distance * 1.6),
                    willChange: "transform, opacity",
                  }}
                />
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  const activeIndex = Math.round(progress);

  return (
    <section
      id="services"
      ref={wrapperRef}
      className="relative"
      style={{ height: `${100 + (total - 1) * SCROLL_PER_ITEM}vh` }}
    >
      {/* Pinned viewport */}
      <div
        className={`sticky top-0 h-screen w-full overflow-hidden ${DIAL_VARS}`}
      >
        <div className="h-full w-full flex items-center justify-between pr-6 xl:pr-12 slg:pr-[120px]">
          {/* ---------- Left: the arc, its label and marker ---------- */}
          <div
            className="relative h-full shrink-0"
            style={{
              width: `calc(var(--dial-cx) + var(--dial-r) + ${NUMBER_BAND})`,
            }}
          >
            {/* Guide circle, centred just inside the left edge */}
            <div
              className="absolute rounded-full border border-black/[0.09]"
              style={{
                left: "var(--dial-cx)",
                top: "50%",
                width: "calc(2 * var(--dial-r))",
                height: "calc(2 * var(--dial-r))",
                marginLeft: "calc(-1 * var(--dial-r))",
                marginTop: "calc(-1 * var(--dial-r))",
              }}
            />

            {/* Section label, inside the arc */}
            <div
              className="absolute uppercase leading-[1.22] left-8 xl:left-12 2xl:left-16 slg:left-[120px] text-[20px] xl:text-[24px] 2xl:text-[30px] slg:text-[36px]"
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                fontWeight: 400,
                color: "#A9A9A9",
              }}
            >
              Our
              <br />
              Services
            </div>

            {/* Marker sitting on the arc at the active position. With the
                wheel on, each number carries its own dot instead. */}
            {!SHOW_NUMBERS && (
              <div
                className="absolute w-[9px] h-[9px] rounded-full"
                style={{
                  left: "calc(var(--dial-cx) + var(--dial-r))",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "#12A89C",
                  boxShadow: "0 0 10px 3px rgba(18, 168, 156, 0.35)",
                }}
              />
            )}

            {/* Numbers ride the circle; the whole wheel counter-rotates */}
            <div
              className="absolute"
              style={{
                left: "var(--dial-cx)",
                top: "50%",
                width: 0,
                height: 0,
                transformOrigin: "0 0",
                transform: `rotate(${-progress * STEP_ANGLE}deg)`,
                willChange: "transform",
                display: SHOW_NUMBERS ? undefined : "none",
              }}
            >
              {services.map((service, index) => {
                const distance = Math.abs(index - progress);
                const nearness = Math.max(0, 1 - distance);
                const dotOpacity = Math.max(0, 1 - distance * 3);

                return (
                  <div
                    key={service.id}
                    className="absolute top-0 left-0 w-0 h-0"
                    style={{
                      // Zero-sized and pinned to its own top-left, so the
                      // rotation pivots on the circle's centre instead of the
                      // element's own box — that is what keeps the dots on the arc.
                      transformOrigin: "0 0",
                      transform: `rotate(${index * STEP_ANGLE}deg) translateX(var(--dial-r))`,
                    }}
                  >
                    <span
                      className="absolute top-0 left-0 flex items-center gap-2 slg:gap-3 whitespace-nowrap"
                      // Back off half the dot so its centre, not its edge,
                      // lands on the circle.
                      style={{ transform: "translate(-4.5px, -50%)" }}
                    >
                      <span
                        className="w-[9px] h-[9px] rounded-full bg-[#12A89C] shrink-0"
                        style={{
                          // Sharper curve than the number: the dot belongs to
                          // the active item only.
                          opacity: dotOpacity,
                          boxShadow: `0 0 ${6 + dotOpacity * 10}px ${2 + dotOpacity * 2}px rgba(18, 168, 156, ${dotOpacity * 0.45})`,
                        }}
                      />
                      <span
                        className="font-light tabular-nums text-[20px] xl:text-[24px] 2xl:text-[28px] slg:text-[32px]"
                        style={{
                          color: `rgba(17, 17, 17, ${0.18 + nearness * 0.82})`,
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ---------- Middle: text that scrolls with the dial ---------- */}
          <div
            className="relative h-[78vh] flex-1 min-w-0 max-w-[380px] xl:max-w-[460px] 2xl:max-w-[540px] slg:max-w-[640px]"
            style={{
              // The gap is measured from the arc, so the copy holds its
              // position whether or not the numbers occupy the band outside it.
              marginLeft: `calc(var(--gap) - ${NUMBER_BAND})`,
              // A soft mask instead of overflow-hidden — clipping cut the copy
              // off against a hard edge as it travelled out of the column.
              maskImage: EDGE_FADE,
              WebkitMaskImage: EDGE_FADE,
            }}
          >
            {services.map((service, index) => {
              const offset = index - progress;
              const distance = Math.abs(offset);

              return (
                <div
                  key={service.id}
                  className="absolute inset-0 flex flex-col justify-center"
                  style={{
                    transform: `translateY(${offset * 70}%)`,
                    // Reaches zero before the item runs into the mask, so the
                    // copy is gone by the time it would otherwise be cut.
                    opacity: Math.max(0, 1 - distance * 1.9),
                    pointerEvents: index === activeIndex ? "auto" : "none",
                    willChange: "transform, opacity",
                  }}
                >
                  <h3
                    className="capitalize mb-4 xl:mb-5 slg:mb-6 text-[30px] xl:text-[38px] 2xl:text-[42px] slg:text-[60px]"
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 400,
                      lineHeight: 1.1,
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="leading-relaxed text-[16px] xl:text-[18px] slg:text-[20px] max-w-[320px] xl:max-w-[380px] 2xl:max-w-[430px] slg:max-w-[480px]"
                    style={{ fontWeight: 300, color: "#898080" }}
                  >
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ---------- Right: artwork that crossfades with the copy ---------- */}
          <div className="relative shrink-0 ml-6 xl:ml-8 2xl:ml-10 slg:ml-12 w-[200px] xl:w-[260px] 2xl:w-[290px] slg:w-[450px]">
            {/* Sets the auto height for the absolutely-stacked images below,
                so the column does not jump as they crossfade. */}
            <img
              src={services[0].image}
              alt=""
              aria-hidden="true"
              className="w-full h-auto invisible"
            />
            {services.map((service, index) => {
              const offset = index - progress;
              const distance = Math.abs(offset);

              return (
                <img
                  key={service.id}
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-contain"
                  style={{
                    transform: `translateY(${offset * 12}%) scale(${1 + Math.min(distance, 1) * 0.04})`,
                    opacity: Math.max(0, 1 - distance * 1.6),
                    willChange: "transform, opacity",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
