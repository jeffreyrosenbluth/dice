"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

// Hardcoded configuration values - EDIT THESE TO CHANGE GAME SETTINGS
const CONFIG = {
  coinGameEnabled: true,
  coinGameMinFlips: 20,
  coinGameMaxFlips: 300,
  coinGameBias: 0.6,
  coinGameMinutes: 15,
  coinSimEnabled: true,
  coinSimMaxSamples: 100000,
  coinSimMaxFlips: 100,
  diceGameEnabled: true,
  diceGameRolls: 100,
  diceSimEnabled: true,
  diceSimMaxSamples: 100000,
};

type ConfigContextType = {
  coinComplete: boolean;
  setCoinComplete: (value: boolean) => void;
  diceComplete: boolean;
  setDiceComplete: (value: boolean) => void;
  coinGameEnabled: boolean;
  coinGameMinFlips: number;
  coinGameMaxFlips: number;
  coinGameBias: number;
  coinGameMinutes: number;
  coinSimEnabled: boolean;
  coinSimMaxSamples: number;
  coinSimMaxFlips: number;
  diceGameEnabled: boolean;
  diceGameRolls: number;
  diceSimEnabled: boolean;
  diceSimMaxSamples: number;
  calibrationComplete: boolean;
  setCalibrationComplete: (value: boolean) => void;
  coinFinalBalance: number | null;
  setCoinFinalBalance: (value: number) => void;
  loading: boolean;
};

const ConfigContext = createContext<ConfigContextType>({
  coinComplete: false,
  setCoinComplete: () => {},
  diceComplete: false,
  setDiceComplete: () => {},
  coinGameEnabled: CONFIG.coinGameEnabled,
  coinGameMinFlips: CONFIG.coinGameMinFlips,
  coinGameMaxFlips: CONFIG.coinGameMaxFlips,
  coinGameBias: CONFIG.coinGameBias,
  coinGameMinutes: CONFIG.coinGameMinutes,
  coinSimEnabled: CONFIG.coinSimEnabled,
  coinSimMaxSamples: CONFIG.coinSimMaxSamples,
  coinSimMaxFlips: CONFIG.coinSimMaxFlips,
  diceGameEnabled: CONFIG.diceGameEnabled,
  diceGameRolls: CONFIG.diceGameRolls,
  diceSimEnabled: CONFIG.diceSimEnabled,
  diceSimMaxSamples: CONFIG.diceSimMaxSamples,
  calibrationComplete: false,
  setCalibrationComplete: () => {},
  coinFinalBalance: null,
  setCoinFinalBalance: () => {},
  loading: false,
});

// Helper function to load initial state from localStorage
const getInitialState = (key: string, defaultValue: boolean): boolean => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper function to load initial number from localStorage
const getInitialNumber = (key: string, defaultValue: number | null): number | null => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [coinComplete, setCoinCompleteState] = useState(() =>
    getInitialState("coinComplete", false)
  );
  const [diceComplete, setDiceCompleteState] = useState(() =>
    getInitialState("diceComplete", false)
  );
  const [calibrationComplete, setCalibrationCompleteState] = useState(() =>
    getInitialState("calibrationComplete", false)
  );
  const [coinFinalBalance, setCoinFinalBalanceState] = useState<number | null>(() =>
    getInitialNumber("coinFinalBalance", null)
  );

  // Wrapper functions to save to localStorage when state changes
  const setCoinComplete = (value: boolean) => {
    setCoinCompleteState(value);
    localStorage.setItem("coinComplete", JSON.stringify(value));
  };

  const setDiceComplete = (value: boolean) => {
    setDiceCompleteState(value);
    localStorage.setItem("diceComplete", JSON.stringify(value));
  };

  const setCalibrationComplete = (value: boolean) => {
    setCalibrationCompleteState(value);
    localStorage.setItem("calibrationComplete", JSON.stringify(value));
  };

  const setCoinFinalBalance = (value: number) => {
    setCoinFinalBalanceState(value);
    localStorage.setItem("coinFinalBalance", JSON.stringify(value));
  };

  return (
    <ConfigContext.Provider
      value={{
        coinComplete,
        setCoinComplete,
        diceComplete,
        setDiceComplete,
        coinGameEnabled: CONFIG.coinGameEnabled,
        coinGameMinFlips: CONFIG.coinGameMinFlips,
        coinGameMaxFlips: CONFIG.coinGameMaxFlips,
        coinGameBias: CONFIG.coinGameBias,
        coinGameMinutes: CONFIG.coinGameMinutes,
        coinSimEnabled: CONFIG.coinSimEnabled,
        coinSimMaxFlips: CONFIG.coinSimMaxFlips,
        coinSimMaxSamples: CONFIG.coinSimMaxSamples,
        diceGameEnabled: CONFIG.diceGameEnabled,
        diceGameRolls: CONFIG.diceGameRolls,
        diceSimEnabled: CONFIG.diceSimEnabled,
        diceSimMaxSamples: CONFIG.diceSimMaxSamples,
        calibrationComplete,
        setCalibrationComplete,
        coinFinalBalance,
        setCoinFinalBalance,
        loading: false,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useAuth = () => useContext(ConfigContext);
