import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { Wealth, to_df, countReturns, pmf } from "@/app/lib/core";

export default function ReturnPlot({returns, pink}) {
  const containerRef = useRef();
  const data = countReturns(returns.slice(1), pink);
  const n = pink ? 3 : 2;

  useEffect(() => {
    if (data === undefined) return;
    const plot = Plot.plot({
      marginLeft: 30,
      marginTop: 50,
      marginRight: 60,
      x: {
        inset: 10,
        ticks: 5,
      },
      y: {inset:10, label: null},
      color: {
        domain: ["Green Die", "Red Die", "White Die", "pink Die"],
        range: ["mediumseagreen", "crimson", "gainsboro", "hotpink"],
      },
      facet: {data: data, y: "symbol", label: null},
      title: "Probability of Returns",
      marks: [
        data.length > n ? Plot.frame(): null,
        data.length > n ? Plot.dot(pmf, {y: "prob", x: "value", fy: "symbol", fill: "gray", r:5}) : null,
        data.length > n ? Plot.ruleX(data, {y: "count", x: "value", stroke: "symbol", strokeWidth: 3  }) : null,
        data.length > n ? Plot.dot(data, {y: "count", x: "value", fill: "symbol", r: 4  }) : null,
        Plot.axisY({
          tickSize: 0,
          dx: -6, 
          lineAnchor: "bottom",
          tickFormat: (d, i, _) => d,
        }),
        Plot.gridY({ ticks: 10 }),
        data.length > n ? Plot.ruleY([0], { stroke: "gray" }) : null,
        Plot.tickY({ x: [] }),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data, n]);

  return <div ref={containerRef} />;
}
