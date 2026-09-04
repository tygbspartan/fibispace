import React, { useState, useEffect, useRef } from "react";
import { projectsAPI, resolveImageUrl } from "../services/api";
import { Project } from "../types";
import { REVEAL_HIDDEN, useRevealOnView } from "../hooks/useRevealOnView";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ProjectModal from "./projects/ProjectModal";

// index.css sets `* { font-family: Inter }` on every element, so Montserrat
// cannot be inherited from a parent — it has to be set where the text is.
const MONTSERRAT = "Montserrat, sans-serif";

// Stored category values, as defined by the admin project form.
const CATEGORY_LABELS: Record<string, string> = {
  smm: "SMM",
  graphic_design: "Graphic Design",
  ui_ux: "UI/UX",
  web_development: "Web Development",
  seo: "SEO",
  ad_commercial: "Advertisement",
  event_management: "Event Management",
  product_shoot: "Photo shoot",
};

// The two filters are now the project's own stored type rather than a
// grouping of its categories: a website project that also used SMM was landing
// under Digital Marketing, and nothing could say otherwise. The ids are the
// stored enum values, so a tab matches a project directly.
const TABS = [
  { id: "digital_marketing", label: "Digital Marketing" },
  { id: "website", label: "Websites" },
];

// Same scale as a Services title, so the two sections read as a set.
const HEADING_SIZE =
  "text-[28px] md:text-[32px] xl:text-[40px] 2xl:text-[58px] slg:text-[72px]";
const TAB_SIZE = "text-[11px] sm:text-[12px] lg:text-[13px] wide:text-[14px]";
// A ratio, not a set of heights: the card keeps the same shape at every width
// rather than getting taller or squatter as the column resizes.
const IMAGE_RATIO = "aspect-[5/4]";
const TITLE_SIZE = "text-[14px] md:text-[17px] lg:text-[22px] wide:text-[24px]";
const CATEGORY_SIZE =
  "text-[11px] md:text-[12px] lg:text-[15px] wide:text-[16px]";

// Maximum tilt, in degrees, at the very corner of a card.
const MAX_TILT = 7;
// Lower is a stronger perspective; this is subtle enough not to warp the image.
const PERSPECTIVE = 900;

const pointerEffectsAllowed = () => {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return false;
  // Nothing to follow without a cursor, and no hover state to leave.
  return !window.matchMedia("(pointer: coarse)").matches;
};

interface ProjectsProps {
  heading?: string;
  /** The home page keeps 72px; other pages step down to 70. */
  headingClass?: string;
  /** Top padding. The home page spaces it as a section; the projects page
   *  needs the fixed gap from the navbar every standalone page uses. */
  topClass?: string;
  /** Optional line under the heading. */
  intro?: string;
  /** The home page shows a selection; the projects page shows everything. */
  featuredOnly?: boolean;
  /** Pointless on the projects page, which is already all of them. */
  showAllButton?: boolean;
  /** Narrows to one stored category — the service pages show only the work
   *  that used the service being read about. The filter pills go with it:
   *  there is nothing left to filter. */
  category?: string;
  /** How many to show at most. */
  limit?: number;
}

// How far apart the cards follow one another in.
const CARD_STEP = 85;
// And how long the first of a batch waits. Whole rows come into view at once,
// so without this the cards would start alongside the heading. Long enough to
// let the heading, the line under it and the pills all arrive first.
const CARD_LEAD = 260;
// How much of a card has to be showing before it reveals, and how little before
// it resets. Two different numbers on purpose: with a single boundary, a card
// parked exactly on it flickers in and out as the page moves a pixel either
// way. The dead band between them is where nothing happens.
const CARD_IN = 0.15;
const CARD_OUT = 0.02;
// The cards arrive the same way everything else on the page does: a fade and
// a short rise, on the shared curve. Nothing else — no blur, no scale, no light
// crossing them. One idea, repeated, is what makes a page feel considered.
const LIFT_FROM = 18;
const LIFT_MS = 650;
const LIFT_EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
// The resting shadow, which the cards carry for the rest of the page.
const CARD_SHADOW = "0px 4px 4px 0px #00000040";

