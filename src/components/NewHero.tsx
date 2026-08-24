import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import contentData from "../data/content.json";
import StarField from "./StarField";

gsap.registerPlugin(ScrollTrigger);

// index.css sets `* { font-family: Inter }` on every element, so Montserrat
// cannot be inherited from a parent — it has to be set where the text is.
const MONTSERRAT = "Montserrat, sans-serif";

// Navbar height per breakpoint. The navbar sits above the hero in the flow, so
// the hero has to be a screen minus that — otherwise the two together are
// taller than the viewport and the page scrolls before anything happens.
export const NAV_HEIGHT_VARS =
  "[--nav-h:64px] md:[--nav-h:80px] lg:[--nav-h:96px]";

export const HERO_BACKGROUND =
  "linear-gradient(178.4deg, #000000 1.36%, #666666 346.03%)";

/**
 * The sequence, as three measurements that derive from one another. All of them
 * are in viewports.
 *
 *   0 ────────────── BADGES ───────────────────────── PIN+PORTAL
 *   │  chain arrives  │  band crosses the screen            │
 *                     ^ the band's top edge is exactly here
 *
 * The band is a strip of gradient at the top of the page, so where it sits in
 * the document is fixed by the spacer above it. Setting PIN to BADGES + 1 is
 * what puts its leading edge precisely one viewport below the fold when the
 * chain finishes — so the badges are all in place and nothing has begun to
 * wash before the first pixel of it appears.
 */
// Scroll the badge chain is dealt out over. Eight badges share it, so this is
// what sets how fast they arrive — the stagger between them is a fraction of
// this span, not a fixed time, and cannot slow them on its own.
export const BADGES = 0.9;
// How tall the band is. The transition takes this plus one viewport to cross
// the screen, so it is the number to change if the crossing feels long.
export const BAND = 0.5;

// Everything below follows from those two. PIN is where the transition starts
// in the document; PORTAL is what it occupies after that.
export const PIN = BADGES + 1;
export const PORTAL = BAND;

// Projects arrives over the hero rather than the hero becoming Projects.
//
// Nothing interpolates between dark and light: the page is a white sheet that
// travels up and covers the sky, and the boundary between them is its own top
// edge. The midpoint of any dark-to-light blend is a flat grey, which is what
// made every previous version look washed out however the gradients were
// arranged. Here there is no midpoint at all.
//
// The sky drifts up a little as the band passes over it. Slower than the
// page, so the two separate — without it the band slides across something
// perfectly static, which reads as a panel over a photograph.
const HERO_DRIFT = 0.1;

// How long someone has to sit still before the scroll hint is offered.
const IDLE_MS = 5000;

// How long each phrase in the headline holds before the next takes over.
const PHRASE_MS = 2000;

// ---------------------------------------------------------------------------
// The hero's type scale, in one place. Every role steps once per breakpoint and
// they are meant to be read together — changing one in isolation is what makes
// a layout look arbitrary.
//
//                base  sm  md  lg  xl 2xl wide
//   headline       28  34  40  48  54  60   68
//   description    14  15  16  17  18   -    -
//   button         13   -  14   -  15   -    -
//   stat value     14  15  16  17  18   -   20
//   stat label      9  10   -  11   -  12    -
//
// `short:` (max-height 820px — laptops) drops each role about one step, since
// there the constraint is height, not width. It is declared last in the config
// so it wins over the width steps, which means every role needs its own short
// ladder or a wide-but-short screen would fall back to the phone size.
const HEADLINE =
  "text-[28px] sm:text-[34px] md:text-[40px] lg:text-[48px] xl:text-[52px] 2xl:text-[56px] wide:text-[68px] " +
  "short:text-[38px] lg:short:text-[44px] xl:short:text-[46px] 2xl:short:text-[48px]";
const BODY =
  "text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] xl:text-[17px] " +
  "short:text-[14px] lg:short:text-[15px]";
const BUTTON =
  "text-[13px] md:text-[14px] xl:text-[15px] short:text-[13px] xl:short:text-[14px]";
const STAT_VALUE =
  "text-[14px] sm:text-[15px] md:text-[16px] lg:text-[16px] xl:text-[17px] wide:text-[20px] " +
  "short:text-[13px] lg:short:text-[14px] 2xl:short:text-[15px]";
const STAT_LABEL =
  "text-[9px] sm:text-[10px] lg:text-[11px] 2xl:text-[12px] " +
  "short:text-[9px] lg:short:text-[10px]";
// The stats sit off the bottom edge. Short screens were pinned almost against
// it, so they get more room rather than less.
const STATS_BOTTOM =
  "bottom-8 md:bottom-12 lg:bottom-14 short:bottom-10 lg:short:bottom-12";
