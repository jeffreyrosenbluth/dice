"use client";

import WealthPlot from "@/app/ui/wealthplot";
import ReturnPlot from "@/app/ui/returnplot";
import Die from "@/app/ui/die";
import DiceButton from "@/app/ui/button";
import Card from "@/app/ui/card";
import {
  Slider,
  Button,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState, useEffect } from "react";
import { addRoll, Assets, toDiceGameTable } from "@/app/lib/market";
import * as d3 from "d3";
import { useStateContext } from "@/app/ctx";
import { createClient } from "@/utils/supabase/client";
import { useAuth } from "@/app/authctx";
import { useRouter } from "next/navigation";

const initialWealth = [{ stock: 100, crypto: 100, cash: 100, portfolio: 100 }];
const initialReturns = [{ stock: 0, crypto: 0, cash: 0, portfolio: 0 }];

export default function Home() {
  const router = useRouter();
  const [isRolling, setIsRolling] = useState(false);
  const { model, setModel } = useStateContext();
  const resetModal = useDisclosure();
  const finishModal = useDisclosure();
  const {
    user,
    diceGameEnabled,
    diceComplete,
    setDiceComplete,
    diceGameRolls,
    override,
  } = useAuth();

  setDiceComplete(override || diceComplete);

  const supabase = createClient();

  useEffect(() => {
    if (!diceGameEnabled) {
      return router.push("/");
    }
  }, [diceGameEnabled, router]);

  const cashPercent =
    1 -
    (model.dicePlaySliders.stockSlider + model.dicePlaySliders.cryptoSlider);

  const handleRoll = () => {
    if (!isRolling) {
      setIsRolling(true);
    }
  };

  const roll = () => {
    setIsRolling(false);
    const [w, r] = addRoll(
      {
        stock: model.dicePlaySliders.stockSlider,
        crypto: model.dicePlaySliders.cryptoSlider,
        cash: cashPercent,
      },
      model.diceWealths,
      model.diceReturns
    );

    setModel({
      ...model,
      diceWealths: w,
      diceReturns: r,
    });
  };

  const reset = () => {
    setModel({
      ...model,
      diceWealths: initialWealth,
      diceReturns: initialReturns,
      includePortfolio: model.includePortfolio,
    });
  };

  const handleStockSlider = (value: number | number[]) => {
    setModel({
      ...model,
      dicePlaySliders: {
        ...model.dicePlaySliders,
        stockSlider: value as number,
      },
    });
  };

  const handleCryptoSlider = (value: number | number[]) => {
    setModel({
      ...model,
      dicePlaySliders: {
        ...model.dicePlaySliders,
        cryptoSlider: value as number,
      },
    });
  };

  const handlePortfolio = (checked: boolean) => {
    setModel({ ...model, includePortfolio: checked });
  };

  const handleFinishGame = async () => {
    if (diceComplete) {
      finishModal.onOpen();
      return;
    }
    if (user) {
      let { data, error } = await supabase
        .from("profiles")
        .update({ dice_complete: true })
        .eq("id", user.id)
        .select();

      let updatesArray = toDiceGameTable(model.diceWealths, user.id);
      ({ data, error } = await supabase.from("dice_game").upsert(updatesArray));

      setDiceComplete(true);
      console.log("Game completed successfully!");
    }
    finishModal.onOpen();
  };

  useEffect(() => {
    if (model.diceWealths.length === diceGameRolls + 1) {
      handleFinishGame();
    }
  }, [model.diceWealths]);

  const avgReturns = average(model.diceReturns.slice(1));

  return (
    <main className="flex min-h-screen flex-col mt-12">
      <div className="flex flex-row text-3xl text-slate-200 justify-center">
        Dice Game
      </div>
      <div className="flex flex-row text-slate-200 justify-center text-lg">
        Rolls: {model.diceWealths.length - 1}
      </div>
      <Modal
        isOpen={finishModal.isOpen}
        onClose={finishModal.onClose}
        isDismissable={false}
      >
        <ModalContent>
          <ModalHeader>
            <p className="text-red-600">Game Complete!</p>
          </ModalHeader>
          <ModalBody>
            <p>The dice game is complete. You can press Reset to play again.</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={finishModal.onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="grid grid-cols-9 mt-16">
        <div className="flex flex-col gap-4 col-span-2 px-8 max-w-56 md:min-w-56">
          {model.diceWealths.length !== diceGameRolls + 1 ? (
            <DiceButton
              onClick={handleRoll}
              disabled={
                isRolling || model.diceWealths.length === diceGameRolls + 1
              }
            >
              Roll
            </DiceButton>
          ) : (
            <>
              <DiceButton onClick={resetModal.onOpen}>Reset</DiceButton>
              <Modal isOpen={resetModal.isOpen} onClose={resetModal.onClose}>
                <ModalContent>
                  <ModalHeader>
                    <p className="text-red-600">Are you sure?</p>
                  </ModalHeader>
                  <ModalBody>
                    <p>You cannot undo this action.</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button onPress={reset}>Reset</Button>
                    <Button onPress={resetModal.onClose}>Close</Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          )}
          <div className="flex flex-col items-center">
            <Die isRolling={isRolling} onAnimationComplete={roll} />
          </div>
          <div className="flex flex-row justify-center mt-4">Portfolio</div>
          <div className="border p-2 mb-6 border-dotted border-gray-400">
            <Slider
              label="Stocks"
              className="text-blue-400 pb-4"
              value={model.dicePlaySliders.stockSlider}
              minValue={0}
              maxValue={2}
              hideThumb={true}
              onChange={handleStockSlider}
              step={0.01}
              defaultValue={0}
              formatOptions={{ style: "percent" }}
            />
            <Slider
              label="Crypto"
              className="text-orange-400 pb-4"
              value={model.dicePlaySliders.ventureSlider}
              minValue={0}
              maxValue={2}
              hideThumb={true}
              onChange={handleCryptoSlider}
              step={0.01}
              defaultValue={0.5}
              formatOptions={{ style: "percent" }}
            />
            <div className="flex text-sm justify-between text-green-400 text-left">
              <div>Bond</div>
              <div>{(100 * cashPercent).toFixed(0)}%</div>
            </div>
          </div>
          {/* <div className="border-y pt-2 mb-6 border-gray-200">
            <div className="flex text-sm justify-between text-blue-400 text-left py-2">
              <div>Stocks</div>
              <div>{(100 * model.dicePlaySliders.stockSlider).toFixed(0)}%</div>
            </div>
            <div className="flex text-sm justify-between text-orange-400 text-left py-2">
              <div>Crypto</div>
              <div>
                {(100 * model.dicePlaySliders.cryptoSlider).toFixed(0)}%
              </div>
            </div>
            <div className="flex text-sm justify-between text-green-400 text-left py-2">
              <div>Bond</div>
              <div>{(100 * cashPercent).toFixed(0)}%</div>
            </div>
          </div> */}
          <Switch
            isSelected={model.includePortfolio}
            onValueChange={handlePortfolio}
          >
            <span className="text-slate-200">Show Portfolio</span>
          </Switch>
        </div>
        <div className="col-span-5 ml-12">
          {model.diceReturns.length > 1 ? (
            <div className="flex flex-col gap-16">
              <WealthPlot
                wealth={model.diceWealths}
                includePortfolio={model.includePortfolio}
              />
              <ReturnPlot
                returns={model.diceReturns}
                includePortfolio={model.includePortfolio}
              />{" "}
            </div>
          ) : null}
        </div>
        <div className="col-span-2 flex flex-col gap-1 px-4 text-sm lg:text-base">
          <Card className="text-blue-400 bg-inherit">
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(
                model.diceWealths[model.diceWealths.length - 1].stock
              )}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.diceReturns[model.diceReturns.length - 1].stock - 1
              )}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.diceWealths[model.diceWealths.length - 1].stock,
                  model.diceWealths.length - 1
                )
              )}
            </p>
            <p>Average Return: {d3.format("10.0%")(avgReturns.stock - 1)}</p>
          </Card>
          <Card className="text-orange-400 bg-inherit">
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(
                model.diceWealths[model.diceWealths.length - 1].crypto
              )}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.diceReturns[model.diceReturns.length - 1].crypto - 1
              )}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.diceWealths[model.diceWealths.length - 1].crypto,
                  model.diceWealths.length - 1
                )
              )}
            </p>
            <p>Average Return: {d3.format("10.0%")(avgReturns.crypto - 1)}</p>
          </Card>
          <Card className="text-green-400 bg-inherit">
            <p>
              Wealth:{" "}
              {d3.format("$,.0f")(
                model.diceWealths[model.diceWealths.length - 1].cash
              )}{" "}
            </p>
            <p>
              Last Return:
              {d3.format("10.0%")(
                model.diceReturns[model.diceReturns.length - 1].cash - 1
              )}
            </p>
            <p>
              Annual Return:{" "}
              {d3.format("10.0%")(
                annualize(
                  model.diceWealths[model.diceWealths.length - 1].cash,
                  model.diceWealths.length - 1
                )
              )}
            </p>
            <p>Average Return: {d3.format("10.0%")(avgReturns.cash - 1)}</p>
          </Card>
          <div>
            {model.includePortfolio && (
              <Card className="text-white bg-inherit">
                <p>
                  Wealth:{" "}
                  {d3.format("$,.0f")(
                    model.diceWealths[model.diceWealths.length - 1].portfolio
                  )}{" "}
                </p>
                <p>
                  Last Return:
                  {d3.format("10.0%")(
                    model.diceReturns[model.diceReturns.length - 1].portfolio -
                      1
                  )}
                </p>
                <p>
                  Annual Return:{" "}
                  {d3.format("10.0%")(
                    annualize(
                      model.diceWealths[model.diceWealths.length - 1].portfolio,
                      model.diceWealths.length - 1
                    )
                  )}
                </p>
                <p>
                  Average Return: {d3.format("10.0%")(avgReturns.portfolio - 1)}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function annualize(wealth: number, years: number): number {
  return years > 0 ? (wealth / 100) ** (1 / years) - 1 : 0;
}

function average(returns: Assets[]): Assets {
  if (returns.length === 0) {
    return { stock: 1, crypto: 1, cash: 1, portfolio: 1 };
  }
  const sum = returns.reduce(
    (acc, r) => {
      acc.stock += r.stock;
      acc.crypto += r.crypto;
      acc.cash += r.cash;
      acc.portfolio += r.portfolio;
      return acc;
    },
    { stock: 0, crypto: 0, cash: 0, portfolio: 0 }
  );

  return {
    stock: sum.stock / returns.length,
    crypto: sum.crypto / returns.length,
    cash: sum.cash / returns.length,
    portfolio: sum.portfolio / returns.length,
  };
}
