import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clientAPI, resolveImageUrl, testimonyAPI } from "../services/api";
import { Client, Testimony } from "../types";
import { REVEAL_HIDDEN, useRevealOnView } from "../hooks/useRevealOnView";
import { useNearViewport } from "../hooks/useNearViewport";
import QuoteMark from "./icons/QuoteMark";

// index.css sets `* { font-family: Inter }` on every element, so Montserrat
// cannot be inherited from a parent — it has to be set where the text is.
const MONTSERRAT = "Montserrat, sans-serif";
const INTER = "Inter, sans-serif";

// Same ramp as every other title on the site.
const TITLE_SIZE =
  "text-[28px] md:text-[34px] xl:text-[38px] 2xl:text-[50px] slg:text-[60px]";

const ROWS = 3;
// Seconds for one full pass. Slightly different per row so the three never
// line up into a single moving block.
const ROW_SECONDS = [46, 38, 52];
// Rows alternate: the middle one runs the other way.
const ROW_REVERSED = [true, false, true];
// How far each row stops short on the right. Only from lg, where the three are
// beside the quote rather than stacked under it.
const ROW_TRIM = ["lg:mr-[10%]", "", "lg:mr-[14%]"];
// A row needs enough logos to outrun the widest screen before it repeats.
const MIN_PER_ROW = 8;

// Solid in the middle, faded out to nothing at both ends of the track.
const FADE =
  "linear-gradient(to right, transparent 0, #000 var(--fade), #000 calc(100% - var(--fade)), transparent 100%)";

/** Splits the clients into `ROWS` groups, dealing them out in turn. */
const dealIntoRows = (clients: Client[]) => {
  const rows: Client[][] = Array.from({ length: ROWS }, () => []);
  clients.forEach((client, index) => rows[index % ROWS].push(client));
  return rows;
};

