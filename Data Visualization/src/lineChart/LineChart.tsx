import { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import type { InteractionData } from '../tooltips/Tooltip'
import { LineChartTooltip } from '../tooltips/LineChartTooltip'
import { type OrderedDataType } from '../orderedData';

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

type LineChart = {
    width: number;
    height: number;
    data: OrderedDataType[];
};

export const LineChart = ({
    width,
    height,
    data,
}: LineChart) => {
    // bounds = area inside the graph axis = calculated by substracting the margins
    const axesRef = useRef(null);
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;
    const dateTicks: any = [] // fix this any
    const [hovered, setHovered] = useState<InteractionData | null>(null);

    for (let i = 0; i <= 700; i += 10) {
        dateTicks.push(i);
    }

    const bDataOnly = data.filter(x => x.event === 'B');
    const dataSummed = bDataOnly.reduce((acc, curr) => {
        const existing = acc.find(item => item.date === curr.date);

        if (existing) {
            existing.totals += curr.totals;
        } else {
            acc.push({ ...curr });
        }

        return acc;
    }, []);

    // Y axis
    // const [min, max] = d3.extent(dataSummed, (d: any) => (d.totals / 60));
    const [, max] = d3.extent(dataSummed, (d: any) => (d.totals / 60));
    const yScale = d3
        .scaleLinear()
        .domain([0, max || 0])
        .range([boundsHeight, 0]);

    // X axis
    // const [xMin, xMax] = d3.extent(dataSummed, (d: any) => d.date);
    const [, xMax] = d3.extent(dataSummed, (d: any) => d.date);
    const xScale = d3
        .scaleLinear()
        .domain([0, xMax || 0])
        .range([0, boundsWidth]);

    // Render the X and Y axis using d3.js, not react
    useEffect(() => {
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll('*').remove();
        const xAxisGenerator = d3.axisBottom(xScale).tickValues(dateTicks);
        svgElement
            .append('g')
            .attr('transform', 'translate(0,' + boundsHeight + ')')
            .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);
        svgElement.append('g').call(yAxisGenerator);
    }, [xScale, yScale, boundsHeight]);

    // Build the line
    const lineBuilder = d3
        .line<OrderedDataType>()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.totals / 60));
    const linePath = lineBuilder(dataSummed);
    if (!linePath) {
        return null;
    }

    // Build the circles
    const allCircles = dataSummed.map((item: OrderedDataType, i: number) => {
        return (
            <circle
                key={i}
                cx={xScale(item.date)}
                cy={yScale(item.totals / 60)}
                r={4}
                fill={'#cb1dd1'}
                onMouseEnter={() =>
                    setHovered({
                        xPos: xScale(item.date),
                        yPos: yScale(item.totals / 60),
                        name: item.event,
                        totals: (item.totals / 60),
                        date: item.date,
                        time: item.time
                    })
                }
                onMouseLeave={() => setHovered(null)}
            />
        );
    });

    return (
        <div>
            <svg width={width} height={height}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
                >
                    <path
                        d={linePath}
                        opacity={0.3}
                        stroke="#cb1dd1"
                        fill="none"
                        strokeWidth={2}
                    />
                    {allCircles}
                </g>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    ref={axesRef}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
                />
            </svg>
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
                <LineChartTooltip interactionData={hovered} />
            </div>
        </div>
    );
};
