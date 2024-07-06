import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center mt-12 px-48">
      <div className="text-3xl md:text-4xl font-bold text-slate-200  mt-12 mb-6 text-center">
        A Dice Rolling Investment Game
      </div>
      <div className="relative flex place-items-center mb-8">
        <p className="text-justify">
          Many students and practitioners of finance struggle to connect the
          concepts of variance and risk. This simulation, inspired by the work
          of Foster and Stine, aims to bridge that gap. In the game, players
          roll virtual dice representing the returns of three distinct types of
          investments: a risk-free money market instrument, the S&P 500, and a
          high-risk option like venture capital or meme stocks.
          <br />
          <br />
          Each investment behaves differently, illustrating real-world financial
          scenarios. As the simulation progresses, some players may experience
          remarkable success with the high-risk investment, accumulating
          significantly more wealth than their peers. However, the majority will
          encounter financial ruin due to the {"investment's"} extreme
          volatility—a phenomenon known as the {'"Variance Drain"'}.
          <br />
          <br />
          This stark contrast in outcomes often surprises players, highlighting
          the difficulty in distinguishing luck from skill in investment
          performance. Additionally, the simulation demonstrates how
          diversifying assets within a portfolio can reduce overall risk
          (variance). Players discover that combining two poor investments can
          unexpectedly result in a robust portfolio performance.
          <br />
          <br />
          By the end of the simulation, players gain a deeper understanding of
          financial volatility and the importance of diversification in managing
          investment risk.
        </p>
      </div>
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
      <br />
      <hr className="w-full border-t-2 border-slate-300" />
      <Link
        className="text-blue-300 mt-4 mb-12 "
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
