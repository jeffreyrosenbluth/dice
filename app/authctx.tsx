"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

// Hardcoded configuration values - EDIT THESE TO CHANGE GAME SETTINGS
const CONFIG = {
  coinGameEnabled: true,
  coinGameMinFlips: 5,
  coinGameMaxFlips: 300,
  coinGameBias: 0.6,
  coinGameMinutes: 15,
  coinSimEnabled: true,
  coinSimMaxSamples: 100000,
  coinSimMaxFlips: 300,
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
  coinGameUseTimer: boolean;
  setCoinGameUseTimer: (value: boolean) => void;
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
  coinGameUseTimer: true,
  setCoinGameUseTimer: () => {},
  loading: false,
});

// Helper function to load initial state from localStorage
const getInitialState = (key: string, defaultValue: boolean): boolean => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Helper function to load initial number from localStorage
const getInitialNumber = (
  key: string,
  defaultValue: number | null
): number | null => {
  if (typeof window === "undefined") return defaultValue;
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [coinComplete, setCoinCompleteState] = useState(false);
  const [diceComplete, setDiceCompleteState] = useState(false);
  const [calibrationComplete, setCalibrationCompleteState] = useState(false);
  const [coinFinalBalance, setCoinFinalBalanceState] = useState<number | null>(
    null
  );
  const [coinGameUseTimer, setCoinGameUseTimerState] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    const savedCoinComplete = getInitialState("coinComplete", false);
    const savedDiceComplete = getInitialState("diceComplete", false);
    const savedCalibrationComplete = getInitialState(
      "calibrationComplete",
      false
    );
    const savedCoinFinalBalance = getInitialNumber("coinFinalBalance", null);
    const savedCoinGameUseTimer = getInitialState("coinGameUseTimer", true);

    setCoinCompleteState(savedCoinComplete);
    setDiceCompleteState(savedDiceComplete);
    setCalibrationCompleteState(savedCalibrationComplete);
    setCoinFinalBalanceState(savedCoinFinalBalance);
    setCoinGameUseTimerState(savedCoinGameUseTimer);
    setIsHydrated(true);
  }, []);

  // Wrapper functions to save to localStorage when state changes
  const setCoinComplete = (value: boolean) => {
    setCoinCompleteState(value);
    if (isHydrated) {
      localStorage.setItem("coinComplete", JSON.stringify(value));
    }
  };

  const setDiceComplete = (value: boolean) => {
    setDiceCompleteState(value);
    if (isHydrated) {
      localStorage.setItem("diceComplete", JSON.stringify(value));
    }
  };

  const setCalibrationComplete = (value: boolean) => {
    setCalibrationCompleteState(value);
    if (isHydrated) {
      localStorage.setItem("calibrationComplete", JSON.stringify(value));
    }
  };

  const setCoinFinalBalance = (value: number) => {
    setCoinFinalBalanceState(value);
    if (isHydrated) {
      localStorage.setItem("coinFinalBalance", JSON.stringify(value));
    }
  };

  const setCoinGameUseTimer = (value: boolean) => {
    setCoinGameUseTimerState(value);
    if (isHydrated) {
      localStorage.setItem("coinGameUseTimer", JSON.stringify(value));
    }
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
        coinGameUseTimer,
        setCoinGameUseTimer,
        loading: false,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useAuth = () => useContext(ConfigContext);
