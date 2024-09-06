"use client";

import * as d3 from "d3";
import Card from "@/app/ui/card";
import React, { useState, useEffect } from "react";
import { Slider, Button, Checkbox, CheckboxGroup } from "@nextui-org/react";
import { AssetFrame, simulate } from "@/app/lib/market";
import SimPlot from "@/app/ui/simplot";
import { useStateContext } from "@/app/ctx";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/authctx";

export default function Home() {
  const { model, setModel } = useStateContext();
  const [isCalculating, setIsCalculating] = useState(false);
  const router = useRouter();
  const { diceGameEnabled, diceComplete, diceSimMaxSamples } = useAuth();

  useEffect(() => {
    if (!(diceComplete && diceGameEnabled)) {
      return router.push("/");
    }
  }, [diceComplete, router]);

  const handleStockSlider = (value: number | number[]) => {
    setModel({
      ...model,
      diceSimSliders: { ...model.diceSimSliders, stockSlider: value as number },
    });
  };

  const handleCryptoSlider = (value: number | number[]) => {
    setModel({
      ...model,
      diceSimSliders: {
        ...model.diceSimSliders,
        cryptoSlider: value as number,
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

  const handleCheckbox = (value: string[]) => {
    setModel({ ...model, diceSimBoxes: value });
  };

  const cashPercent =
    1 - (model.diceSimSliders.stockSlider + model.diceSimSliders.cryptoSlider);
  const weights = {
    stock: model.diceSimSliders.stockSlider,
    crypto: model.diceSimSliders.cryptoSlider,
    cash: cashPercent,
  };
  const portfolioReturn =
    0.07 * weights.stock + 0.708 * weights.crypto + 0.02 * weights.cash;

  useEffect(() => {
    if (!isCalculating) {
      const averages = (af: AssetFrame) => {
        const avgStocks =
          af
            .filter((b) => b.key === "stock")
            .reduce((acc, b) => acc + b.value, 0) /
          model.diceSimSliders.samplesSlider;
        const avgCrypto =
          af
            .filter((b) => b.key === "crypto")
            .reduce((acc, b) => acc + b.value, 0) /
          model.diceSimSliders.samplesSlider;
        const avgPortfolio =
          af
            .filter((b) => b.key === "portfolio")
            .reduce((acc, b) => acc + b.value, 0) /
          model.diceSimSliders.samplesSlider;
        return {
          stock: avgStocks,
          crypto: avgCrypto,
          portfolio: avgPortfolio,
        };
      };
      const stockSD = d3.deviation(
        model.diceSim.filter((b) => b.key === "stock").map((b) => b.value)
      );
      const cryptoSD = d3.deviation(
        model.diceSim.filter((b) => b.key === "crypto").map((b) => b.value)
      );
      const portfolioSD = d3.deviation(
        model.diceSim.filter((b) => b.key === "portfolio").map((b) => b.value)
      );
      setModel({
        ...model,
        diceAvgReturns: averages(model.diceSim),
        diceStandardDeviations: {
          stock: stockSD!,
          crypto: cryptoSD!,
          portfolio: portfolioSD!,
        },
      });
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
    <main className="flex min-h-screen flex-col space-y-24 mt-12">
      <div className="flex flex-row justify-center text-3xl text-slate-200">
        Dice Simulation
      </div>
      <div className="grid gap-4 grid-cols-9">
        <div className="flex flex-col gap-4 col-span-2 px-8 max-w-56 md:min-w-56">
          <Button className="py-4 mb-2 bg-blue-500" onClick={go}>
            Run
          </Button>
          <Slider
            className="pb-4"
            label="Rolls"
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
            maxValue={diceSimMaxSamples}
            step={10}
            hideThumb={true}
            onChange={handleSamplesSlider}
            defaultValue={10000}
          />
          <div className="border p-2 mb-6 border-dotted border-gray-400">
            <Slider
              className="text-blue-400 pb-4"
              label="Stocks"
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
              label="Crypto"
              value={model.diceSimSliders.cryptoSlider}
              minValue={0}
              maxValue={2}
              step={0.01}
              formatOptions={{ style: "percent" }}
              hideThumb={true}
              defaultValue={0.5}
              onChange={handleCryptoSlider}
            />
            <div className="flex text-sm justify-between text-green-400 text-left">
              <span>Bond</span>
              <span> {(100 * cashPercent).toFixed(0)}%</span>
            </div>
          </div>
          <CheckboxGroup
            className="border border-dotted border-gray-400 p-4"
            label="Plot"
            value={model.diceSimBoxes}
            onValueChange={handleCheckbox}
          >
            <Checkbox
              classNames={{
                label: "text-xs md:text-sm text-blue-400",
                base: "pb-4",
              }}
              value="stock"
            >
              Stocks
            </Checkbox>
            <Checkbox
              classNames={{
                label: "text-xs md:text-sm text-orange-400",
                base: "pb-4",
              }}
              value="crypto"
            >
              Crypto
            </Checkbox>
            <Checkbox
              classNames={{ label: "text-xs md:text-sm", base: "pb-4" }}
              value="portfolio"
            >
              Portfolio
            </Checkbox>
          </CheckboxGroup>
        </div>
        <div className="col-span-5 ml-12">
          {model.diceSim.length > 1 && !isCalculating ? (
            <SimPlot data={model.diceSim} toPlot={model.diceSimBoxes} />
          ) : (
            <div className="text-9xl flex justify-center mt-24 mr-24">🎲</div>
          )}
        </div>
        {model.diceSim.length > 1 && !isCalculating ? (
          <div className="col-span-2 flex flex-col gap-1 text-xs lg:text-sm">
            <div className="flex flex-row text-base px-4 font-semibold text-slate-200">
              Returns
            </div>
            <Card className="text-blue-400 bg-inherit">
              <p>Arithmetic Mean: {d3.format("10.2%")(0.07)}</p>
              <p>
                Geometric Mean: {d3.format("10.2%")(model.diceAvgReturns.stock)}
              </p>
              <p>
                Standard Deviation:{" "}
                {d3.format("10.2%")(model.diceStandardDeviations.stock)}
              </p>
              <p>
                Volatility Drag:{" "}
                {d3.format("10.2%")(0.07 - model.diceAvgReturns.stock)}
              </p>
              <p>Drag Estimate: {d3.format("10.2%")(0.019)}</p>
            </Card>
            <Card className="text-orange-400 bg-inherit">
              <p>Arithmetic Mean: {d3.format("10.2%")(0.708)}</p>
              <p>
                Geometric Mean:{" "}
                {d3.format("10.2%")(model.diceAvgReturns.crypto)}
              </p>
              <p>
                Standard Deviation:{" "}
                {d3.format("10.2%")(model.diceStandardDeviations.crypto)}
              </p>
              <p>
                Volatility Drag:{" "}
                {d3.format("10.2%")(0.708 - model.diceAvgReturns.crypto)}
              </p>
              <p>Drag Estimate: {d3.format("10.2%")(0.8777)}</p>
            </Card>
            <Card className="text-white bg-inherit">
              <p>Arithmetic Mean: {d3.format("10.2%")(portfolioReturn)}</p>
              <p>
                Geometric Mean:{" "}
                {d3.format("10.2%")(model.diceAvgReturns.portfolio)}
              </p>
              <p>
                Standard Deviation:{" "}
                {d3.format("10.2%")(model.diceStandardDeviations.portfolio)}
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
