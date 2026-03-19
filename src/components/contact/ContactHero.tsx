import React, { useState } from "react";
import ContactForm from "./ContactForm";
import contentData from "../../data/content.json";
import { Check, Copy } from "lucide-react";

const ContactHero: React.FC = () => {
  const { contact } = contentData;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white pt-8 md:pt-12 lg:pt-20 pb-12 md:pb-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Side - Contact Info */}
          <div className="lg:pt-16">
            <p
              className="text-[#008AA9]"
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(18px, 2.5vw, 24px)",
                fontWeight: "500",
                lineHeight: "clamp(40px, 6vw, 64px)",
                letterSpacing: "0%",
              }}
            >
              Contact Us
            </p>

            <h1
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(32px, 5vw, 48px)",
                fontWeight: "500",
                lineHeight: "clamp(40px, 6vw, 64px)",
                letterSpacing: "0%",
              }}
            >
              We'd Love to Hear
              <br />
              From You.
            </h1>

            <p
              className="text-gray-700 mb-12 md:mb-20"
              style={{
                fontFamily: "Inter",
                fontSize: "clamp(16px, 2.5vw, 24px)",
                fontWeight: "300",
                lineHeight: "clamp(24px, 4vw, 40px)",
                letterSpacing: "0%",
              }}
            >
              Have a project in mind? Or maybe you just want to know more about
              how we work? Drop us a message. We are always happy to discuss new
              ideas and potential collaborations.
            </p>

            {/* Easy Connect */}
            <div>
              <h3
                style={{
                  fontFamily: "Inter",
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  fontWeight: "500",
                  lineHeight: "clamp(28px, 4vw, 40px)",
                  letterSpacing: "0%",
                }}
              >
                Easy Connect
              </h3>
              <a
                style={{
                  fontFamily: "Inter",
                  fontSize: "clamp(24px, 4vw, 36px)",
                  fontWeight: "900",
                  lineHeight: "clamp(32px, 5vw, 50px)",
                  letterSpacing: "0%",
                  color: "#0000001A",
                  cursor: "pointer",
                  width: "fit-content",
                }}
                href="https://wa.me/9779741661719"
                target="_blank"
              >
                {contact.phone}
              </a>
              <br />
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${contact.email}`}
                  style={{
                    fontFamily: "Inter",
                    fontSize: "clamp(24px, 4vw, 36px)",
                    fontWeight: "900",
                    lineHeight: "clamp(32px, 5vw, 50px)",
                    letterSpacing: "0%",
                    color: "#0000001A",
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                >
                  {contact.email}
                </a>
                <button
                  style={{
                    fontFamily: "Inter",
                    fontSize: "clamp(24px, 4vw, 36px)",
                    fontWeight: "900",
                    lineHeight: "clamp(32px, 5vw, 50px)",
                    letterSpacing: "0%",
                    color: "#0000001A",
                    cursor: "pointer",
                    width: "fit-content",
                  }}
                  onClick={handleCopy}
                  title="Copy email"
                >
                  {copied ? <Check size={22} /> : <Copy size={22} />}
                </button>
              </div>
              {/* <a
                style={{
                  fontFamily: "Inter",
                  fontSize: "clamp(24px, 4vw, 36px)",
                  fontWeight: "900",
                  lineHeight: "clamp(32px, 5vw, 50px)",
                  letterSpacing: "0%",
                  color: "#0000001A",
                  cursor: "pointer",
                  width: "fit-content",
                }}
                href={`mailto:${contact.email}`}
                target="_blank"
              >
                {contact.email}
              </a> */}
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactHero;
