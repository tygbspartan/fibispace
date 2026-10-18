import React, { useEffect } from "react";
import Footer from "../components/NewFooter";
import { jumpToTop } from "../lib/jumpToTop";
import { LEGAL, LegalBlock } from "../data/legal";

const MONTSERRAT = "Montserrat, sans-serif";

const BODY =
  "text-[15px] md:text-[16px] slg:text-[18px] leading-relaxed text-[#6B6B6B]";

// A string is a paragraph, an array a bulleted list.
const Block: React.FC<{ block: LegalBlock }> = ({ block }) =>
  Array.isArray(block) ? (
    <ul className={`mt-3 list-disc pl-6 space-y-1.5 ${BODY}`}>
      {block.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  ) : (
    <p className={`mt-3 ${BODY}`}>{block}</p>
  );

interface LegalPageProps {
  title: string;
}

/**
 * Shared shell for the legal pages. The copy lives in data/legal.ts, keyed by
 * the page title.
 */
const LegalPage: React.FC<LegalPageProps> = ({ title }) => {
  const doc = LEGAL[title];

  useEffect(() => {
    jumpToTop();
  }, [title]);

  return (
    <div className="min-h-screen bg-site flex flex-col">
      <section className="flex-grow px-6 md:px-12 lg:px-[120px] pt-[100px] pb-24">
        <h1
          className="text-[30px] xl:text-[38px] 2xl:text-[50px] slg:text-[60px] leading-tight"
          style={{ fontFamily: MONTSERRAT, fontWeight: 400 }}
        >
          {title}
        </h1>

        <p className="mt-4 text-[13px] md:text-[14px] text-[#A9A9A9]">
          Last updated: {doc.updated}
        </p>

        <div className="max-w-3xl">
          <div className="mt-6">
            {doc.intro.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </div>

          {doc.sections.map((section) => (
            <div key={section.heading} className="mt-10">
              <h2
                className="text-[20px] md:text-[22px] slg:text-[26px] text-[#111]"
                style={{ fontFamily: MONTSERRAT, fontWeight: 500 }}
              >
                {section.heading}
              </h2>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalPage;
