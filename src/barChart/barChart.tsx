import * as d3 from 'd3';
import { bColor, pColor, combinedResults, combinedMap } from '../dataTools'

const MARGIN = { top: 30, right: 30, bottom: 30, left: 50 };

type BarplotProps = {
    width: number;
    height: number;
    hideData: boolean
};

// TO DO - Add a legend

export const BarChart = ({ width, height, hideData }: BarplotProps) => {
    // bounds = area inside the graph axis = calculated by substracting the margins
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;
    const BAR_PADDING = hideData ? .01 : .3;

    // Convert the grouped object values back into an array of objects
    const resultB = Object.values(combinedMap);

    // Because there are all dates for B events, we can just use this as our grouping
    const dateGroups = resultB.map((d: any) => d.date);

    // X scale is the horizontal axis so this has to be the date groups
    const xScale = d3
        .scaleBand()
        .domain(dateGroups)
        .range([0, boundsWidth])
        .padding(BAR_PADDING);

    // Y axis is the vertical access so this has to be the totals
    const max = d3.max(resultB.map((d: any) => (d.totals / 60))) ?? 10;
    const yScale: any = d3
        .scaleLinear()
        .domain([Number(max) * 1.05, 0])
        .range([0, boundsHeight]);

    // Build the shapes
    const allShapes = combinedResults.map((d: any, i: number) => {
        const x = xScale(d.date);
        if (x === undefined) {
            return null;
        }

        return (
            <g key={i}>
                {/* B data */}
                <rect
                    x={hideData ? x : x + 10}
                    y={yScale(d.totals / 60)}
                    width={hideData ? xScale.bandwidth() : xScale.bandwidth() - 10} // half the width
                    height={boundsHeight - yScale(d.totals / 60)}
                    opacity={0.9}
                    stroke={bColor}
                    fill={bColor}
                    fillOpacity={0.6}
                    strokeWidth={1}
                    rx={1}
                />
                {!hideData &&
                    <text
                        x={(x + xScale.bandwidth() / 2) + 5}
                        y={yScale(d.totals / 60) - 10}
                        textAnchor="middle"
                        alignmentBaseline="mathematical"
                        fontSize={12}
                    >
                        {(d.totals / 60).toFixed(0)}
                    </text>}
                {/* P data */}
                <rect
                    x={hideData ? x : x + 20}
                    y={yScale(d.pTotals / 60)}
                    width={hideData ? xScale.bandwidth() : xScale.bandwidth() - 10} // half the width
                    height={boundsHeight - yScale(d.pTotals / 60)}
                    opacity={0.9}
                    stroke={pColor}
                    fill={pColor}
                    fillOpacity={0.6}
                    strokeWidth={1}
                    rx={1}
                />
                {!hideData &&
                    <text
                        x={(x + xScale.bandwidth() / 2) + 16}
                        y={yScale(d.pTotals / 60) - 10}
                        textAnchor="middle"
                        alignmentBaseline="mathematical"
                        fontSize={12}
                    >
                        {(d.pTotals !== undefined && (d.pTotals / 60).toFixed(0))}
                    </text>}
                {!hideData &&
                    <text
                        x={(x + xScale.bandwidth() / 2) + 10}
                        y={boundsHeight + 10}
                        textAnchor="middle"
                        alignmentBaseline="central"
                        fontSize={12}
                    >
                        {d.date}
                    </text>}
            </g >
        );
    });


    // THIS IS THE HEIGHT
    const grid = yScale.ticks(5).map((value: any, i: number) => (
        <g key={i}>
            <line
                x1={0}
                x2={boundsWidth}
                y1={yScale(value)}
                y2={yScale(value)}
                stroke="#808080"
                opacity={0.2}
            />
            <text
                x={-10}
                y={yScale(value)}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={9}
                stroke="#808080"
                opacity={0.8}
            >
                {value} mins
            </text>
        </g>
    ));

    return (
        <div>
            <svg width={width} height={height}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
                >
                    {grid}
                    {allShapes}
                </g>
            </svg>
        </div>
    );
};
