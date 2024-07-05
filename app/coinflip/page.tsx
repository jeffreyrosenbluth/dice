"use client";

import React, { useState } from "react";
import {
  Button,
  RadioGroup,
  Radio,
  Slider,
  Card,
  CardHeader,
  Divider,
  CardBody,
} from "@nextui-org/react";
import FlipPlot from "@/app/ui/flipplot";
import Coin from "@/app/ui/coin";
import { addFlip, flip, Flip, BIAS } from "@/app/lib/coin";
import CurrencyInput from "react-currency-input-field";
import { useStateContext } from "@/app/ctx";
import HTPlot from "@/app/ui/htplot";

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
  const { model, setModel } = useStateContext();
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      setModel({ ...model, coinPlayFlipResult: flip(model.coinPlayHT, BIAS) });
    }
  };

  const handleFlipComplete = () => {
    setIsFlipping(false);
    setModel({
      ...model,
      coinPlayFlips: addFlip(
        model.coinPlayFlips,
        model.coinPlayBet,
        model.coinPlayFlipResult
      ),
    });
  };

  const handleReset = () => {
    setModel({ ...model, coinPlayFlips: initialFlips });
  };

  const handleSlider = (value: number | number[]) => {
    setModel({ ...model, coinPlayBet: value as number });
  };

  const balance = model.coinPlayFlips[model.coinPlayFlips.length - 1].value;
  const heads =
    model.coinPlayFlips.filter((f) => f.coin === "heads").length - 1;

  return (
    <main className="flex min-h-screen flex-col space-y-24 mt-12">
      <div className="flex flex-row justify-center text-3xl text-slate-200">
        Coin Flipping Game
      </div>
      <div className="grid grid-cols-12">
        <div className="flex flex-col gap-6 col-span-4 px-8 max-w-72 md:min-w-72">
          <RadioGroup
            className="flex gap-8"
            defaultValue="heads"
            value={model.coinPlayHT}
            onValueChange={(value) => setModel({ ...model, coinPlayHT: value })}
          >
            <Radio classNames={{ label: "text-xs md:text-base" }} value="heads">
              Heads (probability = 0.6)
            </Radio>
            <Radio classNames={{ label: "text-xs md:text-base" }} value="tails">
              Tails (probability = 0.4)
            </Radio>
          </RadioGroup>
          <div>
            <p className="text-sm md:text-base text-slate-200 mb-2">Bet Size</p>
            <CurrencyInput
              id="bet-input"
              name="bet-input"
              placeholder="Bet Size"
              prefix={"$ "}
              defaultValue={0}
              decimalsLimit={2}
              step={1}
              value={model.coinPlayBet}
              onValueChange={(value, name, values) =>
                setModel({
                  ...model,
                  coinPlayBet: Math.min(balance, values!.float || 0),
                })
              }
              className="text-sm md:text-base w-full px-4 py-2 mb-2 bg-zinc-800 rounded-md focus:outline-none "
            />
            <Slider
              className="text-orange-400 pb-4"
              value={model.coinPlayBet}
              minValue={0}
              maxValue={balance}
              hideThumb={true}
              onChange={handleSlider}
              step={1.0}
              defaultValue={0.5}
              formatOptions={{ style: "percent" }}
            />
          </div>
          <div className="flex flex-row justify-evenly">
            <Button
              className="text-sm md:text-base py-2 mb-1 bg-blue-500"
              onClick={handleFlip}
              disabled={isFlipping}
            >
              Flip
            </Button>
            <Button
              className="text-sm md:text-base py-2 mb-1 bg-blue-500"
              onClick={handleReset}
            >
              Reset
            </Button>
          </div>
          <div className="px-8 brightness-90">
            <Coin
              isFlipping={isFlipping}
              result={model.coinPlayFlipResult}
              onAnimationComplete={handleFlipComplete}
            />
          </div>
          <div className="text-base md:text-lg flex flex-col text-blue-400 items-center">
            Balance: {balance.toFixed(2)}
          </div>
          <Card className="bg-zinc-800">
            <CardHeader className="text-sm md:text-base justify-center">
              Statistics
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-row text-slate-200 text-xs md:text-sm gap-6 justify-stretch">
              <div className="text-red-500">Heads {heads}</div>
              <div className="text-zinc-400">
                Tails {model.coinPlayFlips.length - heads - 1}
              </div>
              <div>Flips {model.coinPlayFlips.length - 1}</div>
            </CardBody>
            <div className="flex flex-row text-slate-200 text-xs md:text-sm px-3 justify-start">
              <div>Heads</div>
              <div className="ml-4">
                {model.coinPlayFlips.length > 1
                  ? `${(
                      (100 * heads) /
                      (model.coinPlayFlips.length - 1)
                    ).toFixed(2)}%`
                  : null}
              </div>
            </div>
          </Card>
        </div>
        <div className="col-span-8 mx-8">
          {model.coinPlayFlips.length > 1 ? (
            <FlipPlot flips={model.coinPlayFlips} />
          ) : null}
          {model.coinPlayFlips.length > 1 ? (
            <div className="mt-10">
              <HTPlot flips={model.coinPlayFlips.slice(1)} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
