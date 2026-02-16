import React from 'react';

const AboutTeam: React.FC = () => {
  const teamMembers = [
    { name: 'Team Member 1', role: 'Role', image: '/images/team/member1.jpg' },
    { name: 'Team Member 2', role: 'Role', image: '/images/team/member2.jpg' },
    { name: 'Team Member 3', role: 'Role', image: '/images/team/member3.jpg' },
    { name: 'Team Member 4', role: 'Role', image: '/images/team/member4.jpg' },
  ];

  return (
    <section className="bg-[#008AA9] py-12 md:py-20">
      <div className="px-6 md:px-12 lg:px-24">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white mb-4">Our Team</h2>
          <p className="text-white max-w-3xl">
            To be the most trusted growth partner for brands in Nepal and beyond, setting the standard for 
            integrated marketing by seamlessly blending technology, creativity, and human connection.
          </p>
        </div>

        {/* Team Grid with Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden">
              <div className="w-full h-64 bg-gray-300">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h4 className="font-semibold">{member.name}</h4>
                <p className="text-sm text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;