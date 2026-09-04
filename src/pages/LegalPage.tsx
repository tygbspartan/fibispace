import React, { useEffect } from "react";
import Footer from "../components/NewFooter";
import { jumpToTop } from "../lib/jumpToTop";

const MONTSERRAT = "Montserrat, sans-serif";

interface LegalPageProps {
  title: string;
}

/**
 * Shared shell for the legal pages. The body is deliberately a placeholder —
 * drop the real copy in where marked.
 */
const LegalPage: React.FC<LegalPageProps> = ({ title }) => {
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

        <p
          className="mt-8 max-w-3xl text-[16px] md:text-[18px] slg:text-[20px] leading-relaxed"
          style={{ fontFamily: MONTSERRAT, fontWeight: 400, color: "#6B6B6B" }}
        >
          {/* TODO: replace with the real {title} copy. */}
          This page is a placeholder. Add the {title.toLowerCase()} content
          here.
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default LegalPage;
