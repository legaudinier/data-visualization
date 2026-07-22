import * as d3 from 'd3';
import { type OrderedDataType } from '../orderedData';
import { bColor , pColor} from '../dataTools'


const MARGIN = { top: 30, right: 30, bottom: 30, left: 50 };
const BAR_PADDING = .3;

type BarplotProps = {
    width: number;
    height: number;
    data: OrderedDataType[]
};
// TO DO - you need to make a key here

export const BarChart = ({ width, height, data }: BarplotProps) => {
    // bounds = area inside the graph axis = calculated by substracting the margins
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;


    // Filter to only show the B events
    const bDataOnly: any = data.filter(x => x?.event === 'B');

    // Combine all B events and sum their values
    const combinedMap = bDataOnly.reduce((accumulator: any, currentItem: any) => {
        const key = currentItem.date;

        // If the category does not exist in our accumulator, initialize it
        if (!accumulator[key]) {
            accumulator[key] = { date: key, totals: 0, event: currentItem.event };
        }

        // Sum the amount into the existing category group
        accumulator[key].totals += currentItem.totals;

        return accumulator;
    }, {});

    // Filter to only show the P events
    const pDataOnly: any = data.filter(x => x?.event === 'P');

    // Combine all P events items and sum their values
    const pCombinedMap = pDataOnly.reduce((accumulator: any, currentItem: any) => {
        const key = currentItem.date;

        // If the category does not exist in our accumulator, initialize it
        if (!accumulator[key]) {
            accumulator[key] = { date: key, pTotals: 0, pEvent: currentItem.event };
        }

        // Sum the amount into the existing category group
        accumulator[key].pTotals += currentItem.totals;

        return accumulator;
    }, {});

    // Convert the grouped object values back into an array of objects
    const resultB = Object.values(combinedMap);
    const resultP = Object.values(pCombinedMap)

    // Because there are all dates for B events, we can just use this as our grouping
    const dateGroups = resultB.map((d: any) => d.date);

    // Combine both resultB and resultP based on their similar date values
    const combinedResults = Object.values(
        [...resultB as any, ...resultP as any].reduce((acc: any, current: any) => {
            const key: any = current['date'];
            acc[key] = acc[key] ? { ...acc[key], ...current } : { ...current };
            return acc;
        }, {})
    );

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
                    x={x + 10}
                    y={yScale(d.totals / 60)}
                    width={xScale.bandwidth() - 10} // half the width
                    height={boundsHeight - yScale(d.totals / 60)}
                    opacity={0.9}
                    stroke={bColor}
                    fill={bColor}
                    fillOpacity={0.6}
                    strokeWidth={1}
                    rx={1}
                />
                <text
                    x={(x + xScale.bandwidth() / 2) + 5}
                    y={yScale(d.totals / 60) - 10}
                    textAnchor="middle"
                    alignmentBaseline="mathematical"
                    fontSize={12}
                >
                    {(d.totals / 60).toFixed(0)}
                </text>
                {/* P data */}
                <rect
                    x={x + 20}
                    y={yScale(d.pTotals / 60)}
                    width={xScale.bandwidth() - 10} // half the width
                    height={boundsHeight - yScale(d.pTotals / 60)}
                    opacity={0.9}
                    stroke={pColor}
                    fill={pColor}
                    fillOpacity={0.6}
                    strokeWidth={1}
                    rx={1}
                />
                <text
                    x={(x + xScale.bandwidth() / 2) + 16}
                    y={yScale(d.pTotals / 60) - 10}
                    textAnchor="middle"
                    alignmentBaseline="mathematical"
                    fontSize={12}
                >
                    {(d.pTotals !== undefined && (d.pTotals / 60).toFixed(0))}
                </text>
                <text
                    x={(x + xScale.bandwidth() / 2) + 10}
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
