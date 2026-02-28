import React, { useState, useEffect, useRef } from "react";
import { teamAPI } from "../../services/api";
import { TeamMember } from "../../types";

const AboutTeam: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getAll();
      setTeamMembers(response.data.members || []);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberClick = (index: number) => {
    setHighlightedIndex(index);
  };

  const handleDotClick = (index: number) => {
    setHighlightedIndex(index);
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        direction === "left"
          ? scrollContainerRef.current.scrollLeft - scrollAmount
          : scrollContainerRef.current.scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const highlightedMember = teamMembers[highlightedIndex];
  const otherMembers = teamMembers.filter(
    (_, index) => index !== highlightedIndex,
  );

  if (loading) {
    return (
      <section
        className="py-12 md:py-20"
        style={{
          background:
            "linear-gradient(92.66deg, #019FD2 4.07%, #01526C 109.31%)",
        }}
      >
        <div className="px-6 md:px-12 lg:px-24">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <section
        className="py-12 md:py-20"
        style={{
          background:
            "linear-gradient(92.66deg, #019FD2 4.07%, #01526C 109.31%)",
        }}
      >
        <div className="px-6 md:px-12 lg:px-24">
          <h2 className="text-white text-center text-2xl">
            No team members available
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pb-6 md:pb-10 px-6 md:px-12 lg:px-24 overflow-hidden">
      <div
        style={{
          background:
            "linear-gradient(92.66deg, #019FD2 4.07%, #01526C 109.31%)",
        }}
      >
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,612px)_minmax(0,1fr)] gap-6 md:gap-8 xl:gap-12 items-start mb-6 md:mb-8 py-6 px-6 md:py-8 md:px-8 xl:pl-8">
          {/* Left Side - Highlighted Member */}
          <div className="relative w-full max-w-[612px] mx-auto xl:mx-0">
            <div
              className="relative overflow-hidden rounded transition-all duration-300"
              style={{
                width: "100%",
                height: "clamp(500px, 65vw, 782px)",
              }}
            >
              <img
                src={highlightedMember.image}
                alt={highlightedMember.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/612x782?text=No+Image";
                }}
              />

              {/* White Box - Name & Designation at Bottom - UPDATED */}
              <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5 rounded bg-white p-4 md:p-6 lg:p-8">
                <h3
                  style={{
                    fontFamily: "Inter",
                    fontSize: "clamp(18px, 4vw, 32px)",
                    fontWeight: "700",
                    lineHeight: "1.3",
                    color: "#000000",
                  }}
                >
                  {highlightedMember.name}
                </h3>
                <p
                  className="text-gray-600 mt-1 md:mt-2"
                  style={{
                    fontFamily: "Inter",
                    fontSize: "clamp(13px, 2.5vw, 20px)",
                    fontWeight: "400",
                    lineHeight: "1.4",
                  }}
                >
                  {highlightedMember.designation}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Info & Horizontal Scrollable Cards */}
          <div className="min-w-0">
            {/* Our Team Title - FIXED */}
            <h2 className="text-white mb-3 md:mb-4 text-2xl md:text-3xl xl:text-5xl font-medium">
              Our Team
            </h2>

            {/* Description - FIXED without line clamp */}
            <p className="text-white mb-6 md:mb-8 text-sm md:text-base xl:text-2xl font-normal leading-snug md:leading-relaxed xl:leading-relaxed">
              To be the most trusted growth partner for brands in Nepal and
              beyond, setting the standard for integrated marketing by
              seamlessly blending technology, creativity, and human connection.
            </p>

            {/* Horizontal Scrollable Cards Container */}
            <div className="relative overflow-visible">
              {/* Scrollable Container */}
              <div
                ref={scrollContainerRef}
                className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2 -mr-6 pr-6 md:mr-0 md:pr-0"
                style={{
                  scrollSnapType: "x mandatory",
                }}
              >
                {otherMembers.map((member) => {
                  const actualIndex = teamMembers.findIndex(
                    (m) => m.id === member.id,
                  );

                  return (
                    <div
                      key={member.id}
                      onClick={() => handleMemberClick(actualIndex)}
                      className="relative flex-shrink-0 overflow-hidden rounded cursor-pointer transition-all duration-300 group hover:ring-2 md:hover:ring-4 ring-white"
                      style={{
                        width: "clamp(250px, 70vw, 400px)",
                        aspectRatio: "345/442",
                        scrollSnapAlign: "start",
                      }}
                    >
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/345x442?text=No+Image";
                        }}
                      />

                      {/* White Box at Bottom - Always Visible - UPDATED */}
                      <div className="absolute bottom-2 left-2 right-2 md:bottom-3 md:left-3 md:right-3 rounded bg-white p-3 md:p-4 transition-all duration-300">
                        <p
                          className="font-semibold truncate"
                          style={{
                            fontFamily: "Inter",
                            fontSize: "clamp(13px, 2.5vw, 18px)",
                            lineHeight: "1.3",
                          }}
                        >
                          {member.name}
                        </p>
                        <p
                          className="text-gray-600 text-sm truncate mt-1"
                          style={{
                            fontFamily: "Inter",
                            fontSize: "clamp(11px, 2vw, 14px)",
                          }}
                        >
                          {member.designation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Scroll Buttons - Tablet and Desktop Only */}
              {otherMembers.length > 2 && (
                <div className="hidden md:block">
                  {/* Scroll Left Button */}
                  <button
                    onClick={() => handleScroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-gray-100 transition-colors"
                    style={{ marginTop: "-16px" }}
                    aria-label="Scroll left"
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-[#008AA9]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {/* Scroll Right Button */}
                  <button
                    onClick={() => handleScroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-gray-100 transition-colors"
                    style={{ marginTop: "-16px" }}
                    aria-label="Scroll right"
                  >
                    <svg
                      className="w-5 h-5 md:w-6 md:h-6 text-[#008AA9]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Pagination Dots - For all team members */}
            {teamMembers.length > 1 && (
              <div className="flex justify-center items-center gap-2 md:gap-3 mt-6 md:mt-8">
                {teamMembers.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={`rounded-full transition-all duration-300 ${
                      highlightedIndex === index
                        ? "bg-white w-8 h-2.5 md:w-10 md:h-3"
                        : "bg-white/50 w-2.5 h-2.5 md:w-3 md:h-3 hover:bg-white/75"
                    }`}
                    aria-label={`Select member ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS for hiding scrollbar */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default AboutTeam;
