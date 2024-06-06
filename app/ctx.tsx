"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Wealth, Return } from "@/app/lib/calc";

interface Model {
  wealths: Wealth[];
  returns: Return[];
  pink: boolean;
}

interface StateContextProps {
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model>>;
}

const StateContext = createContext<StateContextProps | undefined>(undefined);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [model, setModel] = useState<Model>({
    wealths: [{ roll_num: 0, green: 100, red: 100, white: 100, pink: 100 }],
    returns: [{ green: 1, red: 1, white: 1, pink: 1 }],
    pink: false,
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
