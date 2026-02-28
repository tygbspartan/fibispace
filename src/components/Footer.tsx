import React from "react";
import { useNavigate } from "react-router-dom";
import contentData from "../data/content.json";

const Footer: React.FC = () => {
  const { contact } = contentData;
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  return (
    <footer
      className="bg-white pt-8 pb-6 md:pt-12 md:pb-8 lg:pt-16 border-t border-gray-200"
      id="contact"
    >
      <div className="px-6 md:px-12 lg:px-24">
        {/* 3 Equal Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {/* Column 1 - Location & Quick Connect */}
          <div className="space-y-6 md:space-y-8">
            {/* Location */}
            <div>
              <h3
                className="capitalize mb-3 md:mb-4"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "600",
                  fontSize: "clamp(20px, 3vw, 28px)",
                  lineHeight: "clamp(32px, 5vw, 50px)",
                  letterSpacing: "0%",
                  textAlign: "justify",
                }}
              >
                Location
              </h3>
              <address
                className="not-italic capitalize"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "400",
                  fontSize: "clamp(16px, 2.5vw, 28px)",
                  lineHeight: "clamp(28px, 4.5vw, 50px)",
                  letterSpacing: "0%",
                  textAlign: "justify",
                }}
              >
                {contact.location.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </address>
            </div>

            {/* Quick Connect */}
            <div>
              <h3
                className="capitalize mb-3 md:mb-4"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "600",
                  fontSize: "clamp(20px, 3vw, 28px)",
                  lineHeight: "clamp(32px, 5vw, 50px)",
                  letterSpacing: "0%",
                  textAlign: "justify",
                }}
              >
                Quick Connect
              </h3>
              <a
                href='https://wa.me/9779741661719'
                className="capitalize hover:text-[#008AA9] transition-colors block"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "400",
                  fontSize: "clamp(16px, 2.5vw, 28px)",
                  lineHeight: "clamp(28px, 4.5vw, 50px)",
                  letterSpacing: "0%",
                  textAlign: "justify",
                }}
              >
                {contact.phone}
              </a>
            </div>
          </div>

          {/* Column 2 - Socials & Enquires */}
          <div className="space-y-6 md:space-y-8">
            {/* Socials */}
            <div>
              <h3
                className="capitalize mb-3 md:mb-4"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "600",
                  fontSize: "clamp(20px, 3vw, 28px)",
                  lineHeight: "clamp(32px, 5vw, 50px)",
                  letterSpacing: "0%",
                  textAlign: "justify",
                }}
              >
                Socials
              </h3>
              <div
                className="space-y-2"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "400",
                  fontSize: "clamp(16px, 2.5vw, 28px)",
                  lineHeight: "clamp(28px, 4.5vw, 50px)",
                  letterSpacing: "0%",
                  textAlign: "justify",
                }}
              >
                <a
                  href={contact.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block capitalize hover:text-[#008AA9] transition-colors"
                >
                  Instagram
                </a>
                <a
                  href={contact.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block capitalize hover:text-[#008AA9] transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={contact.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block capitalize hover:text-[#008AA9] transition-colors"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* Enquires */}
            <div>
              <h3
                className="capitalize mb-3 md:mb-4"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "600",
                  fontSize: "clamp(20px, 3vw, 28px)",
                  lineHeight: "clamp(32px, 5vw, 50px)",
                  letterSpacing: "0%",
                  textAlign: "justify",
                }}
              >
                Enquires
              </h3>
              <a
                href={`mailto:${contact.email}`}
                className="hover:text-[#008AA9] transition-colors block"
                style={{
                  fontFamily: "Inter",
                  fontWeight: "400",
                  fontSize: "clamp(16px, 2.5vw, 28px)",
                  lineHeight: "clamp(28px, 4.5vw, 50px)",
                  letterSpacing: "0%",
                  textAlign: "justify",
                }}
              >
                {contact.email}
              </a>
            </div>
          </div>

          {/* Column 3 - Let's Connect Form */}
          <div className="flex flex-col">
            <h2
              className="mb-6 md:mb-8"
              style={{
                fontFamily: "Inter",
                fontWeight: "400",
                fontSize: "clamp(36px, 6vw, 64px)",
                lineHeight: "100%",
                letterSpacing: "0%",
              }}
            >
              {contact.heading}
            </h2>

            {/* Contact Form Inputs - Responsive */}
            <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-gray-100 rounded-md text-base md:text-lg"
                style={{ fontFamily: "Inter" }}
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-gray-100 rounded-md text-base md:text-lg"
                style={{ fontFamily: "Inter" }}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 md:px-6 py-3 md:py-4 bg-gray-100 rounded-md text-base md:text-lg"
                style={{ fontFamily: "Inter" }}
              />
            </div>

            {/* Contact Button - Responsive */}
            <button
              onClick={handleContactClick}
              className="w-full px-6 md:px-8 py-3 md:py-4 bg-[#008AA9] text-white rounded-md font-medium hover:bg-[#007a98] transition-colors"
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(16px, 2vw, 20px)",
              }}
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Bottom Bar - Responsive */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 text-center">
          <p className="text-xs md:text-sm text-gray-600">
            © {new Date().getFullYear()} FIBI SPACE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
