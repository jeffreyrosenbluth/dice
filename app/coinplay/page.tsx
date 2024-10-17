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
import { addFlip, flip, toCoinGameTable, BIAS, Face } from "@/app/lib/coin";
import { initialFlips } from "@/app/ctx";
import CurrencyInput from "react-currency-input-field";
import { useStateContext } from "@/app/ctx";
import HTPlot from "@/app/ui/htplot";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/app/authctx";

export default function Home() {
  const { model, setModel } = useStateContext();
  const [isFlipping, setIsFlipping] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const timerModal = useDisclosure();
  const finishModal = useDisclosure();
  const {
    user,
    coinComplete,
    setCoinComplete,
    coinGameMinFlips,
    coinGameMaxFlips,
    coinGameBias,
    coinGameMinutes,
    override,
  } = useAuth();

  setCoinComplete(override || coinComplete);

  const [timeRemaining, setTimeRemaining] = useState(coinGameMinutes * 60);
  const supabase = createClient();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !gameEnded) {
      handleFinishGame();
    }

    return () => clearInterval(timer);
  }, [isTimerRunning, timeRemaining, gameEnded]);

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleFinishGame = async () => {
    if (override) {
      setGameEnded(true);
      return;
    }
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
      setIsTimerRunning(false);
      setGameEnded(true);
      timerModal.onOpen();
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
      {!coinComplete ? (
        !isTimerRunning ? (
          <div className="flex flex-row justify-evenly">
            <Button
              className="text-sm md:text-base py-2 mb-1 bg-green-600"
              onClick={startTimer}
            >
              Start
            </Button>
          </div>
        ) : (
          <div className="flex flex-row justify-evenly text-xl text-green-500 font-medium">
            Time Remaining: {formatTime(timeRemaining)}
          </div>
        )
      ) : null}
      <div className="flex flex-row text-xl justify-center text-blue-300">
        Balance: ${balance.toFixed(0)}
      </div>
      <Modal isOpen={timerModal.isOpen} onClose={timerModal.onClose}>
        <ModalContent>
          <ModalHeader>
            <p className="text-red-600">Game Complete!</p>
          </ModalHeader>
          <ModalBody>
            <p>
              The game has ended and your results have been submitted. You can
              contiune playing or press Reset to play again from scratch.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={timerModal.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="grid grid-cols-12">
        <div className="flex flex-col gap-6 col-span-4 px-8 max-w-72 md:min-w-80">
          <RadioGroup
            className="flex gap-8"
            value={selected || ""}
            onValueChange={handleRadio}
          >
            <Radio classNames={{ label: "text-xs md:text-base" }} value="heads">
              Heads (probability = {coinGameBias})
            </Radio>
            <Radio classNames={{ label: "text-xs md:text-base" }} value="tails">
              Tails (probability = {1 - coinGameBias})
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
                    selected === undefined ||
                    model.coinPlayBet === 0 ||
                    (!coinComplete && !isTimerRunning),
                },
                {
                  "hover:opacity-50 hover:bg-blue-500 hover:border-transparent":
                    selected === undefined ||
                    model.coinPlayBet === 0 ||
                    (!coinComplete && !isTimerRunning),
                },
                "disabled:hover:opacity-50 disabled:hover:bg-blue-500 disabled:hover:border-transparent"
              )}
              onClick={handleFlip}
              disabled={
                isFlipping ||
                selected === undefined ||
                model.coinPlayBet === 0 ||
                model.coinPlayFlips.length > coinGameMaxFlips ||
                (!coinComplete && !isTimerRunning)
              }
            >
              Flip
            </Button>
            {!coinComplete ? (
              <>
                <Button
                  className={clsx(
                    "text-sm md:text-base py-2 mb-1 bg-blue-500",
                    {
                      "opacity-50 ":
                        model.coinPlayFlips.length < coinGameMinFlips + 1,
                    },
                    {
                      "hover:opacity-50 hover:bg-blue-500 hover:border-transparent":
                        model.coinPlayFlips.length < coinGameMinFlips + 1,
                    },
                    "disabled:hover:opacity-50 disabled:hover:bg-blue-500 disabled:hover:border-transparent"
                  )}
                  disabled={model.coinPlayFlips.length < coinGameMinFlips + 1}
                  onClick={finishModal.onOpen}
                >
                  Finish
                </Button>
                <Modal
                  isOpen={finishModal.isOpen}
                  onClose={finishModal.onClose}
                >
                  <ModalContent>
                    <ModalHeader>
                      <p className="text-red-600">Are you sure?</p>
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        The game will end and your results will be submitted.
                        You cannot undo this action.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button onPress={handleFinishGame}>Finish</Button>
                      <Button onPress={finishModal.onClose}>Close</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
              </>
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
            <CardHeader className="text-sm md:text-base justify-center">
              Statistics
            </CardHeader>
            <Divider />
            <CardBody className="flex flex-row text-slate-200 text-xs md:text-sm gap-6 justify-stretch">
              <div className="text-yellow-600">Heads {heads}</div>
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
