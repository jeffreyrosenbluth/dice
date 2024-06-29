import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";
import { Flip } from "@/app/lib/coin";

type HTPlotProps = {
  flips: Flip[];
  className?: string;
};

export default function HTPlot({ flips, className = "" }: HTPlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flips === undefined || containerRef.current === null) return;
    const plot = Plot.plot({
      width: 720,
      height: 7,
      marginLeft: 15,
      marginRight: 60,
      x: {
        domain: [0, flips.length],
        label: "Flip Number",
        axis: null,
      },
      y: {
        label: null,
        axis: null,
      },
      color: { legend: true },
      marks: [
        Plot.rectY(flips, {
          x1: (d, i) => i,
          x2: (d, i) => i + 1,
          y1: 0.0,
          y2: 0.5,
          fill: (d) => (d.coin === "heads" ? "#dc2626" : "#a1a1aa"),
          stroke: "black",
          strokeOpacity: 0.7,
          strokeWidth: 1.0,
        }),
      ],
    });
    containerRef.current.append(plot);
    return () => plot.remove();
  }, [flips]);
  return <div ref={containerRef} />;
}
