"use client";

import * as d3 from "d3";
import Card from "@/app/ui/card";
import React, { useState, useEffect, use } from "react";
import { Slider, Button } from "@nextui-org/react";
import { AssetFrame, simulate } from "@/app/lib/market";
import SimPlot from "@/app/ui/simplot";
import { useStateContext } from "@/app/ctx";

export default function Home() {
  const { model, setModel } = useStateContext();
  const [sim, setSim] = useState<AssetFrame>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [avgReturns, setAvgReturns] = useState({
    stock: 0,
    venture: 0,
    portfolio: 0,
  });

  const handleStockSlider = (value: number | number[]) => {
    setModel({
      ...model,
      simSliders: { ...model.simSliders, stockSlider: value as number },
    });
  };

  const handleVentureSlider = (value: number | number[]) => {
    setModel({
      ...model,
      simSliders: { ...model.simSliders, ventureSlider: value as number },
    });
  };

  const handleYearsSlider = (value: number | number[]) => {
    setModel({
      ...model,
      simSliders: { ...model.simSliders, yearsSlider: value as number },
    });
  };

  const handleSamplesSlider = (value: number | number[]) => {
    setModel({
      ...model,
      simSliders: { ...model.simSliders, samplesSlider: value as number },
    });
  };

  const cashPercent =
    1 - (model.simSliders.stockSlider + model.simSliders.ventureSlider);
  const weights = {
    stock: model.simSliders.stockSlider,
    venture: model.simSliders.ventureSlider,
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
          model.simSliders.samplesSlider;
        const avgVenture =
          af
            .filter((b) => b.key === "venture")
            .reduce((acc, b) => acc + b.value, 0) /
          model.simSliders.samplesSlider;
        const avgPortfolio =
          af
            .filter((b) => b.key === "portfolio")
            .reduce((acc, b) => acc + b.value, 0) /
          model.simSliders.samplesSlider;
        return {
          stock: avgStocks,
          venture: avgVenture,
          portfolio: avgPortfolio,
        };
      };
      setAvgReturns(averages(sim));
    }
  }, [isCalculating, model.simSliders.samplesSlider, sim]);

  function go() {
    setIsCalculating(true);
    setSim(
      simulate(
        weights,
        model.simSliders.yearsSlider,
        model.simSliders.samplesSlider
      )
    );
    setIsCalculating(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center space-y-24 mt-12">
      <div className="text-4xl text-slate-200">
        Risk and Return Dice Simulation
      </div>
      <div className="grid gap-4 grid-cols-9 min-w-full">
        <div className="flex flex-col gap-4 col-span-2 px-8">
          <Button
            className="py-4 mb-2"
            onClick={go}
            color={isCalculating ? "success" : "primary"}
          >
            Run
          </Button>
          <Slider
            className="pb-4"
            label="Years per Simulation"
            value={model.simSliders.yearsSlider}
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
            value={model.simSliders.samplesSlider}
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
              value={model.simSliders.stockSlider}
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
              value={model.simSliders.ventureSlider}
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
          {sim.length > 1 && !isCalculating ? (
            <SimPlot data={sim} />
          ) : (
            <div className="text-9xl flex justify-center mt-24 mr-24">🎲</div>
          )}
        </div>
        {sim.length > 1 && !isCalculating ? (
          <div className="col-span-2  flex  flex-col gap-1 text-sm">
            <Card className="text-blue-400 bg-inherit">
              <p>Arithmetic Mean Return: {d3.format("10.2%")(0.07)}</p>
              <p>
                Geometric Mean Return: {d3.format("10.2%")(avgReturns.stock)}
              </p>
              <p>
                Volatility Drag: {d3.format("10.2%")(0.07 - avgReturns.stock)}
              </p>
              <p>Volatility Drag Estimate: {d3.format("10.2%")(0.019)}</p>
            </Card>
            <Card className="text-orange-400 bg-inherit">
              <p>Arithmetic Mean Return: {d3.format("10.2%")(0.708)}</p>
              <p>
                Geometric Mean Return: {d3.format("10.2%")(avgReturns.venture)}
              </p>
              <p>
                Volatility Drag:{" "}
                {d3.format("10.2%")(0.708 - avgReturns.venture)}
              </p>
              <p>Volatility Drag Estimate: {d3.format("10.2%")(0.8777)}</p>
            </Card>
            <Card className="text-white bg-inherit">
              <p>
                Arithmetic Mean Return: {d3.format("10.2%")(portfolioReturn)}
              </p>
              <p>
                Geometric Mean Return:{" "}
                {d3.format("10.2%")(avgReturns.portfolio)}
              </p>
              <p>
                Volatility Drag:{" "}
                {d3.format("10.2%")(portfolioReturn - avgReturns.portfolio)}
              </p>
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  );
}
