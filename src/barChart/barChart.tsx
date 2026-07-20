import * as d3 from 'd3';
import { type OrderedDataType } from '../orderedData';

const MARGIN = { top: 30, right: 30, bottom: 30, left: 50 };
const BAR_PADDING = 0.3;

type BarplotProps = {
    width: number;
    height: number;
    data: OrderedDataType[]
};

export const BarChart = ({ width, height, data }: BarplotProps) => {
    // bounds = area inside the graph axis = calculated by substracting the margins
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    // B data by day in a barchart

    // filter to only show the b events
    const bDataOnly: any = data.filter(x => x?.event === 'B');

    const groups = bDataOnly.sort((a: any, b: any) => b.date + a.date).map((d: any) => d.totals);

    // Combine similar items and sum their values
    const combinedMap = bDataOnly.reduce((accumulator, currentItem) => {
        const key = currentItem.date;

        // If the category does not exist in our accumulator, initialize it
        if (!accumulator[key]) {
            accumulator[key] = { date: key, totals: 0, event: currentItem.event };
        }

        // Sum the amount into the existing category group
        accumulator[key].totals += currentItem.totals;

        return accumulator;
    }, {});

    // Convert the grouped object values back into an array of objects
    const result = Object.values(combinedMap);
    const dateGroups = result.map((d: any) => d.date);
    const totalsGroups = result.map((d: any) => d.totals);

    console.log('combinedMap', combinedMap)


    console.log('resultGroups', dateGroups);
    console.log('totalsGroups', totalsGroups)

    console.log('result', result)


    // X scale is the horizontal axis so this has to be the date groups
    const xScale = d3
        .scaleBand()
        .domain(dateGroups)
        .range([0, boundsWidth])
        .padding(BAR_PADDING);

    // Y axis is the vertical access so this has to be the totals
    const max = d3.max(result.map((d: any) => d.totals)) ?? 10;
    const yScale: any = d3
        .scaleLinear()
        .domain([Number(max) * 1.2, 0])
        .range([0, boundsHeight]);

    // Build the shapes
    const allShapes = result.map((d: OrderedDataType, i: number) => {
        const x = xScale(d.date); // this is broken
        if (x === undefined) {
            return null;
        }

        return (
            <g key={i}>
                <rect
                    x={x}
                    y={yScale(d.totals)}
                    width={xScale.bandwidth()}
                    height={boundsHeight - yScale(d.totals)}
                    opacity={0.9}
                    stroke="#0f50bf"
                    fill="#0544b0"
                    fillOpacity={0.6}
                    strokeWidth={1}
                    rx={1}
                />
                <text
                    x={x + xScale.bandwidth() / 2}
                    y={yScale(d.date) - 10}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    fontSize={12}
                >
                    {d.totals}
                </text>
                {/* this is the bottom */}
                <text
                    x={x + xScale.bandwidth() / 2}
                    y={boundsHeight + 10}
                    textAnchor="middle"
                    alignmentBaseline="central"
                    fontSize={12}
                >
                    {d.date}
                </text>
            </g>
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
