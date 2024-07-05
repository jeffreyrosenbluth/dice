import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { wealthFrame, Assets, AssetFrameN } from "@/app/lib/market";

type WealthPlotProps = {
  wealth: Assets[];
  includePortfolio: boolean;
  className?: string;
};

const WealthPlot: React.FC<WealthPlotProps> = ({
  wealth,
  includePortfolio,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const data = wealthFrame(wealth, includePortfolio);
  const n = includePortfolio ? 4 : 3;

  useEffect(() => {
    if (data === undefined || containerRef.current === null) return;
    const plot = Plot.plot({
      marginLeft: 15,
      marginTop: 50,
      marginRight: 60,
      x: {
        ticks: Math.min(Math.trunc(data.length / n), 20),
        label: "Years",
        insetLeft: 50,
      },
      y: { label: null },
      color: {
        domain: ["stock", "venture", "cash", "portfolio"],
        range: ["#60a5fa", "#fb923c", "#4ade80", "white"],
      },
      title: "Value of $100 Invested",
      marks: [
        Plot.lineY(data, {
          x: "period",
          y: "value",
          stroke: "key",
          strokeWidth: 2.5,
        }),
        Plot.tip(
          data,
          Plot.pointer({
            x: "period",
            y: "value",
            fill: "black",
            title: (d) =>
              `${
                d.key.charAt(0).toUpperCase() + d.key.slice(1)
              }\nWealth: ${d3.format(",.0f")(d.value)}`,
          })
        ),
        Plot.text(
          data,
          Plot.selectLast({
            filter: (d) => d.key === "portfolio",
            x: "period",
            y: "value",
            fill: "white",
            fontSize: 14,
            fontWeight: "semibold",
            text: (d) => `${d3.format(",.0f")(d.value)}`,
            dx: 25,
          })
        ),
        Plot.text(
          data,
          Plot.selectLast({
            filter: (d) => d.key === "stock",
            x: "period",
            y: "value",
            fill: "#60a5fa",
            fontSize: 14,
            fontWeight: "semibold",
            text: (d) => `${d3.format(",.0f")(d.value)}`,
            dx: 25,
          })
        ),
        Plot.text(
          data,
          Plot.selectLast({
            filter: (d) => d.key === "venture",
            x: "period",
            y: "value",
            fill: "#fb923c",
            fontSize: 14,
            fontWeight: "semibold",
            text: (d) => `${d3.format(",.0f")(d.value)}`,
            dx: 25,
          })
        ),
        Plot.text(
          data,
          Plot.selectLast({
            filter: (d) => d.key === "cash",
            x: "period",
            y: "value",
            fill: "#4ade80",
            fontSize: 14,
            fontWeight: "semibold",
            text: (d) => `${d3.format(",.0f")(d.value)}`,
            dx: 25,
          })
        ),
        Plot.axisY({
          tickSize: 0,
          dx: 38,
          dy: -6,
          lineAnchor: "bottom",
        }),
        Plot.gridY({ ticks: 10 }),
        Plot.ruleY([0], { stroke: "gray" }),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data, n]);

  return <div className={className} ref={containerRef} />;
};

export default WealthPlot;
