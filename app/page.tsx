"use client";

import { Image } from "@nextui-org/react";
import { Link, Button } from "@nextui-org/react";
import { useAuth } from "@/app/authctx";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStateContext, initialModel } from "@/app/ctx";

const Page = () => {
  const {
    loading,
    user,
    refreshUser,
    coinComplete,
    diceComplete,
    coinGameMinFlips,
    coinGameMaxFlips,
    coinGameBias,
    coinGameMinutes,
    diceGameEnabled,
    diceGameMinRolls,
    diceGameMaxRolls,
    diceSimEnabled,
  } = useAuth();

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const ctx = useStateContext();
  const searchParams = useSearchParams();
  const authParam = searchParams.get("auth");
  useEffect(() => {
    if (authParam === "success") {
      ctx.setModel(initialModel);
    }
  }, [authParam]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-screen max-w-5xl flex-col flex-grow items-center justify-start gap-8 w-full">
      <div className="text-4xl md:text-4xl font-bold text-slate-200  mt-12 text-center">
        Experiments for Learning Finance
      </div>
      <div className="flex flex-col place-items-center">
        <Image src="/elf_blue.svg" alt="Elf" width={96} />
        <div className="max-w-3xl">
          <div className="py-4">
            <div className="text-3xl text-blue-400 font-medium mb-2 ">
              Coin Flip Game
            </div>
            <div>
              <p>
                In this game, you will start with $100 and bet on a biased coin
                flip. The coin has a {coinGameBias * 100}% chance of landing on
                heads. You can bet on either heads or tails, wagering any amount
                up to your current balance for each flip. This game is inspired
                by a study from Victor Haghani and Richard Dewey.
              </p>
              <div className="text-xl font-medium mb-1 mt-4">Game Rules</div>
              <div className="list-circle list-inside ml-4">
                <div>Minimum {coinGameMinFlips} flips required</div>
                <div>Maximum {coinGameMaxFlips} flips allowed</div>
                <div>
                  You have a {coinGameMinutes} minutes to complete the game
                </div>
                <div>
                  After {coinGameMinFlips} flips, the{" "}
                  <span className="text-lg text-blue-400 font-semibold">
                    Finish
                  </span>{" "}
                  button becomes available
                </div>
              </div>
              <div className="text-xl font-medium mb-1 mt-4">
                When you press
                <span className="text-blue-400 font-semibold"> Finish</span> or
                run out of time
              </div>
              <div className="list-circle list-inside ml-4 mb-4">
                <div>Your data will be saved to a database</div>
                <div>
                  Your performance will be compared to other betting strategies
                </div>
                <div>A discussion of this game will be shown below </div>
              </div>
              <p>
                You can reset and play again, but additional games will not be
                saved.
              </p>
              <div className="text-blue-400 mt-2 mb-2">
                To play choose <code className="text-white">Game</code> from the{" "}
                <code className="text-white">Coin Flipping</code> menu.
              </div>
              {/* <Button
                className="mt-4 mb-2 py-2 px-4 bg-blue-500"
                href="/coinplay"
                as={Link}
                variant="solid"
                isDisabled={!user}
              >
                Play Coin Flip Game
              </Button> */}
              {!user ? (
                <div className="border-1 border-l-8 border-orange-500 p-4 mb-4 mt-4">
                  <p className="font-semibold italic">
                    You must be signed in to play this game. Press the Sign In
                    button to sign in or sign up. Or click
                  </p>
                  <Link
                    href="/login"
                    className="text-blue-400 font-semibold underline"
                  >
                    here
                  </Link>
                </div>
              ) : null}
              {coinComplete ? (
                <>
                  <div className=" text-orange-400 text-xl font-medium mb-1 mt-4">
                    Discussion
                  </div>
                  <div className="text-orange-400">
                    Despite the favorable odds, many players struggle with bet
                    sizing, revealing common behavioral biases and sub-optimal
                    strategies. The optimal approach, based on expected utility
                    or the Kelly criterion, suggests betting a fixed proportion
                    of {" one's"} balance on each flip. In this game the Kelly
                    proportion is 20%. This strategy balances risk and reward.
                    However, most players deviate, leading to erratic betting
                    patterns and poor outcomes. We recommend reading the note
                    referenced below for a more detailed discussion.
                    <br />
                    <br />
                    Through this game, you will learn about risk management and
                    the importance of consistent, proportional betting. You will
                    experience firsthand the challenges of maintaining
                    discipline and the pitfalls of emotional decision-making in
                    investment scenarios.
                    <br />
                    <br />
                    <hr className="w-full border-t-2 border-slate-400 mb-4" />
                    <Link
                      href="https://elmwealth.com/lessons-from-betting-on-a-biased-coin-cool-heads-and-cautionary-tales/"
                      className="inline text-left text-blue-300 mt-6"
                    >
                      <span className="whitespace-nowrap mr-1">Based on: </span>
                      <em>
                        Lessons from Betting on a Biased Coin: Cool heads and
                        cautionary tales
                      </em>
                      , by Victor Haghani and Richard Dewey
                    </Link>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div className="py-4">
            <div className="text-3xl text-blue-400 font-medium mb-2">
              Coin Flip Simulation
            </div>
            {coinComplete ? (
              <>
                <p>
                  Now that you have completed the Coin Flip Game, you can run a
                  simulation with a fixed betting strategy. Run a simulation of
                  the results to compare statistics of different strategies. You
                  can change the number of flips per rounds, the number of
                  simulations samples, the bias of the coin and the betting
                  rule.
                </p>
                <div className="text-blue-400 mt-2 mb-2">
                  To play choose <code className="text-white">Simulation</code>{" "}
                  from the <code className="text-white">Coin Flipping</code>{" "}
                  menu.
                </div>
                {/* <Button
                  className="mt-4 mb-2 py-2 px-4 bg-blue-500"
                  href="/coinsim"
                  as={Link}
                  variant="solid"
                  isDisabled={!user}
                >
                  Coin Flip Simulation
                </Button> */}
              </>
            ) : (
              <div className="border-1 border-l-8 border-orange-500 p-4 mb-4 mt-4">
                <p className="font-semibold italic">
                  Complete the Coin Flip Game to unlock the simulation
                </p>
              </div>
            )}
          </div>
          {diceGameEnabled ? (
            <div className="py-4">
              <div className="text-3xl text-blue-400 font-medium mb-2">
                Dice Roll Game
              </div>
              <p>
                In this game, you will start with $100 and roll 3 dice. Each die
                is calibrated to represent a different investment, one stocks ,
                one a crypto investment, and one a bond investment. You will
                also create a portfolio of these investments with up to 2x
                levearge in the stock and crypto investments. The app will keep
                track of cummulative balance for each investment and the
                portfolio and plot the results. It will also plot the histograms
                of each investment compared to its trure probability
                distrtibution.
              </p>
              <div className="text-xl font-medium mb-1 mt-4">Game Rules</div>
              <div className="list-circle list-inside ml-4">
                <div>Minimum {diceGameMinRolls} rolls required</div>
                <div>Maximum {diceGameMaxRolls} rolls allowed</div>
                <div>
                  After {diceGameMinRolls} rolls, the{" "}
                  <span className="text-lg text-blue-400 font-semibold">
                    Finish
                  </span>{" "}
                  button becomes available
                </div>
              </div>
              <div className="text-xl font-medium mb-1 mt-4">
                When you press
                <span className="text-blue-400 font-semibold">
                  {" "}
                  Finish
                </span>{" "}
              </div>
              <div className="list-circle list-inside ml-4 mb-4">
                <div>Your data will be saved to a database</div>
                <div>A discussion of the Dice Game will appear below</div>
                <div>The Dice Simulation section will unlock</div>
              </div>
              <p>
                You can reset and play again, but additional games will not be
                saved.
              </p>
              <Button
                className="mt-4 mb-2 py-2 px-4 bg-blue-500"
                href="/diceplay"
                as={Link}
                variant="solid"
                isDisabled={!user}
              >
                Play Dice Roll Game
              </Button>
              <div className="border-1 border-l-8 border-orange-500 p-4 mb-4 mt-4">
                <p className="font-semibold italic">
                  You must be signed in to play this game.
                </p>
              </div>
              <br />
              <br />
              <div className="flex place-items-center"></div>
              <div className="text-2xl font-bold text-slate-200 text-center">
                Risk and Return
              </div>
              <div className="overflow-x-auto mx-auto max-w-2xl">
                <div className="min-w-full py-2 px-6 lg:px-8">
                  <div className="overflow-hidden">
                    <table className="min-w-full text-left text-sm font-light">
                      <thead className="border-b font-medium dark:border-neutral-500">
                        <tr>
                          <th scope="col" className="px-6 py-3"></th>
                          <th scope="col" className="px-6 py-3 text-right">
                            Mean Return
                          </th>
                          <th scope="col" className="px-6 py-3 text-right">
                            Standard Deviation
                          </th>
                          <th scope="col" className="px-6 py-3 text-right">
                            Volatility Adjusted
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b dark:border-neutral-500">
                          <td className="whitespace-nowrap px-6 py-3 font-medium text-blue-400">
                            Stocks
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right">
                            7.0%
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right">
                            20.0%
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right">
                            5.1%
                          </td>
                        </tr>
                        <tr className="border-b dark:border-neutral-500">
                          <td className="whitespace-nowrap px-6 py-3 font-medium text-orange-400">
                            Crypto
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right">
                            71.0%
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right">
                            132.0%
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right">
                            -16.9%
                          </td>
                        </tr>
                        <tr className="border-b dark:border-neutral-500">
                          <td className="whitespace-nowrap px-6 py-3 font-medium text-green-400">
                            Bond
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right">
                            2.0%
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right">
                            0.0%
                          </td>
                          <td className="whitespace-nowrap px-6 py-3 text-right">
                            2.0%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-200 mt-12 text-center">
                Investment Net Returns
              </div>
              <div className="flex flex-col">
                <div className="overflow-x-auto mx-auto mb-4 max-w-2xl">
                  <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                    <div className="overflow-hidden">
                      <table className="min-w-full text-left text-sm font-light">
                        <thead className="border-b font-medium dark:border-neutral-500">
                          <tr>
                            <th scope="col" className="px-6 py-3">
                              Outcome
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-blue-400"
                            >
                              Stocks
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-orange-400"
                            >
                              Crypto
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-right text-green-400"
                            >
                              Bond
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b dark:border-neutral-500">
                            <td className="whitespace-nowrap px-6 py-3 text-center">
                              1
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              -20%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              -95%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              2%
                            </td>
                          </tr>
                          <tr className="border-b dark:border-neutral-500">
                            <td className="whitespace-nowrap px-6 py-3 text-center">
                              2
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              -10%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              -80%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              2%
                            </td>
                          </tr>
                          <tr className="border-b dark:border-neutral-500">
                            <td className="whitespace-nowrap px-6 py-3 text-center">
                              3
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              2%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              0%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              2%
                            </td>
                          </tr>
                          <tr className="border-b dark:border-neutral-500">
                            <td className="whitespace-nowrap px-6 py-3 text-center">
                              4
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              10%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              200%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              2%
                            </td>
                          </tr>
                          <tr className="border-b dark:border-neutral-500">
                            <td className="whitespace-nowrap px-6 py-3 text-center">
                              5
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              20%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              200%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              2%
                            </td>
                          </tr>
                          <tr className="border-b dark:border-neutral-500">
                            <td className="whitespace-nowrap px-6 py-3 text-center">
                              6
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              40%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              200%
                            </td>
                            <td className="whitespace-nowrap px-6 py-3 text-right">
                              2%
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {diceComplete && diceGameEnabled ? (
            <>
              <div className=" text-orange-400 text-xl font-medium mb-1 mt-4">
                Discussion
              </div>
              <div className="text-orange-400">
                <p className="text-justify">
                  Many students and practitioners of finance struggle to connect
                  the concepts of variance and risk. This game, inspired by the
                  work of Foster and Stine, aims to bridge that gap. In the
                  game, players roll virtual dice representing the returns of
                  three distinct types of investments: a risk-free bond, stocks,
                  and a high-risk option like crypto or meme stocks.
                  <br />
                  <br />
                  Each investment behaves differently, illustrating real-world
                  financial scenarios. As the simulation progresses, some
                  players may experience remarkable success with the high-risk
                  investment, accumulating significantly more wealth than their
                  peers. However, the majority will encounter financial ruin due
                  to the {"investment's"} extreme volatility—a phenomenon known
                  as the {'"Variance Drain"'}.
                  <br />
                  <br />
                  This stark contrast in outcomes often surprises players,
                  highlighting the difficulty in distinguishing luck from skill
                  in investment performance. Additionally, the simulation
                  demonstrates how diversifying assets within a portfolio can
                  reduce overall risk (variance). Players discover that
                  combining two poor investments can unexpectedly result in a
                  robust portfolio performance.
                  <br />
                  <br />
                  By the end of the game, players gain a deeper understanding of
                  financial volatility and the importance of diversification in
                  managing investment risk.
                </p>
                <div>
                  <hr className="w-full border-t-2 border-slate-400 mb-4 mt-4" />
                  <Link
                    href="http://deanfoster.net/research/being_warren_buffett.pdf"
                    className="inline text-left text-blue-300 mt-6"
                  >
                    <span className="whitespace-nowrap mr-1">Based on: </span>
                    <em>
                      Being Warren Buffett: A Classroom Simulation of Risk and
                      Wealth When Investing in the Stock Market
                    </em>
                    , by Dean P. Foster and Robert A. Stein.
                  </Link>
                </div>
              </div>
            </>
          ) : diceSimEnabled ? (
            <div className="border-1 border-l-8 border-orange-500 p-4 mb-4 mt-4">
              <p className="font-semibold italic">
                Complete the Dice Roll to unlock the simulation
              </p>
            </div>
          ) : null}
          <div className="py-4">
            {diceComplete && diceSimEnabled ? (
              <>
                <div className="text-3xl text-blue-400 font-medium mb-2">
                  Dice Roll Simulation
                </div>
                <p>
                  Set the portfolio weights, rolls per sample, and number of
                  samples. Then run a simulation of the results to compare
                  statistics of the different investments. Including the
                  arithmetic, geometric mean returns and the volatility drag.
                </p>
              </>
            ) : diceSimEnabled ? (
              <div className="border-1 border-l-8 border-orange-500 p-4 mb-4 mt-4">
                <p className="font-semibold italic">
                  Complete the Dice Roll Game to unlock the simulation
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
};

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
}
