import * as Plot from "@observablehq/plot";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function SimPlot({ data }) {
    const containerRef = useRef();

    useEffect(() => {
        if (data === undefined) return;
        const plot = Plot.plot({
            marginLeft: 40,
            marginTop: 50,
            marginRight: 0,
            x: {
                label: "Return",
                tickFormat: (d) => d3.format(".0%")(d),
            },
            color: {
                domain: ["stock", "venture", "portfolio"],
                range: ["#60a5fa", "#fb923c", "white"],
            },
            marks: [
                Plot.rectY(data.slice(), Plot.binX({ y2: "count" }, { x: "value", fill: "key", fillOpacity: 0.75 })),
            ]
        });
        containerRef.current.append(plot);
        return () => plot.remove();
    }, [data]);
    return <div ref={containerRef} />;
}