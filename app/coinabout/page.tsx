import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center mt-12 px-48">
      <div className="text-3xl md:text-4xl font-bold text-slate-200  mt-12 mb-6 text-center">
        A Coin Flipping Investment Game
      </div>
      <div>
        In this simulation, players bet on the flip of a biased coin to
        understand optimal bet sizing. Inspired by a study from Victor Haghani
        and Richard Dewey, participants start with $100 and place bets on a coin
        with a 60% chance of landing heads. They can wager any amount on each
        flip and keep track of their balance.
        <br />
        <br />
        Despite the favorable odds, many players struggle with bet sizing,
        revealing common behavioral biases and sub-optimal strategies. The
        optimal approach, based on expected utility or the Kelly criterion,
        suggests betting a fixed proportion of {" one's"} balance on each flip.
        This strategy balances risk and reward. However, most players deviate,
        leading to erratic betting patterns and poor outcomes.
        <br />
        <br />
        Through this simulation, players learn about risk management and the
        importance of consistent, proportional betting. They experience
        firsthand the challenges of maintaining discipline and the pitfalls of
        emotional decision-making in investment scenarios.
      </div>
      <Link
        className="text-blue-300 mt-12"
        href="https://elmwealth.com/lessons-from-betting-on-a-biased-coin-cool-heads-and-cautionary-tales/"
      >
        Based on:{" "}
        <em>
          {" "}
          Lessons from Betting on a Biased Coin: Cool heads and cautionary tales
        </em>
        , by Victor Haghani and Richard Dewey
      </Link>
    </main>
  );
}
