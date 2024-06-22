"use client";

import React, { useState } from "react";
import { Button, RadioGroup, Radio, Input, Image } from "@nextui-org/react";
import FlipPlot from "@/app/ui/flipplot";
import Coin from "@/app/ui/coin";
import { addFlip, Flip } from "@/app/lib/coin";

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
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    setFlips(addFlip(flips, bet, headsTails));
    setIsFlipping(true);
    setTimeout(() => {
      setIsFlipping(false);
    }, 1000); // duration of the flip animation
  };

  const handleReset = () => {
    setFlips(initialFlips);
    setBet(10);
  };

  const flipResult = flips[flips.length - 1].coin;
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
          <Input
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            type="number"
            color="default"
            value={Math.min(bet, balance).toFixed(2)}
            onValueChange={(v) => setBet(parseFloat(v))}
            label="Bet Amount"
            labelPlacement="outside"
          />
          <Button className="py-2 mb-1" color="primary" onClick={handleFlip}>
            Flip
          </Button>
          <Button className="py-2 mb-2" color="primary" onClick={handleReset}>
            Reset
          </Button>
          <div className="px-8 brightness-90">
            <Coin isFlipping={isFlipping} result={flipResult} />
          </div>
          <div className="flex flex-col text-white text-lg items-center">
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