// How far the chain sits off the bottom. Raised along with the copy above it.
const BADGE_BOTTOM =
  "bottom-[22%] md:bottom-[28%] lg:bottom-[27%] short:bottom-[16%] md:short:bottom-[22%] lg:short:bottom-[24%]";
// The badge chain, scaled to the room available. Not scaled at all below md,
// where it is a grid laid out at its own size rather than a wide row being
// shrunk to fit — shrinking a row is what made the labels unreadable on a
// phone.
const BADGE_SCALE =
  "scale-100 lg:scale-[0.9] xl:scale-[0.96] 2xl:scale-100 " +
  "short:scale-100 lg:short:scale-[0.86] xl:short:scale-[0.9]";

// The badges sit on one level line, laid out edge to edge in a flex row so they
// stay linked whatever their text width. Each leans off horizontal on its own —
// some up, some down — which is what gives the row its kink.
const BADGE_TILT = [-8, 6, -11, 4, -5, 9, -7, 5];
// A sliver of negative margin so neighbours stay touching rather than opening a
// seam where they tilt away from each other.
const BADGE_OVERLAP = -6;

// 0 before `from`, 1 after `to`, smoothly eased between.
const ramp = (value: number, from: number, to: number) => {
  const t = Math.min(Math.max((value - from) / (to - from), 0), 1);
  return t * t * (3 - 2 * t);
};

