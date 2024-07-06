import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center mt-12 px-48">
      <div className="text-3xl md:text-4xl font-bold text-slate-200  mt-12 mb-6 text-center">
        A Simulation of Investment Risk and Return
      </div>
      <div className="relative flex place-items-center mb-8">
        <p className="text-justify">
          Both students practioners of finance often have a hard time making the
          connection between variance and risk. In this simulation, which is
          based on the work of Foster and Stine, players roll virtual dice that
          simulate the returns of three investments. The three investments
          behave very differently: one is like a risk free money market
          instrument, the second is like the S&P 500,, and the third is like
          venture capital or perhaps even a meme stock. As the simulation
          proceeds, some have great success with this last investment, they
          accumulate far greater wealth than the majority of players. For most
          players, however, this last investment leads to ruin because of its
          volatility - the so called
          <em> Variance Drain</em>. The stark difference in outcomes often
          surprises players who discover how hard it is to separate luck from
          skill. The simulation also demonstrates how combining assets in
          portfolios reduces he risk (variance). Players discover that a mixture
          of two poor investments emerges as a surprising performer. After this
          experience, our players often begin to associate financial volatility
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
