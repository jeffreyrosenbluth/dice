"use client";

import WealthPlot from "@/app/ui/wealthplot";
import ReturnPlot from "@/app/ui/returnplot";
import Button from "@/app/ui/button";
import Toggle from "@/app/ui/toggle";
import Card from "@/app/ui/card";
import React, { useState } from "react";
import { Wealth, roll, outcomes, Weights, Return } from "@/app/lib/core";
import * as d3 from "d3";
import Navbar from "@/app/ui/navbar";
import { useStateContext } from "@/app/ctx";

const initialWealth = [
  { roll_num: 0, green: 100, red: 100, white: 100, pink: 100 },
];

const initialReturns = [{ green: 1, red: 1, white: 1, pink: 1 }];

export default function Home() {
  const { model, setModel } = useStateContext();
  const weights: Weights = { green: 0.0, red: 0.5, white: 0.5 };

  const addRoll = () => {
    const [w, r] = roll(outcomes, weights, model.wealths);
    setModel({
      wealths: [...model.wealths, w],
      returns: [...model.returns, r],
      pink: model.pink,
    });
  };

  const reset = () => {
    setModel({
      wealths: initialWealth,
      returns: initialReturns,
      pink: model.pink,
    });
  };

  const handlePink = (checked: boolean) => {
    setModel({ ...model, pink: checked });
  };

  return (
    <main className="flex min-h-screen flex-col items-center space-y-24 mt-12">
      <div className="text-4xl">Investment Risk and Return Simulation 🎲</div>
      <div className="grid gap-8 grid-cols-8">
        <div className="flex flex-col gap-8">
          <Button onClick={addRoll}>Roll</Button>
          <Button onClick={reset}>Reset</Button>
          <Toggle
            label="Show Pink"
            checked={model.pink}
            onChange={handlePink}
          />
        </div>
        <div className="col-span-5 ml-16 flex flex-col gap-12">
          <WealthPlot wealth={model.wealths} pink={model.pink} />
          <ReturnPlot returns={model.returns} pink={model.pink} />
        </div>
        <div className="col-span-2  flex  flex-col gap-8">
          <Card className="text-emerald-400 bg-inherit">
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.returns[model.returns.length - 1].green - 1
              )}
            </p>
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(
                model.wealths[model.wealths.length - 1].green
              )}{" "}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.wealths[model.wealths.length - 1].green,
                  model.wealths.length - 1
                )
              )}
            </p>
          </Card>
          <Card className="text-rose-500 bg-inherit">
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.returns[model.returns.length - 1].red - 1
              )}
            </p>
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(model.wealths[model.wealths.length - 1].red)}{" "}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.wealths[model.wealths.length - 1].red,
                  model.wealths.length - 1
                )
              )}
            </p>
          </Card>
          <Card className="text-white bg-inherit">
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.returns[model.returns.length - 1].white - 1
              )}
            </p>
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(
                model.wealths[model.wealths.length - 1].white
              )}{" "}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.wealths[model.wealths.length - 1].white,
                  model.wealths.length - 1
                )
              )}
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}

function annualize(wealth: number, years: number): number {
  return years > 0 ? (wealth / 100) ** (1 / years) - 1 : 0;
}
