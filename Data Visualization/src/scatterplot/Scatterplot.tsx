import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottom";
import { useState } from "react";
import { Tooltip } from '../tooltips/Tooltip'
import type { InteractionData } from '../tooltips/Tooltip'

const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };
type DataPoint = {
    date: number;
    time: any;
    totals: number;
    event: string;
};

type ScatterplotProps = {
    width: number;
    height: number;
    data: DataPoint[];
};

export const Scatterplot = ({ width, height, data }: ScatterplotProps) => {
    const boundsWidth: any = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const [hovered, setHovered] = useState<InteractionData | null>(null);

    const minDate = new Date(data[0].date)
    const maxDate = new Date(data[data.length - 1].date)

    // Scales
    const yScale = d3.scaleLinear().domain([0, 24]).range([boundsHeight, 0]);
    const xScale: any = d3
        .scaleLinear<Date>()
        .domain([minDate, maxDate])
        .range([0, boundsWidth]);
    const allGroups = data.map((d) => String(d.event));
    const colorScale = d3
        .scaleOrdinal<string>()
        .domain(allGroups)
        .range(["#672be0", "#52b1e8", "#6bd2e1", "#9a6fb0", "#a53253"]);

    // Build the shapes
    const allShapes = data.map((d, i) => {
        return (
            <circle
                key={i}
                r={8}
                cx={xScale(d.date)}
                cy={yScale(Number(d.time.split(':')[0]) + Number(d.time.split(':')[1] / 60))}
                stroke={colorScale(d.event)}
                fill={colorScale(d.event)}
                fillOpacity={0.7}
                onMouseEnter={() =>
                    setHovered({
                        xPos: xScale(d.date),
                        yPos: yScale(Number(d.time.split(':')[0]) + Number(d.time.split(':')[1] / 60)),
                        name: d.event,
                        totals: d.totals,
                        date: d.date,
                        time: d.time
                    })
                }
                onMouseLeave={() => setHovered(null)}
            />
        );
    });

    return (
        <div style={{ position: "relative" }}>
            <svg width={width} height={height}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
                >
                    {/* Y axis */}
                    <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />

                    {/* X axis, use an additional translation to appear at the bottom */}
                    <g transform={`translate(0, ${boundsHeight})`}>
                        <AxisBottom
                            xScale={xScale}
                            pixelsPerTick={30}
                            height={boundsHeight}
                        />
                    </g>

                    {/* Circles */}
                    {allShapes}
                </g>
            </svg>

            {/* Tooltip */}
            <div
                style={{
                    width: boundsWidth,
                    height: boundsHeight,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    pointerEvents: "none",
                    marginLeft: MARGIN.left,
                    marginTop: MARGIN.top,
                }}
            >
                <Tooltip interactionData={hovered} />
            </div>
        </div>
    );
};
