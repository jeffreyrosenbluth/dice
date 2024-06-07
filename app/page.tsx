"use client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-16">
      <div className="relative flex place-items-center">
        <div className="text-5xl font-bold text-blue-400  mt-12 mb-6">
          A Simulation of Investment Risk and Return
        </div>
      </div>
      <div className="text-2xl font-bold text-blue-400">
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
                  <td className="whitespace-nowrap px-6 py-3 font-medium text-emerald-400">
                    Green
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right">
                    8.3%
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right">
                    20.0%
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right">
                    6.4%
                  </td>
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap px-6 py-3 font-medium text-rose-500">
                    Red
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right">
                    71.0%
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right">
                    132.0%
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right">
                    -17.0%
                  </td>
                </tr>
                <tr className="border-b dark:border-neutral-500">
                  <td className="whitespace-nowrap px-6 py-3 font-medium">
                    White
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right">
                    0.8%
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right">
                    4.0%
                  </td>
                  <td className="whitespace-nowrap px-6 py-3 text-right">
                    0.7%
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
                    <th scope="col" className="px-6 py-3 text-emerald-400">
                      Green
                    </th>
                    <th scope="col" className="px-6 py-3 text-rose-500">
                      Red
                    </th>
                    <th scope="col" className="px-6 py-3">
                      White
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
                      -5%
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
                      0%
                    </td>
                  </tr>
                  <tr className="border-b dark:border-neutral-500">
                    <td className="whitespace-nowrap px-6 py-3 text-center">
                      3
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right">
                      10%
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right">
                      0%
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right">
                      0%
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
                      0%
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
                      0%
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
                      10%
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
