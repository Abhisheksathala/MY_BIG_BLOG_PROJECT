import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const AnimationWarper = ({
  children,
  keyValue,
  className = '',
  initial = { opacity: 0, scale: 0.95, y: 30 },
  animate = { opacity: 1, scale: 1, y: 0 },
  exit = { opacity: 0, scale: 0.95, y: -20 },
  transition = { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyValue}
        initial={initial}
        animate={animate}
        exit={exit}
        transition={transition}
        className={`px-6 ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWarper;
