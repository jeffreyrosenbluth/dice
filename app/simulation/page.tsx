"use client";

import WealthPlot from "@/app/ui/wealthplot";
import ReturnPlot from "@/app/ui/returnplot";
import Button from "@/app/ui/button";
import Toggle from "@/app/ui/toggle";
import Card from "@/app/ui/card"; // Update the import statement to match the actual file name
import React, { useState } from "react";
import { Wealth, roll, outcomes, Weights, Return } from "@/app/lib/calc";
import * as d3 from "d3";

const initialWealth = [
  { roll_num: 0, green: 100, red: 100, white: 100, pink: 100 },
];

const initialReturns = [{ green: 1, red: 1, white: 1, pink: 1 }];

export default function Home() {
  const weights: Weights = { green: 0.0, red: 0.5, white: 0.5 };
  const [wealth, setWealth] = useState<Wealth[]>(initialWealth.slice());
  const [returns, setReturns] = useState<Return[]>(initialReturns.slice());
  const [isToggled, setIsToggled] = useState(false);

  const addRoll = () => {
    const [w, r] = roll(outcomes, weights, wealth);
    setWealth((wealth) => [...wealth, w]);
    setReturns((returns) => [...returns, r]);
  };

  const reset = () => {
    setWealth(initialWealth.slice());
    setReturns(initialReturns.slice());
  };

  const handlePink = (checked: boolean) => {
    setIsToggled(checked);
    // Perform any additional actions based on the toggle state
  };

  return (
    <main className="flex min-h-screen flex-col items-center space-y-24 mt-24">
      <div className="relative text-4xl">
        Investment Risk and Return Simulation 🎲
      </div>
      <div>
        <WealthPlot wealth={wealth} pink={isToggled} />
      </div>
      <div className="grid gap-8 grid-cols-3">
        <Button onClick={addRoll}>Roll</Button>
        <Button onClick={reset}>Reset</Button>
        <Toggle label="Show Pink" checked={isToggled} onChange={handlePink} />
      </div>
      <div className="grid gap-8 grid-cols-3">
        <Card className="text-emerald-400">
          <p>
            Last Return:
            {d3.format("10.0%")(returns[returns.length - 1].green - 1)}
          </p>
          <p>Wealth: {d3.format("$,.0f")(wealth[wealth.length - 1].green)} </p>
          <p>
            Annual Return:{" "}
            {d3.format("10.0%")(
              annualize(wealth[wealth.length - 1].green, wealth.length - 1)
            )}
          </p>
        </Card>
        <Card className="text-rose-500">
          <p>
            Last Return:
            {d3.format("10.0%")(returns[returns.length - 1].red - 1)}
          </p>
          <p>Wealth: {d3.format("$,.0f")(wealth[wealth.length - 1].red)} </p>
          <p>
            Annual Return:{" "}
            {d3.format("10.0%")(
              annualize(wealth[wealth.length - 1].red, wealth.length - 1)
            )}
          </p>
        </Card>
        <Card className="text-white">
          <p>
            Last Return:
            {d3.format("10.0%")(returns[returns.length - 1].white - 1)}
          </p>
          <p>Wealth: {d3.format("$,.0f")(wealth[wealth.length - 1].white)} </p>
          <p>
            Annual Return:{" "}
            {d3.format("10.0%")(
              annualize(wealth[wealth.length - 1].white, wealth.length - 1)
            )}
          </p>
        </Card>
      </div>
      <div>
        <ReturnPlot returns={returns} pink={isToggled} />
      </div>
    </main>
  );
}

function annualize(wealth: number, years: number): number {
  return years > 0 ? (wealth / 100) ** (1 / years) - 1 : 0;
}
