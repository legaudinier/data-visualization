import * as d3 from 'd3';
import {
    bColor,
    pColor,
    bColorH,
    pColorH,
    combinedResults,
    combinedResultsH,
    combinedMap,
    combinedMapH
} from '../dataTools';

const MARGIN = { top: 30, right: 30, bottom: 80, left: 50 };

type BarplotProps = {
    width: number;
    height: number;
    hideData: boolean;
    dataToggleM: boolean;
    dataToggleH: boolean;
};

export const BarChart = ({
    width,
    height,
    hideData,
    dataToggleM,
    dataToggleH,
}: BarplotProps) => {
    const resultM = dataToggleM ? Object.values(combinedMap) : [];
    const resultH = dataToggleH ? Object.values(combinedMapH) : [];
    // Because data set M actually doesn't start from 0, need to start with H
    // eventually maybe just one data set but differentiate between M/H
    const activeData = [...resultH, ...resultM];

    const dateGroups = Array.from(new Set(activeData.map((d: any) => d.date)));

    const effectiveWidth = hideData ? width : Math.max(width, dateGroups.length * 80);
    const boundsWidth = Math.max(0, effectiveWidth - MARGIN.right - MARGIN.left);
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;
    const BAR_PADDING = .1;

    const xScale = d3
        .scaleBand()
        .domain(dateGroups)
        .range([0, boundsWidth])
        .padding(BAR_PADDING);

    const activeSlots = [
        ...(dataToggleM ? ['BM', 'PM'] : []),
        ...(dataToggleH ? ['BH', 'PH'] : []),
    ];

    const xSubgroup = d3
        .scaleBand()
        .domain(activeSlots)
        .range([0, xScale.bandwidth()])
        .padding(hideData ? 0.05 : 0.12);

    const max =
        d3.max(activeData, (d: any) =>
            Math.max(d.totals ?? 0, d.pTotals ?? 0) / 60
        ) ?? 10;

    const yScale = d3
        .scaleLinear()
        .domain([Number(max) * 1.1, 0])
        .range([0, boundsHeight]);

    const renderSlotBar = (
        groupX: number,
        slotKey: string,
        rawVal: number | undefined,
        color: string
    ) => {
        const slotX = xSubgroup(slotKey);
        if (rawVal === undefined || slotX === undefined) {
            return null; // Leaves intentional whitespace in this slot
        }

        const minutes = rawVal / 60;
        const barX = groupX + slotX;
        const barWidth = xSubgroup.bandwidth();

        return (
            <g key={slotKey}>
                <rect
                    x={barX}
                    y={yScale(minutes)}
                    width={barWidth}
                    height={boundsHeight - yScale(minutes)}
                    opacity={0.9}
                    stroke={color}
                    fill={color}
                    fillOpacity={0.6}
                    strokeWidth={1}
                    rx={1}
                />
                {!hideData && (
                    <text
                        x={barX + barWidth / 2}
                        y={yScale(minutes) - 8}
                        textAnchor="middle"
                        fontSize={11}
                    >
                        {minutes.toFixed(0)}
                    </text>
                )}
            </g>
        );
    };

    const mByDate = new Map((dataToggleM ? combinedResults : []).map((d: any) => [d.date, d]));
    const hByDate = new Map((dataToggleH ? combinedResultsH : []).map((d: any) => [d.date, d]));

    const allShapes = dateGroups.map((date: any) => {
        const x = xScale(date);
        if (x === undefined) return null;

        const dM: any = mByDate.get(date);
        const dH: any = hByDate.get(date);

        return (
            <g key={date}>
                {/* Fixed positions: Slot 1 = BM, Slot 2 = PM, Slot 3 = BH, Slot 4 = PH */}
                {renderSlotBar(x, 'BM', dM?.totals, bColor)}
                {renderSlotBar(x, 'PM', dM?.pTotals, pColor)}
                {renderSlotBar(x, 'BH', dH?.totals, bColorH)}
                {renderSlotBar(x, 'PH', dH?.pTotals, pColorH)}

                {!hideData && (
                    <text
                        x={x + xScale.bandwidth() / 2}
                        y={boundsHeight + 16}
                        textAnchor="middle"
                        fontSize={12}
                    >
                        {date}
                    </text>
                )}
            </g>
        );
    });

    const grid = yScale.ticks(5).map((value, i) => (
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
                textAnchor="end"
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
            <svg width={effectiveWidth} height={height}>
                <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
                    {grid}
                    {allShapes}
                </g>
            </svg>
        </div>
    );
};
