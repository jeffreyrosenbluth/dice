import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function SimPlot({ data, toPlot }) {
    const containerRef = useRef();

    useEffect(() => {
        if (data === undefined) return;
        const series = toPlot.map((s) => {
            if (s === "stock") {
                return "stock";
            }
            if (s === "crypto") {
                return "crypto";
            }
            if (s === "portfolio") {
                return "portfolio";
            }
        });
        let new_data = data.filter((b) => series.includes(b.key));
        const plot = Plot.plot({
            marginLeft: 40,
            marginTop: 50,
            marginRight: 0,
            x: {
                label: "Return",
                tickFormat: (d) => d3.format(".0%")(d),
            },
            y: { tickFormat: (d) => d3.format(".0%")(d) },
            color: {
                domain: ["stock", "crypto", "portfolio"],
                range: ["#60a5fa", "#fb923c", "white"],
            },
            marks: [
                Plot.rectY(new_data.slice(), Plot.binX({ y2: "proportion" }, { x: "value", fill: "key", fillOpacity: 0.75 })),
            ]
        });
        containerRef.current.append(plot);
        return () => plot.remove();
    }, [data, toPlot]);
    return <div ref={containerRef} />;
}