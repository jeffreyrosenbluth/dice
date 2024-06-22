// components/Coin.tsx
import React from "react";
import { motion } from "framer-motion";

const Coin = ({
  isFlipping,
  result,
}: {
  isFlipping: boolean;
  result: string;
}) => {
  const rotation = result === "heads" ? 0 : 180;

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <motion.div
        className="w-24 h-24 relative"
        animate={{ rotateY: isFlipping ? [0, 540 + rotation] : rotation }}
        transition={{ duration: 1, ease: "linear" }}
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
