import React, { useState } from "react";
import contentData from "../data/content.json";
import { X } from "lucide-react";

const socialLinks: {
  name: string;
  icon: React.ReactNode;
  link: string;
}[] = [
  {
    name: "Facebook",
    icon: "Facebook.png",
    link: "https://facebook.com/fibispace",
  },
  {
    name: "Instagram",
    icon: "Instagram.png",
    link: "https://instagram.com/fibispace",
  },
  {
    name: "LinkedIn",
    icon: "Linkedin.png",
    link: "https://linkedIn.com/",
  },
  {
    name: "Threads",
    icon: "Threads.png",
    link: "https://threads.net/@fibispace",
  },
];

const CTA: React.FC = () => {
  const { cta } = contentData;
  const [modalOpen, setModalOpen] = useState(false);

  const handleQuickConnect = () => {
    setModalOpen(true);
  };

  return (
    <>
      <section className="bg-[#008AA9] min-h-screen flex items-center justify-center">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-24 text-center py-12">
          <p
            className="text-white uppercase mb-6 md:mb-8 lg:mb-12"
            style={{
              fontFamily: "Inter",
              fontWeight: "600",
              fontSize: "clamp(18px, 4vw, 28px)",
              lineHeight: "clamp(30px, 5vw, 50px)",
            }}
          >
            {cta.title}
          </p>

          <h2
            className="text-white mb-8 md:mb-12 lg:mb-16"
            style={{
              fontFamily: "Inter",
              fontWeight: "400",
              fontSize: "clamp(48px, 12vw, 150px)",
              lineHeight: "100%",
            }}
          >
            Let's Work
            <br />
            Together!
          </h2>

          <button
            onClick={handleQuickConnect}
            className="px-6 md:px-8 lg:px-10 py-3 md:py-4 bg-white text-[#008AA9] rounded-md hover:bg-gray-100 transition-colors shadow-lg"
            style={{
              fontFamily: "Inter",
              fontWeight: "500",
              fontSize: "clamp(16px, 2vw, 20px)",
              lineHeight: "100%",
            }}
          >
            Quick Connect
          </button>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl px-10 py-10 w-full max-w-sm mx-4 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            <h3
              className="text-[#008AA9] text-center mb-2"
              style={{
                fontFamily: "Inter",
                fontWeight: "700",
                fontSize: "22px",
              }}
            >
              Quick Connect
            </h3>
            <p className="text-gray-400 text-center text-sm mb-8">
              Find us on social media
            </p>

            <div className="flex flex-col gap-3">
              {socialLinks.map(({ name, link, icon }) => (
                <a
                  key={name}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 px-5 py-3 rounded-xl border border-gray-100 hover:border-[#008AA9] hover:text-[#008AA9] text-gray-600 transition-all group"
                >
                  <img
                    src={`/assets/Socials/${icon}`}
                    alt={name}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/400x200?text=Invalid+Image+URL";
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "Inter",
                      fontWeight: "500",
                      fontSize: "16px",
                    }}
                  >
                    {name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CTA;
