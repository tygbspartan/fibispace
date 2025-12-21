import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { projects } from "../json/datas";

const Projects = () => {
//   const [scrollY, setScrollY] = useState(0);
//   const [lastScrollY, setLastScrollY] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       setLastScrollY(scrollY);
//       setScrollY(window.scrollY);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [scrollY]);
//   return (
//     <section className="relative  py-20 px-4 md:px-32 ">
//       <div className="">
//         <div className="text-center mb-16">
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
//             Our Projects
//           </h2>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Showcasing our finest work and innovative solutions
//           </p>
//         </div>

//         <div className="space-y-16 md:space-y-24">
//           {projects.map((project, index) => (
//             <ProjectCard
//               key={project.id}
//               project={project}
//               index={index}
//               scrollDirection={scrollY > lastScrollY ? "down" : "up"}
//             />
//           ))}
//         </div>

//         {/* <div className="mt-16 relative">
//           <Link to="/projects" className="group block relative overflow-hidden">
//             <div className="relative bg-gradient-to-r from-[#12a89d] to-[#0d8579] py-6 px-8 rounded-2xl flex items-center justify-center">
//               <div className="chevron-container absolute inset-0 opacity-10">
//                 <div className="chevron chevron-1"></div>
//                 <div className="chevron chevron-2"></div>
//                 <div className="chevron chevron-3"></div>
//                 <div className="chevron chevron-4"></div>
//                 <div className="chevron chevron-5"></div>
//               </div>

//               <div className="relative z-10 flex items-center gap-4">
//                 <span className="text-white text-2xl font-bold">
//                   Explore All Projects
//                 </span>
//                 <div className="arrow-wrapper flex items-center gap-2 overflow-hidden">
//                   <span className="arrow-slide text-white text-2xl font-bold opacity-0 transform -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
//                     →
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </Link>
//         </div> */}
//       </div>
//     </section>
//   );
};

export default Projects;
