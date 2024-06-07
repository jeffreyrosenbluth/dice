"use client";

import WealthPlot from "@/app/ui/wealthplot";
import ReturnPlot from "@/app/ui/returnplot";
import Button from "@/app/ui/button";
import Toggle from "@/app/ui/toggle";
import Card from "@/app/ui/card";
import Slider from "@/app/ui/slider";
import React, { useState } from "react";
import { Wealth, roll, outcomes, Weights, Return } from "@/app/lib/core";
import * as d3 from "d3";
import Navbar from "@/app/ui/navbar";
import { useStateContext } from "@/app/ctx";

const initialWealth = [
  { roll_num: 0, green: 100, red: 100, white: 100, pink: 100 },
];

const initialReturns = [{ green: 1, red: 1, white: 1, pink: 1 }];
const initialSliderValues = { greenSlider: 0, redSlider: 50 };

export default function Home() {
  const { model, setModel } = useStateContext();

  const whitePercent =
    1 - (model.sliderValues.greenSlider + model.sliderValues.redSlider) / 100;

  const addRoll = () => {
    const [w, r] = roll(
      outcomes,
      {
        green: model.sliderValues.greenSlider / 100,
        red: model.sliderValues.redSlider / 100,
        white: whitePercent,
      },
      model.wealths
    );
    setModel({
      ...model,
      wealths: [...model.wealths, w],
      returns: [...model.returns, r],
    });
  };

  const reset = () => {
    setModel({
      ...model,
      wealths: initialWealth,
      returns: initialReturns,
      pink: model.pink,
      sliderValues: initialSliderValues,
    });
  };

  const handlePink = (checked: boolean) => {
    setModel({ ...model, pink: checked });
  };

  const avgReturns = average(model.returns.slice(1));

  return (
    <main className="flex min-h-screen flex-col items-center space-y-24 mt-12">
      <div className="text-4xl text-blue-300">
        Investment Risk and Return Simulation
      </div>
      <div className="grid gap-8 grid-cols-9 min-w-full">
        <div className="flex flex-col gap-4 col-span-2 px-8">
          <Button className="py-4 mb-2" onClick={addRoll}>
            Roll
          </Button>
          <Button className="py-4 mb-4" onClick={reset}>
            Reset
          </Button>
          <div className="border p-2 mb-6 border-dotted border-gray-400">
            <div className="text-1xl justify-center text-emerald-400 text-center py-4">
              Green %
            </div>
            <Slider
              className="text-emerald-500"
              identifier="greenSlider"
              min={0}
              max={100}
              step={1}
            />
            <div className="text-1xl justify-center text-rose-500 text-center py-4">
              Red %
            </div>
            <Slider
              className="text-rose-500"
              identifier="redSlider"
              min={0}
              max={100}
              step={1}
            />
            <div className="text-1xl justify-center text-white text-center pt-6">
              White %
            </div>
            <div className="text-sm justify-center text-white text-center py-2">
              {(100 * whitePercent).toFixed(0)}
            </div>
          </div>
          <Toggle
            label="Show Pink"
            checked={model.pink}
            onChange={handlePink}
          />
        </div>
        <div className="col-span-5 ml-12">
          {model.returns.length > 1 ? (
            <div className="flex flex-col gap-16">
              <WealthPlot wealth={model.wealths} pink={model.pink} />
              <ReturnPlot returns={model.returns} pink={model.pink} />{" "}
            </div>
          ) : (
            <div className="text-9xl flex justify-center mt-24 mr-24">🎲</div>
          )}
        </div>
        <div className="col-span-2  flex  flex-col gap-1">
          <Card className="text-emerald-400 bg-inherit">
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(
                model.wealths[model.wealths.length - 1].green
              )}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.returns[model.returns.length - 1].green - 1
              )}
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
            <p>Average Return: {d3.format("10.0%")(avgReturns.green - 1)}</p>
          </Card>
          <Card className="text-rose-500 bg-inherit">
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(model.wealths[model.wealths.length - 1].red)}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.returns[model.returns.length - 1].red - 1
              )}
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
            <p>Average Return: {d3.format("10.0%")(avgReturns.red - 1)}</p>
          </Card>
          <Card className="text-white bg-inherit">
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(
                model.wealths[model.wealths.length - 1].white
              )}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.returns[model.returns.length - 1].white - 1
              )}
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
            <p>Average Return: {d3.format("10.0%")(avgReturns.white - 1)}</p>
          </Card>
          <div>
            {model.pink && (
              <Card className="text-pink-400 bg-inherit">
                <p>
                  Wealth:{" "}
                  {d3.format("$,.0f")(
                    model.wealths[model.wealths.length - 1].pink
                  )}{" "}
                </p>
                <p>
                  Last Return:
                  {d3.format("10.0%")(
                    model.returns[model.returns.length - 1].pink - 1
                  )}
                </p>
                <p>
                  Annual Return:{" "}
                  {d3.format("10.0%")(
                    annualize(
                      model.wealths[model.wealths.length - 1].pink,
                      model.wealths.length - 1
                    )
                  )}
                </p>
                <p>Average Return: {d3.format("10.0%")(avgReturns.pink - 1)}</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function annualize(wealth: number, years: number): number {
  return years > 0 ? (wealth / 100) ** (1 / years) - 1 : 0;
}

function average(returns: Return[]): Return {
  if (returns.length === 0) {
    return { green: 1, red: 1, white: 1, pink: 1 };
  }
  const sum = returns.reduce(
    (acc, r) => {
      acc.green += r.green;
      acc.red += r.red;
      acc.white += r.white;
      acc.pink += r.pink;
      return acc;
    },
    { green: 0, red: 0, white: 0, pink: 0 }
  );

  return {
    green: sum.green / returns.length,
    red: sum.red / returns.length,
    white: sum.white / returns.length,
    pink: sum.pink / returns.length,
  };
}
