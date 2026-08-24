import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import AudioToggle from "./AudioToggle";
import contentData from "../data/content.json";

// index.css sets `* { font-family: Inter }`, which lands on every element
// directly — so inheriting Montserrat from the <nav> does not work. These have
// to be applied per element, where an inline style outranks the universal rule.
const MONTSERRAT = "Montserrat, sans-serif";

const LINK_STYLE: React.CSSProperties = {
  fontFamily: MONTSERRAT,
  fontWeight: 500,
  fontSize: "15px",
  lineHeight: "100%",
  letterSpacing: "0",
};

const CTA_STYLE: React.CSSProperties = {
  fontFamily: MONTSERRAT,
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "0",
};

// `menu: true` opens the services panel instead of navigating — Services is
// not a page any more, only a way into the individual ones.
const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services", menu: true },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Contact Us", path: "/contact" },
];

const NavbarNew: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [atFooter, setAtFooter] = useState(false);
  // Glass only once something is actually passing underneath the bar.
  const [glass, setGlass] = useState(true);
  // The services panel. Held open briefly on leaving, so the cursor can cross
  // the gap between the trigger and the panel without it snapping shut.
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const navRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  const go = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Close both panels on route change
  useEffect(() => {
    setIsOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Opening is immediate; closing waits a beat so moving the cursor from the
  // trigger down into the panel does not pass through a gap and shut it.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setMenuOpen(true);
  };
  const closeMenu = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMenuOpen(false), 140);
  };
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  // While the panel is open the whole bar goes dark, whatever is behind it.
  const dark = menuOpen || isOpen || !glass;

  // Over the dark hero the bar carries no background at all, and its contents
  // are light. It flips when the page behind it does — the hero publishes that
  // as it fades, which is the only thing that actually knows. Watching the
  // hero's own position instead would flip the bar while the background was
  // still dark. Pages without a hero are always light.
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    if (!hero) {
      setGlass(true);
      return;
    }

    let raf: number | null = null;

    const update = () => {
      raf = null;
      setGlass(document.documentElement.dataset.pageLight === "true");
    };

    const onScroll = () => {
      if (raf === null) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [location.pathname]);

  // Get out of the way once the footer takes over the screen. Re-queried per
  // route because each page renders its own footer element.
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setAtFooter(entry.isIntersecting);
        if (entry.isIntersecting) setIsOpen(false);
      },
      // Shrink the root from the bottom so this fires once the footer has
      // properly arrived, not the instant its first pixel appears.
      { rootMargin: "0px 0px -35% 0px" },
    );

    observer.observe(footer);
    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <nav
      ref={navRef}
      onMouseLeave={closeMenu}
      className={`sticky top-0 z-50 transition-all duration-300 ease-out ${
        menuOpen || isOpen
          ? "bg-black"
          : glass
            ? "bg-site/70 backdrop-blur-xl"
            : "bg-transparent"
      } ${
        atFooter
          ? "-translate-y-full opacity-0 pointer-events-none"
          : "translate-y-0 opacity-100"
      }`}
      style={{ fontFamily: MONTSERRAT }}
      aria-hidden={atFooter}
      aria-label="Main"
    >
      <div className="px-6 md:px-12 lg:px-[120px] py-4 md:py-5 lg:py-6">
        <div className="relative flex items-center justify-between gap-6">
          {/* ---------- Left: logo ---------- */}
          <button
            onClick={() => go("/")}
            className="shrink-0"
            aria-label="Fibispace home"
          >
            <img
              // Flips with the background underneath it, on the same flag as
              // the links and the glass.
              src={dark ? "/assets/fibiWhite.png" : "/assets/fibiBlack.png"}
              alt="Fibispace"
              className="h-8 md:h-10 lg:h-12 w-auto object-contain transition-opacity duration-300"
            />
          </button>

          {/* ---------- Centre: links ----------
              Absolutely centred rather than a flex child, so the group sits on
              the screen's midpoint instead of being pushed around by the
              differing widths of the logo and the CTA. */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-10 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <button
                  key={link.name}
                  // Services opens the panel and goes nowhere. Hovering any
                  // other link closes it, so moving along the bar dismisses it.
                  onClick={link.menu ? openMenu : () => go(link.path)}
                  onMouseEnter={link.menu ? openMenu : closeMenu}
                  onFocus={link.menu ? openMenu : closeMenu}
                  aria-haspopup={link.menu ? "true" : undefined}
                  aria-expanded={link.menu ? menuOpen : undefined}
                  className="transition-colors inline-flex items-center gap-1.5"
                  style={{
                    ...LINK_STYLE,
                    color: dark
                      ? active || (link.menu && menuOpen)
                        ? "#FFFFFF"
                        : "rgba(255,255,255,0.62)"
                      : active
                        ? "#111111"
                        : "#8A8A8A",
                  }}
                >
                  {link.name}
                  {link.menu && (
                    <ChevronDown
                      size={14}
                      strokeWidth={2}
                      className={`transition-transform duration-300 ${menuOpen ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ---------- Right: audio, CTA, mobile toggle ---------- */}
          <div className="flex items-center gap-3 shrink-0">
            <AudioToggle />

            <button
              onClick={() => go("/contact")}
              className={`hidden lg:flex items-center gap-2 rounded-full transition-colors px-6 lg:px-7 py-2.5 lg:py-3 ${
                menuOpen
                  ? "bg-white text-black hover:bg-white/90"
                  : "bg-primary hover:bg-primary-dark text-white"
              }`}
              style={CTA_STYLE}
            >
              Book a call
              <ArrowRight size={16} strokeWidth={2} />
            </button>

            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className={`lg:hidden p-2 -mr-2 ${dark ? "text-white" : "text-black"}`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Services panel ----------
          Full width, flush under the bar, which has gone black to meet it — so
          the two read as one surface rather than a menu floating on a page. */}
      <div
        className={`hidden lg:block absolute left-0 right-0 top-full bg-black overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${
          menuOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
        }`}
        onMouseEnter={openMenu}
        onMouseLeave={closeMenu}
      >
        <div className="px-6 md:px-12 lg:px-[120px] pt-10 pb-14">
          <p
            className="uppercase text-[11px] tracking-[0.14em]"
            style={{
              fontFamily: MONTSERRAT,
              fontWeight: 400,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            What we do
          </p>

          <div className="mt-8 grid grid-cols-2 xl:grid-cols-4 gap-x-10 gap-y-8">
            {contentData.services.map((service, index) => (
              <button
                key={service.id}
                onClick={() => go(`/services/${service.slug}`)}
                className="group text-left border-t border-white/10 pt-4 transition-colors hover:border-white/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className="block text-[11px] tabular-nums"
                      style={{
                        fontFamily: MONTSERRAT,
                        fontWeight: 500,
                        color: "#12A89C",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="mt-2 block text-[16px] xl:text-[18px] transition-colors group-hover:text-white"
                      style={{
                        fontFamily: MONTSERRAT,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      {service.shortTitle}
                    </span>
                    <span
                      className="mt-1.5 block text-[12px] leading-relaxed line-clamp-2"
                      style={{
                        fontFamily: MONTSERRAT,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.42)",
                      }}
                    >
                      {service.subtitle}
                    </span>
                  </div>

                  <ArrowRight
                    size={16}
                    strokeWidth={2}
                    className="shrink-0 mt-1 -rotate-45 text-white/30 transition-all duration-300 group-hover:rotate-0 group-hover:text-white"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Mobile / tablet panel ----------
          A sheet that drops in from behind the bar. The outer box is fixed and
          clips; the inner one is what travels, from a full height above to
          nothing, so only a transform animates and the panel appears to fall
          out of the header rather than fade into place.

          Rendered at all times rather than mounted on open, so it has a state
          to leave from — a panel that only exists while open can slide in but
          can never slide out. */}
      <div
        // Absolute against the bar, not fixed against the window. The nav
        // carries a transform of its own — it slides away at the footer — and
        // a transformed ancestor becomes the containing block for anything
        // fixed inside it, so a fixed panel here would be positioned off the
        // nav regardless. top-full puts it directly under the bar without
        // needing to know how tall the bar is.
        className={`lg:hidden absolute top-full inset-x-0 z-40 overflow-hidden ${
          isOpen ? "" : "pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      >
        <div
          className={`max-h-[calc(100dvh-4.5rem)] overflow-y-auto bg-[#0B0B0B] px-6 md:px-12 pt-6 pb-10 transition-transform duration-[620ms] ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            isOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          <div className="flex flex-col">
            {navLinks.map((link, index) => {
              const active = isActive(link.path);
              const ink = active ? "#FFFFFF" : "rgba(255,255,255,0.62)";

              // Each line follows the sheet down, a little after the one above
              // it. The delay is only on the way in: leaving, they go together
              // with the panel that carries them.
              const arrive: React.CSSProperties = {
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? "none" : "translateY(-10px)",
                transition:
                  "opacity 420ms ease-out, transform 420ms cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: isOpen ? `${220 + index * 70}ms` : "0ms",
              };

              // No hover on a touch screen, so Services is not a trigger here —
              // its list is simply always shown, indented.
              if (link.menu) {
                return (
                  <div
                    key={link.name}
                    className="py-4 border-b border-white/10"
                    style={arrive}
                  >
                    <span
                      className="block"
                      style={{ ...LINK_STYLE, color: ink }}
                    >
                      {link.name}
                    </span>
                    <div className="mt-3 flex flex-col gap-3 pl-4">
                      {contentData.services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => go(`/services/${service.slug}`)}
                          className="text-left text-[13px] md:text-[14px]"
                          style={{
                            fontFamily: MONTSERRAT,
                            fontWeight: 400,
                            color: "rgba(255,255,255,0.62)",
                          }}
                        >
                          {service.shortTitle}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={link.name}
                  onClick={() => go(link.path)}
                  className="text-left py-4 border-b border-white/10"
                  style={{ ...LINK_STYLE, ...arrive, color: ink }}
                >
                  {link.name}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => go("/contact")}
            className="mt-6 w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-full transition-colors py-3.5"
            style={{
              ...CTA_STYLE,
              opacity: isOpen ? 1 : 0,
              transform: isOpen ? "none" : "translateY(-10px)",
              transition:
                "opacity 420ms ease-out, transform 420ms cubic-bezier(0.16, 1, 0.3, 1)",
              transitionDelay: isOpen
                ? `${220 + navLinks.length * 70}ms`
                : "0ms",
            }}
          >
            Book a call
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavbarNew;
