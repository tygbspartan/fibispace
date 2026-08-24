import React, { useEffect, useState } from "react";
import type { LucideProps } from "lucide-react";
import { ArrowRightLeft, CircleQuestionMark, Eye } from "lucide-react";
import TrafficLight from "../icons/TrafficLight";
import contentData from "../../data/content.json";
import {
  REVEAL_FLAT,
  REVEAL_HIDDEN,
  useGrowOnView,
  useRevealOnView,
} from "../../hooks/useRevealOnView";

const MONTSERRAT = "Montserrat, sans-serif";
const INTER = "Inter, sans-serif";

// Same ramp as every other section title on the site.
// How far the connectors keep clear of the rings at either end.
// The ring is smaller on a phone. In classes rather than in the style below,
// because an inline width cannot vary by breakpoint — and RING itself has to
// stay 52, since the connector maths is measured off it and connectors only
// appear from lg up, where that is the real size.
const LINE_GAP = 12;
// The connector reads the ring size and the grid gap from custom properties,
// set on the line itself: --ring 38/52 and --gap 20/112, matching w-[38px]
// md:w-[52px] on the rings and gap-x-5 lg:gap-x-28 on the grid. They are
// written out as literal classes there because Tailwind scans source text and
// anything interpolated compiles to nothing. RING stays for the desktop maths.

const TITLE_SIZE =
  "text-[28px] md:text-[34px] xl:text-[38px] 2xl:text-[50px] slg:text-[60px]";

// Named in the content file rather than imported there, so the copy stays free
// of anything that has to resolve to a component.
// The chain: a step arrives, then the line travels on to the next one, then
// that step arrives. STEP_GAP is one full link of that, and the line sets off
// partway through its own step so the two overlap rather than queue.
const STEP_GAP = 380;
const LINE_LEAD = 200;

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  visibility: Eye,
  traffic: TrafficLight,
  inquiries: CircleQuestionMark,
  conversion: ArrowRightLeft,
};

interface StepProps {
  step: { number: string; icon: string; title: string; body: string };
  index: number;
  /** Where this step sits in its own row, which is what its delay is counted
   *  from. Four in a row on desktop and two on a phone, so the same step is a
   *  different slot at each width. */
  slot: number;
  showLine: boolean;
}

/**
 * One step. A component of its own rather than markup inside the map: the step
 * and its outgoing connector each animate on their own, and a hook cannot be
 * called from a loop.
 */
