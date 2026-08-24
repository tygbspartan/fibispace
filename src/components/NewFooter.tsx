import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import contentData from "../data/content.json";

// index.css sets `* { font-family: Inter }` on every element, so Montserrat
// cannot be inherited from a parent — it has to be set where the text is.
const MONTSERRAT = "Montserrat, sans-serif";

const MUTED = "#8A8A8A";
const LINK = "#B4B4B4";

// react-icons v5 types its icons as returning ReactNode, which this project's
// @types/react rejects as a JSX component. Narrow them at the boundary.
type IconComponent = React.FC<{ size?: number; className?: string }>;
const asIcon = (icon: unknown) => icon as IconComponent;

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "About", path: "/about" },
  { name: "Project", path: "/projects" },
  { name: "Contact Us", path: "/contact" },
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms and Conditions", path: "/terms-and-conditions" },
];

const NewFooter: React.FC = () => {
  const { footer, contact } = contentData;
  const navigate = useNavigate();
  const location = useLocation();

  const socials = [
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
      icon: asIcon(FaLinkedin),
      href: contact.socials.linkedin,
    },
    {
      name: "Email",
      icon: asIcon(FaEnvelope),
      href: `mailto:${contact.email}`,
    },
    {
      name: "WhatsApp",
      icon: asIcon(FaWhatsapp),
      href: "https://wa.me/9779741661719",
    },
  ];

  const isActive = (path: string) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path);

  return (
    <footer
      className="bg-black text-white min-h-screen flex flex-col"
      id="contact"
      style={{ fontFamily: MONTSERRAT }}
    >
      {/* Centred in whatever height is left above the legal band, then biased
          downward by the uneven padding — the reference sits below true centre. */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-[120px] pt-32 md:pt-44 lg:pt-48 pb-12 text-center">
        {/* ---------- Tagline ---------- */}
        <h2
          className="text-[22px] sm:text-[28px] lg:text-[36px] wide:text-[48px] leading-snug max-w-3xl mx-auto"
          style={{ fontFamily: MONTSERRAT, fontWeight: 500 }}
        >
          {footer.tagline}
        </h2>

        {/* ---------- Mark ---------- */}
        <button
          onClick={() => navigate("/")}
          aria-label={`${footer.company} home`}
          className="mt-24 inline-block"
        >
          <img
            src="/assets/fibiGrey.png"
            alt={footer.company}
            className="h-8 md:h-9 wide:h-12 w-auto object-contain mx-auto"
          />
        </button>

        {/* ---------- Quick links ---------- */}
        <p
          className="mt-24 text-[12px] md:text-[13px] wide:text-[16px]"
          style={{ fontFamily: MONTSERRAT, fontWeight: 400, color: MUTED }}
        >
          Quick Links
        </p>

        <nav
          className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-2"
          aria-label="Footer"
        >
          {quickLinks.map((link, index) => {
            const active = isActive(link.path);
            return (
              <React.Fragment key={link.name}>
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="text-[10px]"
                    style={{ color: "#4A4A4A" }}
                  >
                    •
                  </span>
                )}
                <button
                  onClick={() => navigate(link.path)}
                  className="px-1 text-[12px] md:text-[13px] wide:text-[16px] transition-colors hover:text-white"
                  style={{
                    fontFamily: MONTSERRAT,
                    fontWeight: active ? 600 : 400,
                    color: active ? "#FFFFFF" : LINK,
                  }}
                >
                  {link.name}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* ---------- Socials ---------- */}
        <p
          className="mt-10 md:mt-12 text-[12px] md:text-[13px] wide:text-[16px]"
          style={{ fontFamily: MONTSERRAT, fontWeight: 400, color: MUTED }}
        >
          Follow {footer.company} on
        </p>

        <div className="mt-4 flex items-center justify-center gap-6 md:gap-8">
          {socials.map(({ name, icon: Icon, href }) => (
            <a
              key={name}
              href={href}
              target={href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={name}
              title={name}
              className="text-white/90 hover:text-primary transition-colors"
            >
              <Icon size={18} className="w-[18px] h-[18px] wide:w-8 wide:h-8" />
            </a>
          ))}
        </div>
      </div>

      {/* ---------- Legal ---------- */}
      <div className="border-t border-white/[0.12]">
        <div className="px-6 md:px-12 lg:px-[120px] py-5 md:py-6 text-center space-y-2">
          <p
            className="text-[12px] md:text-[13px] wide:text-[16px]"
            style={{ fontFamily: MONTSERRAT, fontWeight: 400, color: MUTED }}
          >
            {footer.location}
          </p>
          <p
            className="text-[12px] md:text-[13px] wide:text-[16px]"
            style={{ fontFamily: MONTSERRAT, fontWeight: 400, color: MUTED }}
          >
            All Rights Reserved @{new Date().getFullYear()} {footer.company}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default NewFooter;