/** Repeats a row until it is long enough to fill the screen. */
const fill = (row: Client[]) => {
  if (row.length === 0) return row;
  const out: Client[] = [];
  while (out.length < MIN_PER_ROW) out.push(...row);
  return out;
};

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  // Three tracks, all infinite. They only need to move while they can be seen.
  const [sectionRef, rowsNear] = useNearViewport<HTMLElement>();

  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [shown, setShown] = useState(0);
  // The arrows can be left pointing past the end if the list is refetched
  // shorter, so the index is clamped at read rather than trusted.
  const testimony = testimonies.length
    ? testimonies[Math.min(shown, testimonies.length - 1)]
    : null;

  // Each layer fades up once 40% of it is on screen, and again every time it
  // comes back. The order is the point: the heading, then what the client said,
  // then who they are. The clients arrive from a fetch, so none of these exist
  // on first render — hence the dependency.
  const titleRef = useRevealOnView<HTMLHeadingElement>({
    pop: true,
    deps: [clients],
  });
  const quoteRef = useRevealOnView<HTMLElement>({
    delay: 200,
    deps: [clients, testimonies],
  });
  const rowsRef = useRevealOnView<HTMLDivElement>({
    delay: 400,
    deps: [clients],
  });

  // Wraps in both directions, so neither arrow is ever a dead end.
  const step = (by: number) =>
    setShown(
      (current) => (current + by + testimonies.length) % testimonies.length,
    );

  useEffect(() => {
    clientAPI
      .getAll()
      .then((response) => setClients(response.data.clients || []))
      .catch((error) => console.error("Error fetching clients:", error));

    testimonyAPI
      .getAll()
      .then((response) => setTestimonies(response.data.testimonies || []))
      .catch((error) => console.error("Error fetching testimonies:", error));
  }, []);

  if (clients.length === 0) return null;

  const rows = dealIntoRows(clients);

  return (
    <section
      ref={sectionRef}
      className="py-[40px] md:py-[60px] overflow-hidden"
      id="clients"
    >
      <h2
        ref={titleRef}
        className={`text-center px-6 ${TITLE_SIZE}`}
        style={{
          ...REVEAL_HIDDEN,
          fontFamily: MONTSERRAT,
          fontWeight: 400,
          lineHeight: 1.1,
          color: "var(--page-ink, #111111)",
        }}
      >
        Our Clients
      </h2>

      <div className="mt-8 md:mt-20 flex flex-col lg:flex-row lg:items-center gap-8 md:gap-14 lg:gap-0">
        {/* ---------- What a client said ---------- */}
        {testimony && (
          <figure
            ref={quoteRef}
            className="shrink-0 w-full lg:w-[50%] px-6 md:px-12 lg:pl-[120px] lg:pr-10"
            style={REVEAL_HIDDEN}
          >
            {/* One row: an arrow, the quote, an arrow. Chevrons rather than
              full arrows, matching the FAQ. Only worth showing when there is
              somewhere to go. */}
            <div className="flex items-center justify-center gap-5">
              {testimonies.length > 1 && (
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous testimony"
                  className="shrink-0 text-primary transition-opacity hover:opacity-60"
                >
                  <ChevronLeft size={28} strokeWidth={1.8} />
                </button>
              )}

              <div className="w-full max-w-[360px] text-center">
                <blockquote
                  className="text-[13px] md:text-[16px] lg:text-[20px] leading-[1.65]"
                  style={{
                    fontFamily: INTER,
                    fontWeight: 400,
                    color: "var(--page-ink-muted, #8A8A8A)",
                  }}
                >
                  {/* Set inline rather than positioned off the edges of the block:
                    the copy is centred, so its first and last lines rarely reach
                    those edges and the marks ended up stranded out in the margin.
                    In the flow they sit against the words themselves. */}
                  <QuoteMark
                    size={18}
                    className="inline-block align-top mr-2 -translate-y-0.5 text-primary"
                  />
                  {testimony.description}
                  <QuoteMark
                    size={18}
                    className="inline-block align-top ml-2 -translate-y-0.5 rotate-180 text-primary"
                  />
                </blockquote>
              </div>

              {testimonies.length > 1 && (
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next testimony"
                  className="shrink-0 text-primary transition-opacity hover:opacity-60"
                >
                  <ChevronRight size={28} strokeWidth={1.8} />
                </button>
              )}
            </div>

            <figcaption className="mt-6 md:mt-8 text-center">
              <p
                className="text-[13px] md:text-[16px] lg:text-[20px]"
                style={{
                  fontFamily: INTER,
                  fontWeight: 600,
                  color: "var(--page-ink, #111111)",
                }}
              >
                {testimony.name}
              </p>
              <p
                className="mt-1 text-[13px] md:text-[16px] lg:text-[20px]"
                style={{
                  fontFamily: INTER,
                  fontWeight: 400,
                  color: "var(--page-ink, #111111)",
                }}
              >
                {testimony.companyName}
              </p>
            </figcaption>
          </figure>
        )}

        {/* ---------- Who they are ----------
            Takes the rest of the row and ends on the page gutter, so the
            logos stop where every other section stops.
            min-w-0 is what allows that — without it the w-max track inside
            would force this flex item wider than its share of the row. */}
        <div
          ref={rowsRef}
          className="min-w-0 lg:flex-1 space-y-10 md:space-y-14 pr-6 md:pr-12 lg:pr-[120px]"
          style={REVEAL_HIDDEN}
        >
          {rows.map((row, rowIndex) => {
            const sequence = fill(row);
            if (sequence.length === 0) return null;

            return (
              <div
                key={rowIndex}
                // A short fade where the track meets the quote, and the page
                // gutter's worth of it on the way out at the right.
                className={`[--fade:24px] md:[--fade:48px] lg:[--fade:80px] ${ROW_TRIM[rowIndex]}`}
                // A mask rather than an overlay, so it works whatever colour
                // the page happens to be behind it.
                style={{
                  maskImage: FADE,
                  WebkitMaskImage: FADE,
                }}
              >
                <div
                  className={`flex w-max animate-marquee motion-reduce:animate-none ${
                    rowsNear ? "" : "[animation-play-state:paused]"
                  }`}
                  style={{
                    animationDuration: `${ROW_SECONDS[rowIndex]}s`,
                    animationDirection: ROW_REVERSED[rowIndex]
                      ? "reverse"
                      : "normal",
                  }}
                >
                  {/* Two copies: the animation ends at -50%, which is the start
                      of the second one, so the seam is never visible. */}
                  {[0, 1].map((copy) => (
                    <div
                      key={copy}
                      className="flex shrink-0"
                      aria-hidden={copy === 1}
                    >
                      {sequence.map((client, index) => (
                        <div
                          key={`${client.id ?? client.name}-${index}`}
                          className="flex items-center gap-3 md:gap-4 px-6 md:px-10 shrink-0"
                        >
                          <img
                            src={resolveImageUrl(client.image)}
                            alt={client.name}
                            loading="lazy"
                            className="h-7 md:h-12 lg:h-14 w-auto max-w-[72px] md:max-w-[110px] object-contain shrink-0 grayscale"
                          />
                          <span
                            className="text-[12px] md:text-[15px] lg:text-[20px] whitespace-nowrap"
                            style={{
                              fontFamily: INTER,
                              fontWeight: 400,
                              color: "var(--page-ink-muted, #9A9A9A)",
                            }}
                          >
                            {client.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Clients;
