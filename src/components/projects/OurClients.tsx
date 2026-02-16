import React, { useState, useEffect } from "react";
import contentData from "../../data/content.json";

const OurClients: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 12;

  const clients = contentData.clients;

  // Calculate pagination
  const totalPages = Math.ceil(clients.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;
  const endIndex = startIndex + clientsPerPage;
  const currentClients = clients.slice(startIndex, endIndex);

  // Auto-play slideshow - changes every 3 seconds
  useEffect(() => {
    if (totalPages <= 1) return; // Don't auto-play if only 1 page

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev >= totalPages ? 1 : prev + 1));
    }, 4000); // 3 seconds

    return () => clearInterval(interval);
  }, [totalPages]);

  const handleDotClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="bg-white pt-12 md:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        {/* Section Title - Responsive */}
        <h2
          className="text-center mb-6 md:mb-8"
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(32px, 5vw, 48px)",
            fontWeight: "500",
            lineHeight: "clamp(40px, 6vw, 64px)",
          }}
        >
          Our Clients
        </h2>

        {/* Description - Responsive */}
        <p
          className="text-center text-black mb-8 md:mb-12 px-4"
          style={{
            fontFamily: "Inter",
            fontSize: "clamp(16px, 2.5vw, 24px)",
            fontWeight: "300",
            lineHeight: "clamp(24px, 3.5vw, 32px)",
          }}
        >
          We are proud to partner with a diverse range of businesses, from
          emerging start-ups to established industry leaders. Our clients trust
          us to deliver creative solutions that drive real growth. We don't just
          work for them; we work with them. Building every project as a
          collaboration dedicated to their unique vision and success.
        </p>

        {/* Clients Grid with Fade Transition */}
        <div className="relative mb-8 md:mb-12">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-500"
            key={currentPage}
          >
            {currentClients.map((client, index) => (
              <div
                key={index}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Circle Image - Responsive */}
                <div
                  className="flex-shrink-0 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50"
                  style={{
                    width: "clamp(70px, 10vw, 103.5px)",
                    height: "clamp(70px, 10vw, 103.5px)",
                  }}
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="object-contain grayscale hover:grayscale-0 transition-all"
                    style={{
                      width: "clamp(40px, 6vw, 64px)",
                      height: "clamp(40px, 6vw, 64px)",
                    }}
                  />
                </div>

                {/* Company Name - Responsive */}
                <p
                  className="flex-1"
                  style={{
                    fontFamily: "Inter",
                    fontSize: "clamp(16px, 2.5vw, 24px)",
                    fontWeight: "500",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                  }}
                >
                  {client.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators - Only show if more than 12 clients */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 md:gap-3 mb-8 md:mb-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handleDotClick(page)}
                className={`rounded-full transition-all duration-300 ${
                  currentPage === page
                    ? "bg-[#008AA9] w-8 md:w-10 h-2.5 md:h-3"
                    : "bg-gray-300 w-2.5 md:w-3 h-2.5 md:h-3 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${page}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurClients;
