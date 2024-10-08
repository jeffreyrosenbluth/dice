"use client";

import Coin from "@/app/ui/coin";
import { useRef, useState } from "react";
import { useStateContext } from "@/app/ctx";
import DiceButton from "@/app/ui/button";
import {
  addToss,
  toss,
  Face,
  trackRecProbability,
  entropy,
} from "@/app/lib/coin";
import { Slider } from "@nextui-org/react";
import clsx from "clsx";

const COIN2_HEADS_BIAS = 0.5;
const COIN2_TAILS_BIAS = 1 - COIN2_HEADS_BIAS;

function countHeads(faces: Face[]): number {
  return faces.filter((face) => face === "heads").length;
}

function countTails(faces: Face[]): number {
  return faces.filter((face) => face === "tails").length;
}

export default function Home() {
  const { model, setModel } = useStateContext();
  const [isFlipping1, setIsFlipping1] = useState(false);
  const [isFlipping2, setIsFlipping2] = useState(false);
  const tailBias = 1 - model.trackBias;

  // Calculate the prior probability of coin 1 being biased
  const prior = trackRecProbability(
    model.trackFlipFaces1.length,
    model.trackFlipFaces2.length,
    countHeads(model.trackFlipFaces1),
    countHeads(model.trackFlipFaces2),
    model.trackBias
  );

  // Calculate the posterior probabilities of coin 1 and coin 2 being biased
  // given heads and given tails.
  const posterior1H =
    (prior * model.trackBias) /
    (prior * model.trackBias + (1 - prior) * COIN2_HEADS_BIAS);
  const posterior1T =
    (prior * tailBias) / (prior * tailBias + (1 - prior) * COIN2_TAILS_BIAS);
  const posterior2H =
    ((1 - prior) * model.trackBias) /
    ((1 - prior) * model.trackBias + prior * COIN2_HEADS_BIAS);
  const posterior2T =
    ((1 - prior) * tailBias) /
    ((1 - prior) * tailBias + prior * COIN2_TAILS_BIAS);

  // Calculate the expected entropy of coin 1 and coin 2
  const p_heads1 = prior * model.trackBias + (1 - prior) * COIN2_HEADS_BIAS;
  const p_tails1 = 1 - p_heads1;
  const p_heads2 = (1 - prior) * model.trackBias + prior * COIN2_HEADS_BIAS;
  const p_tails2 = 1 - p_heads2;
  const entropy1H = entropy(posterior1H);
  const entropy1T = entropy(posterior1T);
  const entropy2H = entropy(posterior2H);
  const entropy2T = entropy(posterior2T);
  const entropy1 = p_heads1 * entropy1H + p_tails1 * entropy1T;
  const entropy2 = p_heads2 * entropy2H + p_tails2 * entropy2T;

  const trackCoin1 = useRef(Math.random() < 0.5);

  const handleFlipComplete1 = () => {
    setIsFlipping1(false);
    setModel((prevModel) => ({
      ...prevModel,
      trackFlipFaces1: addToss(model.trackFlipFaces1, model.trackFlipResult1),
    }));
  };

  const handleFlipComplete2 = () => {
    setIsFlipping2(false);
    setModel((prevModel) => ({
      ...prevModel,
      trackFlipFaces2: addToss(model.trackFlipFaces2, model.trackFlipResult2),
    }));
  };

  const handleFlip1 = () => {
    if (!isFlipping1) {
      setIsFlipping1(true);
      setModel((prevModel) => ({
        ...prevModel,
        trackFlipResult1: toss(model.trackBias),
      }));
    }
  };

  const handleFlip2 = () => {
    if (!isFlipping2) {
      setIsFlipping2(true);
      setModel((prevModel) => ({
        ...prevModel,
        trackFlipResult2: toss(COIN2_HEADS_BIAS),
      }));
    }
  };

  const handleSlider = (value: number | number[]) => {
    setModel((prevModel) => ({ ...prevModel, trackBias: value as number }));
  };

  return (
    <main className="flex min-h-screen flex-col space-y-6 mt-12">
      <div className="flex flex-row justify-center text-3xl text-slate-200 mb-6">
        Track Record Game
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2 col-start-2 flex flex-col items-center gap-4">
          <Slider
            label="Coin Bias"
            value={model.trackBias}
            minValue={0.5}
            maxValue={1.0}
            hideThumb={true}
            onChange={handleSlider}
            step={0.01}
            formatOptions={{ style: "percent" }}
            defaultValue={0.6}
          />
        </div>
        <div></div>
        <div
          className={clsx(
            "col-span-3 flex flex-col items-center gap-8",
            trackCoin1.current ? "order-1" : "order-2"
          )}
        >
          <Coin
            headsImage="../heads_gold.png"
            tailsImage="../tails_gold.png"
            isFlipping={isFlipping1}
            landedOn={model.trackFlipResult1 === "heads" ? 1 : 0}
            onAnimationComplete={handleFlipComplete1}
          />
          <DiceButton onClick={handleFlip1}>Flip</DiceButton>
          <div>Flips: {model.trackFlipFaces1.length}</div>
          <div>Heads: {countHeads(model.trackFlipFaces1)}</div>
          <div>Tails: {countTails(model.trackFlipFaces1)}</div>
          <div>
            % Heads:{" "}
            {model.trackFlipFaces1.length <= 0
              ? "0"
              : (
                  (100 * countHeads(model.trackFlipFaces1)) /
                  model.trackFlipFaces1.length
                ).toFixed(2)}
          </div>
          <div>Probability Biased = {(100 * prior).toFixed(2)}</div>
        </div>
        <div
          className={clsx(
            "col-span-3 flex flex-col items-center gap-8",
            trackCoin1.current ? "order-2" : "order-1"
          )}
        >
          <Coin
            headsImage="../heads_silver.png"
            tailsImage="../tails_silver.png"
            isFlipping={isFlipping2}
            landedOn={model.trackFlipResult2 === "heads" ? 1 : 0}
            onAnimationComplete={handleFlipComplete2}
          />
          <DiceButton onClick={handleFlip2}>Flip</DiceButton>
          <div>Flips: {model.trackFlipFaces2.length}</div>
          <div>Heads: {countHeads(model.trackFlipFaces2)}</div>
          <div>Tails: {countTails(model.trackFlipFaces2)}</div>
          <div>
            % Heads:{" "}
            {model.trackFlipFaces2.length <= 0
              ? "0"
              : (
                  (100 * countHeads(model.trackFlipFaces2)) /
                  model.trackFlipFaces2.length
                ).toFixed(2)}
          </div>
          <div>Probability Biased = {(100 * (1 - prior)).toFixed(2)}</div>
        </div>
      </div>
      {/* <div>Expected Entropy Coin 1 = {(100 * entropy1).toFixed(4)}</div>
      <div>Expected Entropy Coin 2 = {(100 * entropy2).toFixed(4)}</div>
      <div className="text-lg font-semibold text-yellow-500">
        Choose --- Coin {entropy1 <= entropy2 ? 1 : 2} --- for next flip
      </div> */}
    </main>
  );
}
