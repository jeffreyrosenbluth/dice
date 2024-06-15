"use client";

import WealthPlot from "@/app/ui/wealthplot";
import ReturnPlot from "@/app/ui/returnplot";
import Toggle from "@/app/ui/toggle";
import Card from "@/app/ui/card";
import { Slider, Button } from "@nextui-org/react";
import React, { useState } from "react";
import { addRoll, Assets } from "@/app/lib/market";
import * as d3 from "d3";
import { useStateContext } from "@/app/ctx";
import { m } from "framer-motion";

const initialWealth = [{ stock: 100, venture: 100, cash: 100, portfolio: 100 }];

const initialReturns = [{ stock: 0, venture: 0, cash: 0, portfolio: 0 }];

export default function Home() {
  const { model, setModel } = useStateContext();

  const whitePercent =
    1 - (model.sliderValues.greenSlider + model.sliderValues.redSlider);

  const roll = () => {
    const [w, r] = addRoll(
      {
        stock: model.sliderValues.greenSlider,
        venture: model.sliderValues.redSlider,
        cash: whitePercent,
      },
      model.wealths,
      model.returns
    );

    setModel({
      ...model,
      wealths: w,
      returns: r,
    });
  };

  const reset = () => {
    setModel({
      ...model,
      wealths: initialWealth,
      returns: initialReturns,
      includePortfolio: model.includePortfolio,
    });
  };

  const handleGreenSlider = (value: number | number[]) => {
    setModel({
      ...model,
      sliderValues: { ...model.sliderValues, greenSlider: value as number },
    });
  };

  const handleRedSlider = (value: number | number[]) => {
    setModel({
      ...model,
      sliderValues: { ...model.sliderValues, redSlider: value as number },
    });
  };

  const handleViolet = (checked: boolean) => {
    setModel({ ...model, includePortfolio: checked });
  };

  const avgReturns = average(model.returns.slice(1));

  return (
    <main className="flex min-h-screen flex-col items-center space-y-24 mt-12">
      <div className="text-4xl text-blue-300">
        Investment Risk and Return Game
      </div>
      <div className="grid gap-8 grid-cols-9 min-w-full">
        <div className="flex flex-col gap-4 col-span-2 px-8">
          <Button className="py-4 mb-2" onClick={roll} color="primary">
            Roll
          </Button>
          <Button className="py-4 mb-4" onClick={reset} color="primary">
            Reset
          </Button>
          <div className="border p-2 mb-6 border-dotted border-gray-400">
            <Slider
              label="S&P 500"
              className="text-emerald-500 pb-4"
              minValue={0}
              maxValue={2}
              hideThumb={true}
              onChange={handleGreenSlider}
              step={0.01}
              defaultValue={0}
              formatOptions={{ style: "percent" }}
            />
            <Slider
              label="Venture Capital"
              className="text-rose-500 pb-6"
              minValue={0}
              maxValue={2}
              hideThumb={true}
              onChange={handleRedSlider}
              step={0.01}
              defaultValue={0.5}
              formatOptions={{ style: "percent" }}
            />
            <div className="flex text-sm justify-between text-white text-left">
              <div>Money Market</div>
              <div>{(100 * whitePercent).toFixed(0)}%</div>
            </div>
          </div>
          <Toggle
            label="Show Portfolio"
            checked={model.includePortfolio}
            onChange={handleViolet}
          />
        </div>
        <div className="col-span-5 ml-12">
          {model.returns.length > 1 ? (
            <div className="flex flex-col gap-16">
              <WealthPlot
                wealth={model.wealths}
                includePortfolio={model.includePortfolio}
              />
              <ReturnPlot
                returns={model.returns}
                includePortfolio={model.includePortfolio}
              />{" "}
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
                model.wealths[model.wealths.length - 1].stock
              )}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.returns[model.returns.length - 1].stock - 1
              )}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.wealths[model.wealths.length - 1].stock,
                  model.wealths.length - 1
                )
              )}
            </p>
            <p>Average Return: {d3.format("10.0%")(avgReturns.stock - 1)}</p>
          </Card>
          <Card className="text-rose-500 bg-inherit">
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(
                model.wealths[model.wealths.length - 1].venture
              )}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.returns[model.returns.length - 1].venture - 1
              )}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.wealths[model.wealths.length - 1].venture,
                  model.wealths.length - 1
                )
              )}
            </p>
            <p>Average Return: {d3.format("10.0%")(avgReturns.venture - 1)}</p>
          </Card>
          <Card className="text-white bg-inherit">
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(model.wealths[model.wealths.length - 1].cash)}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.returns[model.returns.length - 1].cash - 1
              )}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.wealths[model.wealths.length - 1].cash,
                  model.wealths.length - 1
                )
              )}
            </p>
            <p>Average Return: {d3.format("10.0%")(avgReturns.cash - 1)}</p>
          </Card>
          <div>
            {model.includePortfolio && (
              <Card className="text-pink-400 bg-inherit">
                <p>
                  Wealth:{" "}
                  {d3.format("$,.0f")(
                    model.wealths[model.wealths.length - 1].portfolio
                  )}{" "}
                </p>
                <p>
                  Last Return:
                  {d3.format("10.0%")(
                    model.returns[model.returns.length - 1].portfolio - 1
                  )}
                </p>
                <p>
                  Annual Return:{" "}
                  {d3.format("10.0%")(
                    annualize(
                      model.wealths[model.wealths.length - 1].portfolio,
                      model.wealths.length - 1
                    )
                  )}
                </p>
                <p>
                  Average Return: {d3.format("10.0%")(avgReturns.portfolio - 1)}
                </p>
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

function average(returns: Assets[]): Assets {
  if (returns.length === 0) {
    return { stock: 1, venture: 1, cash: 1, portfolio: 1 };
  }
  const sum = returns.reduce(
    (acc, r) => {
      acc.stock += r.stock;
      acc.venture += r.venture;
      acc.cash += r.cash;
      acc.portfolio += r.portfolio;
      return acc;
    },
    { stock: 0, venture: 0, cash: 0, portfolio: 0 }
  );

  return {
    stock: sum.stock / returns.length,
    venture: sum.venture / returns.length,
    cash: sum.cash / returns.length,
    portfolio: sum.portfolio / returns.length,
  };
}
