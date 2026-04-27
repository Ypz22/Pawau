import type { ReactNode } from 'react';
import { motion } from 'motion/react';

const motionElements = {
  div: motion.div,
  section: motion.section,
} as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof typeof motionElements;
}

export default function Reveal({
  children,
  className = '',
  delay = 0,
  as = 'div',
}: RevealProps) {
  const MotionTag = motionElements[as];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </MotionTag>
  );
}
