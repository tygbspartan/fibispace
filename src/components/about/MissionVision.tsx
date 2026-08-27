import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import contentData from "../../data/content.json";

gsap.registerPlugin(ScrollTrigger);

const MONTSERRAT = "Montserrat, sans-serif";
const INTER = "Inter, sans-serif";

// How far each card travels, as a fraction of its own width. At 0.54 they end
// up just clear of one another with a gap between.
const SPREAD = 0.54;
// The stack, before it opens: the vision card sits behind and offset. Half the
// offset each, in opposite directions, so the pair straddles the middle of the
// column. Putting the whole offset on one card leaves the stack sitting off to
// its side — the separated state is symmetric, so the stacked one has to be too
// or the pair appears to shift sideways as it opens.
const STACKED = { x: 13, y: -13 };
// Each card leans its own way. They are already tilted while stacked, and open
// out a little further as they part.
const TILT_STACKED = { mission: -2, vision: 2 };
const TILT_APART = { mission: -4, vision: 4 };
// Scroll spent held still while the cards separate, as a fraction of a screen.
const PIN = 0.9;

// Square from md up, where the two share a slot and part sideways. On a phone
// they are wide and short and simply sit one under the other.
//
// Sized off the height of the window rather than its width. The whole opening —
// heading, line, cards and stats — is held on screen while the pair separates,
// so what matters is whether it fits vertically. A width ramp cannot know that:
// a 1600x900 screen took the same 420px card as a 1920x1200 one and pushed the
// stats off the bottom, which is what made the animation look wrong. Clamped so
// it never gets silly on a very short or very tall window.
const CARD =
  "w-[88%] h-[250px] md:w-[clamp(280px,34vh,420px)] md:h-[clamp(280px,34vh,420px)]";
// The slot only has a height from md up. Below that the two are in the flow and
// the column is as tall as they make it.
const CARD_HEIGHT = "md:h-[clamp(280px,34vh,420px)]";
// The card is sized off the height of the window, so what is inside it has to
// be as well. A width ramp against a height-driven box is what put the logo and
// the copy outside the card: on a short screen the box shrank and the type did
// not. Clamped the same way, everything in the card grows and shrinks together
// and the proportions hold at any size.
const CARD_TITLE = "text-[14px] md:text-[clamp(17px,2.4vh,32px)]";
const CARD_BODY = "text-[12px] md:text-[clamp(11px,1.45vh,17px)]";
const CARD_MARK =
  "h-[26px] w-[26px] md:h-[clamp(26px,3.6vh,43px)] md:w-[clamp(26px,3.6vh,43px)]";
// The padding goes with them, or a small card is mostly margin.
const CARD_PAD = "p-5 md:p-[clamp(16px,2.6vh,32px)]";

