"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  RadioGroup,
  Radio,
  Slider,
  Card,
  CardHeader,
  Divider,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import FlipPlot from "@/app/ui/flipplot";
import Coin from "@/app/ui/coin";
import { addFlip, flip, toCoinGameTable, Face } from "@/app/lib/coin";
import { initialFlips } from "@/app/ctx";
import { useStateContext } from "@/app/ctx";
import HTPlot from "@/app/ui/htplot";
import clsx from "clsx";
import { useAuth } from "@/app/authctx";

export default function Home() {
  const { model, setModel } = useStateContext();
  const [isFlipping, setIsFlipping] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const timerModal = useDisclosure();
  const {
    coinComplete,
    setCoinComplete,
    coinGameMaxFlips,
    coinGameBias,
    coinGameMinutes,
    setCoinFinalBalance,
    coinFinalBalance,
    coinGameMinFlips,
    coinGameUseTimer,
  } = useAuth();

  // Initialize timer state from localStorage or default
  const [timeRemaining, setTimeRemaining] = useState(() => {
    if (typeof window === 'undefined') return coinGameMinutes * 60;
    const savedStartTime = localStorage.getItem('coinGameStartTime');
    const savedIsRunning = localStorage.getItem('coinGameTimerRunning');

    if (savedStartTime && savedIsRunning === 'true') {
      const startTime = parseInt(savedStartTime);
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, coinGameMinutes * 60 - elapsed);
      return remaining;
    }
    return coinGameMinutes * 60;
  });

  // Calculate current balance
  const balance = model.coinPlayFlips[model.coinPlayFlips.length - 1].value;

  // Track when component has mounted on client
  useEffect(() => {
    setMounted(true);

    // Restore timer running state from localStorage
    const savedIsRunning = localStorage.getItem('coinGameTimerRunning');
    if (savedIsRunning === 'true' && !coinComplete) {
      setIsTimerRunning(true);
    }
  }, [coinComplete]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    // Check if player is bankrupt
    if (balance <= 0 && isTimerRunning && !gameEnded) {
      setTimeRemaining(0);
      handleFinishGame();
      return;
    }

    if (isTimerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !gameEnded) {
      handleFinishGame();
    }

    return () => clearInterval(timer);
  }, [isTimerRunning, timeRemaining, gameEnded, balance]);

  const startTimer = () => {
    const startTime = Date.now();
    localStorage.setItem('coinGameStartTime', startTime.toString());
    localStorage.setItem('coinGameTimerRunning', 'true');
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleFinishGame = () => {
    setCoinComplete(true);
    setCoinFinalBalance(balance);
    setIsTimerRunning(false);
    setGameEnded(true);
    localStorage.removeItem('coinGameStartTime');
    localStorage.removeItem('coinGameTimerRunning');
    timerModal.onOpen();
  };

  const handleFlip = () => {
    if (!isFlipping) {
      setIsFlipping(true);
      setModel((prevModel) => ({
        ...prevModel,
        coinPlayFlipResult: flip(coinGameBias),
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
    setTimeRemaining(coinGameMinutes * 60);
    setIsTimerRunning(false);
    setGameEnded(false);
    localStorage.removeItem('coinGameStartTime');
    localStorage.removeItem('coinGameTimerRunning');
    localStorage.removeItem('coinPlayFlips');
  };

  const handleSlider = (value: number | number[]) => {
    setModel((prevModel) => ({ ...prevModel, coinPlayBet: value as number }));
  };

  const handleRadio = (value: string) => {
    setModel((prevModel) => ({ ...prevModel, coinPlayHT: value as Face }));
    setSelected(value as string);
  };

  const heads =
    model.coinPlayFlips.filter((f) => f.coinResult === "heads").length - 1;

  if (!mounted) {
    return (
      <main className="flex min-h-screen flex-col space-y-6 mt-12 px-2 md:px-0">
        <div className="flex flex-row justify-center text-2xl md:text-3xl text-slate-200">
          Coin Flipping Game
        </div>
        <div className="flex flex-row text-lg md:text-xl justify-center text-blue-300">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col space-y-6 mt-12 px-2 md:px-0">
      <div className="flex flex-row justify-center text-2xl md:text-3xl text-slate-200">
        Coin Flipping Game
      </div>
      {coinFinalBalance !== null && (
        <div className="md:hidden flex justify-center">
          <div className="bg-slate-800 px-4 py-2 rounded-md border border-gray-600 shadow-lg">
            <div className="text-xs text-slate-400 text-center">Final Balance</div>
            <div className="text-lg font-semibold text-green-400">
              ${coinFinalBalance.toFixed(2)}
            </div>
          </div>
        </div>
      )}
      {!coinComplete ? (
        coinGameUseTimer ? (
          !isTimerRunning ? (
            <div className="flex flex-row justify-evenly">
              <Button
                className="text-base md:text-base py-3 md:py-2 px-6 md:px-4 mb-1 bg-green-600 min-w-[120px]"
                onClick={startTimer}
              >
                Start
              </Button>
            </div>
          ) : (
            <div className="flex flex-row justify-evenly text-lg md:text-xl text-green-500 font-medium">
              Time Remaining: {formatTime(timeRemaining)}
            </div>
          )
        ) : (
          <div className="flex flex-row justify-evenly">
            <Button
              onClick={handleFinishGame}
              disabled={model.coinPlayFlips.length - 1 < coinGameMinFlips}
              className={clsx("bg-orange-600 px-6 py-3 md:px-4 md:py-2 transition duration-200 text-base md:text-base min-w-[120px]", {
                "opacity-100": model.coinPlayFlips.length - 1 >= coinGameMinFlips,
                "opacity-50": model.coinPlayFlips.length - 1 < coinGameMinFlips,
              })}
            >
              Finish
            </Button>
          </div>
        )
      ) : null}
      <div className="flex flex-row text-lg md:text-xl justify-center text-blue-300">
        Balance: ${balance.toFixed(2)}
      </div>
      <Modal isOpen={timerModal.isOpen} onClose={timerModal.onClose}>
        <ModalContent>
          <ModalHeader>
            <p className="text-red-600">Game Complete!</p>
          </ModalHeader>
          <ModalBody>
            {balance <= 0 ? (
              <p>
                You went bankrupt! The game has ended. You can continue playing
                or press Reset to play again from scratch.
              </p>
            ) : (
              <p>
                The game has ended. You can continue playing or press Reset to
                play again from scratch.
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={timerModal.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0">
        <div className="flex flex-col gap-6 col-span-12 md:col-span-4 px-4 md:px-8 max-w-full md:max-w-72 md:min-w-80">
          <RadioGroup
            className="flex flex-col sm:flex-row gap-4 sm:gap-8"
            value={selected || ""}
            onValueChange={handleRadio}
          >
            <Radio
              size="lg"
              classNames={{
                label: "text-base md:text-base cursor-pointer",
                wrapper: "group-data-[selected=true]:border-blue-500 cursor-pointer",
                base: "cursor-pointer m-0",
                control: "cursor-pointer"
              }}
              value="heads"
            >
              Heads (probability = {coinGameBias})
            </Radio>
            <Radio
              size="lg"
              classNames={{
                label: "text-base md:text-base cursor-pointer",
                wrapper: "group-data-[selected=true]:border-blue-500 cursor-pointer",
                base: "cursor-pointer m-0",
                control: "cursor-pointer"
              }}
              value="tails"
            >
              Tails (probability = {1 - coinGameBias})
            </Radio>
          </RadioGroup>
          <div>
            <p className="text-base md:text-base text-slate-200 mb-2">Bet Size</p>
            <div className="relative mb-2">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base md:text-base text-slate-400">$</span>
              <input
                id="bet-input"
                type="number"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={model.coinPlayBet === 0 ? "" : model.coinPlayBet}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setModel((prevModel) => ({
                    ...prevModel,
                    coinPlayBet: val,
                  }));
                }}
                onFocus={(e) => e.target.select()}
                className="text-base md:text-base w-full pl-7 pr-4 py-3 md:py-2 bg-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Slider
              className="text-orange-400 pb-4"
              value={model.coinPlayBet}
              minValue={0}
              maxValue={balance}
              hideThumb={true}
              onChange={handleSlider}
              step={0.01}
              formatOptions={{ style: "percent" }}
            />
          </div>
          <div className="flex flex-row justify-evenly gap-4">
            <Button
              className={clsx(
                "text-base md:text-base py-3 md:py-2 px-6 md:px-4 mb-1 bg-blue-500 min-w-[120px]",
                {
                  "opacity-50 ":
                    selected === undefined ||
                    model.coinPlayBet === 0 ||
                    (!coinComplete && coinGameUseTimer && !isTimerRunning),
                },
                {
                  "hover:opacity-50 hover:bg-blue-500 hover:border-transparent":
                    selected === undefined ||
                    model.coinPlayBet === 0 ||
                    (!coinComplete && coinGameUseTimer && !isTimerRunning),
                },
                "disabled:hover:opacity-50 disabled:hover:bg-blue-500 disabled:hover:border-transparent"
              )}
              onClick={handleFlip}
              disabled={
                isFlipping ||
                selected === undefined ||
                model.coinPlayBet === 0 ||
                model.coinPlayFlips.length > coinGameMaxFlips ||
                (!coinComplete && coinGameUseTimer && !isTimerRunning)
              }
            >
              Flip
            </Button>
            {coinComplete && (
              <Button
                className="text-base md:text-base py-3 md:py-2 px-6 md:px-4 mb-1 bg-blue-500 min-w-[120px]"
                onClick={handleReset}
              >
                Reset
              </Button>
            )}
          </div>
          <div className="px-4 md:px-8 brightness-90">
            <Coin
              headsImage="../heads.png"
              tailsImage="../tails.png"
              isFlipping={isFlipping}
              landedOn={model.coinPlayFlipResult}
              onAnimationComplete={handleFlipComplete}
            />
          </div>
          {/* <div className="text-base md:text-lg flex flex-col text-blue-400 items-center">
            Balance: {balance.toFixed(2)}
          </div> */}
          <Card className="bg-zinc-800 mt-6">
            <CardHeader className="text-base md:text-base justify-center">
              Statistics
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-row text-slate-200 text-sm md:text-sm gap-4 md:gap-6 justify-stretch">
              <div className="text-yellow-600">Heads {heads}</div>
              <div className="text-zinc-400">
                Tails {model.coinPlayFlips.length - heads - 1}
              </div>
              <div>Flips {model.coinPlayFlips.length - 1}</div>
            </CardBody>
            <div className="flex flex-row text-slate-200 text-sm md:text-sm px-3 pb-2 justify-start">
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
        <div className="col-span-12 md:col-span-8 mx-4 md:mx-8">
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
