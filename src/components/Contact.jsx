import { motion } from 'framer-motion';
import { Mail, Linkedin, Github } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="scroll-mt-24 mb-24 pt-12 border-t border-neutral-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h2 className="text-4xl font-bold mb-4 text-white">Get in touch</h2>
          <p className="text-xl text-neutral-500">
            Open for new opportunities.
          </p>
        </div>

        <div className="flex gap-8">
          <a 
            href="mailto:chris@example.com" 
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="Email"
          >
            <Mail size={28} />
          </a>
          <a 
            href="#" 
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github size={28} />
          </a>
          <a 
            href="#" 
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={28} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
