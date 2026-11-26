import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottom";
import { useState } from "react";
import { ScatterplotTooltip } from '../tooltips/ScatterplotTooltip'
import type { InteractionData } from '../tooltips/ScatterplotTooltip'
import { bColor, pColor, bColorH, pColorH } from '../dataTools'
import { orderedDataM, emptyData, orderedDataH } from "../orderedData";

const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };

type ScatterplotProps = {
    width: number;
    height: number;
    dataToggleM: string;
    dataToggleH: string;
    circleSize: number;
    hideToolTip: boolean;
};

export const Scatterplot = ({ width, height, circleSize, hideToolTip, dataToggleM, dataToggleH }: ScatterplotProps) => {
    const boundsWidth: any = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const [hovered, setHovered] = useState<InteractionData | null>(null);
    const dataM = dataToggleM === 'M' ? orderedDataM : emptyData;
    const dataH = dataToggleH === 'H' ? orderedDataH : emptyData;

    const min = Math.min(dataM[0].date, dataH[0].date)
    const max = Math.max(dataM[dataM.length - 1].date, dataH[dataH.length - 1].date)

    const minDate = new Date(min)
    const maxDate = new Date(max)

    // Scales
    const yScale = d3.scaleLinear().domain([0, 24]).range([boundsHeight, 0]);
    const xScale: any = d3
        .scaleLinear<Date>()
        .domain([minDate, maxDate])
        .range([0, boundsWidth]);
    const allGroups = dataM.map((d) => String(d.event));
    const colorScale = d3
        .scaleOrdinal<string>()
        .domain(allGroups)
        .range([pColor, bColor]);

    const allGroupsH = dataH.map((d) => String(d.event));
    const colorScaleH = d3
        .scaleOrdinal<string>()
        .domain(allGroupsH)
        .range([pColorH, bColorH]);

    // Build the shapes
    const allShapesM = dataM.map((d, i) => {
        return (
            // if its hovered, then change the color of the bubble
            <circle
                key={i}
                r={circleSize}
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

    const allShapesH = dataH.map((d, i) => {
        return (
            // if its hovered, then change the color of the bubble
            <circle
                key={i}
                r={circleSize}
                cx={xScale(d.date)}
                cy={yScale(Number(d.time.split(':')[0]) + Number(d.time.split(':')[1] / 60))}
                stroke={colorScaleH(d.event)}
                fill={colorScaleH(d.event)}
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
                    {allShapesM}
                    {allShapesH}
                </g>
            </svg>

            {/* Tooltip */}
            {!hideToolTip &&
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
                    <ScatterplotTooltip interactionData={hovered} />
                </div>}
        </div>
    );
};
