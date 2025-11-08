"use client";

import * as d3 from "d3";
import Card from "@/app/ui/card";
import React, { useState, useEffect, use } from "react";
import {
  Slider,
  Button,
  Image,
  CheckboxGroup,
  Checkbox,
} from "@nextui-org/react";
import CoinSimPlot from "@/app/ui/coinsimplot";
import { useStateContext } from "@/app/ctx";
import { Profit, runCoinSim } from "@/app/lib/coin";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/authctx";

export default function Home() {
  const { model, setModel } = useStateContext();
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();
  const bias = model.coinSimSliders.biasSlider;
  const kellyFraction = bias * 2 - 1;
  const {
    coinComplete,
    coinSimEnabled,
    coinSimMaxSamples,
    coinSimMaxFlips,
  } = useAuth();

  useEffect(() => {
    if (!(coinComplete && coinSimEnabled)) {
      return router.push("/");
    }
  }, [coinComplete, coinSimEnabled, router]);

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

  const handleCheckbox = (value: string[]) => {
    setModel({ ...model, coinSimBoxes: value });
  };

  useEffect(() => {
    if (!isCalculating) {
      const averages = (profits: Profit[]) => {
        const playerProfits = profits.filter(
          (b) =>
            b.key ===
            `Constant ${Math.trunc(100 * model.coinSimSliders.betSlider)}%`
        );
        const constantProfits = profits.filter((b) => b.key === "Constant $20");
        const kellyProfits = profits.filter((b) => b.key === "Kelly");
        const avgPlayer = d3.mean(playerProfits.map((b) => b.value))!;
        const avgConstant = d3.mean(constantProfits.map((b) => b.value))!;
        const avgKelly = d3.mean(kellyProfits.map((b) => b.value))!;
        const medianPlayer = d3.median(playerProfits.map((b) => b.value))!;
        const medianConstant = d3.median(constantProfits.map((b) => b.value))!;
        const medianKelly = d3.median(kellyProfits.map((b) => b.value))!;
        const sdPlayer = d3.deviation(playerProfits.map((b) => b.value))!;
        const sdConstant = d3.deviation(constantProfits.map((b) => b.value))!;
        const sdKelly = d3.deviation(kellyProfits.map((b) => b.value))!;
        return [
          {
            player: avgPlayer,
            constant: avgConstant,
            kelly: avgKelly,
          },
          {
            player: medianPlayer,
            constant: medianConstant,
            kelly: medianKelly,
          },
          { player: sdPlayer, constant: sdConstant, kelly: sdKelly },
        ];
      };
      const [avg, median, sd] = averages(model.coinSim);
      setModel({
        ...model,
        coinAvgReturns: avg,
        coinMedianReturns: median,
        coinStandardDeviations: sd,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalculating, model.coinSimSliders.samplesSlider, model.coinSim]);

  function go() {
    setIsCalculating(true);
    setModel({
      ...model,
      coinSim: runCoinSim(
        model.coinSimSliders.yearsSlider,
        model.coinSimSliders.samplesSlider,
        model.coinSimSliders.biasSlider,
        model.coinSimSliders.betSlider
      ),
    });
    setIsCalculating(false);
  }

  return (
    <main className="flex min-h-screen flex-col space-y-6 mt-8 md:mt-12 px-2 md:px-0">
      <div className="flex flex-row justify-center text-2xl md:text-3xl text-slate-200 py-4 md:py-8">
        Coin Flipping Simulation
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-9">
        <div className="flex flex-col gap-4 col-span-1 md:col-span-2 px-4 md:px-8 md:min-w-56">
          <Button className="py-6 md:py-4 mb-2 bg-blue-500 text-base md:text-base" onClick={go}>
            Run
          </Button>
          <Slider
            className="pb-1"
            label="Flips"
            value={model.coinSimSliders.yearsSlider}
            minValue={1}
            maxValue={coinSimMaxFlips}
            step={1}
            hideThumb={true}
            onChange={handleYearsSlider}
            defaultValue={20}
          />
          <Slider
            className="pb-1"
            label="Samples"
            value={model.coinSimSliders.samplesSlider}
            minValue={100}
            maxValue={coinSimMaxSamples}
            step={10}
            hideThumb={true}
            onChange={handleSamplesSlider}
            defaultValue={10000}
          />
          <Slider
            className="text-slate-200 pb-1"
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
            minValue={0.5}
            maxValue={1}
            step={0.01}
            formatOptions={{ style: "percent" }}
            hideThumb={true}
            defaultValue={0.5}
            onChange={handleBiasSlider}
          />
          <CheckboxGroup
            className="border border-dotted border-gray-400 p-2"
            label="Plot"
            value={model.coinSimBoxes}
            onValueChange={handleCheckbox}
          >
            <Checkbox
              classNames={{ label: "text-sm md:text-sm" }}
              value="constant"
            >
              Constant $20
            </Checkbox>
            <Checkbox
              classNames={{ label: "text-sm md:text-sm" }}
              value="kelly"
            >
              {`Kelly ${Math.round(10000 * kellyFraction) / 100}%`}
            </Checkbox>
          </CheckboxGroup>
        </div>
        <div className="col-span-1 md:col-span-5 mx-4 md:ml-12 md:mr-0">
          {model.coinSim.length > 1 && !isCalculating ? (
            <CoinSimPlot
              profits={model.coinSim}
              betFraction={Math.trunc(100 * model.coinSimSliders.betSlider)}
              toPlot={model.coinSimBoxes}
            />
          ) : (
            <div className="text-9xl flex justify-center mt-12 md:mt-24 mr-0 md:mr-8">
              <Image src="/heads.png" alt="Heads" width={200} className="md:w-[250px]" />
            </div>
          )}
        </div>
        {model.coinSim.length > 1 && !isCalculating ? (
          <div className="col-span-1 md:col-span-2 flex flex-col gap-1 text-sm px-4 md:px-0">
            <Card className="text-blue-400 bg-inherit">
              <p>
                Mean Return: {d3.format("10.2%")(model.coinAvgReturns.player)}
              </p>
              <p>
                Median Return:
                {d3.format("10.2%")(model.coinMedianReturns.player)}
              </p>
              <p>
                Standard Deviation:
                {d3.format("10.2%")(model.coinStandardDeviations.player)}
              </p>
            </Card>
            <Card className="text-orange-400 bg-inherit">
              <p>
                Mean Return: {d3.format("10.2%")(model.coinAvgReturns.constant)}
              </p>
              <p>
                Median Return:
                {d3.format("10.2%")(model.coinMedianReturns.constant)}
              </p>
              <p>
                Standard Deviation:
                {d3.format("10.2%")(model.coinStandardDeviations.constant)}
              </p>
            </Card>
            <Card className="text-white bg-inherit">
              <p>
                Mean Return: {d3.format("10.2%")(model.coinAvgReturns.kelly)}
              </p>
              <p>
                Median Return:
                {d3.format("10.2%")(model.coinMedianReturns.kelly)}
              </p>
              <p>
                Standard Deviation:
                {d3.format("10.2%")(model.coinStandardDeviations.kelly)}
              </p>
            </Card>
          </div>
        ) : null}
      </div>
    </main>
  );
}
