import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, ArrowRight } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="scroll border border-neutral-800 rounded-2xl p-8 md:p-12">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-medium text-white">hit me up.</h2>
        </div>

        <div className="text-neutral-500 hidden md:block">
          <h2 className="text-2xl md:text-3xl font-medium text-white">-------&gt;</h2>
        </div>

        <div className="flex gap-4">
          <a
            href="mailto:cyoon16@jh.edu"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-neutral-300 hover:text-neutral-950 hover:bg-white transition-all duration-200"
            aria-label="Email"
          >
            <Mail size={20} />
          </a>
          <a
            href="https://github.com/sha-sta"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-neutral-300 hover:text-neutral-950 hover:bg-white transition-all duration-200"
            aria-label="GitHub"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/christian-yoon/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm text-neutral-300 hover:text-neutral-950 hover:bg-white transition-all duration-200"
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
