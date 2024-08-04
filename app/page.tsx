"use client";

import { Image } from "@nextui-org/react";

import { useCallback, useEffect, useState } from "react";
import { Link, Button } from "@nextui-org/react";
import { useSupabase } from "@/app/lib/supabase";

export default function Home() {
  const [coin, setCoin] = useState<boolean | null>(null);
  const supabase = useSupabase();

  const getProfile = useCallback(async () => {
    if (!supabase) return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.log("No user found");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("coin_complete")
        .eq("id", user.id)
        .single();

      if (error) {
        console.log(error);
        throw error;
      }

      if (data) {
        setCoin(data.coin_complete);
      }
    } catch (error) {
      alert("Error loading user data");
    }
  }, [supabase]);

  useEffect(() => {
    if (supabase) {
      getProfile();
    }
  }, [supabase, getProfile]);

  return (
    <main className="flex min-h-screen max-w-5xl flex-col flex-grow items-center justify-start gap-8 w-full">
      <div className="text-3xl md:text-4xl font-bold text-slate-200  mt-12 text-center">
        Experiments for Learning Finance
      </div>
      <div className="flex flex-col place-items-center">
        <Image src="/elf_blue.svg" alt="Elf" width={96} />
        <ul className="list-disc max-w-4xl">
          <li className="py-4">
            <div className="text-2xl mb-2 ">Coin Flip Game</div>
            <div>
              <p>
                In this game, you will start with $100 and bet on a biased coin
                flip. The coin has a 60% chance of landing on heads. You can bet
                on either heads or tails, wagering any amount up to your current
                balance for each flip. This game is inspired by a study from
                Victor Haghani and Richard Dewey.
              </p>
              <div className="text-xl font-medium mb-1 mt-4">Game Rules</div>
              <ul className="list-circle list-inside ml-4">
                <li>Minimum 20 flips required</li>
                <li>Maximum 300 flips allowed</li>
                <li>
                  After 20 flips, the{" "}
                  <span className="text-lg text-blue-400 font-semibold">
                    Finish
                  </span>{" "}
                  button becomes available
                </li>
              </ul>
              <div className="text-xl font-medium mb-1 mt-4">
                When you press
                <span className="text-blue-400 font-semibold">
                  {" "}
                  Finish
                </span>{" "}
              </div>
              <ul className="list-circle list-inside ml-4 mb-4">
                <li>Your data will be saved to a database</li>
                <li>
                  Your performance will be compared to other betting strategies
                </li>
                <li>The Coin Simulation section will unlock</li>
              </ul>
              <p>
                You can reset and play again, but additional games will not be
                saved.
              </p>
              <Button
                className="mt-4 mb-2 py-2 px-4 bg-blue-500"
                href="/coinplay"
                as={Link}
                variant="solid"
              >
                Play Coin Flip Game
              </Button>
              <div className="border-1 border-l-8 border-orange-500 p-4 mb-4 mt-4">
                <p className="font-semibold italic">
                  You must be logged in to play this game.
                </p>
              </div>
              {coin ? (
                <div>
                  Despite the favorable odds, many players struggle with bet
                  sizing, revealing common behavioral biases and sub-optimal
                  strategies. The optimal approach, based on expected utility or
                  the Kelly criterion, suggests betting a fixed proportion of{" "}
                  {" one's"} balance on each flip. This strategy balances risk
                  and reward. However, most players deviate, leading to erratic
                  betting patterns and poor outcomes.
                  <br />
                  <br />
                  Through this simulation, players learn about risk management
                  and the importance of consistent, proportional betting. They
                  experience firsthand the challenges of maintaining discipline
                  and the pitfalls of emotional decision-making in investment
                  scenarios.
                  <br />
                  <br />
                  <hr className="w-full border-t-2 border-slate-400" />
                  <Link
                    className="text-blue-300 mt-6"
                    href="https://elmwealth.com/lessons-from-betting-on-a-biased-coin-cool-heads-and-cautionary-tales/"
                  >
                    Based on:
                    <em>
                      Lessons from Betting on a Biased Coin: Cool heads and
                      cautionary tales{" "}
                    </em>
                    , by Victor Haghani and Richard Dewey
                  </Link>
                </div>
              ) : null}
            </div>
          </li>
          <li className="py-4">
            <div className="text-xl mb-2">Coin Flip Simulation</div>
            {coin ? (
              <p>
                Fix the betting strategy and run a simulation of the results to
                compare statistics of different strategies. You can change the
                number of flips per rounds, the number of simulations samples,
                the bias of the coin and the betting rule.
              </p>
            ) : (
              <div className="border-1 border-l-8 border-orange-500 p-4 mb-4 mt-4">
                <p className="font-semibold italic">
                  Complete the Coin Flip Game to unlock the simulation
                </p>
              </div>
            )}
          </li>
          <li className="py-4">
            <div className="text-xl mb-2">Dice Roll Game</div>
            <p>
              In this game, you will start with $100 and roll 3 dice. Each die
              is calibrated to represent a different investment, one the S&P
              500, one a venture capital investment, and one a money market
              investment. You will also create a portfolio of these investments
              with up to 2x levearge in the stock and venture investments. The
              app will keep track of cummulative balance for each investment and
              the portfolio and plot the results. It will also plot the
              histograms of each investment compared to its trure probability
              distrtibution.
              <br />
              <br />
              The dice roll game should be played before running any dice roll
              simulations or reading the about section of the Dice Rolling tab.
              That way you will be able to play the game without being biased by
              knowing the optimal strategy.
            </p>
          </li>
          <li className="py-4">
            <div className="text-xl mb-2">Dice Roll Simulation</div>
          </li>
        </ul>
      </div>
    </main>
  );
}