const NewHero: React.FC = () => {
  const { hero, services } = contentData;
  const navigate = useNavigate();

  const sectionRef = useRef<HTMLElement>(null);
  const badgesRef = useRef<(HTMLDivElement | null)[]>([]);

  // The lean and the overlap are inline styles — GSAP animates these elements,
  // so they cannot be Tailwind transform classes — and an inline style cannot
  // vary by breakpoint. Hence a flag rather than a class.
  const [phone, setPhone] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 1023px)");
    const sync = () => setPhone(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  // Read by the star field every frame; never triggers a render.
  const travelRef = useRef(0);

  // The headline's second line cycles. hero.subtitle stays the first thing
  // shown, so the line is correct on the very first paint.
  const phrases = hero.subtitles?.length ? hero.subtitles : [hero.subtitle];
  const [phrase, setPhrase] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(
      () => setPhrase((current) => (current + 1) % phrases.length),
      PHRASE_MS,
    );
    return () => window.clearInterval(id);
  }, [phrases.length]);

  // The hint only appears once nothing has happened for a while — someone
  // already scrolling does not need to be told to scroll.
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: number | undefined;

    const arm = () => {
      // Passing the same value is a no-op in React, so this does not re-render
      // on every pointer move — only on the two actual transitions.
      setIdle(false);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setIdle(true), IDLE_MS);
    };

    const events = [
      "scroll",
      "pointermove",
      "pointerdown",
      "wheel",
      "keydown",
      "touchstart",
    ];

    arm();
    events.forEach((event) =>
      window.addEventListener(event, arm, { passive: true }),
    );

    return () => {
      window.clearTimeout(timer);
      events.forEach((event) => window.removeEventListener(event, arm));
    };
  }, []);

  const stats = [
    { value: hero.stats.reach, label: hero.stats.reachDescription },
    { value: hero.stats.customers, label: hero.stats.customersDescription },
    { value: hero.stats.time, label: hero.stats.timeDescription },
  ];

  // Coming up on the horizon.
  //
  // Scroll-linked, not played: every value below is a function of where the
  // page is, so it runs forwards and backwards at whatever speed you scroll and
  // never becomes an animation happening at you. rAF-throttled and written
  // straight to the nodes, so the page does not re-render while it runs.
  //
  // Four elements, no per-star DOM: the copy leaving, a wash climbing from the
  // bottom edge, a glow just beyond it, and a final white that lands exactly on
  // the Projects background.
  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    const page = document.querySelector<HTMLElement>("[data-page-content]");
    const band = document.querySelector<HTMLElement>("[data-cloud-band]");

    let ticking = false;
    // Only announced when it changes, so listeners are not woken every frame.
    let wasCrossed: boolean | null = null;

    const apply = () => {
      ticking = false;

      // 0 as the band's leading edge reaches the bottom of the screen — the
      // moment the chain has finished — and 1 once the page has arrived at the
      // top. Measured off the page itself rather than counted in viewports, so
      // it cannot drift from the CSS that positions the band.
      const pageTop = page
        ? page.getBoundingClientRect().top
        : window.innerHeight * (PIN + PORTAL) - window.scrollY;
      const bandHeight = band ? band.offsetHeight : window.innerHeight * BAND;
      const span = window.innerHeight + bandHeight;
      const progress = Math.min(Math.max(1 - pageTop / span, 0), 1);

      // --- the copy goes ---
      // Faded out before the band reaches it, so nothing is read through a
      // half-white wash.
      const leaving = ramp(progress, 0, 0.5);
      content.style.opacity = String(1 - leaving);
      content.style.pointerEvents = leaving > 0.95 ? "none" : "";

      // --- and the sky falls back behind the band ---
      overlay.style.transform = `translate3d(0, ${-progress * HERO_DRIFT * 100}%, 0)`;

      // Covered completely — nothing left to draw.
      overlay.style.visibility = progress >= 1 ? "hidden" : "visible";

      // How far through the crossing the field is. Read by it every frame.
      travelRef.current = ramp(progress, 0, 1) * 0.35;

      // The navbar sits over all of this and has to flip while the screen is
      // still lightening, not after.
      document.documentElement.dataset.pageLight =
        progress > 0.55 ? "true" : "false";

      // Projects waits for this before it starts revealing itself. It is on
      // screen well before the crossing ends — held still behind the light —
      // and without it, its own entrances would all have played out unseen by
      // the time it is uncovered.
      //
      // Announced as an event as well as written as an attribute. An attribute
      // alone has to be polled, and the obvious place to poll is the scroll
      // handler — which is exactly what is not running when someone stops
      // scrolling on the last frame of the crossing.
      const crossed = progress >= 1;
      if (crossed !== wasCrossed) {
        wasCrossed = crossed;
        document.documentElement.dataset.heroCrossed = crossed
          ? "true"
          : "false";
        window.dispatchEvent(
          new CustomEvent("fibi:hero", { detail: { crossed } }),
        );
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      delete document.documentElement.dataset.pageLight;
      delete document.documentElement.dataset.heroCrossed;
    };
  }, []);

  // The badge chain is the one thing that needs its own scroll mapping, so the
  // links arrive one at a time rather than together.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const badges = badgesRef.current.filter(Boolean) as HTMLDivElement[];
    if (badges.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(badges, { y: 0, opacity: 1 });
      return;
    }

    const context = gsap.context(() => {
      // Parked below the fold, so each badge flies up from off-screen.
      gsap.set(badges, { y: () => window.innerHeight * 0.5, opacity: 0 });

      gsap.to(badges, {
        y: 0,
        opacity: 1,
        ease: "back.out(1.3)",
        duration: 0.6,
        stagger: { each: 0.5 },
        scrollTrigger: {
          // No pin: the hero is a fixed overlay already, and its scroll length
          // comes from the spacer the page leaves for it. This just maps the
          // first stretch of that scroll onto the chain arriving.
          trigger: document.documentElement,
          start: 0,
          end: () => window.innerHeight * BADGES,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <>
      {/* ---------- The scene ----------
          One fixed overlay holding the sky, the starfield and everything the
          hero says, sitting above the rest of the page. The transition happens
          inside it: the sky lightens from the bottom up until it is the same
          white as the section arriving underneath, and then it is done. */}
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-30 overflow-hidden ${NAV_HEIGHT_VARS}`}
        style={{ background: HERO_BACKGROUND, willChange: "transform" }}
      >
        <div aria-hidden="true" className="absolute inset-0">
          <StarField travelRef={travelRef} />
        </div>

        <section
          ref={sectionRef}
          // The navbar looks for this to know it is sitting over the dark hero.
          data-hero
          // Sits below the navbar, which floats over this whole overlay.
          className="absolute left-0 right-0 bottom-0 overflow-hidden"
          style={{ top: "var(--nav-h)" }}
        >
          <div
            ref={contentRef}
            className="absolute inset-0 z-10"
            style={{ willChange: "transform, opacity" }}
          >
            {/* ---------- Copy ---------- */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 md:px-12 lg:px-[120px] -translate-y-[40px] md:-translate-y-[75px] short:-translate-y-[55px]">
              <h1
                className={HEADLINE}
                style={{
                  fontFamily: MONTSERRAT,
                  fontWeight: 300,
                  lineHeight: 1.18,
                  letterSpacing: "0",
                  color: "#FFFFFF",
                }}
              >
                {hero.title}
                <br />
                {/* Keyed on the index so React remounts it, which is what
                  replays the entrance each time the phrase changes.
                  fontFamily is repeated here because index.css sets it on
                  every element via a * rule — without it this span falls
                  back to Inter while the line above stays Montserrat. */}
                <span
                  key={phrase}
                  className="inline-block animate-wordIn motion-reduce:animate-none"
                  style={{
                    fontFamily: MONTSERRAT,
                    fontWeight: 300,
                    color: "#12A89C",
                  }}
                >
                  {phrases[phrase]}
                </span>
              </h1>

              <p
                className={`mt-6 md:mt-[30px] short:mt-4 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl ${BODY}`}
                style={{
                  fontFamily: MONTSERRAT,
                  fontWeight: 400,
                  lineHeight: 1.6,
                  color: "#B8B8B8",
                }}
              >
                {hero.description}
              </p>

              <div className="mt-6 md:mt-[30px] short:mt-4 flex items-center gap-3 md:gap-4">
                <button
                  onClick={() => navigate("/services")}
                  className={`rounded-full bg-white text-black px-5 md:px-6 lg:px-7 py-2.5 lg:py-3 hover:bg-white/90 transition-colors ${BUTTON}`}
                  style={{ fontFamily: MONTSERRAT, fontWeight: 600 }}
                >
                  Our Services
                </button>
                <button
                  onClick={() => navigate("/contact")}
                  className={`group inline-flex items-center gap-2 rounded-full bg-white text-black px-5 md:px-6 lg:px-7 py-2.5 lg:py-3 hover:bg-white/90 transition-colors ${BUTTON}`}
                  style={{ fontFamily: MONTSERRAT, fontWeight: 600 }}
                >
                  {hero.ctaText}
                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    // Runs for as long as the cursor is on the button, rather
                    // than shifting once and settling.
                    className="group-hover:animate-nudge motion-reduce:animate-none"
                  />
                </button>
              </div>
            </div>

            {/* ---------- Service badges ----------
              A connected chain rather than scattered pills: one level row, each
              link leaning off horizontal on its own. */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none origin-center w-full px-4 md:px-12 lg:w-auto lg:px-0 ${BADGE_BOTTOM} ${BADGE_SCALE}`}
            >
              {/* Four across and two down on a phone, one row from md up. */}
              <div className="grid grid-cols-4 gap-x-0 gap-y-1.5 place-items-stretch lg:flex lg:items-center lg:gap-0">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    ref={(el) => {
                      badgesRef.current[index] = el;
                    }}
                    className="w-full lg:w-auto flex items-center justify-center text-center leading-tight rounded-full border border-white/15 bg-[#0B0B0B] px-1 py-1.5 md:px-3 md:py-2 lg:px-5 lg:py-2.5 text-[10px] md:text-[12px] lg:text-[13px]"
                    style={{
                      // Its own lean off the level line, kept out of GSAP's way by
                      // living in rotate rather than transform. In a grid there
                      // is no level line to lean off, and the overlap that keeps
                      // the row linked would only push the columns apart.
                      rotate: phone
                        ? undefined
                        : `${BADGE_TILT[index % BADGE_TILT.length]}deg`,
                      marginLeft: phone || index === 0 ? 0 : BADGE_OVERLAP,
                      fontFamily: MONTSERRAT,
                      fontWeight: 500,
                      color: "#FFFFFF",
                    }}
                  >
                    {service.shortTitle}
                  </div>
                ))}
              </div>
            </div>

            {/* ---------- Stats ---------- */}
            <div
              className={`absolute left-0 right-0 z-10 px-6 md:px-12 lg:px-[120px] ${STATS_BOTTOM}`}
            >
              {/* ---------- Scroll hint ----------
                Centred directly above the stats, and only offered once someone
                has sat still long enough to look like they need it. Inside the
                content layer, so it fades away with the rest of the copy. */}
              <button
                onClick={() =>
                  window.scrollBy({
                    top: window.innerHeight,
                    behavior: "smooth",
                  })
                }
                aria-label="Scroll down"
                aria-hidden={!idle}
                className={`mx-auto mb-5 flex flex-col items-center gap-1.5 transition-opacity duration-500 ${
                  idle ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <span
                  className="uppercase text-[9px] md:text-[10px] tracking-[0.2em]"
                  style={{
                    fontFamily: MONTSERRAT,
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.55)",
                  }}
                >
                  Scroll
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={1.8}
                  className="text-white animate-scrollHint motion-reduce:animate-none"
                />
              </button>

              <div className="flex justify-center gap-6 sm:gap-10 md:gap-14 lg:gap-16 wide:gap-20">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p
                      className={STAT_VALUE}
                      style={{
                        fontFamily: MONTSERRAT,
                        fontWeight: 700,
                        color: "#FFFFFF",
                      }}
                    >
                      {stat.value}
                    </p>
                    <p
                      className={`mt-1 uppercase tracking-[0.08em] ${STAT_LABEL}`}
                      style={{
                        fontFamily: MONTSERRAT,
                        fontWeight: 400,
                        color: "#8A8A8A",
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default NewHero;
