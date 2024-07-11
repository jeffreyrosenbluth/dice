"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Image } from "@nextui-org/react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const refresh = searchParams.get("refresh");
    if (refresh === "true") {
      // Remove the refresh parameter from the URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("refresh");
      router.replace(newUrl.toString());

      // Force a re-render of the entire app
      window.location.reload();
    }
  }, [searchParams, router]);

  return (
    <main className="flex min-h-screen max-w-5xl flex-col flex-grow items-center justify-start gap-8 w-full">
      <div className="text-3xl md:text-4xl font-bold text-slate-200  mt-12 text-center">
        Experiments for Learning Finance
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
          </li>
          <li className="py-4">
            <div className="text-xl mb-2">Dice Roll Simulation</div>
          </li>
        </ul>
      </div>
    </main>
  );
}
