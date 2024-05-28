import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function WealthPlot() {
  const containerRef = useRef();
  const [data, setData] = useState();

  useEffect(() => {
    d3.csv('/wealth.csv', d3.autoType).then((data) => {
      setData(data);
    });
  }, []);

  useEffect(() => {
    if (data === undefined) return;
    const plot = Plot.plot({
      marginLeft: 0,
      marginTop: 50,
      x: {
        ticks: Math.trunc(data.length / 3),
        label: "Years",
        insetLeft: 50,
      },
      color: {
        domain: ["green", "red", "white"],
        range: ["mediumseagreen", "crimson", "white"],
      },
      marks: [
        Plot.lineY(data, {
          x: "roll_num",
          y: "value",
          stroke: "symbol",
          strokeWidth: 2.5,
          tip: true,
        }),
        Plot.axisY({
          tickSize: 0,
          dx: 38, // offset right
          dy: -6, // offset up
          lineAnchor: "bottom", // draw labels above grid lines
          tickFormat: (d, i, _) => d,
        }),
        Plot.gridY({ ticks: 10 }),
        Plot.ruleY([0], { stroke: "gray" }),
        Plot.tickY({ x: [] }),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data]);

  return <div ref={containerRef} />;
}
