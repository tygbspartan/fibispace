import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import contentData from "../data/content.json";
import { REVEAL_HIDDEN, useRevealOnView } from "../hooks/useRevealOnView";

// index.css sets `* { font-family: Inter }` on every element, so Montserrat
// cannot be inherited from a parent — it has to be set where the text is.
const MONTSERRAT = "Montserrat, sans-serif";
const INTER = "Inter, sans-serif";
// Single weight display face, loaded alongside the others in index.html.
const CONSENT = "'Manufacturing Consent', Montserrat, sans-serif";

// Same ramp as every other title on the site.
const TITLE_SIZE =
  "text-[28px] md:text-[34px] xl:text-[38px] 2xl:text-[50px] slg:text-[60px]";

// Where the questions start arriving, once the heading and intro have, and how
// far apart they follow one another.
const ITEMS_DELAY = 220;
const ITEM_STAGGER = 140;

interface RowProps {
  number: string;
  question: string;
  answer: string;
  delay: number;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * One question. A component of its own rather than markup inside the map: each
 * row reveals on its own, and a hook cannot be called from a loop.
 */
const FaqRow: React.FC<RowProps> = ({
  number,
  question,
  answer,
  delay,
  isOpen,
  onToggle,
}) => {
  const ref = useRevealOnView<HTMLDivElement>({ delay });

  return (
    <div
      ref={ref}
      className="border-b border-[#E7E7E7] last:border-b-0"
      style={REVEAL_HIDDEN}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-start gap-3 md:gap-4 py-4 md:py-5 text-left"
      >
        <span
          className="shrink-0 tabular-nums text-[14px] md:text-[18px] lg:text-[22px] leading-[1.4]"
          style={{
            fontFamily: CONSENT,
            fontWeight: 400,
            color: "#12A89C",
          }}
        >
          {number}
        </span>

        <span className="flex-1 min-w-0">
          <span
            className="block text-[14px] md:text-[17px] lg:text-[20px] leading-[1.5]"
            style={{
              fontFamily: INTER,
              fontWeight: 500,
              color: "var(--page-ink, #111111)",
            }}
          >
            {question}
          </span>

          {/* Animating grid rows from 0fr to 1fr, rather than a fixed
              max-height: the answer opens to exactly its own height whatever
              the copy or the screen width, with no magic number to outgrow. */}
          <span
            className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
            style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
          >
            <span className="overflow-hidden">
              <span
                className="block pt-2 text-[12px] md:text-[15px] lg:text-[18px] leading-relaxed"
                style={{
                  fontFamily: INTER,
                  fontWeight: 400,
                  color: "var(--page-ink-muted, #8A8A8A)",
                }}
              >
                {answer}
              </span>
            </span>
          </span>
        </span>

        <ChevronDown
          aria-hidden="true"
          size={18}
          strokeWidth={1.8}
          className={`shrink-0 mt-1 transition-transform duration-300 motion-reduce:transition-none ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: "var(--page-ink, #111111)" }}
        />
      </button>
    </div>
  );
};

const Faq: React.FC = () => {
  const { faq } = contentData;
  // One at a time: opening a second would push the first off the screen.
  const [open, setOpen] = useState<number | null>(null);

  const titleRef = useRevealOnView<HTMLHeadingElement>({ pop: true });
  const introRef = useRevealOnView<HTMLParagraphElement>({ delay: 200 });

  return (
    <section
      className="px-6 md:px-12 lg:px-[120px] py-[40px] md:py-[60px]"
      id="faq"
    >
      <h2
        ref={titleRef}
        className={`text-center ${TITLE_SIZE}`}
        style={{
          ...REVEAL_HIDDEN,
          fontFamily: MONTSERRAT,
          fontWeight: 400,
          lineHeight: 1.1,
          color: "var(--page-ink, #111111)",
        }}
      >
        {faq.heading}
      </h2>
      <p
        ref={introRef}
        className="mt-4 text-center text-[13px] md:text-[16px] xl:text-[18px] slg:text-[20px] leading-relaxed"
        style={{
          ...REVEAL_HIDDEN,
          fontFamily: INTER,
          fontWeight: 400,
          color: "var(--page-ink-muted, #8A8A8A)",
        }}
      >
        {faq.intro}
      </p>

      <div className="mt-8 md:mt-16 mx-auto max-w-[720px]">
        {faq.items.map((item, index) => (
          <FaqRow
            key={item.question}
            number={String(index + 1).padStart(2, "0")}
            question={item.question}
            answer={item.answer}
            delay={ITEMS_DELAY + index * ITEM_STAGGER}
            isOpen={open === index}
            onToggle={() => setOpen(open === index ? null : index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Faq;
