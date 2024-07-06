import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center mt-12 px-48">
      <div className="text-3xl md:text-4xl font-bold text-slate-200  mt-12 mb-6 text-center">
        A Dice Rolling Investment Game
      </div>
      In this simulation, players bet on the flip of a biased coin to understand
      optimal bet sizing. Inspired by a study from Victor Haghani and Richard
      Dewey, participants start with $25 and have 30 minutes to place bets on a
      coin with a 60% chance of landing heads. They can wager any amount on each
      flip and keep their earnings, up to a maximum payout. Despite the
      favorable odds, many players struggle with bet sizing, revealing common
      behavioral biases and sub-optimal strategies. The optimal approach, based
      on the Kelly criterion, suggests betting 20% of one's wealth on each flip.
      This strategy maximizes the growth rate of wealth by balancing risk and
      reward. However, most players deviate, leading to erratic betting patterns
      and poor outcomes. Through this simulation, players learn about risk
      management and the importance of consistent, proportional betting. They
      experience firsthand the challenges of maintaining discipline and the
      pitfalls of emotional decision-making in investment scenarios.
      <div className="flex place-items-center"></div>
      <div className="text-2xl font-bold text-slate-200">Risk and Return</div>
      <div className="overflow-x-auto">
        <div className="min-w-full py-2 px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-6 py-3"></th>
                  <th scope="col" className="px-6 py-3">
                    Mean Return
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Standart Deviation
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Volatility Adjusted
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap px-6 py-3 font-medium text-blue-400">
                    S&P 500
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
                    Venture Capital
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
                    Money Market
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
      <div className="text-2xl font-bold text-slate-200 mt-12">
        Investment Net Returns
      </div>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Outcome
                    </th>
                    <th scope="col" className="px-6 py-3 text-blue-400">
                      S&P 500
                    </th>
                    <th scope="col" className="px-6 py-3 text-orange-400">
                      Venture Capital
                    </th>
                    <th scope="col" className="px-6 py-3 text-green-400">
                      Money Market
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
      <Link
        className="text-blue-300 mt-12"
        href="http://deanfoster.net/research/being_warren_buffett.pdf"
      >
        Based on:{" "}
        <em>
          {" "}
          Being Warren Buffett: A Classroom Simulation of Risk and Wealth When
          Investing in the Stock Market
        </em>
        , by Dean P. Foster and Robert A. Stein.
      </Link>
    </main>
  );
}
