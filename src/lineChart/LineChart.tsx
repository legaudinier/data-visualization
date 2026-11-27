import { useEffect, useState, useRef } from 'react';
import * as d3 from 'd3';
import type { InteractionData } from '../tooltips/ScatterplotTooltip'
import { LineChartTooltip } from '../tooltips/LineChartTooltip'
import { emptyData } from '../orderedData';
import {
    bColor,
    pColor,
    bColorH,
    pColorH,
    combinedResults,
    combinedResultsH
} from '../dataTools'

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

type LineChart = {
    width: number;
    height: number;
    dataToggleM: string;
    dataToggleH: string;
    hideToolTip: boolean
    circleSize: number
};

export const LineChart = ({
    width,
    height,
    circleSize,
    hideToolTip,
    dataToggleM,
    dataToggleH
}: LineChart) => {
    // bounds = area inside the graph axis = calculated by substracting the margins
    const axesRef = useRef(null);
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;
    const dateTicks: any = [] // fix this any
    const [hovered, setHovered] = useState<InteractionData | null>(null);

    const data = dataToggleM === 'M' ? combinedResults : emptyData;
    const dataH = dataToggleH === 'H' ? combinedResultsH : emptyData;

    if (hideToolTip) {
        for (let i = 0; i <= 700; i += 100) {
            dateTicks.push(i);
        }
    }
    else {
        for (let i = 0; i <= 700; i += 10) {
            dateTicks.push(i);
        }
    }

    // Y axis
    const [, max] = d3.extent(data, (d: any) => (d.totals / 60));
    const yScale = d3
        .scaleLinear()
        .domain([0, max || 0])
        .range([boundsHeight, 0]);

    // X axis
    const [, xMax] = d3.extent(data, (d: any) => d.date);
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

    // Build the bLine - M data
    const lineBuilder = d3
        .line<any>()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.totals / 60));

    const linePath = lineBuilder(data);
    if (!linePath) {
        return null;
    }

    // Build the bLine - H data
    const lineBuilderH = d3
        .line<any>()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.totals / 60));
    const linePathH = lineBuilderH(dataH);
    if (!linePathH) {
        return null;
    }

    // Build the pLine - M data
    const pLineBuilder = d3
        .line<any>()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.pTotals / 60));
    const pLinePath = pLineBuilder(data);
    if (!pLinePath) {
        return null;
    }

    // Build the pLine - H data
    const pLineBuilderH = d3
        .line<any>()
        .x((d) => xScale(d.date))
        .y((d) => yScale(d.pTotals / 60));
    const pLinePathH = pLineBuilderH(dataH);
    if (!pLinePathH) {
        return null;
    }

    // Build the circles
    const allCircles = data.map((item: any, i: number) => {
        return (
            <g key={`b-${i}`}>
                <circle
                    cx={xScale(item.date)}
                    cy={yScale(item.totals / 60)}
                    r={circleSize}
                    fill={bColor}
                    stroke={bColor}
                    opacity={'0.8'}
                    onMouseEnter={(e) =>
                        setHovered({
                            xPos: e.currentTarget.getBoundingClientRect().x,
                            yPos: e.currentTarget.getBoundingClientRect().y,
                            name: item.event,
                            totals: (item.totals / 60),
                            date: item.date,
                            time: item.time
                        })
                    }
                    onMouseLeave={() => setHovered(null)}
                />
                {item.pTotals !== undefined &&
                    <circle
                        cx={xScale(item.date)}
                        cy={yScale(item.pTotals / 60)}
                        r={circleSize}
                        fill={pColor}
                        stroke={pColor}
                        opacity={'0.8'}
                        onMouseEnter={() =>
                            setHovered({
                                xPos: xScale(item.date),
                                yPos: yScale(item.pTotals / 60),
                                name: item.event,
                                totals: (item.pTotals / 60),
                                date: item.date,
                                time: item.pTime
                            })
                        }
                        onMouseLeave={() => setHovered(null)}
                    />}
            </g>
        );
    });

    // Build the circles
    const allCirclesH = dataH.map((item: any, i: number) => {
        return (
            <g key={`b-${i}`}>
                <circle
                    cx={xScale(item.date)}
                    cy={yScale(item.totals / 60)}
                    r={circleSize}
                    fill={bColorH}
                    stroke={bColorH}
                    opacity={'0.8'}
                    onMouseEnter={(e) =>
                        setHovered({
                            xPos: e.currentTarget.getBoundingClientRect().x,
                            yPos: e.currentTarget.getBoundingClientRect().y,
                            name: item.event,
                            totals: (item.totals / 60),
                            date: item.date,
                            time: item.time
                        })
                    }
                    onMouseLeave={() => setHovered(null)}
                />
                {item.pTotals !== undefined &&
                    <circle
                        cx={xScale(item.date)}
                        cy={yScale(item.pTotals / 60)}
                        r={circleSize}
                        fill={pColorH}
                        stroke={pColorH}
                        opacity={'0.8'}
                        onMouseEnter={() =>
                            setHovered({
                                xPos: xScale(item.date),
                                yPos: yScale(item.pTotals / 60),
                                name: item.event,
                                totals: (item.pTotals / 60),
                                date: item.date,
                                time: item.pTime
                            })
                        }
                        onMouseLeave={() => setHovered(null)}
                    />}
            </g>
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
                        stroke={bColor}
                        opacity={'0.7'}
                        fill="none"
                        strokeWidth={2}
                    />
                    <path
                        d={pLinePath}
                        stroke={pColor}
                        opacity={'0.7'}
                        fill="none"
                        strokeWidth={2}
                    />
                    <path
                        d={linePathH}
                        stroke={bColorH}
                        opacity={'0.7'}
                        fill="none"
                        strokeWidth={2}
                    />
                    <path
                        d={pLinePathH}
                        stroke={pColorH}
                        opacity={'0.7'}
                        fill="none"
                        strokeWidth={2}
                    />
                    {allCircles}
                    {allCirclesH}
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
                {!hideToolTip && <LineChartTooltip interactionData={hovered} />}
            </div>
        </div>
    );
};