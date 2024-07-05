"use client";

import WealthPlot from "@/app/ui/wealthplot";
import ReturnPlot from "@/app/ui/returnplot";
import Card from "@/app/ui/card";
import { Slider, Button, Switch } from "@nextui-org/react";
import React from "react";
import { addRoll, Assets } from "@/app/lib/market";
import * as d3 from "d3";
import { useStateContext } from "@/app/ctx";

const initialWealth = [{ stock: 100, venture: 100, cash: 100, portfolio: 100 }];
const initialReturns = [{ stock: 0, venture: 0, cash: 0, portfolio: 0 }];

export default function Home() {
  const { model, setModel } = useStateContext();

  const cashPercent =
    1 -
    (model.dicePlaySliders.stockSlider + model.dicePlaySliders.ventureSlider);

  const roll = () => {
    const [w, r] = addRoll(
      {
        stock: model.dicePlaySliders.stockSlider,
        venture: model.dicePlaySliders.ventureSlider,
        cash: cashPercent,
      },
      model.diceWealths,
      model.diceReturns
    );

    setModel({
      ...model,
      diceWealths: w,
      diceReturns: r,
    });
  };

  const reset = () => {
    setModel({
      ...model,
      diceWealths: initialWealth,
      diceReturns: initialReturns,
      includePortfolio: model.includePortfolio,
    });
  };

  const handleStockSlider = (value: number | number[]) => {
    setModel({
      ...model,
      dicePlaySliders: {
        ...model.dicePlaySliders,
        stockSlider: value as number,
      },
    });
  };

  const handleVentureSlider = (value: number | number[]) => {
    setModel({
      ...model,
      dicePlaySliders: {
        ...model.dicePlaySliders,
        ventureSlider: value as number,
      },
    });
  };

  const handlePortfolio = (checked: boolean) => {
    setModel({ ...model, includePortfolio: checked });
  };

  const avgReturns = average(model.diceReturns.slice(1));

  return (
    <main className="flex min-h-screen flex-col space-y-24 mt-12">
      <div className="flex fles-row text-3xl text-slate-200 justify-center">
        Dice Game
      </div>
      <div className="grid grid-cols-9">
        <div className="flex flex-col gap-4 col-span-2 px-8 max-w-56 md:min-w-56">
          <Button className="py-4 mb-2 bg-blue-500" onClick={roll}>
            Roll
          </Button>
          <Button className="py-4 mb-4 bg-blue-500" onClick={reset}>
            Reset
          </Button>
          <div className="border p-2 mb-6 border-dotted border-gray-400">
            <Slider
              label="S&P 500"
              className="text-blue-400 pb-4"
              value={model.dicePlaySliders.stockSlider}
              minValue={0}
              maxValue={2}
              hideThumb={true}
              onChange={handleStockSlider}
              step={0.01}
              defaultValue={0}
              formatOptions={{ style: "percent" }}
            />
            <Slider
              label="Venture Capital"
              className="text-orange-400 pb-4"
              value={model.dicePlaySliders.ventureSlider}
              minValue={0}
              maxValue={2}
              hideThumb={true}
              onChange={handleVentureSlider}
              step={0.01}
              defaultValue={0.5}
              formatOptions={{ style: "percent" }}
            />
            <div className="flex text-sm justify-between text-green-400 text-left">
              <div>Money Market</div>
              <div>{(100 * cashPercent).toFixed(0)}%</div>
            </div>
          </div>
          <Switch
            isSelected={model.includePortfolio}
            onValueChange={handlePortfolio}
          >
            <span className="text-slate-200">Show Portfolio</span>
          </Switch>
        </div>
        <div className="col-span-5 ml-12">
          {model.diceReturns.length > 1 ? (
            <div className="flex flex-col gap-16">
              <WealthPlot
                wealth={model.diceWealths}
                includePortfolio={model.includePortfolio}
              />
              <ReturnPlot
                returns={model.diceReturns}
                includePortfolio={model.includePortfolio}
              />{" "}
            </div>
          ) : (
            <div className="text-9xl flex justify-center mt-24 mr-24">🎲</div>
          )}
        </div>
        <div className="col-span-2 flex flex-col gap-1 px-4 text-sm lg:text-base">
          <Card className="text-blue-400 bg-inherit">
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(
                model.diceWealths[model.diceWealths.length - 1].stock
              )}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.diceReturns[model.diceReturns.length - 1].stock - 1
              )}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.diceWealths[model.diceWealths.length - 1].stock,
                  model.diceWealths.length - 1
                )
              )}
            </p>
            <p>Average Return: {d3.format("10.0%")(avgReturns.stock - 1)}</p>
          </Card>
          <Card className="text-orange-400 bg-inherit">
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(
                model.diceWealths[model.diceWealths.length - 1].venture
              )}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.diceReturns[model.diceReturns.length - 1].venture - 1
              )}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.diceWealths[model.diceWealths.length - 1].venture,
                  model.diceWealths.length - 1
                )
              )}
            </p>
            <p>Average Return: {d3.format("10.0%")(avgReturns.venture - 1)}</p>
          </Card>
          <Card className="text-green-400 bg-inherit">
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(
                model.diceWealths[model.diceWealths.length - 1].cash
              )}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.diceReturns[model.diceReturns.length - 1].cash - 1
              )}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.diceWealths[model.diceWealths.length - 1].cash,
                  model.diceWealths.length - 1
                )
              )}
            </p>
            <p>Average Return: {d3.format("10.0%")(avgReturns.cash - 1)}</p>
          </Card>
          <div>
            {model.includePortfolio && (
              <Card className="text-white bg-inherit">
                <p>
                  Wealth:{" "}
                  {d3.format("$,.0f")(
                    model.diceWealths[model.diceWealths.length - 1].portfolio
                  )}{" "}
                </p>
                <p>
                  Last Return:
                  {d3.format("10.0%")(
                    model.diceReturns[model.diceReturns.length - 1].portfolio -
                      1
                  )}
                </p>
                <p>
                  Annual Return:{" "}
                  {d3.format("10.0%")(
                    annualize(
                      model.diceWealths[model.diceWealths.length - 1].portfolio,
                      model.diceWealths.length - 1
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
