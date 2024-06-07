import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { Wealth, to_df } from "@/app/lib/core";

export default function WealthPlot({ wealth, pink, className = '' }) {
  const containerRef = useRef();
  const data = to_df(wealth, pink);
  const n = pink ? 4 : 3;

  useEffect(() => {
    if (data === undefined) return;
    const plot = Plot.plot({
      marginLeft: 0,
      marginTop: 50,
      marginRight: 60,
      x: {
        ticks: Math.min(Math.trunc(data.length / n), 20),
        label: "Years",
        insetLeft: 50,
      },
      y: { label: null },
      color: {
        domain: ["_green", "_red", "_white", "_pink"],
        range: ["mediumseagreen", "crimson", "white", "hotpink"],
      },
      title: "Value of $100 Invested",
      marks: [
        Plot.lineY(data, {
          x: "roll_num",
          y: "value",
          stroke: "symbol",
          strokeWidth: 2.5,
        }),
        Plot.tip(data, Plot.pointer({
          x: "roll_num", y: "value",
          fill: "black", title: (d) => `${d.symbol.charAt(1).toUpperCase() + d.symbol.slice(2)}\nWealth: ${d3.format(",.0f")(d.value)}`
        })),
        Plot.text(data, Plot.selectLast({
          filter: (d) => d.symbol === "_pink", x: "roll_num", y: "value",
          fill: "hotpink", fontSize: 14, fontWeight: "semibold", text: (d) => `${d3.format(",.0f")(d.value)}`, dx: 25
        })),
        Plot.text(data, Plot.selectLast({
          filter: (d) => d.symbol === "_green", x: "roll_num", y: "value",
          fill: "mediumseagreen", fontSize: 14, fontWeight: "semibold", text: (d) => `${d3.format(",.0f")(d.value)}`, dx: 25
        })),
        Plot.text(data, Plot.selectLast({
          filter: (d) => d.symbol === "_red", x: "roll_num", y: "value",
          fill: "crimson", fontSize: 14, fontWeight: "semibold", text: (d) => `${d3.format(",.0f")(d.value)}`, dx: 25
        })),
        Plot.text(data, Plot.selectLast({
          filter: (d) => d.symbol === "_white", x: "roll_num", y: "value",
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
