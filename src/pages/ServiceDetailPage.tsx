import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { ArrowRight, CornerDownRight } from "lucide-react";
import contentData from "../data/content.json";
import Projects from "../components/Projects";
import Footer from "../components/NewFooter";
import { projectsAPI } from "../services/api";
import { Project } from "../types";
import { REVEAL_HIDDEN, useRevealOnView } from "../hooks/useRevealOnView";

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

// A service is named by its slug; a project is tagged with a stored category.
// This is the join between the two, and the only place the two vocabularies
// meet — everything else on either side keeps its own.
const SERVICE_CATEGORY: Record<string, string> = {
  "social-media-marketing": "smm",
  "ui-ux": "ui_ux",
  "graphic-design": "graphic_design",
  "web-development": "web_development",
  seo: "seo",
  advertising: "ad_commercial",
  "event-management": "event_management",
  "product-photography": "product_shoot",
};

const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { services, serviceMethod } = contentData;

  const service = services.find((item) => item.slug === slug);

  const category = slug ? SERVICE_CATEGORY[slug] : undefined;
  // Whether any project actually carries this category. Asked here rather than
  // left to the grid: the heading and the whole section have to go too, and the
  // grid only knows what it has after it has already rendered one.
  const [hasWork, setHasWork] = useState(false);

  const otherRef = useRevealOnView<HTMLHeadingElement>({ pop: true });
  const otherIntroRef = useRevealOnView<HTMLParagraphElement>({ delay: 130 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!category) {
      setHasWork(false);
      return;
    }

    let stopped = false;
    projectsAPI
      .getAll()
      .then((response) => {
        if (stopped) return;
        const projects: Project[] = response.data.projects || [];
        setHasWork(projects.some((item) => item.category.includes(category)));
      })
      .catch((error) => {
        console.error("Error checking projects for this service:", error);
        if (!stopped) setHasWork(false);
      });

    return () => {
      stopped = true;
    };
  }, [category]);

  // An unknown slug goes to the first service rather than a blank screen.
  if (!service)
    return <Navigate to={`/services/${services[0].slug}`} replace />;

  return (
    <div className="min-h-screen bg-site flex flex-col">
      {/* No bottom padding of its own: the Method section inside already
          ends with the standard section padding, and stacking the two put
          200px between the last step and the section below. */}
      <div className="flex-grow px-6 md:px-12 lg:px-[120px] pt-[30px] md:pt-[100px]">
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
          <div className="mt-8 md:mt-12 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-x-5 md:gap-x-6 gap-y-8 md:gap-y-12">
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
      </div>

      {/* ---------- The work that used it ----------
            Rendered only when a project actually carries this category, so a
            service with nothing to show gets no empty section. The grid is the
            same component the projects page uses, with the pills dropped:
            there is nothing left to filter once it is one category. */}
      {hasWork && (
        <Projects
          heading="Our best work, So far."
          headingClass={TITLE_SIZE}
          topClass="pt-[40px] md:pt-[60px]"
          intro="A few of the projects this went into."
          category={category}
          limit={3}
          featuredOnly={false}
        />
      )}

      <div className="px-6 md:px-12 lg:px-[120px] pb-[40px] md:pb-20">
        {/* ---------- Other services ---------- */}
        <section className="py-[40px] md:py-[60px]">
          <h2
            ref={otherRef}
            className={`text-center ${TITLE_SIZE}`}
            style={{
              ...REVEAL_HIDDEN,
              fontFamily: MONTSERRAT,
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            Other services
          </h2>
          <p
            ref={otherIntroRef}
            className="mt-4 mx-auto max-w-2xl text-center text-[13px] md:text-[16px] xl:text-[18px] slg:text-[20px] leading-relaxed"
            style={{
              ...REVEAL_HIDDEN,
              fontFamily: INTER,
              fontWeight: 400,
              color: MUTED,
            }}
          >
            Everything else we do, and how it fits alongside this.
          </p>

          <div className="mt-8 md:mt-12 mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-x-10 md:gap-x-20 lg:gap-x-28 gap-y-4 md:gap-y-5">
            {services.map((item) => {
              const current = item.slug === service.slug;

              return (
                <button
                  key={item.id}
                  onClick={() => navigate(`/services/${item.slug}`)}
                  className="group flex items-center gap-2.5 text-left"
                  style={{
                    fontFamily: INTER,
                    fontWeight: 400,
                    // The one being read is marked rather than removed: it is
                    // still part of the set, and taking it out would make the
                    // column jump between pages.
                    color: current ? "#12A89C" : "#111111",
                  }}
                >
                  <CornerDownRight
                    size={18}
                    strokeWidth={1.8}
                    className="shrink-0"
                    style={{ color: current ? "#12A89C" : MUTED }}
                  />
                  <span className="text-[14px] md:text-[18px] lg:text-[25px] group-hover:text-primary transition-colors">
                    {item.title}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

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
              className="group-hover:animate-nudge motion-reduce:animate-none"
            />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
