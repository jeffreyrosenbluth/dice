"use client";

import React, { useEffect, useState } from "react";
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
import { addFlip, flip, toCoinGameTable, BIAS, Face } from "@/app/lib/coin";
import { initialFlips } from "@/app/ctx";
import CurrencyInput from "react-currency-input-field";
import { useStateContext } from "@/app/ctx";
import HTPlot from "@/app/ui/htplot";
import clsx from "clsx";
import { useSupabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

const MINFLIPS = 20;
const MAXFLIPS = 300;

export default function Home() {
  const { model, setModel } = useStateContext();
  const router = useRouter();
  const [isFlipping, setIsFlipping] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [coinComplete, setCoinComplete] = useState(false);
  const supabase = useSupabase();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return router.push("/login");
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("coin_complete")
        .eq("id", user.id)
        .single();

      if (data && !error) {
        setCoinComplete(data.coin_complete);
      }
    };

    fetchProfile();
  });

  const handleFinishGame = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      let { data, error } = await supabase
        .from("profiles")
        .update({ coin_complete: true })
        .eq("id", user.id)
        .select();

      if (error) {
        console.error("Error updating profile:", error);
      } else {
        setCoinComplete(true);
        console.log("Game completed successfully!");
      }
      let updatesArray = toCoinGameTable(model.coinPlayFlips);
      ({ data, error } = await supabase.from("coin_game").upsert(updatesArray));

      if (error) {
        console.error("Error updating coin_game data:", error);
      } else {
        console.log("coin_game data updated successfully:", data);
      }
    }
  };

  const handleFlip = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      setModel((prevModel) => ({
        ...prevModel,
        coinPlayFlipResult: flip(model.coinPlayHT, BIAS),
      }));
    }
  };

  const handleFlipComplete = () => {
    setIsFlipping(false);
    setSelected(undefined);
    const newflip = addFlip(
      model.coinPlayFlips,
      model.coinPlayBet,
      model.coinPlayFlipResult,
      model.coinPlayHT
    );
    setModel((prevModel) => ({
      ...prevModel,
      coinPlayFlips: newflip,
      coinPlayBet: 0,
    }));
  };

  const handleReset = () => {
    setModel((prevModel) => ({ ...prevModel, coinPlayFlips: initialFlips }));
  };

  const handleSlider = (value: number | number[]) => {
    setModel((prevModel) => ({ ...prevModel, coinPlayBet: value as number }));
  };

  const handleInput = (value: any, name: any, values: any) => {
    setModel((prevModel) => ({
      ...prevModel,
      coinPlayBet: Math.min(balance, values!.float || 0),
    }));
  };

  const handleRadio = (value: string) => {
    setModel((prevModel) => ({ ...prevModel, coinPlayHT: value as Face }));
    setSelected(value as string);
  };

  const balance = model.coinPlayFlips[model.coinPlayFlips.length - 1].value;
  const heads =
    model.coinPlayFlips.filter((f) => f.coinResult === "heads").length - 1;

  return (
    <main className="flex min-h-screen flex-col space-y-6 mt-12">
      <div className="flex flex-row justify-center text-3xl text-slate-200">
        Coin Flipping Game
      </div>
      <div className="flex flex-row justify-center text-slate-200">
        Starting Balance: $100
      </div>
      <div className="grid grid-cols-12">
        <div className="flex flex-col gap-6 col-span-4 px-8 max-w-72 md:min-w-80">
          <RadioGroup
            className="flex gap-8"
            value={selected || ""}
            onValueChange={handleRadio}
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
              decimalsLimit={2}
              step={1}
              value={model.coinPlayBet}
              onValueChange={handleInput}
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
              formatOptions={{ style: "percent" }}
            />
          </div>
          <div className="flex flex-row justify-evenly">
            <Button
              className={clsx(
                "text-sm md:text-base py-2 mb-1 bg-blue-500",
                {
                  "opacity-50 ":
                    selected === undefined || model.coinPlayBet === 0,
                },
                {
                  "hover:opacity-50 hover:bg-blue-500 hover:border-transparent":
                    selected === undefined || model.coinPlayBet === 0,
                },
                "disabled:hover:opacity-50 disabled:hover:bg-blue-500 disabled:hover:border-transparent"
              )}
              onClick={handleFlip}
              disabled={
                isFlipping || selected === undefined || model.coinPlayBet === 0
              }
            >
              Flip
            </Button>
            {!coinComplete ? (
              <Button
                className={clsx(
                  "text-sm md:text-base py-2 mb-1 bg-blue-500",
                  {
                    "opacity-50 ": model.coinPlayFlips.length < MINFLIPS + 1,
                  },
                  {
                    "hover:opacity-50 hover:bg-blue-500 hover:border-transparent":
                      model.coinPlayFlips.length < MINFLIPS + 1,
                  },
                  "disabled:hover:opacity-50 disabled:hover:bg-blue-500 disabled:hover:border-transparent"
                )}
                disabled={model.coinPlayFlips.length < MINFLIPS + 1}
                onClick={handleFinishGame}
              >
                Finish
              </Button>
            ) : (
              <Button
                className="text-sm md:text-base py-2 mb-1 bg-blue-500"
                onClick={handleReset}
              >
                Reset
              </Button>
            )}
          </div>
          <div className="px-8 brightness-90">
            <Coin
              isFlipping={isFlipping}
              landedOn={model.coinPlayFlipResult}
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
            <FlipPlot flips={model.coinPlayFlips} completed={coinComplete} />
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
