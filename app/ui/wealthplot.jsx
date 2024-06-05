import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import { Wealth, to_df } from "@/app/lib/calc";

export default function WealthPlot({wealth, pink, className=''}) {
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
        ticks: Math.trunc(data.length / n),
        label: "Years",
        insetLeft: 50,
      },
      y: {label: null},
      color: {
        domain: ["_green", "_red", "_white", "_pink"],
        range: ["mediumseagreen", "crimson", "white", "hotpink"],
      },
      title: "Value of $100 Invested",
      marks: [
        data.length > n ? Plot.lineY(data, {
          x: "roll_num",
          y: "value",
          stroke: "symbol",
          strokeWidth: 2.5,
        }) : null,
        Plot.text(data, Plot.selectLast({filter: (d) => d.symbol === "_pink", x: "roll_num", y: "value", fill: "hotpink", text: (d) => `${d.value.toFixed(0)}`, dx: 25})),
        Plot.axisY({
          tickSize: 0,
          dx: 38, 
          dy: -6,
          lineAnchor: "bottom",
          tickFormat: (d, i, _) => d,
        }),
        Plot.gridY({ ticks: 10 }),
        data.length > n ? Plot.ruleY([0], { stroke: "gray" }) : null,
        // data.length > n ? null : Plot.text(["Press Roll to Start"], 
        //   {frameAnchor: "middle", stroke: "skyblue", fontSize: 35, fontWeight: 1, fontStyle: "normal"}),
        Plot.tickY({ x: [] }),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data, n]);

  return <div className={className} ref={containerRef} />;
}
