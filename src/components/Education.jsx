import { motion } from 'framer-motion';

const Education = () => {
  return (
    <section id="education" className="scroll-mt-24 mb-32">
      <motion.h2 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-base font-mono text-neutral-500 mb-16 uppercase tracking-widest"
      >
        Education
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col md:flex-row justify-between items-start md:items-start border-b border-neutral-800 pb-12"
      >
        <div>
          <h3 className="text-3xl font-medium text-neutral-100 mb-2">Johns Hopkins University</h3>
          <p className="text-xl text-neutral-400">Bachelor’s of Science in Computer Science</p>
          <p className="text-lg text-purple-300 mt-2">Hodson Scholar (~0.05% Acceptance; Merit Scholarship)</p>
          <p className="text-lg text-neutral-400 mt-6 max-w-2xl leading-relaxed">
            <span className="font-mono text-sm uppercase tracking-wider text-neutral-500 mr-3">Coursework</span>
            Data Structures, Probability, C/C++ on Linux, Linear Algebra, Discrete Math, Calculus III
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <p className="text-neutral-500 font-mono text-lg">Expected May 2028</p>
        </div>
      </motion.div>
    </section>
  );
};

export default Education;
