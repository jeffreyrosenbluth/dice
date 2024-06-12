"use client";

// import Button from "@/app/ui/button";
import Card from "@/app/ui/card";
import React, { useState } from "react";
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

  function handleGreenSlider(value: number | number[]) {
    setGreenSlider(value as number);
  }
  function handleRedSlider(value: number | number[]) {
    setRedSlider(value as number);
  }

  function handleYearsSlider(value: number | number[]) {
    setSamplesSlider(value as number);
  }

  function handleSamplesSlider(value: number | number[]) {
    setSamplesSlider(value as number);
  }

  const whitePercent = 1 - (greenSlider + redSlider);
  const weights = { green: greenSlider, red: redSlider, white: whitePercent };

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
      <div className="grid gap-8 grid-cols-9 min-w-full">
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
        <div className="col-span-2  flex  flex-col gap-1">
          <Card className="text-emerald-400 bg-inherit">
            <p>Wealth: </p>
            <p>Last Return:</p>
            <p>Annual Return: </p>
          </Card>
          <Card className="text-rose-500 bg-inherit">
            <p>Wealth: </p>
            <p>Last Return:</p>
            <p>Annual Return: </p>
          </Card>
          <Card className="text-white bg-inherit">
            <p>Wealth: </p>
            <p>Last Return:</p>
            <p>Annual Return: </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
