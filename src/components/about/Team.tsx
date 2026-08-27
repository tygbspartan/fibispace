import React, { useEffect, useState } from "react";
import { teamAPI, resolveImageUrl } from "../../services/api";
import { TeamMember } from "../../types";
import contentData from "../../data/content.json";
import { REVEAL_HIDDEN, useRevealOnView } from "../../hooks/useRevealOnView";

const MONTSERRAT = "Montserrat, sans-serif";
const INTER = "Inter, sans-serif";

// Same ramp as every other section title on the site.
// 70px at the top end: the home page keeps 72, every other page steps down.
// Where the cards start arriving, once the heading and intro have, and how
// far apart they follow one another.
const CARDS_DELAY = 220;
const CARD_STAGGER = 150;

const TITLE_SIZE =
  "text-[28px] md:text-[34px] xl:text-[38px] 2xl:text-[50px] slg:text-[60px]";

interface CardProps {
  member: TeamMember;
  delay: number;
}

/**
 * One team member. A component of its own rather than markup inside the map:
 * each card reveals on its own, and a hook cannot be called from a loop.
 */
const Card: React.FC<CardProps> = ({ member, delay }) => {
  const ref = useRevealOnView<HTMLDivElement>({ delay, deps: [member.id] });

  return (
    <div ref={ref} style={REVEAL_HIDDEN}>
      {/* Portrait rectangles, with the same drop shadow as the
          project cards. */}
      <div className="overflow-hidden rounded-[10px] shadow-[0px_4px_4px_0px_#00000040] h-[340px] sm:h-[400px] lg:h-[440px] wide:h-[480px]">
        <img
          src={resolveImageUrl(member.image)}
          alt={member.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />
      </div>
      <h3
        className="mt-4 text-[16px] md:text-[19px] lg:text-[24px]"
        style={{ fontFamily: INTER, fontWeight: 400, color: "#111111" }}
      >
        {member.name}
      </h3>
      <p
        className="mt-1 text-[12px] md:text-[14px] lg:text-[16px]"
        style={{ fontFamily: INTER, fontWeight: 400, color: "#8A8A8A" }}
      >
        {member.designation}
      </p>
    </div>
  );
};

const Team: React.FC = () => {
  const { about } = contentData;
  const [members, setMembers] = useState<TeamMember[]>([]);

  // The section renders nothing until the members arrive, so these two only
  // exist after the fetch — without the dependency their observers would be set
  // up while the refs are still null and never run again.
  const titleRef = useRevealOnView<HTMLHeadingElement>({
    pop: true,
    deps: [members],
  });
  const introRef = useRevealOnView<HTMLParagraphElement>({
    delay: 200,
    deps: [members],
  });

  useEffect(() => {
    teamAPI
      .getAll()
      .then((response) => setMembers(response.data.members || []))
      .catch((error) => console.error("Error fetching team members:", error));
  }, []);

  if (members.length === 0) return null;

  return (
    <section className="py-[40px] md:py-[60px]" id="team">
      <h2
        ref={titleRef}
        className={`text-center ${TITLE_SIZE}`}
        style={{
          ...REVEAL_HIDDEN,
          fontFamily: MONTSERRAT,
          fontWeight: 400,
          lineHeight: 1.1,
        }}
      >
        {about.team.heading}
      </h2>
      <p
        ref={introRef}
        className="mt-5 mx-auto max-w-2xl text-center text-[13px] md:text-[16px] xl:text-[18px] slg:text-[20px] leading-relaxed"
        style={{
          ...REVEAL_HIDDEN,
          fontFamily: INTER,
          fontWeight: 400,
          color: "#8A8A8A",
        }}
      >
        {about.team.intro}
      </p>

      <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
        {members.map((member, index) => (
          <Card
            key={member.id}
            member={member}
            delay={CARDS_DELAY + index * CARD_STAGGER}
          />
        ))}
      </div>
    </section>
  );
};

export default Team;
