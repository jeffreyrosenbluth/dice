// components/Slider.tsx
import React, { useState } from "react";
import { useStateContext } from "@/app/ctx";
import clsx from "clsx";

interface SliderProps {
  identifier: string;
  min: number;
  max: number;
  step: number;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  identifier,
  min,
  max,
  step,
  className,
}) => {
  const { model, setModel } = useStateContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    model.setSliderValue(identifier, Number(event.target.value));
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={model.sliderValues[identifier]}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      <span className={clsx("mt-2 text-sm font-medium", className)}>
        {model.sliderValues[identifier]}
      </span>
    </div>
  );
};

export default Slider;
