import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: "fumble",
    role: "gamified ai social platform",
    description: "real-time event-driven social platform serving 2k+ users.",
    tags: ["next.js", "typescript", "mongodb", "redis", "socket.io"],
    links: { github: "#", live: "#" },
    image: "https://placehold.co/600x400/1a1a1a/666666?text=fumble"
  },
  {
    title: "galatea",
    role: "democratizing water quality monitoring",
    description: "dual-model architecture to impute sparse spatiotemporal data and predict biochemical oxygen demand 50x cheaper than sota sensors.",
    tags: ["pytorch", "scikit-learn"],
    links: { github: "#", live: "#" },
    image: "https://placehold.co/600x400/1a1a1a/666666?text=galatea"
  },
  {
    title: "ivry",
    role: "unified trading terminal",
    description: "high-frequency arbitrage engine and unified trading terminal aggregating liquidity across regulated and defi markets with <10µs latency.",
    tags: ["c++", "next.js", "fastapi", "supabase"],
    links: { github: "#", live: "#" },
    image: "https://placehold.co/600x400/1a1a1a/666666?text=ivry"
  },
  {
    title: "blindspot",
    role: "real-time safety app",
    description: "detecting emergencies via multimodal ai analysis with <500ms latency and automated context-aware 911 dispatch.",
    tags: ["react native", "next.js", "supabase"],
    links: { github: "#", live: "#" },
    image: "https://placehold.co/600x400/1a1a1a/666666?text=blindspot"
  }
];

const Projects = () => {
  return (
    <section id="projects" className="scroll-mt-24 mb-32">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-base font-mono text-neutral-500 mb-16 uppercase tracking-widest"
      >
        cool projects
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col h-full"
          >
            {/* Minimal Image Container */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800 mb-6 group-hover:border-neutral-600 transition-colors">
              <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors z-10" />
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out grayscale group-hover:grayscale-0"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-medium text-neutral-100 group-hover:text-white transition-colors lowercase">
                  {project.title}
                </h3>
                <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a href={project.links.github} className="text-neutral-500 hover:text-white transition-colors" aria-label="GitHub">
                    <Github size={20} />
                  </a>
                  <a href={project.links.live} className="text-neutral-500 hover:text-white transition-colors" aria-label="Live Demo">
                    <ArrowUpRight size={20} />
                  </a>
                </div>
              </div>

              <p className="text-purple-300 text-sm font-medium mb-3 lowercase">{project.role}</p>

              <p className="text-neutral-400 text-lg leading-relaxed mb-6 lowercase">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-auto">
                {project.tags.map(tag => (
                  <span key={tag} className="text-sm font-mono text-neutral-500 lowercase">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
