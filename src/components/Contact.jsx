import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, ArrowRight } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="scroll border-neutral-900">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-4xl font-bold text-white">hit me up.</h2>
        </div>

        <div className="text-neutral-500 hidden md:block">
          <h2 className="text-4xl font-bold text-white">-------&gt;</h2>
        </div>

        <div className="flex gap-8">
          <a
            href="mailto:cyoon16@jh.edu"
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="Email"
          >
            <Mail size={28} />
          </a>
          <a
            href="https://github.com/sha-sta"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github size={28} />
          </a>
          <a
            href="https://www.linkedin.com/in/christian-yoon/"
            target="_blank"
            rel="noopener noreferrer"
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