const Projects: React.FC<ProjectsProps> = ({
  heading: headingText = "Our Projects",
  headingClass = HEADING_SIZE,
  topClass = "pt-[60px]",
  intro,
  featuredOnly = true,
  showAllButton = true,
  category,
  limit,
}) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  const [animatedCards, setAnimatedCards] = useState<Set<number>>(new Set());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tiltRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Both only exist once the fetch has landed, hence the dependency.
  const headingRef = useRevealOnView<HTMLHeadingElement>({
    pop: true,
    rise: 26,
    blur: 6,
    deps: [loading],
  });
  const introRef = useRevealOnView<HTMLParagraphElement>({
    delay: 130,
    rise: 18,
    blur: 4,
    deps: [loading],
  });
  const pillsRef = useRevealOnView<HTMLDivElement>({
    delay: 280,
    rise: 14,
    blur: 3,
    deps: [loading],
  });

  // Tilt written straight to the node — this runs on every pointer move and
  // must not re-render the grid.
  const tiltTo = (index: number, event: React.PointerEvent<HTMLDivElement>) => {
    const layer = tiltRefs.current[index];
    if (!layer || !pointerEffectsAllowed()) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    // No transition while tracking, or the card lags behind the cursor.
    layer.style.transition = "none";
    layer.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${-y * MAX_TILT}deg) rotateY(${x * MAX_TILT}deg)`;
  };

  const resetTilt = (index: number) => {
    const layer = tiltRefs.current[index];
    if (!layer) return;
    // Eased on the way out only, so it settles back rather than snapping flat.
    layer.style.transition = "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)";
    layer.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`;
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedProject(null);
    }, 300);
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data.projects);
      setError(null);
    } catch (err) {
      setError("Failed to load projects");
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const tab = TABS.find((t) => t.id === activeTab) ?? TABS[0];
  const matched = projects.filter((project) =>
    category
      ? project.category.includes(category)
      : (!featuredOnly || project.isFeatured) &&
        // Projects stored before the split have no type; they were all digital
        // marketing, which is also what the column defaults to.
        (project.projectType ?? "digital_marketing") === tab.id,
  );
  const visible = limit ? matched.slice(0, limit) : matched;

  // Cards reveal one at a time, every time they arrive.
  //
  // Each card watches itself, but they share a queue: a card that arrives while
  // another is still coming in waits its turn. That is the difference between a
  // cascade and a batch — staggering by index % 3 would start the fourth card
  // at the same moment as the first. A card scrolled to on its own still
  // appears immediately, because the queue has emptied by then.
  //
  // Leaving the screen puts a card back to its hidden state, so scrolling away
  // and back plays it again. That also unmounts the sweep and the orbiting
  // light, which is what lets their CSS animations restart — a paused element
  // that is never removed will not replay.
  useEffect(() => {
    if (loading || visible.length === 0) return;

    const observers: IntersectionObserver[] = [];
    // Per card, so one that leaves before its turn can be taken off the queue
    // rather than appearing after it has gone.
    const timers = new Map<number, number>();
    // When the next card in the queue is allowed to appear.
    let nextAt = 0;

    const clear = (index: number) => {
      const timer = timers.get(index);
      if (timer === undefined) return;
      window.clearTimeout(timer);
      timers.delete(index);
    };

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          const ratio = entry.isIntersecting ? entry.intersectionRatio : 0;

          if (ratio >= CARD_IN) {
            if (timers.has(index)) return;

            const now = performance.now();
            // An empty queue means this is the first card of a fresh batch, so
            // it waits for the heading. Cards joining a queue already running
            // simply take the next slot.
            const at = nextAt > now ? nextAt : now + CARD_LEAD;
            nextAt = at + CARD_STEP;

            timers.set(
              index,
              window.setTimeout(() => {
                timers.delete(index);
                setAnimatedCards((prev) => new Set(prev).add(index));
              }, at - now),
            );
            return;
          }

          // Between the two boundaries, leave it exactly as it is.
          if (ratio > CARD_OUT) return;

          clear(index);
          setAnimatedCards((prev) => {
            if (!prev.has(index)) return prev;
            const next = new Set(prev);
            next.delete(index);
            return next;
          });
        },
        // Both boundaries have to be in the list, or there is no callback at
        // the moment either one is crossed.
        { threshold: [0, CARD_OUT, CARD_IN] },
      );

      observer.observe(card);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [loading, visible.length, activeTab]);

  const heading = (
    <h2
      ref={headingRef}
      className={`text-center ${headingClass}`}
      style={{
        ...REVEAL_HIDDEN,
        fontFamily: MONTSERRAT,
        fontWeight: 400,
        lineHeight: 1.1,
        letterSpacing: "0",
        color: "var(--page-ink, #111111)",
      }}
    >
      {headingText}
    </h2>
  );

  const introLine = intro ? (
    <p
      ref={introRef}
      className="mt-5 mx-auto max-w-2xl text-center text-[13px] md:text-[16px] xl:text-[18px] slg:text-[20px] leading-relaxed"
      style={{
        ...REVEAL_HIDDEN,
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        color: "var(--page-ink-muted, #8A8A8A)",
      }}
    >
      {intro}
    </p>
  ) : null;

  const sectionProps = {
    id: "projects",
    // Follows whatever top radius the page wrapper has, so this section's
    // own background does not square off the panel's rounded corners.
    style: {
      borderTopLeftRadius: "inherit",
      borderTopRightRadius: "inherit",
    } as React.CSSProperties,
  };

  if (loading) {
    return (
      <section className={`${topClass} pb-[60px]`} {...sectionProps}>
        <div className="px-6 md:px-12 lg:px-[120px]">
          {heading}
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={`${topClass} pb-12 md:pb-20`} {...sectionProps}>
        <div className="px-6 md:px-12 lg:px-[120px]">
          {heading}
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors"
              style={{ fontFamily: MONTSERRAT, fontWeight: 500 }}
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`relative ${topClass} pb-12 md:pb-20 overflow-hidden`}
      {...sectionProps}
    >
      <div className="relative px-6 md:px-12 lg:px-[120px]">
        {heading}
        {introLine}

        {/* ---------- Filter pills ---------- */}
        {!category && (
          <div
            ref={pillsRef}
            className="flex justify-center mt-6 md:mt-8"
            style={REVEAL_HIDDEN}
          >
            <div
              className="inline-flex items-center gap-1 rounded-full bg-black p-1"
              role="tablist"
              aria-label="Project type"
            >
              {TABS.map((option) => {
                const active = option.id === activeTab;
                return (
                  <button
                    key={option.id}
                    role="tab"
                    aria-selected={active}
                    onClick={() => {
                      setActiveTab(option.id);
                      setAnimatedCards(new Set());
                    }}
                    className={`rounded-full px-4 py-1.5 wide:px-5 wide:py-2 transition-colors ${TAB_SIZE} ${
                      active ? "bg-white text-black" : "text-white"
                    }`}
                    style={{ fontFamily: MONTSERRAT, fontWeight: 500 }}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------- Grid ---------- */}
        {visible.length === 0 ? (
          <p
            className="text-center py-20"
            style={{
              fontFamily: MONTSERRAT,
              fontWeight: 400,
              color: "var(--page-ink-muted, #8A8A8A)",
            }}
          >
            No projects to show here yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-5 gap-y-8 sm:gap-y-10 mt-10 md:mt-12">
            {visible.map((project, index) => {
              const isAnimated = animatedCards.has(index);

              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  onClick={() => handleProjectClick(project)}
                  onPointerMove={(e) => tiltTo(index, e)}
                  onPointerLeave={() => resetTilt(index)}
                  className="relative group cursor-pointer"
                  style={{
                    opacity: isAnimated ? 1 : 0,
                    // The lift lives on the card root, strictly outside the
                    // tilt layer below. Stacking it onto that element would
                    // push the entrance transform through the tilt's
                    // perspective, which is what made the arrow shimmer.
                    transform: isAnimated
                      ? "none"
                      : `translateY(${LIFT_FROM}px)`,
                    transition: `opacity ${LIFT_MS}ms ${LIFT_EASE}, transform ${LIFT_MS}ms ${LIFT_EASE}`,
                  }}
                >
                  {/* Tilt layer — kept off the card root, which already owns a
                      transform for the scroll reveal. */}
                  <div
                    ref={(el) => {
                      tiltRefs.current[index] = el;
                    }}
                    // Flat, not preserve-3d. The tilt is applied to this
                    // element itself, so nothing inside needs to live in 3D —
                    // and preserve-3d would put every descendant transform into
                    // that perspective space, which made the arrow's rotation
                    // shift and shimmer as the card tilted under the cursor.
                    style={{ transformStyle: "flat" }}
                  >
                    {/* Project Image */}
                    <div
                      className={`relative overflow-hidden rounded-[10px] mb-4 w-full ${IMAGE_RATIO}`}
                      style={{ boxShadow: CARD_SHADOW }}
                    >
                      <img
                        src={resolveImageUrl(project.mainImage)}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        {/* Title */}
                        <h3
                          className={TITLE_SIZE}
                          style={{
                            fontFamily: MONTSERRAT,
                            fontWeight: 400,
                            lineHeight: 1.3,
                            color: "var(--page-ink, #111111)",
                          }}
                        >
                          {project.title}
                        </h3>

                        {/* Categories */}
                        <p
                          className={`mt-1 flex flex-wrap items-center gap-x-2 ${CATEGORY_SIZE}`}
                          style={{
                            fontFamily: MONTSERRAT,
                            fontWeight: 400,
                            color: "var(--page-ink-muted, #8A8A8A)",
                          }}
                        >
                          {project.category.map((cat, idx) => (
                            <React.Fragment key={cat}>
                              {idx > 0 && (
                                <span
                                  aria-hidden="true"
                                  className="text-[10px]"
                                >
                                  •
                                </span>
                              )}
                              <span>
                                {CATEGORY_LABELS[cat] ?? cat.replace(/_/g, " ")}
                              </span>
                            </React.Fragment>
                          ))}
                        </p>
                      </div>

                      {/* Open affordance. Decorative — the whole card is the
                        click target, so this must not be a nested button. */}
                      <span
                        aria-hidden="true"
                        // Starts explicitly white rather than transparent, so the
                        // fill ramps white -> grey -> black. ease-in-out keeps the
                        // midpoint at the halfway mark; the snappier curve used
                        // for the arrow would land on black almost at once.
                        className="shrink-0 grid place-items-center rounded-full border-[1.5px] border-black/50 bg-white text-black transition-[background-color,border-color,color] duration-[600ms] ease-in-out group-hover:bg-black group-hover:border-black group-hover:text-white w-8 h-8 wide:w-10 wide:h-10"
                      >
                        {/* ArrowUpRight already points where it should at rest,
                          so nothing is transformed until you hover. The
                          rotation still lives on this wrapper rather than the
                          svg: transforming the svg makes the browser
                          re-rasterise its paths mid-turn. */}
                        <span className="inline-flex transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45">
                          <ArrowUpRight
                            size={18}
                            strokeWidth={2}
                            className="wide:w-5 wide:h-5"
                          />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View More Button */}
        {showAllButton && projects.length > 0 && (
          <div className="text-center mt-12 lg:mt-16">
            <button
              onClick={() => navigate("/projects")}
              className="group inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full hover:bg-black/80 transition-colors"
              style={{ fontFamily: MONTSERRAT, fontWeight: 600, fontSize: 14 }}
            >
              All Projects
              <ArrowRight size={16} strokeWidth={2} className="group-hover:animate-nudge motion-reduce:animate-none" />
            </button>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
};

export default Projects;
