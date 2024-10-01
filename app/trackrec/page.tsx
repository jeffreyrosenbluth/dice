"use client";

import Coin from "@/app/ui/coin";
import { useState } from "react";
import { useStateContext } from "@/app/ctx";
import DiceButton from "@/app/ui/button";
import {
  addToss,
  toss,
  Face,
  trackRecProbability,
  entropy,
} from "@/app/lib/coin";

const COIN1_HEADS_BIAS = 0.6;
const COIN1_TAILS_BIAS = 1 - COIN1_HEADS_BIAS;
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

  // Calculate the prior probability of coin 1 being biased
  const prior = trackRecProbability(
    model.trackFlipFaces1.length,
    model.trackFlipFaces2.length,
    countHeads(model.trackFlipFaces1),
    countHeads(model.trackFlipFaces2),
    COIN1_HEADS_BIAS
  );

  // Calculate the posterior probabilities of coin 1 and coin 2 being biased
  // given heads and given tails.
  const posterior1H =
    (prior * COIN1_HEADS_BIAS) /
    (prior * COIN1_HEADS_BIAS + (1 - prior) * COIN2_HEADS_BIAS);
  const posterior1T =
    (prior * COIN1_TAILS_BIAS) /
    (prior * COIN1_TAILS_BIAS + (1 - prior) * COIN2_TAILS_BIAS);
  const posterior2H =
    ((1 - prior) * COIN1_HEADS_BIAS) /
    ((1 - prior) * COIN1_HEADS_BIAS + prior * COIN2_HEADS_BIAS);
  const posterior2T =
    ((1 - prior) * COIN1_TAILS_BIAS) /
    ((1 - prior) * COIN1_TAILS_BIAS + prior * COIN2_TAILS_BIAS);

  // Calculate the expected entropy of coin 1 and coin 2
  const p_heads1 = prior * COIN1_HEADS_BIAS + (1 - prior) * COIN2_HEADS_BIAS;
  const p_tails1 = 1 - p_heads1;
  const p_heads2 = (1 - prior) * COIN1_HEADS_BIAS + prior * COIN2_HEADS_BIAS;
  const p_tails2 = 1 - p_heads2;
  const entropy1H = entropy(posterior1H);
  const entropy1T = entropy(posterior1T);
  const entropy2H = entropy(posterior2H);
  const entropy2T = entropy(posterior2T);
  const entropy1 = p_heads1 * entropy1H + p_tails1 * entropy1T;
  const entropy2 = p_heads2 * entropy2H + p_tails2 * entropy2T;

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
        trackFlipResult1: toss(COIN1_HEADS_BIAS),
      }));
    }
  };

  const handleFlip2 = () => {
    if (!isFlipping2) {
      setIsFlipping2(true);
      setModel((prevModel) => ({
        ...prevModel,
        trackFlipResult2: toss(COIN1_TAILS_BIAS),
      }));
    }
  };

  return (
    <main className="flex min-h-screen flex-col space-y-6 mt-12">
      <div className="flex flex-row justify-center text-3xl text-slate-200 mb-6">
        Track Record Game
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-5 col-start-2 flex flex-col items-center gap-8">
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
            {(
              (100 * countHeads(model.trackFlipFaces1)) /
              model.trackFlipFaces1.length
            ).toFixed(2)}
          </div>
          <div>Probability Biased = {(100 * prior).toFixed(2)}</div>
        </div>
        <div className="col-span-5 col-start-7 flex flex-col items-center gap-8">
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
            {(
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
