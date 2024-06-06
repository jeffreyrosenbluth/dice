// components/Slider.tsx
import React, { useState } from "react";
import clsx from "clsx";

interface SliderProps {
  min: number;
  max: number;
  step: number;
  initial: number;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  step,
  initial,
  className,
}) => {
  const [value, setValue] = useState(initial);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(Number(event.target.value));
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      <span className={clsx("mt-2 text-sm font-medium", className)}>
        {value}
      </span>
    </div>
  );
};

export default Slider;
