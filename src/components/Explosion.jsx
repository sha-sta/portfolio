import { motion, AnimatePresence } from 'framer-motion';

const Explosion = ({ active }) => {
  return (
    <AnimatePresence>
      {active && (
        <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none z-50 overflow-visible">
          {/* Core flash */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-12 h-12 bg-white rounded-full blur-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
          
          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ x: 0, y: 0, scale: 0 }}
              animate={{ 
                x: Math.cos(i * 60 * (Math.PI / 180)) * 40,
                y: Math.sin(i * 60 * (Math.PI / 180)) * 40,
                scale: [1, 0],
                opacity: [1, 0]
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-purple-300 rounded-full"
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default Explosion;
