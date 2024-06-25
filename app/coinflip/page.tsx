"use client";

import React, { useState } from "react";
import { Button, RadioGroup, Radio, Slider } from "@nextui-org/react";
import FlipPlot from "@/app/ui/flipplot";
import Coin from "@/app/ui/coin";
import { addFlip, flip } from "@/app/lib/coin";
import { Flip } from "@/app/lib/coin";
import CurrencyInput from "react-currency-input-field";
import { parse } from "path";

const initialFlips: Flip[] = [
  {
    flip_num: 0,
    value: 100,
    value10: 100,
    value20: 100,
    kelly: 100,
    coin: "heads",
  },
];

export default function Home() {
  const [flips, setFlips] = useState(initialFlips);
  const [bet, setBet] = useState(10);
  const [headsTails, setHeadsTails] = useState("heads");
  const [flipResult, setFlipResult] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      setFlipResult(flip(headsTails));
    }
  };

  const handleFlipComplete = () => {
    setIsFlipping(false);
    setFlips(addFlip(flips, bet, flipResult));
  };

  const handleReset = () => {
    setFlips(initialFlips);
    setBet(0);
  };

  const handleSlider = (value: number | number[]) => {
    setBet(value as number);
  };

  const balance = flips[flips.length - 1].value;

  return (
    <main className="flex min-h-screen flex-col items-center space-y-24 mt-12">
      <div className="text-4xl text-slate-200">Coin Flipping Game</div>
      <div className="grid gap-4 grid-cols-4 min-w-full">
        <div className="flex flex-col gap-6 col-span-1 px-8">
          <RadioGroup
            className="flex gap-8"
            defaultValue="heads"
            orientation="horizontal"
            value={headsTails}
            onValueChange={setHeadsTails}
          >
            {" "}
            <div className="flex space-x-8">
              <Radio value="heads">
                <span className="text-slate-200">Heads</span>
              </Radio>
              <Radio value="tails">
                <span className="text-slate-200">Tails</span>
              </Radio>
            </div>
          </RadioGroup>
          <div>
            <p className="text-slate-200 mb-2">Bet Size</p>
            <CurrencyInput
              id="bet-input"
              name="bet-input"
              placeholder="Bet Size"
              prefix={"$ "}
              defaultValue={0}
              decimalsLimit={2}
              step={1}
              value={bet}
              onValueChange={(value, name, values) =>
                setBet(values!.float || 0)
              }
              className="w-full px-4 py-2 mb-2 bg-zinc-800 rounded-md focus:outline-none "
            />
            <Slider
              className="text-orange-400 pb-4"
              value={bet}
              minValue={0}
              maxValue={balance}
              hideThumb={true}
              onChange={handleSlider}
              step={1.0}
              defaultValue={0.5}
              formatOptions={{ style: "percent" }}
            />
          </div>
          <Button
            className="py-2 mb-1 bg-blue-500"
            onClick={handleFlip}
            disabled={isFlipping}
          >
            Flip
          </Button>
          <Button className="py-2 mb-2 bg-blue-500" onClick={handleReset}>
            Reset
          </Button>
          <div className="px-8 brightness-90">
            <Coin
              isFlipping={isFlipping}
              result={flipResult}
              onAnimationComplete={handleFlipComplete}
            />
          </div>
          <div className="flex flex-col text-blue-400 text-lg items-center">
            Balance: {balance.toFixed(2)}
          </div>
        </div>
        <div className="col-span-3 ml-8 px-8">
          {flips.length > 1 ? <FlipPlot flips={flips} /> : null}
        </div>
      </div>
    </main>
  );
}
