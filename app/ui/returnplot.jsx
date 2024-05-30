import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { Wealth, to_df } from "@/app/lib/calc";

export default function ReturnPlot({returns, pink}) {
  const containerRef = useRef();
  const data = to_df(returns.slice(0, -1), pink);
  const n = pink ? 3 : 2;

  useEffect(() => {
    if (data === undefined) return;
    const plot = Plot.plot({
      marginLeft: 20,
      marginTop: 50,
      x: {
        axis: null,
        // insetLeft: 50,
      },
      color: {
        domain: ["_green", "_red", "_white", "_pink"],
        range: ["mediumseagreen", "crimson", "gainsboro", "hotpink"],
      },
      marks: [
        data.length > n ? Plot.rectY(data, Plot.binY({y: "proportion-facet"}, {
          x: "value",
          fill: "symbol",
          fx: "symbol",
        }), {interval: 0.05}) : Plot.frame(),
        Plot.axisY({
          tickSize: 0,
          dx: 38, 
          dy: -6,
          lineAnchor: "bottom",
          tickFormat: (d, i, _) => d,
        }),
        Plot.gridY({ ticks: 10 }),
        data.length > n ? Plot.ruleY([0], { stroke: "gray" }) : null,
        data.length > n ? null : Plot.text(["Press roll to generate a histogram of returns"], 
          {frameAnchor: "middle", stroke: "skyblue", fontSize: 25, fontWeight: 1, fontStyle: "normal"}),
        Plot.tickY({ x: [] }),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data, n]);

  return <div ref={containerRef} />;
}
