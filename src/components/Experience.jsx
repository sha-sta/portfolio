import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const experiences = [
  {
    company: "Iris Finance",
    role: "software engineer intern",
    period: "dec 2025 - present",
    location: "remote",
    description: "developed the initial data processing layer for dashboard-building pipelines, semantically interpreting and standardizing unstructured client inputs into enriched schemas for downstream llm agents.",
    logo: "/iris-logo.png",
    link: "https://www.irisfinance.co/"
  },
  {
    company: "HopHacks",
    role: "full-stack engineer",
    period: "dec 2025 - present",
    location: "baltimore, md",
    description: "building the official platform for jhu's premier hackathon, migrating legacy ui to tailwind css, and containerizing infrastructure with docker for improved deployment reliability.",
    logo: "/hophacks-logo.png",
    link: "https://hophacks.com"
  },
  {
    company: "National Institute of Standards and Technology",
    role: "data science intern",
    period: "2023 - 2025",
    location: "gaithersburg, md",
    description: "developed end-to-end preprocessing pipelines for nanoscale x-ray scattering data. discovered novel molecular fluctuation mechanisms linked to ballistic resistance.",
    logo: "/nist-logo.png",
    link: "https://www.nist.gov"
  }
];

const Experience = () => {
  return (
    <section id="experience" className="scroll mb-64 pt-24">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-medium mb-16"
      >
        work.
      </motion.h2>

      <div className="space-y-20">
        {experiences.map((exp, index) => (
          <motion.a
            key={index}
            href={exp.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex gap-8 items-center cursor-pointer hover:translate-x-2 hover:scale-[1.02] transition-all duration-300 ease-out"
          >
            <div className={`hidden md:flex shrink-0 w-24 h-24 items-center justify-center ${exp.company === "National Institute of Standards and Technology" ? "-mt-4" : ""}`}>
              <img
                src={exp.logo}
                alt={`${exp.company} logo`}
                className={`w-full h-full object-contain transition-all duration-300 opacity-60 group-hover:opacity-100 ${exp.company === "National Institute of Standards and Technology"
                  ? "brightness-0 invert"
                  : "filter-[brightness(0.9)_contrast(0.8)_saturate(0.1)_sepia(0.2)] group-hover:filter-none"
                  }`}
              />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-medium text-neutral-100 group-hover:text-white transition-colors">
                    {exp.company}
                  </h3>
                </div>
                <span className="md:text-lg text-md font-medium text-neutral-400">{exp.period}</span>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="text-purple-300 text-md md:text-lg font-medium">{exp.role}</div>
                <span className="text-md md:text-lg text-neutral-400 hidden sm:block">{exp.location}</span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
};

export default Experience;
