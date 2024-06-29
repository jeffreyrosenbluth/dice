import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { mkFlipNs, Flip, FlipN } from "@/app/lib/coin";

type FlipPlotProps = {
  flips: Flip[];
  className?: string;
};

export default function FlipPlot({ flips, className = "" }: FlipPlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const data = mkFlipNs(flips);

  const getTickValues = (data: FlipN[]): number[] => {
    return data.map((d) => d.flip_num);
  };

  useEffect(() => {
    if (data === undefined || containerRef.current === null) return;
    const plot = Plot.plot({
      marginLeft: 15,
      marginTop: 50,
      marginRight: 60,
      width: 720,
      height: (40 / 64) * 720,
      x: {
        label: "Flip",
        insetLeft: 50,
        ticks: getTickValues(data),
        tickFormat: (d) => d.toFixed(0),
      },
      color: {
        legend: true,
        label: "Label Text",
        domain: ["You", "Constant 10%", "Constant $20", "Kelly"],
        range: ["#60a5fa", "#fb923c", "#4ade80", "white"],
      },
      marks: [
        Plot.ruleY([0], { stroke: "gray" }),
        Plot.lineY(data, {
          x: "flip_num",
          y: "value",
          stroke: "key",
          strokeWidth: 2.5,
        }),
        Plot.tip(
          data,
          Plot.pointer({
            x: "flip_num",
            y: "value",
            fill: "black",
            title: (d: FlipN) =>
              `${
                d.key.charAt(0).toUpperCase() + d.key.slice(1)
              }\nWinnings: ${d3.format(",.0f")(d.value)}`,
          })
        ),
        Plot.text(
          data,
          Plot.selectLast({
            filter: (d) => d.key === "You",
            x: "flip_num",
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
            filter: (d) => d.key === "Constant 10%",
            x: "flip_num",
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
            filter: (d) => d.key === "Constant $20",
            x: "flip_num",
            y: "value",
            fill: "#4ade80",
            fontSize: 14,
            fontWeight: "semibold",
            text: (d) => `${d3.format(",.0f")(d.value)}`,
            dx: 25,
          })
        ),
        Plot.text(
          data,
          Plot.selectLast({
            filter: (d) => d.key === "Kelly",
            x: "flip_num",
            y: "value",
            fill: "white",
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
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [data]);
  return <div className={className} ref={containerRef} />;
}
