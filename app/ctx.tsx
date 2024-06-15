"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Assets } from "@/app/lib/market";

interface Model {
  wealths: Assets[];
  returns: Assets[];
  includePortfolio: boolean;
  sliderValues: { [key: string]: number };
}

interface StateContextProps {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [model, setModel] = useState<Model>({
    wealths: [{ stock: 100, venture: 100, cash: 100, portfolio: 100 }],
    returns: [{ stock: 0, venture: 0, cash: 0, portfolio: 0 }],
    includePortfolio: false,
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
