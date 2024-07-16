import * as Plot from "@observablehq/plot";
import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { mkFlipNs, Flip, FlipN } from "@/app/lib/coin";

type FlipPlotProps = {
  flips: Flip[];
  completed: boolean;
  className?: string;
};

export default function FlipPlot({
  flips,
  completed,
  className = "",
}: FlipPlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const data = mkFlipNs(flips, completed);
  const domain = completed
    ? ["Player", "Constant 10%", "Constant $20", "Kelly"]
    : ["Player"];

  const getTickValues = (data: FlipN[]): number[] => {
    const d = data.filter((d) => d.key === "Kelly").map((d) => d.flip_num);
    if (d.length > 320) {
      return d.filter((_, i) => i % 9 === 0);
    }
    if (d.length > 280) {
      return d.filter((_, i) => i % 8 === 0);
    }
    if (d.length > 240) {
      return d.filter((_, i) => i % 7 === 0);
    }
    if (d.length > 200) {
      return d.filter((_, i) => i % 6 === 0);
    }
    if (d.length > 160) {
      return d.filter((_, i) => i % 5 === 0);
    }
    if (d.length > 120) {
      return d.filter((_, i) => i % 4 === 0);
    }
    if (d.length > 80) {
      return d.filter((_, i) => i % 3 === 0);
    }
    if (d.length > 40) {
      return d.filter((_, i) => i % 2 === 0);
    }
    return d;
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
        domain: domain,
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
            filter: (d) => d.key === "Player",
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
