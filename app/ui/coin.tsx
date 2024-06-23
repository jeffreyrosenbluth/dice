import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CoinProps {
  isFlipping: boolean;
  result: number;
  onAnimationComplete: () => void;
}

const Coin: React.FC<CoinProps> = ({
  isFlipping,
  result,
  onAnimationComplete,
}) => {
  const [hasFlipped, setHasFlipped] = useState(false);

  useEffect(() => {
    if (isFlipping) {
      setHasFlipped(true);
    }
  }, [isFlipping]);

  // 0 means tails (180 degrees) and 1 means heads (0 degrees)
  const finalRotation = hasFlipped ? (result === 0 ? 180 : 0) : 0;
  // When flipping, rotate 720 degrees (two full rotations) plus the final rotation
  const rotation = isFlipping ? 720 + finalRotation : finalRotation;

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <motion.div
        className="w-24 h-24 relative"
        animate={{ rotateY: rotation }}
        initial={{ rotateY: 0 }}
        transition={{ duration: isFlipping ? 0.75 : 0, ease: "linear" }}
        onAnimationComplete={isFlipping ? onAnimationComplete : undefined}
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.img
          src="/heads.png"
          alt="Heads"
          className="absolute w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        />
        <motion.img
          src="/tails.png"
          alt="Tails"
          className="absolute w-full h-full"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        />
      </motion.div>
    </div>
  );
};

export default Coin;
