import React, { useState, useEffect } from "react";
import { clientAPI } from "../../services/api";
import { Client } from "../../types";

const OurClients: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const clientsPerPage = 12;

  // Fetch clients from API
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAll();
      setClients(response.data.clients || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(clients.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;
  const endIndex = startIndex + clientsPerPage;
  const currentClients = clients.slice(startIndex, endIndex);

  // Auto-play slideshow - changes every 4 seconds
  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev >= totalPages ? 1 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [totalPages]);

  const handleDotClick = (page: number) => {
    setCurrentPage(page);
  };

  // Loading state
  if (loading) {
    return (
      <section className="bg-white pt-12 md:pt-20">
        <div className="px-6 md:px-12 lg:px-24">
          <h2 className="text-center mb-6 md:mb-8 text-3xl md:text-4xl lg:text-5xl font-medium">
            Our Clients
          </h2>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008AA9]"></div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (clients.length === 0) {
    return (
      <section className="bg-white pt-12 md:pt-20">
        <div className="px-6 md:px-12 lg:px-24">
          <h2 className="text-center mb-6 md:mb-8 text-3xl md:text-4xl lg:text-5xl font-medium">
            Our Clients
          </h2>
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No clients to display yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pt-12 md:pt-20">
      <div className="px-6 md:px-12 lg:px-24">
        {/* Section Title */}
        <h2 className="text-center mb-6 md:mb-8 text-3xl md:text-4xl lg:text-5xl font-medium leading-tight">
          Our Clients
        </h2>

        {/* Description */}
        <p className="text-center text-black mb-8 md:mb-12 px-4 text-base md:text-lg lg:text-2xl font-light leading-relaxed max-w-8xl mx-auto">
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
            {currentClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Circle Image */}
                <div className="flex-shrink-0 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28">
                  <img
                    src={client.image}
                    alt={client.name}
                    className="object-contain transition-all w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/64?text=Logo";
                    }}
                  />
                </div>

                {/* Company Name */}
                <p className="flex-1 text-base md:text-lg lg:text-2xl font-medium leading-tight">
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
