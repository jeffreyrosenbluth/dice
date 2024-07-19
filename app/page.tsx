"use client";

import { Image } from "@nextui-org/react";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type User, SupabaseClient } from "@supabase/supabase-js";

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
        console.log(data);
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
      <div>
        {coin ? "Coin game completed" : "Please complete the coin game"}
      </div>
      <div className="flex flex-col place-items-center">
        <Image src="/elf_blue.svg" alt="Elf" width={96} />
        <ul className="list-disc max-w-2xl">
          <li className="py-4">
            <div className="text-xl mb-2 ">Coin Flip Game</div>
            <p>
              In this game, you will start with $100 and bet on the flip of a
              biased coin with the probability of heads set to 60%. You can bet
              on heads or tails and wager any amount up to your balance on each
              flip. The app will keep track of your balance and show a plot of
              your results compared to betting a constant $20, the kelly
              criteria (optimal bet) and a constant 10% of your balance.
              <br />
              <br />
              The coin flipgame should be played before running any coin
              flipping simulations or reading the about section of the Coin
              Flipping tab. That way you will be able to play the game without
              being biased by knowing the optimal strategy.
            </p>
          </li>
          <li className="py-4">
            <div className="text-xl mb-2">Coin Flip Simulation</div>
            <p>
              Fix the betting strategy and run a simulation of the results to
              compare statistics of different strategies. You can change the
              number of flips per rounds, the number of simulations samples, the
              bias of the coin and the betting rule.
            </p>
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
