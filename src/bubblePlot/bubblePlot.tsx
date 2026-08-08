import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { resultB, bColor } from "../dataTools";

const MARGIN = { top: 30, right: 0, bottom: 50, left: 100 }

type BubblePlotProps = {
    width: number;
    height: number;
    hideData: boolean
};

export const BubblePlot = ({ width, height, hideData }: BubblePlotProps) => {

    const BUBBLE_MIN_SIZE = hideData ? 5 : 1;
    const BUBBLE_MAX_SIZE = hideData ? 10 : 50;
    const axesRef = useRef(null);
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const data = resultB

    // Scales
    const yScale = useMemo(() => {
        const [min, max] = d3.extent(data.map((d: any) => d.totals / 60)) as [
            number,
            number
        ];
        return d3.scaleLinear().domain([min, max]).range([boundsHeight, 0]).nice();
    }, [data, height]);


    const xScale = useMemo(() => {
        const [min, max] = d3.extent(data.map((d: any) => d.date)) as [
            number,
            number
        ];
        return d3.scaleLinear().domain([min, max]).range([0, boundsWidth]).nice();
    }, [data, width]);

    const sizeScale = useMemo(() => {
        const [min, max] = d3.extent(data.map((d: any) => d.totals / 60)) as [number, number];
        return d3
            .scaleSqrt()
            .domain([min, max])
            .range([BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE]);
    }, [data, width]);

    // Render the X and Y axis using d3.js, not react
    useEffect(() => {
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll("*").remove();

        // add more ticks here
        const xAxisGenerator = d3.axisBottom(xScale);
        svgElement
            .append("g")
            .attr("transform", "translate(0," + (boundsHeight + 20) + ")")
            .call(xAxisGenerator);

        const yAxisGenerator = d3.axisLeft(yScale);
        svgElement
            .append("g")
            .attr("transform", "translate(" + -20 + ",0)")
            .call(yAxisGenerator);
    }, [xScale, yScale, boundsHeight, boundsWidth]);

    // Build the shapes
    const allShapes = data
        .map((d: any, i: number) => {
            return (
                <circle
                    key={i}
                    r={sizeScale(d.totals / 60)}
                    cx={xScale(d.date)}
                    cy={yScale(d.totals / 60)}
                    opacity={1}
                    stroke={bColor}
                    fill={bColor}
                    fillOpacity={0.4}
                    strokeWidth={1}
                />
            );
        });

    return (
        <div>
            <svg width={width} height={height}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
                >
                    {allShapes}
                </g>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    ref={axesRef}
                    transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
                />
            </svg>
        </div>
    );
};
