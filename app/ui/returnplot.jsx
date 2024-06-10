import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { Wealth, to_df, countReturns, pmf } from "@/app/lib/core";

export default function ReturnPlot({ returns, pink }) {
  const containerRef = useRef();
  const data = countReturns(returns.slice(1), pink);
  const n = pink ? 3 : 2;

  useEffect(() => {
    if (data === undefined) return;
    const plot = Plot.plot({
      marginLeft: 45,
      marginTop: 50,
      marginRight: 60,
      x: {
        inset: 10,
        ticks: 5,
        label: "Return %"
      },
      y: { inset: 10, label: null },
      color: {
        domain: ["Green Die", "Red Die", "portfolio"],
        range: ["mediumseagreen", "crimson", "hotpink"],
      },
      facet: { data: data, y: "symbol", label: null },
      title: "Probability Distribution of Returns",
      marks: [
        Plot.frame(),
        Plot.dot(pmf, { y: "prob", x: "value", fy: "symbol", fill: "gray", fillOpacity: 0.5, r: 5 }),
        Plot.ruleX(pmf, { y: "prob", x: "value", fy: "symbol", stroke: "gray", strokeOpacity: 0.5, strokeWidth: 2 }),
        Plot.ruleX(data, { y: "count", x: "value", stroke: "symbol", strokeWidth: 3 }),
        Plot.dot(data, { y: "count", x: "value", fill: "symbol", r: 4 }),
        Plot.axisY({
          tickSize: 0,
          dx: -6,
          lineAnchor: "bottom",
          tickFormat: (d, i, _) => d,
        }),
        Plot.gridY({ ticks: 5 }),
        Plot.ruleY([0], { stroke: "gray" }),
        Plot.tickY({ x: [] }),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data, n]);
  return <div ref={containerRef} />;
}
