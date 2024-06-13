"use client";

import * as d3 from "d3";
import Card from "@/app/ui/card";
import React, { useState, useEffect, use } from "react";
import { Slider, Button } from "@nextui-org/react";
import { outcomes, runSim, Batches } from "@/app/lib/core";
import SimPlot from "@/app/ui/simplot";

const intialBatches: Batches = {
  batches: [],
  currentReturn: {
    green: 0,
    red: 0,
    white: 0,
    violet: 0,
    num: 0,
  },
};

export default function Home() {
  const [yearsSlider, setYearsSlider] = useState(20);
  const [samplesSlider, setSamplesSlider] = useState(1000);
  const [greenSlider, setGreenSlider] = useState(0);
  const [redSlider, setRedSlider] = useState(0.5);
  const [sim, setSim] = useState(intialBatches);
  const [isCalculating, setIsCalculating] = useState(false);
  const [avgReturns, setAvgReturns] = useState({ green: 0, red: 0, violet: 0 });

  function handleGreenSlider(value: number | number[]) {
    setGreenSlider(value as number);
  }
  function handleRedSlider(value: number | number[]) {
    setRedSlider(value as number);
  }

  function handleYearsSlider(value: number | number[]) {
    setYearsSlider(value as number);
  }

  function handleSamplesSlider(value: number | number[]) {
    setSamplesSlider(value as number);
  }

  const whitePercent = 1 - (greenSlider + redSlider);
  const weights = { green: greenSlider, red: redSlider, white: whitePercent };
  const violetRetun =
    0.07 * weights.green + 0.708 * weights.red + 0.02 * weights.white;

  useEffect(() => {
    if (!isCalculating) {
      const averages = (b: Batches) => {
        const avgGreen =
          b.batches
            .filter((b) => b.symbol === "green")
            .reduce((acc, b) => acc + b.cummReturn, 0) / samplesSlider;
        const avgRed =
          b.batches
            .filter((b) => b.symbol === "red")
            .reduce((acc, b) => acc + b.cummReturn, 0) / samplesSlider;
        const avgViolet =
          b.batches
            .filter((b) => b.symbol === "violet")
            .reduce((acc, b) => acc + b.cummReturn, 0) / samplesSlider;
        return { green: avgGreen, red: avgRed, violet: avgViolet };
      };
      setAvgReturns(averages(sim));
    }
  }, [sim, isCalculating, samplesSlider]);

  function go() {
    setIsCalculating(true);
    setSim(runSim(outcomes, weights, yearsSlider, samplesSlider));
    setIsCalculating(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center space-y-24 mt-12">
      <div className="text-4xl text-blue-300">
        Investment Risk and Return Simulation
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
            minValue={100}
            maxValue={10000}
            step={10}
            hideThumb={true}
            onChange={handleSamplesSlider}
            defaultValue={1000}
          />
          <div className="border p-2 mb-6 border-dotted border-gray-400">
            <Slider
              className="text-emerald-500 pb-4"
              label="Green"
              minValue={0}
              maxValue={2}
              step={0.01}
              formatOptions={{ style: "percent" }}
              hideThumb={true}
              defaultValue={0}
              onChange={handleGreenSlider}
            />
            <Slider
              className="text-rose-500 pb-6"
              label="Red"
              minValue={0}
              maxValue={2}
              step={0.01}
              formatOptions={{ style: "percent" }}
              hideThumb={true}
              defaultValue={0.5}
              onChange={handleRedSlider}
            />
            <div className="flex text-sm justify-between text-white text-left">
              <span>White</span>
              <span> {(100 * whitePercent).toFixed(0)}%</span>
            </div>
          </div>
        </div>
        <div className="col-span-5 ml-12">
          {sim.batches.length > 1 && !isCalculating ? (
            <SimPlot data={sim} />
          ) : (
            <div className="text-9xl flex justify-center mt-24 mr-24">🎲</div>
          )}
        </div>
        {sim.batches.length > 1 && !isCalculating ? (
          <div className="col-span-2  flex  flex-col gap-1 text-sm">
            <Card className="text-emerald-400 bg-inherit">
              <p>Arithmetic Mean Return: {d3.format("10.2%")(0.07)}</p>
              <p>
                Geometric Mean Return: {d3.format("10.2%")(avgReturns.green)}
              </p>
              <p>
                Volatility Drag: {d3.format("10.2%")(0.07 - avgReturns.green)}
              </p>
              <p>Volatility Drag Estimate: {d3.format("10.2%")(0.019)}</p>
            </Card>
            <Card className="text-rose-500 bg-inherit">
              <p>Arithmetic Mean Return: {d3.format("10.2%")(0.708)}</p>
              <p>Geometric Mean Return: {d3.format("10.2%")(avgReturns.red)}</p>
              <p>
                Volatility Drag: {d3.format("10.2%")(0.708 - avgReturns.red)}
              </p>
              <p>Volatility Drag Estimate: {d3.format("10.2%")(0.8777)}</p>
            </Card>
            <Card className="text-pink-500 bg-inherit">
              <p>Arithmetic Mean Return: {d3.format("10.2%")(violetRetun)}</p>
              <p>
                Geometric Mean Return: {d3.format("10.2%")(avgReturns.violet)}
              </p>
              <p>
                Volatility Drag:{" "}
                {d3.format("10.2%")(violetRetun - avgReturns.violet)}
              </p>
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  );
}
