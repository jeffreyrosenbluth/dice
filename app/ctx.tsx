"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Assets, AssetFrame } from "@/app/lib/market";
import { Flip, Profit, Face } from "@/app/lib/coin";

export const initialFlips: Flip[] = [
  {
    flip_num: 0,
    value: 100,
    value10: 100,
    value20: 100,
    kelly: 100,
    betOn: "heads",
    betSize: 0,
    coinResult: "heads",
  },
];

type Model = {
  diceWealths: Assets[];
  diceReturns: Assets[];
  includePortfolio: boolean;
  dicePlaySliders: { [key: string]: number };
  diceSimSliders: { [key: string]: number };
  diceAvgReturns: { stock: number; crypto: number; portfolio: number };
  diceStandardDeviations: { stock: number; crypto: number; portfolio: number };
  diceSim: AssetFrame;
  diceSimBoxes: string[];
  coinSimSliders: { [key: string]: number };
  coinSimBoxes: string[];
  coinPlayFlips: Flip[];
  coinPlayBet: number;
  coinPlayHT: Face;
  coinPlayFlipResult: number;
  coinSim: Profit[];
  coinAvgReturns: { player: number; constant: number; kelly: number };
  coinMedianReturns: { player: number; constant: number; kelly: number };
  coinStandardDeviations: { player: number; constant: number; kelly: number };
  trackFlipResult1: Face;
  trackFlipResult2: Face;
  trackFlipFaces1: Face[];
  trackFlipFaces2: Face[];
  trackBias: number;
};

interface StateContextProps {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);
const trackCoin1 = Math.random() < 0.5;

export const initialModel: Model = {
  diceWealths: [{ stock: 100, crypto: 100, cash: 100, portfolio: 100 }],
  diceReturns: [{ stock: 0, crypto: 0, cash: 0, portfolio: 0 }],
  includePortfolio: false,
  dicePlaySliders: { stockSlider: 0, cryptoSlider: 0.5 },
  diceSimSliders: {
    yearsSlider: 20,
    samplesSlider: 10000,
    stockSlider: 0,
    cryptoSlider: 0.5,
  },
  diceAvgReturns: { stock: 0, crypto: 0, portfolio: 0 },
  diceStandardDeviations: { stock: 0, crypto: 0, portfolio: 0 },
  diceSim: [],
  diceSimBoxes: ["stock", "crypto", "portfolio"],
  coinSimSliders: {
    yearsSlider: 20,
    samplesSlider: 10000,
    biasSlider: 0.6,
    betSlider: 0.1,
  },
  coinPlayFlips: initialFlips,
  coinPlayBet: 0,
  coinPlayHT: "heads",
  coinPlayFlipResult: 0,
  coinSim: [],
  coinAvgReturns: { player: 0, constant: 0, kelly: 0 },
  coinMedianReturns: { player: 0, constant: 0, kelly: 0 },
  coinStandardDeviations: { player: 0, constant: 0, kelly: 0 },
  coinSimBoxes: ["player", "kelly"],
  trackFlipResult1: "heads",
  trackFlipResult2: "heads",
  trackFlipFaces1: [],
  trackFlipFaces2: [],
  trackBias: 0.6,
};

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [model, setModel] = useState<Model>(initialModel);
  return (
    <StateContext.Provider value={{ model, setModel }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a StateProvider");
  }
  return context;
};