const Step: React.FC<StepProps> = ({ step, index, slot, showLine }) => {
  const Icon = ICONS[step.icon];
  // First of a pair — 01 and 03 — which are the only ones with a neighbour to
  // their right while the grid is two columns wide.
  const pairLeader = index % 2 === 0;
  // Counted from its place in the row rather than from the start of the whole
  // chain. On a phone the second row arrives long after the first, so counting
  // through would leave 03 waiting out a delay measured from a step that went
  // past the top of the screen a while ago.
  const delay = slot * STEP_GAP;

  const contentRef = useRevealOnView<HTMLDivElement>({ delay });
  // Sets off before its own step has quite finished, and lands as the next one
  // begins — which is what makes it read as travelling between them.
  const lineRef = useGrowOnView<HTMLSpanElement>({ delay: delay + LINE_LEAD });

  return (
    <div ref={contentRef} className="text-center" style={REVEAL_HIDDEN}>
      {/* ---------- Number and connector ---------- */}
      <div className="relative flex justify-center">
        {showLine && (
          <span
            ref={lineRef}
            aria-hidden="true"
            // Hidden until the row is actually a row — stacked, a line
            // running off to the right connects nothing.
            className={`absolute top-1/2 h-[2px] bg-primary/60 [--ring:38px] [--gap:20px] md:[--ring:44px] md:[--gap:32px] lg:[--ring:52px] lg:[--gap:112px] ${
              // Two to a row on a phone, so only the first of each pair has
              // anywhere to point. Four in a row from lg, where all but the
              // last one does.
              pairLeader ? "block" : "hidden lg:block"
            }`}
            style={{
              ...REVEAL_FLAT,
              // Inset off both rings by the radius plus a breathing
              // gap, so the line stops short of each circle rather than
              // touching it. The width spans a column plus the grid gap,
              // which is the real centre-to-centre distance — without
              // the gap term the line falls short of the next ring.
              left: `calc(50% + var(--ring) / 2 + ${LINE_GAP}px)`,
              width: `calc(100% + var(--gap) - var(--ring) - ${LINE_GAP * 2}px)`,
              // The vertical centring lived in a -translate-y-1/2 class, which
              // the scaleX keyframes would overwrite. It moves into the origin
              // instead, so the two do not fight.
              transformOrigin: "left center",
              marginTop: -1,
            }}
          />
        )}
        <span
          className="relative z-[1] flex items-center justify-center rounded-full border border-primary bg-[#E8F7F5] w-[38px] h-[38px] md:w-[44px] md:h-[44px] lg:w-[52px] lg:h-[52px] text-[14px] md:text-[18px] lg:text-[22px]"
          style={{
            fontFamily: INTER,
            fontWeight: 400,
            color: "#12A89C",
          }}
        >
          {step.number}
        </span>
      </div>

      {/* ---------- Label ---------- */}
      <div className="mt-5 flex items-center justify-center gap-1.5">
        {Icon && (
          <Icon
            size={24}
            strokeWidth={1.8}
            className="w-[15px] h-[15px] md:w-[19px] md:h-[19px] lg:w-6 lg:h-6"
          />
        )}
        <h3
          className="text-[14px] md:text-[18px] lg:text-[21px] slg:text-[25px]"
          style={{
            fontFamily: MONTSERRAT,
            fontWeight: 500,
            color: "#111111",
          }}
        >
          {step.title}
        </h3>
      </div>

      <p
        className="mt-3 md:mt-5 text-[12px] md:text-[14px] lg:text-[20px] leading-relaxed"
        style={{
          fontFamily: INTER,
          fontWeight: 300,
          color: "#111111",
        }}
      >
        {step.body}
      </p>
    </div>
  );
};

const Process: React.FC = () => {
  const { process } = contentData.about;
  const last = process.steps.length - 1;

  // Two columns below lg, four from lg up. Read at first render rather than
  // corrected afterwards, so the steps are never observed on the wrong timing
  // even for a frame.
  const [perRow, setPerRow] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1024px)").matches
      ? 4
      : 2,
  );

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const sync = () => setPerRow(query.matches ? 4 : 2);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const titleRef = useRevealOnView<HTMLHeadingElement>({ pop: true });
  const introRef = useRevealOnView<HTMLParagraphElement>({ delay: 200 });

  return (
    <section className="py-[40px] md:py-[60px]">
      <h2
        ref={titleRef}
        className={`text-center ${TITLE_SIZE}`}
        style={{
          ...REVEAL_HIDDEN,
          fontFamily: MONTSERRAT,
          fontWeight: 400,
          lineHeight: 1.1,
        }}
      >
        {process.heading}
      </h2>
      <p
        ref={introRef}
        className="mt-5 mx-auto max-w-2xl text-center text-[13px] md:text-[16px] xl:text-[18px] slg:text-[20px] leading-relaxed"
        style={{
          ...REVEAL_HIDDEN,
          fontFamily: INTER,
          fontWeight: 400,
          color: "#8A8A8A",
        }}
      >
        {process.intro}
      </p>

      {/* Equal columns are what make the connectors land: each line starts at
          its own circle's centre and runs one full column, which is exactly the
          next circle's centre. */}
      <div className="mt-8 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-x-5 md:gap-x-8 lg:gap-x-28 gap-y-8 md:gap-y-14">
        {process.steps.map((step, index) => (
          <Step
            key={step.number}
            step={step}
            index={index}
            slot={index % perRow}
            showLine={index < last}
          />
        ))}
      </div>
    </section>
  );
};

export default Process;
