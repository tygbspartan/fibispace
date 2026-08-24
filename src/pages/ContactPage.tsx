import React, { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import {
  FaWhatsapp,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
} from "react-icons/fa";
import IdeaBulb from "../components/icons/IdeaBulb";
import ContactForm from "../components/contact/ContactForm";
import Footer from "../components/NewFooter";
import contentData from "../data/content.json";

const MONTSERRAT = "Montserrat, sans-serif";
const INTER = "Inter, sans-serif";
const MUTED = "#898080";

// react-icons v5 types its icons as returning ReactNode, which this project's
// @types/react rejects as a JSX component. Narrow them at the boundary.
type IconComponent = React.FC<{ size?: number }>;
const asIcon = (icon: unknown) => icon as IconComponent;

// Same ramp as every other page title on the site.
// 70px at the top end: the home page keeps 72, every other page steps down.
const TITLE_SIZE =
  "text-[28px] md:text-[34px] xl:text-[38px] 2xl:text-[50px] slg:text-[60px]";

const ContactPage: React.FC = () => {
  const { contact } = contentData;

  const titleRef = useRef<HTMLHeadingElement>(null);
  // The description is set to the width of the heading's longest line, so the
  // two wrap to the same edge. Measured rather than guessed: the heading is a
  // block that fills its column, so its own box says nothing about how wide the
  // text inside it actually runs, and that width changes at every breakpoint.
  const [titleWidth, setTitleWidth] = useState<number>();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const heading = titleRef.current;
    if (!heading) return;

    const measure = () => {
      // Per-line rectangles for the text runs, not the element box.
      const range = document.createRange();
      range.selectNodeContents(heading);
      const rects = Array.from(range.getClientRects());
      if (rects.length === 0) return;

      // The heading holds inline spans, so a single line comes back as several
      // rectangles. Group them by the line they sit on and take each line's
      // full extent — otherwise this measures the widest fragment rather than
      // the widest line, and the description stops short of "happen.".
      const lines = new Map<number, { left: number; right: number }>();
      for (const rect of rects) {
        const key = Math.round(rect.top);
        const line = lines.get(key);
        if (line) {
          line.left = Math.min(line.left, rect.left);
          line.right = Math.max(line.right, rect.right);
        } else {
          lines.set(key, { left: rect.left, right: rect.right });
        }
      }

      const widest = Array.from(lines.values()).reduce(
        (max, line) => Math.max(max, line.right - line.left),
        0,
      );
      if (widest > 0) setTitleWidth(widest);
    };

    measure();
    // Montserrat may still be loading, and it is wider than the fallback.
    document.fonts?.ready.then(measure).catch(() => {});

    const observer = new ResizeObserver(measure);
    observer.observe(heading);
    return () => observer.disconnect();
  }, []);

  const whatsapp = `https://wa.me/${contact.phone.replace(/\D/g, "")}`;

  const socials = [
    { name: "WhatsApp", icon: asIcon(FaWhatsapp), href: whatsapp },
    {
      name: "Facebook",
      icon: asIcon(FaFacebookF),
      href: contact.socials.facebook,
    },
    {
      name: "Instagram",
      icon: asIcon(FaInstagram),
      href: contact.socials.instagram,
    },
    {
      name: "LinkedIn",
      icon: asIcon(FaLinkedinIn),
      href: contact.socials.linkedin,
    },
    {
      name: "Email",
      icon: asIcon(FaEnvelope),
      href: `mailto:${contact.email}`,
    },
  ];

  return (
    <div className="bg-site">
      {/* The contact block itself is exactly the screen, minus the navbar
          sitting above it in the flow. The footer then follows below. */}
      <div className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-96px)] px-6 md:px-12 lg:px-[120px] pt-[30px] md:pt-[100px] pb-10 md:pb-14">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20">
          {/* ---------- Left: who to talk to ---------- */}
          <div className="flex flex-col text-center md:text-left">
            <h1
              ref={titleRef}
              className={TITLE_SIZE}
              style={{
                fontFamily: MONTSERRAT,
                fontWeight: 400,
                lineHeight: 1.15,
              }}
            >
              {/* fontFamily repeated on the spans: index.css sets it on every
                  element via `*`, so these would otherwise render in Inter
                  while the bare text beside them stayed Montserrat. */}
              <span
                className="inline-flex items-start gap-3"
                style={{ fontFamily: MONTSERRAT }}
              >
                Have an idea?
                <IdeaBulb
                  aria-hidden="true"
                  // Sized against the title rather than in pixels, so it keeps
                  // its proportion as the heading steps down.
                  className="shrink-0 w-[0.5em] h-[0.5em] mt-[0.15em]"
                  // Mirrored first, then tilted, so it faces the other way
                  // while keeping the 35 lean.
                  style={{ transform: "rotate(35deg) scaleX(-1)" }}
                />
              </span>
              <br />
              Let's make it{" "}
              {/* Scoped to this word alone, so the stroke tracks its width
                  rather than the whole line's. */}
              <span
                className="relative inline-block"
                style={{ fontFamily: MONTSERRAT }}
              >
                happen.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 12"
                  preserveAspectRatio="none"
                  className="absolute left-0 -bottom-1 w-full h-[0.16em]"
                >
                  <path
                    d="M2 9C34 3 92 1 138 3c22 1 42 3 60 6"
                    fill="none"
                    stroke="#12A89C"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
            <p
              className="mt-6 mx-auto md:mx-0 text-[13px] md:text-[16px] xl:text-[18px] slg:text-[20px] leading-relaxed"
              style={{
                fontFamily: INTER,
                fontWeight: 400,
                color: MUTED,
                maxWidth: titleWidth ? `${titleWidth}px` : undefined,
              }}
            >
              Have a project in mind? Or maybe you just want to know more about
              how we work? Drop us a message. We are always happy to discuss new
              ideas and potential collaborations.
            </p>

            {/* Pushed to the bottom of the column, as in the design. */}
            <div className="mt-12 lg:mt-auto lg:pt-16">
              <a
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-4 md:gap-5 group"
              >
                <span className="w-7 h-7 md:w-9 md:h-9 shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center transition-colors group-hover:bg-primary group-hover:text-white">
                  <Phone size={15} strokeWidth={2} />
                </span>
                <span className="text-left">
                  <span
                    className="block text-[13px] md:text-[12px]"
                    style={{
                      fontFamily: INTER,
                      fontWeight: 600,
                      color: "#535353",
                    }}
                  >
                    Call us
                  </span>
                  <span
                    className="block text-[14px] md:text-[16px]"
                    style={{ fontFamily: INTER, fontWeight: 500 }}
                  >
                    {contact.phone}
                  </span>
                </span>
              </a>

              <div className="mt-8 mx-auto md:mx-0 max-w-md border-t border-black/10 pt-6 text-center md:text-left">
                <p
                  className="text-[13px] md:text-[16px]"
                  style={{
                    fontFamily: INTER,
                    fontWeight: 600,
                    color: "#535353",
                  }}
                >
                  Easy Connect
                </p>
                <div className="mt-4 flex items-center justify-center md:justify-start gap-6">
                  {socials.map(({ name, icon: SocialIcon, href }) => (
                    <a
                      key={name}
                      href={href}
                      target={href.startsWith("mailto:") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      aria-label={name}
                      title={name}
                      className="text-black hover:text-primary transition-colors [&>svg]:w-[20px] [&>svg]:h-[20px] md:[&>svg]:w-8 md:[&>svg]:h-8"
                    >
                      <SocialIcon size={32} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Right: the form ---------- */}
          <ContactForm />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
