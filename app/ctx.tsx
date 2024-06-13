"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Wealth, Return } from "@/app/lib/core";

interface Model {
  wealths: Wealth[];
  returns: Return[];
  violet: boolean;
  sliderValues: { [key: string]: number };
}

interface StateContextProps {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [model, setModel] = useState<Model>({
    wealths: [{ roll_num: 0, green: 100, red: 100, white: 100, violet: 100 }],
    returns: [{ green: 1, red: 1, white: 1, violet: 1 }],
    violet: false,
    sliderValues: { greenSlider: 0, redSlider: 0.5 },
  });

  return (
    <StateContext.Provider value={{ model, setModel }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
