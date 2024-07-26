"use client";

import { Image } from "@nextui-org/react";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User, SupabaseClient } from "@supabase/supabase-js";
import { Link, Button } from "@nextui-org/react";

export default function Home() {
  // const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [coin, setCoin] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    setSupabase(createClient());
  }, []);

  const getProfile = useCallback(async () => {
    if (!supabase) return;

    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      console.log(user);

      if (!user) {
        console.log("No user found");
        setLoading(false);
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
    } finally {
      setLoading(false);
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
        <ul className="list-disc max-w-3xl">
          <li className="py-4">
            <div className="text-2xl mb-2 ">Coin Flip Game</div>
            <p>
              In this game, you will start with $100 and bet on a biased coin
              flip. The coin has a 60% chance of landing on heads. You can bet
              on either heads or tails, wagering any amount up to your current
              balance for each flip.
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
              <span className="text-blue-400 font-semibold"> Finish</span>{" "}
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