const MissionVision: React.FC = () => {
  const { about } = contentData;

  const cardsRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const visionRef = useRef<HTMLDivElement>(null);

  // The cards hold still while they separate, and the page only carries on
  // once they are apart. From md up only: below that they are laid out one
  // above the other, already apart, with no scroll behaviour of their own —
  // there is no width for two cards to move into on a phone.
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const mission = missionRef.current;
        const vision = visionRef.current;
        const slot = cardsRef.current;
        if (!mission || !vision || !slot) return;

        gsap.set(vision, {
          x: STACKED.x,
          y: STACKED.y,
          rotate: TILT_STACKED.vision,
        });
        gsap.set(mission, { x: 0, y: 0, rotate: TILT_STACKED.mission });

        // A function, so a resize recalculates it rather than baking in the
        // width the page happened to load at.
        const travel = () => mission.offsetWidth * SPREAD;

        // What is held is the whole opening — heading, line, cards and stats —
        // rather than the cards alone. Pinning inserts a screen of scroll under
        // whatever it pins, so pinning only the cards is what pushed the stats
        // out of view; and because the group reaches the top of the page, the
        // hold begins on the very first scroll rather than after the heading has
        // gone past.
        const group = slot.closest<HTMLElement>("[data-about-pin]") ?? slot;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: group,
            // If the whole group fits the window, hold from the very top: the
            // first scroll opens the cards and nothing has moved before it. If it
            // does not fit — a short window, or a long heading — that would hold
            // the page with the cards half off the bottom, so it waits until the
            // group has been scrolled to the top of the screen and holds there,
            // showing as much of it as there is room for.
            start: () =>
              group.offsetHeight <= window.innerHeight ? 0 : "top top",
            end: () => "+=" + window.innerHeight * PIN,
            pin: true,
            pinSpacing: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(mission, {
            x: () => -travel(),
            rotate: TILT_APART.mission,
            ease: "power2.inOut",
            duration: 1,
          })
          .to(
            vision,
            {
              x: () => travel(),
              y: 0,
              rotate: TILT_APART.vision,
              ease: "power2.inOut",
              duration: 1,
            },
            "<",
          );
      },
    );

    // With motion reduced there is no hold and no transition, so the cards have
    // to be placed apart from the start — otherwise they would sit stacked and
    // the vision card would never be visible at all.
    mm.add("(min-width: 768px) and (prefers-reduced-motion: reduce)", () => {
      const mission = missionRef.current;
      const vision = visionRef.current;
      if (!mission || !vision) return;

      const travel = mission.offsetWidth * SPREAD;
      gsap.set(mission, { x: -travel, y: 0, rotate: TILT_APART.mission });
      gsap.set(vision, { x: travel, y: 0, rotate: TILT_APART.vision });
    });

    return () => mm.revert();
  }, []);

  return (
    <div className="py-[40px] md:py-[60px]">
      {/* Below md they simply stack. From md up they share one absolute slot,
          which is what lets them sit on top of each other before parting. */}
      <div
        ref={cardsRef}
        className={`flex flex-col items-center gap-5 w-full md:block md:relative md:w-auto ${CARD_HEIGHT}`}
      >
        {/* ---------- Vision: the card underneath ---------- */}
        <div
          ref={visionRef}
          className={`relative md:absolute md:left-1/2 md:top-0 md:-translate-x-1/2 ${CARD} rotate-[2deg] md:rotate-0 rounded-[18px] border border-black bg-white ${CARD_PAD} flex flex-col items-center justify-center text-center will-change-transform`}
        >
          <img
            src="/assets/fibiBlack.png"
            alt=""
            aria-hidden="true"
            className={`${CARD_MARK} object-contain`}
          />
          <h3
            className={`mt-[clamp(8px,1.6vh,16px)] ${CARD_TITLE}`}
            style={{ fontFamily: MONTSERRAT, fontWeight: 400 }}
          >
            {about.vision.title}
          </h3>
          <p
            className={`mt-[clamp(6px,1.4vh,16px)] leading-relaxed ${CARD_BODY}`}
            style={{ fontFamily: INTER, fontWeight: 300, color: "#535353" }}
          >
            {about.vision.body}
          </p>
        </div>

        {/* ---------- Mission: the card on top ---------- */}
        <div
          ref={missionRef}
          className={`relative md:absolute md:left-1/2 md:top-0 md:-translate-x-1/2 ${CARD} -rotate-[2deg] md:rotate-0 rounded-[18px] bg-black text-white ${CARD_PAD} flex flex-col items-center justify-center text-center will-change-transform shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]`}
        >
          <img
            src="/assets/fibiWhite.png"
            alt=""
            aria-hidden="true"
            className={`${CARD_MARK} object-contain`}
          />
          <h3
            className={`mt-[clamp(8px,1.6vh,16px)] ${CARD_TITLE}`}
            style={{ fontFamily: MONTSERRAT, fontWeight: 400 }}
          >
            {about.mission.title}
          </h3>
          <p
            className={`mt-[clamp(6px,1.4vh,16px)] leading-relaxed ${CARD_BODY}`}
            style={{
              fontFamily: INTER,
              fontWeight: 300,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            {about.mission.body}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;
