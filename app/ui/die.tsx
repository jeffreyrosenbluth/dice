import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";

interface DieProps {
  isRolling: boolean;
  onAnimationComplete: () => void;
}

const Die: React.FC<DieProps> = ({ isRolling, onAnimationComplete }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isRolling) {
      controls.start({
        rotate: 360,
        transition: { duration: 0.75, ease: "linear" },
      });
    } else {
      controls.set({ rotate: 0 });
    }
  }, [isRolling, controls]);

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <motion.div
        className="text-8xl mb-4"
        animate={controls}
        onAnimationComplete={onAnimationComplete}
        style={{ transformStyle: "preserve-3d" }}
      >
        🎲
      </motion.div>
    </div>
  );
};

export default Die;
