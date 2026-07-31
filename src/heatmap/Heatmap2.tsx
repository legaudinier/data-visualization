import { useMemo } from "react";
import * as d3 from "d3";
import { pColor } from "../dataTools";

type Heatmap2Props = {
    width: number;
    height: number;
    data: { x: any; y: any; value: number }[];
};

export type InteractionData = {
    xLabel: number;
    yLabel: number;
    xPos: number;
    yPos: number;
    value: number;
};

const MARGIN = { top: 10, right: 50, bottom: 30, left: 50 };

export const Heatmap2 = ({ width, height, data }: Heatmap2Props) => {
    //   const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);

    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

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
        .scaleLinear()
        .range(['#e5dff0', pColor])
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
                key={i}
                r={4}
                x={xScale(d.x)}
                y={yScale(d.y)}
                width={xScale.bandwidth()}
                height={yScale.bandwidth()}
                opacity={.99}
                fill={`${(colorScale(d.value))}`}
                rx={0}
                stroke={'white'}
            />
        );
    });

    const xLabels = allXGroups.map((name, i) => {
        const x = xScale(name);

        if (!x) {
            return null;
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
                {/* {name} */}
            </text>
        );
    });

    const yLabels = allYGroups.map((name, i) => {
        const y = yScale(name);

        if (!y) {
            return null;
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
                {/* {name} */}
            </text>
        );
    });

    return (
        <svg width={width} height={height}>
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
    );
};
