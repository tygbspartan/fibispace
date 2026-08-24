import React, { useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import contentData from "../data/content.json";
import Footer from "../components/NewFooter";

// index.css sets `* { font-family: Inter }` on every element, so Montserrat
// cannot be inherited from a parent — it has to be set where the text is.
const MONTSERRAT = "Montserrat, sans-serif";
// Body copy stays on Inter — only titles are set in Montserrat.
const INTER = "Inter, sans-serif";

// Same scale as the Services dial and the Our Projects heading, so every
// section title across the site is set at exactly one size ramp.
// 70px at the top end: the home page keeps 72, every other page steps down.
const TITLE_SIZE =
  "text-[28px] md:text-[34px] xl:text-[38px] 2xl:text-[50px] slg:text-[60px]";
const SUB_TITLE_SIZE =
  "text-[22px] md:text-[30px] lg:text-[40px] xl:text-[48px] 2xl:text-[56px]";

const MUTED = "#898080";

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { services, serviceMethod } = contentData;

  const service = services.find((item) => item.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // An unknown slug goes to the first service rather than a blank screen.
  if (!service)
    return <Navigate to={`/services/${services[0].slug}`} replace />;

  return (
    <div className="min-h-screen bg-site flex flex-col">
      <div className="flex-grow px-6 md:px-12 lg:px-[120px] pt-[30px] md:pt-[100px] pb-[40px] md:pb-20">
        {/* ---------- Title, blurb, and the service's mark ---------- */}
        <div className="flex items-start justify-between gap-8">
          {/* Held narrow on purpose: the title is meant to break over two
              lines rather than run the width of the page. */}
          <div className="min-w-0 max-w-[560px]">
            <h1
              className={`capitalize ${TITLE_SIZE}`}
              style={{
                fontFamily: MONTSERRAT,
                fontWeight: 400,
                lineHeight: 1.1,
              }}
            >
              {service.title}
            </h1>
            <p
              className="mt-5 max-w-xl text-[13px] md:text-[16px] xl:text-[18px] slg:text-[20px] leading-relaxed"
              style={{ fontFamily: INTER, fontWeight: 400, color: MUTED }}
            >
              {service.description}
            </p>
          </div>

          <img
            src={service.image}
            alt=""
            aria-hidden="true"
            className="hidden md:block h-[200px] lg:h-[250px] xl:h-[300px] w-auto object-contain shrink-0"
          />
        </div>

        {/* ---------- Banner ----------
            Its own field in content.json, separate from the small mark
            above: this one is wide artwork, not a spot illustration. */}
        <div className="mt-10 md:mt-14 rounded-[10px] overflow-hidden">
          <img
            src={service.banner}
            alt={service.title}
            className="w-full h-[160px] sm:h-[280px] lg:h-[380px] wide:h-[460px] object-cover"
          />
        </div>

        {/* ---------- Method ---------- */}
        <div className="py-[40px] md:py-[60px]">
          <span
            className="inline-block rounded-full px-3 py-1 uppercase text-[10px] md:text-[11px] tracking-[0.12em]"
            style={{
              fontFamily: INTER,
              fontWeight: 500,
              color: "#12A89C",
              border: "1px solid #12A89C",
            }}
          >
            {serviceMethod.label}
          </span>

          <div className="mt-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-16">
            <h2
              className={`max-w-2xl ${SUB_TITLE_SIZE}`}
              style={{
                fontFamily: MONTSERRAT,
                fontWeight: 400,
                lineHeight: 1.15,
              }}
            >
              {serviceMethod.heading}
            </h2>
            <p
              className="max-w-md text-[13px] md:text-[14px] leading-relaxed"
              style={{ fontFamily: INTER, fontWeight: 400, color: MUTED }}
            >
              {serviceMethod.blurb}
            </p>
          </div>

          {/* Steps */}
          <div className="mt-8 md:mt-20 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-5 md:gap-x-6 gap-y-8 md:gap-y-12">
            {serviceMethod.steps.map((step, index) => (
              <div key={step.title}>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[16px] md:text-[20px] lg:text-[26px] tabular-nums"
                    style={{
                      fontFamily: MONTSERRAT,
                      fontWeight: 700,
                      color: "#12A89C",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px w-5"
                    style={{ backgroundColor: "#12A89C" }}
                  />
                </div>

                <h3
                  className="mt-3 md:mt-4 text-[13px] md:text-[15px]"
                  style={{ fontFamily: MONTSERRAT, fontWeight: 600 }}
                >
                  {step.title}
                </h3>
                <p
                  className="mt-2 text-[12px] md:text-[13px] leading-relaxed"
                  style={{
                    fontFamily: INTER,
                    fontWeight: 400,
                    color: MUTED,
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Closing prompt ---------- */}
        <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-black/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 md:gap-6">
          <p
            className="text-[13px] md:text-[14px]"
            style={{ fontFamily: INTER, fontWeight: 400, color: MUTED }}
          >
            {serviceMethod.ctaText}
          </p>
          <button
            // Carries which service this was, so the contact form opens
            // with it already filled in.
            onClick={() =>
              navigate("/contact", { state: { service: service.title } })
            }
            className="group shrink-0 flex md:inline-flex w-full md:w-auto justify-center items-center gap-2 rounded-full bg-black text-white px-6 py-3 text-[12px] md:text-[13px] hover:bg-black/80 transition-colors"
            style={{ fontFamily: MONTSERRAT, fontWeight: 600 }}
          >
            {serviceMethod.ctaButton}
            <ArrowRight
              size={15}
              strokeWidth={2}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
