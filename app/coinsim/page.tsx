"use client";

import * as d3 from "d3";
import Card from "@/app/ui/card";
import React, { useState, useEffect, use } from "react";
import { Slider, Button, Image } from "@nextui-org/react";
import SimPlot from "@/app/ui/simplot";
import { useStateContext } from "@/app/ctx";

export default function Home() {
  const { model, setModel } = useStateContext();
  const [isCalculating, setIsCalculating] = useState(false);
  const sim: any = [];

  const handleYearsSlider = (value: number | number[]) => {
    setModel({
      ...model,
      coinSimSliders: { ...model.coinSimSliders, yearsSlider: value as number },
    });
  };

  const handleSamplesSlider = (value: number | number[]) => {
    setModel({
      ...model,
      coinSimSliders: {
        ...model.coinSimSliders,
        samplesSlider: value as number,
      },
    });
  };

  const handleBiasSlider = (value: number | number[]) => {
    setModel({
      ...model,
      coinSimSliders: {
        ...model.coinSimSliders,
        biasSlider: value as number,
      },
    });
  };

  const handleBetSlider = (value: number | number[]) => {
    setModel({
      ...model,
      coinSimSliders: {
        ...model.coinSimSliders,
        betSlider: value as number,
      },
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center space-y-24 mt-12">
      <div className="text-4xl text-slate-200">Coin Flip Simulation</div>
      <div className="grid gap-4 grid-cols-9 min-w-full">
        <div className="flex flex-col gap-4 col-span-2 px-8">
          <Button className="py-4 mb-2 bg-blue-500">Run</Button>
          <Slider
            className="pb-4"
            label="Years per Simulation"
            value={model.coinSimSliders.yearsSlider}
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
            value={model.coinSimSliders.samplesSlider}
            minValue={100}
            maxValue={10000}
            step={10}
            hideThumb={true}
            onChange={handleSamplesSlider}
            defaultValue={1000}
          />
          <Slider
            className="text-slate-200 pb-4"
            label="Bet Size"
            value={model.coinSimSliders.betSlider}
            minValue={0}
            maxValue={1}
            step={0.01}
            formatOptions={{ style: "percent" }}
            hideThumb={true}
            defaultValue={0}
            onChange={handleBetSlider}
          />
          <Slider
            className="text-slate-200 pb-4"
            label="Heads Probability"
            value={model.coinSimSliders.biasSlider}
            minValue={0}
            maxValue={1}
            step={0.01}
            formatOptions={{ style: "percent" }}
            hideThumb={true}
            defaultValue={0.5}
            onChange={handleBiasSlider}
          />
        </div>
        <div className="col-span-5 ml-12">
          {sim.length > 1 && !isCalculating ? (
            <SimPlot data={sim} />
          ) : (
            <div className="text-9xl flex justify-center mt-24 mr-24">
              <Image src="/heads.png" alt="Heads" width={250} />
            </div>
          )}
        </div>
        {sim.length > 1 && !isCalculating ? (
          <div className="col-span-2  flex  flex-col gap-1 text-sm">
            <Card className="text-blue-400 bg-inherit">
              <p>Arithmetic Mean Return: {d3.format("10.2%")(0.07)}</p>
              <p>
                {/* Geometric Mean Return: {d3.format("10.2%")(avgReturns.stock)} */}
              </p>
              <p>
                {/* Volatility Drag: {d3.format("10.2%")(0.07 - avgReturns.stock)} */}
              </p>
              <p>Volatility Drag Estimate: {d3.format("10.2%")(0.019)}</p>
            </Card>
            <Card className="text-orange-400 bg-inherit">
              <p>Arithmetic Mean Return: {d3.format("10.2%")(0.708)}</p>
              <p>
                {/* Geometric Mean Return: {d3.format("10.2%")(avgReturns.venture)} */}
              </p>
              <p>
                Volatility Drag:{" "}
                {/* {d3.format("10.2%")(0.708 - avgReturns.venture)} */}
              </p>
              <p>Volatility Drag Estimate: {d3.format("10.2%")(0.8777)}</p>
            </Card>
            <Card className="text-white bg-inherit">
              <p>
                {/* Arithmetic Mean Return: {d3.format("10.2%")(portfolioReturn)} */}
              </p>
              <p>
                Geometric Mean Return:{" "}
                {/* {d3.format("10.2%")(avgReturns.portfolio)} */}
              </p>
              <p>
                Volatility Drag:{" "}
                {/* {d3.format("10.2%")(portfolioReturn - avgReturns.portfolio)} */}
              </p>
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  );
}
