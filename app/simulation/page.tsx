"use client";

import * as d3 from "d3";
import Card from "@/app/ui/card";
import React, { useState, useEffect } from "react";
import { Slider, Button } from "@nextui-org/react";
import { AssetFrame, simulate } from "@/app/lib/market";
import SimPlot from "@/app/ui/simplot";
import { useStateContext } from "@/app/ctx";

export default function Home() {
  const { model, setModel } = useStateContext();
  const [isCalculating, setIsCalculating] = useState(false);

  const handleStockSlider = (value: number | number[]) => {
    setModel({
      ...model,
      diceSimSliders: { ...model.diceSimSliders, stockSlider: value as number },
    });
  };

  const handleVentureSlider = (value: number | number[]) => {
    setModel({
      ...model,
      diceSimSliders: {
        ...model.diceSimSliders,
        ventureSlider: value as number,
      },
    });
  };

  const handleYearsSlider = (value: number | number[]) => {
    setModel({
      ...model,
      diceSimSliders: { ...model.diceSimSliders, yearsSlider: value as number },
    });
  };

  const handleSamplesSlider = (value: number | number[]) => {
    setModel({
      ...model,
      diceSimSliders: {
        ...model.diceSimSliders,
        samplesSlider: value as number,
      },
    });
  };

  const cashPercent =
    1 - (model.diceSimSliders.stockSlider + model.diceSimSliders.ventureSlider);
  const weights = {
    stock: model.diceSimSliders.stockSlider,
    venture: model.diceSimSliders.ventureSlider,
    cash: cashPercent,
  };
  const portfolioReturn =
    0.07 * weights.stock + 0.708 * weights.venture + 0.02 * weights.cash;

  useEffect(() => {
    if (!isCalculating) {
      const averages = (af: AssetFrame) => {
        const avgStocks =
          af
            .filter((b) => b.key === "stock")
            .reduce((acc, b) => acc + b.value, 0) /
          model.diceSimSliders.samplesSlider;
        const avgVenture =
          af
            .filter((b) => b.key === "venture")
            .reduce((acc, b) => acc + b.value, 0) /
          model.diceSimSliders.samplesSlider;
        const avgPortfolio =
          af
            .filter((b) => b.key === "portfolio")
            .reduce((acc, b) => acc + b.value, 0) /
          model.diceSimSliders.samplesSlider;
        return {
          stock: avgStocks,
          venture: avgVenture,
          portfolio: avgPortfolio,
        };
      };
      setModel({ ...model, diceAvgReturns: averages(model.diceSim) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalculating, model.diceSimSliders.samplesSlider, model.diceSim]);

  function go() {
    setIsCalculating(true);
    setModel({
      ...model,
      diceSim: simulate(
        weights,
        model.diceSimSliders.yearsSlider,
        model.diceSimSliders.samplesSlider
      ),
    });
    setIsCalculating(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center space-y-24 mt-12">
      <div className="text-4xl text-slate-200">
        Risk and Return Dice Simulation
      </div>
      <div className="grid gap-4 grid-cols-9 min-w-full">
        <div className="flex flex-col gap-4 col-span-2 px-8">
          <Button className="py-4 mb-2 bg-blue-500" onClick={go}>
            Run
          </Button>
          <Slider
            className="pb-4"
            label="Years per Simulation"
            value={model.diceSimSliders.yearsSlider}
            minValue={1}
            maxValue={50}
            step={1}
            hideThumb={true}
            onChange={handleYearsSlider}
            defaultValue={20}
          />
          <Slider
            className="pb-4"
            label="Samples"
            value={model.diceSimSliders.samplesSlider}
            minValue={100}
            maxValue={10000}
            step={10}
            hideThumb={true}
            onChange={handleSamplesSlider}
            defaultValue={1000}
          />
          <div className="border p-2 mb-6 border-dotted border-gray-400">
            <Slider
              className="text-blue-400 pb-4"
              label="S&P 500"
              value={model.diceSimSliders.stockSlider}
              minValue={0}
              maxValue={2}
              step={0.01}
              formatOptions={{ style: "percent" }}
              hideThumb={true}
              defaultValue={0}
              onChange={handleStockSlider}
            />
            <Slider
              className="text-orange-400 pb-4"
              label="Venture Capital"
              value={model.diceSimSliders.ventureSlider}
              minValue={0}
              maxValue={2}
              step={0.01}
              formatOptions={{ style: "percent" }}
              hideThumb={true}
              defaultValue={0.5}
              onChange={handleVentureSlider}
            />
            <div className="flex text-sm justify-between text-green-400 text-left">
              <span>Money Market</span>
              <span> {(100 * cashPercent).toFixed(0)}%</span>
            </div>
          </div>
        </div>
        <div className="col-span-5 ml-12">
          {model.diceSim.length > 1 && !isCalculating ? (
            <SimPlot data={model.diceSim} />
          ) : (
            <div className="text-9xl flex justify-center mt-24 mr-24">🎲</div>
          )}
        </div>
        {model.diceSim.length > 1 && !isCalculating ? (
          <div className="col-span-2  flex  flex-col gap-1 text-sm">
            <Card className="text-blue-400 bg-inherit">
              <p>Arithmetic Mean Return: {d3.format("10.2%")(0.07)}</p>
              <p>
                Geometric Mean Return:{" "}
                {d3.format("10.2%")(model.diceAvgReturns.stock)}
              </p>
              <p>
                Volatility Drag:{" "}
                {d3.format("10.2%")(0.07 - model.diceAvgReturns.stock)}
              </p>
              <p>Volatility Drag Estimate: {d3.format("10.2%")(0.019)}</p>
            </Card>
            <Card className="text-orange-400 bg-inherit">
              <p>Arithmetic Mean Return: {d3.format("10.2%")(0.708)}</p>
              <p>
                Geometric Mean Return:{" "}
                {d3.format("10.2%")(model.diceAvgReturns.venture)}
              </p>
              <p>
                Volatility Drag:{" "}
                {d3.format("10.2%")(0.708 - model.diceAvgReturns.venture)}
              </p>
              <p>Volatility Drag Estimate: {d3.format("10.2%")(0.8777)}</p>
            </Card>
            <Card className="text-white bg-inherit">
              <p>
                Arithmetic Mean Return: {d3.format("10.2%")(portfolioReturn)}
              </p>
              <p>
                Geometric Mean Return:{" "}
                {d3.format("10.2%")(model.diceAvgReturns.portfolio)}
              </p>
              <p>
                Volatility Drag:{" "}
                {d3.format("10.2%")(
                  portfolioReturn - model.diceAvgReturns.portfolio
                )}
              </p>
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  );
}
