import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center mt-12 px-48">
      <div className="relative flex place-items-center mb-8">
        <p className="columns-2 gap-8 text-justify">
          Both students practioners of finance often have a hard time making the
          connection between variance and risk. This simulation, which is based
          on the work of Foster and Stine, players roll virtual dice that
          simulate the returns of three investments. The three investments
          behave very differently: one is like a money market instrument, the
          second is like the S&P 500,, and the third is like a technology or
          perhaps even a meme stock. As the simulation proceeds, some have great
          success with this last investment, they accumulate far greater wealth
          than the majority of players. For most players, however, this last
          investment leads to ruin because of its volatility - the so called
          <em> Variance Drain</em>. The stark difference in outcomes often
          surprises players who discover how hard it is to separate luck from
          skill. The simulation also demonstrates how combining assets in
          portfolios reduces the risk (variance). Players discover that a
          mixture of two poor invest ments emerges as a surprising performer.
          After this experience, our students immediately associate financial
          volatility with vari ance. lios, weighted combinations of investments,
          reduce the variance. Players discover that a mixture of two poor
          invest ments emerges as a surprising performer.
        </p>
      </div>
      <Link
        className="text-blue-300"
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
