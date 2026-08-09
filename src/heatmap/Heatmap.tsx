import { useMemo, useState } from "react";
import * as d3 from "d3";
import { bColor, pColor, HeatmapDataB, HeatmapDataP } from "../dataTools";
import { HeatapTooltip } from "../tooltips/HeatmapTooltip";

type HeatmapProps = {
    width: number;
    height: number;
    hideTooltip: boolean
    heatmapVersion: string
};

export type InteractionData = {
    x: string;
    y: string;
    xPos: number;
    yPos: number;
    value: number;
};

const MARGIN = { top: 10, right: 50, bottom: 30, left: 50 };

export const Heatmap = ({ width, height, hideTooltip, heatmapVersion }: HeatmapProps) => {
    const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const data = heatmapVersion === 'b' ? HeatmapDataB : HeatmapDataP
    const color = heatmapVersion === 'b' ? bColor : pColor

    const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
    const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);

    const [min = 0, max = 0] = d3.extent(data.map((d) => d.value));

    const xScale = useMemo(() => {
        return d3
            .scaleBand()
            .range([0, boundsWidth])
            .domain(allXGroups)
            .padding(0.01);
    }, [data, width]);

    const yScale = useMemo(() => {
        return d3
            .scaleBand()
            .range([boundsHeight, 0])
            .domain(allYGroups)
            .padding(0.01);
    }, [data, height]);

    var colorScale = d3
        .scaleLinear<string, string>()
        .range(['#e5dff0', color])
        .domain([min, max])

    // Build the rectangles
    const allShapes = data.map((d, i) => {
        const x = xScale(d.x);
        const y = yScale(d.y);

        if (d.value === null || !x || !y) {
            return;
        }

        return (
            <rect
                key={`${i}{heatmapVersion}`}
                r={4}
                x={xScale(d.x)}
                y={yScale(d.y)}
                width={xScale.bandwidth()}
                height={yScale.bandwidth()}
                opacity={.99}
                fill={`${(colorScale(d.value))}`}
                rx={0}
                stroke={'white'}
                onMouseEnter={() => {
                    setHoveredCell({
                        x: "group " + d.x,
                        y: "group " + d.y,
                        xPos: x + xScale.bandwidth() + MARGIN.left,
                        yPos: y + xScale.bandwidth() / 2 + MARGIN.top,
                        value: Math.round(d.value * 100) / 100,
                    });
                }}
                onMouseLeave={() => setHoveredCell(null)}
                cursor="pointer"
            />
        );
    });

    const xLabels = allXGroups.map((name, i) => {
        const x = xScale(name);

        if (!x) {
            return null;
        }
        if (hideTooltip) {
            return
        }

        return (
            <text
                key={i}
                x={x + xScale.bandwidth() / 2}
                y={boundsHeight + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={10}
            >
                {name}
            </text>
        );
    });

    const yLabels = allYGroups.map((name, i) => {
        const y = yScale(name);

        if (!y) {
            return null;
        }
        if (hideTooltip) {
            return
        }

        return (
            <text
                key={i}
                x={-5}
                y={y + yScale.bandwidth() / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={10}
            >
                {name}
            </text>
        );
    });

    return (
        <div>
            <svg width={width} height={height} id={`${heatmapVersion}svg`}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
                >
                    {allShapes}
                    {xLabels}
                    {yLabels}
                </g>
            </svg>
            {!hideTooltip &&
                <HeatapTooltip interactionData={hoveredCell} />}

        </div>
    );
};
