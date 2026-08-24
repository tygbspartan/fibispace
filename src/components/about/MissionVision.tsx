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
// The stack, before it opens: the vision card sits behind and offset.
const STACKED = { x: 26, y: -26 };
// Each card leans its own way. They are already tilted while stacked, and open
// out a little further as they part.
const TILT_STACKED = { mission: -2, vision: 2 };
const TILT_APART = { mission: -4, vision: 4 };
// Scroll spent held still while the cards separate, as a fraction of a screen.
const PIN = 0.9;

// Square from md up, where the two share a slot and part sideways. On a phone
// they are wide and short and simply sit one under the other.
const CARD =
  "w-[88%] h-[250px] md:w-[300px] md:h-[300px] lg:w-[340px] lg:h-[340px] xl:w-[380px] xl:h-[380px] 2xl:w-[420px] 2xl:h-[420px]";
// The slot only has a height from md up. Below that the two are in the flow and
// the column is as tall as they make it.
const CARD_HEIGHT = "md:h-[300px] lg:h-[340px] xl:h-[380px] 2xl:h-[420px]";
const CARD_TITLE =
  "text-[14px] md:text-[24px] lg:text-[28px] xl:text-[32px] 2xl:text-[40px]";
const CARD_BODY = "text-[12px] lg:text-[13px] xl:text-[15px] 2xl:text-[18px]";

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
            start: () => 0,
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
      gsap.set(mission, { x: -travel, rotate: TILT_APART.mission });
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
          className={`relative md:absolute md:left-1/2 md:top-0 md:-translate-x-1/2 ${CARD} rotate-[2deg] md:rotate-0 rounded-[18px] border border-black bg-white p-6 lg:p-8 flex flex-col items-center justify-center text-center will-change-transform`}
        >
          <img
            src="/assets/fibiBlack.png"
            alt=""
            aria-hidden="true"
            className="h-[26px] w-[26px] md:h-[43px] md:w-[43px] object-contain"
          />
          <h3
            className={`mt-4 ${CARD_TITLE}`}
            style={{ fontFamily: MONTSERRAT, fontWeight: 400 }}
          >
            {about.vision.title}
          </h3>
          <p
            className={`mt-4 leading-relaxed ${CARD_BODY}`}
            style={{ fontFamily: INTER, fontWeight: 300, color: "#535353" }}
          >
            {about.vision.body}
          </p>
        </div>

        {/* ---------- Mission: the card on top ---------- */}
        <div
          ref={missionRef}
          className={`relative md:absolute md:left-1/2 md:top-0 md:-translate-x-1/2 ${CARD} -rotate-[2deg] md:rotate-0 rounded-[18px] bg-black text-white p-6 lg:p-8 flex flex-col items-center justify-center text-center will-change-transform shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]`}
        >
          <img
            src="/assets/fibiWhite.png"
            alt=""
            aria-hidden="true"
            className="h-[26px] w-[26px] md:h-[43px] md:w-[43px] object-contain"
          />
          <h3
            className={`mt-4 ${CARD_TITLE}`}
            style={{ fontFamily: MONTSERRAT, fontWeight: 400 }}
          >
            {about.mission.title}
          </h3>
          <p
            className={`mt-4 leading-relaxed ${CARD_BODY}`}
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
