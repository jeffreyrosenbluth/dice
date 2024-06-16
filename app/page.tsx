"use client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col flex-grow items-center justify-start gap-16 w-full">
      <div className="flex place-items-center">
        <div className="text-5xl font-bold text-slate-200  mt-12 mb-6 text-center">
          A Simulation of Investment Risk and Return
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-200">
        Investment Risk and Return
      </div>
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
      <div className="text-2xl font-bold text-blue-400">
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
    </main>
  );
}
