"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Assets, AssetFrame } from "@/app/lib/market";

type Model = {
  diceWealths: Assets[];
  diceReturns: Assets[];
  includePortfolio: boolean;
  dicePlaySliders: { [key: string]: number };
  diceSimSliders: { [key: string]: number };
  diceAvgReturns: { stock: number; venture: number; portfolio: number };
  diceSim: AssetFrame;
  coinSimSliders: { [key: string]: number };
};

interface StateContextProps {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [model, setModel] = useState<Model>({
    diceWealths: [{ stock: 100, venture: 100, cash: 100, portfolio: 100 }],
    diceReturns: [{ stock: 0, venture: 0, cash: 0, portfolio: 0 }],
    includePortfolio: false,
    dicePlaySliders: { stockSlider: 0, ventureSlider: 0.5 },
    diceSimSliders: {
      yearsSlider: 20,
      samplesSlider: 1000,
      stockSlider: 0,
      ventureSlider: 0.5,
    },
    diceAvgReturns: { stock: 0, venture: 0, portfolio: 0 },
    diceSim: [],
    coinSimSliders: {
      yearsSlider: 20,
      samplesSlider: 1000,
      biasSlider: 0.6,
      betSlider: 0.15,
    },
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
