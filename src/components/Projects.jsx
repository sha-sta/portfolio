import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: "Fumble",
    role: "gamified ai social platform",
    description: "architected a real-time event-driven social platform serving 2k+ users with sub-100ms latency via websockets and redis pub/sub.",
    tags: ["next.js", "mongodb", "redis", "socket.io"],
    links: { live: "https://www.fumble.chat/" },
    image: "/fumble-logo.png"
  },
  {
    title: "GALATEA",
    role: "dual graph model for water quality prediction",
    description: "designed a dual-model architecture (graph-based matrix factorization + gnn) to impute missing spatiotemporal data with state-of-the-art accuracy.",
    tags: ["pytorch", "scikit-learn"],
    links: { github: "https://github.com/sha-sta/GALATEA" },
    image: "/galatea-image.png"
  },
  {
    title: "Ivry",
    role: "unified prediction market trading terminal",
    description: "high-frequency arbitrage engine and unified trading terminal aggregating liquidity across regulated and defi markets with <10µs latency.",
    tags: ["c++", "next.js", "fastapi", "supabase"],
    links: { github: "#", live: "#" },
    image: "ivry-logo.png"
  },
  // {
  //   title: "BlindSpot",
  //   role: "real-time safety app for the visually impaired",
  //   description: "detecting emergencies via multimodal ai analysis with <500ms latency and automated context-aware 911 dispatch.",
  //   tags: ["react native", "next.js", "supabase"],
  //   links: { github: "#", live: "#" },
  //   image: ""
  // }
];

const Projects = () => {
  return (
    <section id="projects" className="scroll-mt-24 mb-64">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-medium mb-16"
      >
        projects.
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 md:gap-16">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col h-full cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col h-full"
            >
              {/* Minimal Image Container */}
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-transparent mb-6 transition-colors p-4">
                <div className="absolute inset-0 bg-transparent z-10" />
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-medium text-neutral-100 group-hover:text-white transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {project.links.github && (
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors" aria-label="GitHub">
                        <Github size={20} />
                      </a>
                    )}
                    {project.links.live && (
                      <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-white transition-colors" aria-label="Live Demo">
                        <ArrowUpRight size={20} />
                      </a>
                    )}
                  </div>
                </div>

                <p className="text-purple-300 text-md md:text-lg font-medium mb-3 lowercase">{project.role}</p>

                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-auto">
                  {project.tags.map(tag => (
                    <span key={tag} className="md:text-lg text-md font-medium text-neutral-400 lowercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
