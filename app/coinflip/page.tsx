"use client";

import React, { useState } from "react";
import { Button, RadioGroup, Radio, Input } from "@nextui-org/react";
import FlipPlot from "@/app/ui/flipplot";
import { addFlip } from "@/app/lib/coin";

const initialFlips = [
  { flip_num: 0, value: 100, value10: 100, value20: 100, kelly: 100 },
];

export default function Home() {
  const [flips, setFlips] = useState(initialFlips);
  const [bet, setBet] = useState(0);
  const [headsTails, setHeadsTails] = useState("heads");

  const handleFlip = () => {
    setFlips(addFlip(flips, bet, headsTails));
  };

  const handleReset = () => {
    setFlips(initialFlips);
  };

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
            value={bet.toFixed(2)}
            onValueChange={(v) => setBet(parseFloat(v))}
            label="Bet Amount"
            placeholder="0.00"
            labelPlacement="outside"
          />
          <Button className="py-2 mb-1" color="primary" onClick={handleFlip}>
            Flip
          </Button>
          <Button className="py-2 mb-2" color="primary" onClick={handleReset}>
            Reset
          </Button>
          <div className="text-blue-400">
            Winnings: {flips[flips.length - 1].value.toFixed(2)}
          </div>
        </div>
        <div className="col-span-3 ml-12">
          <FlipPlot flips={flips} />
        </div>
      </div>
    </main>
  );
}
