import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { Profit } from "@/app/lib/coin";

type CoinSimPlotProps = {
  profits: Profit[];
  betFraction: number;
  toPlot: string[];
  className?: string;
};

const CoinSimPlot: React.FC<CoinSimPlotProps> = ({
  profits,
  betFraction,
  toPlot,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profits === undefined || containerRef.current === null) return;
    const series = toPlot.map((s) => {
      if (s === "player") {
        return `Constant ${betFraction}%`;
      }
      if (s === "constant") {
        return "Constant $20";
      }
      if (s === "kelly") {
        return "Kelly";
      }
    });
    let data = profits.filter((b) => series.includes(b.key));

    const plot = Plot.plot({
      marginLeft: 40,
      marginTop: 50,
      marginRight: 20,
      x: {
        label: "Return",
        tickFormat: (d) => d3.format(".0%")(d),
      },
      y: { tickFormat: (d) => d3.format(".0%")(d) },
      color: {
        legend: true,
        domain: [`Constant ${betFraction}%`, "Constant $20", "Kelly"],
        range: ["#60a5fa", "#fb923c", "white"],
      },
      marks: [
        Plot.rectY(
          data,
          Plot.binX(
            { y2: "proportion" },
            {
              x: "value",
              fill: "key",
              fillOpacity: 0.7,
            }
          )
        ),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [profits]);
  return <div className={className} ref={containerRef} />;
};

export default CoinSimPlot;
