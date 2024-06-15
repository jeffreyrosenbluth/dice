import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { wealthFrame } from "@/app/lib/market";

export default function WealthPlot({ wealth, includePortfolio, className = '' }) {
  const containerRef = useRef();
  const data = wealthFrame(wealth, includePortfolio);
  const n = includePortfolio ? 4 : 3;

  useEffect(() => {
    if (data === undefined) return;
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
        range: ["mediumseagreen", "crimson", "white", "hotpink"],
      },
      title: "Value of $100 Invested",
      marks: [
        Plot.lineY(data, {
          x: "period",
          y: "value",
          stroke: "key",
          strokeWidth: 2.5,
        }),
        Plot.tip(data, Plot.pointer({
          x: "period", y: "value",
          fill: "black", title: (d) => `${d.key.charAt(0).toUpperCase() + d.key.slice(1)}\nWealth: ${d3.format(",.0f")(d.value)}`
        })),
        Plot.text(data, Plot.selectLast({
          filter: (d) => d.key === "portfolio", x: "period", y: "value",
          fill: "hotpink", fontSize: 14, fontWeight: "semibold", text: (d) => `${d3.format(",.0f")(d.value)}`, dx: 25
        })),
        Plot.text(data, Plot.selectLast({
          filter: (d) => d.key === "stock", x: "period", y: "value",
          fill: "mediumseagreen", fontSize: 14, fontWeight: "semibold", text: (d) => `${d3.format(",.0f")(d.value)}`, dx: 25
        })),
        Plot.text(data, Plot.selectLast({
          filter: (d) => d.key === "venture", x: "period", y: "value",
          fill: "crimson", fontSize: 14, fontWeight: "semibold", text: (d) => `${d3.format(",.0f")(d.value)}`, dx: 25
        })),
        Plot.text(data, Plot.selectLast({
          filter: (d) => d.key === "cash", x: "period", y: "value",
          fill: "white", fontSize: 14, fontWeight: "semibold", text: (d) => `${d3.format(",.0f")(d.value)}`, dx: 25
        })),
        Plot.axisY({
          tickSize: 0,
          dx: 38,
          dy: -6,
          lineAnchor: "bottom",
          tickFormat: (d, i, _) => d,
        }),
        Plot.gridY({ ticks: 10 }),
        Plot.ruleY([0], { stroke: "gray" }),
        Plot.tickY({ x: [] }),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data, n]);

  return <div className={className} ref={containerRef} />;
}
