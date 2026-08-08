import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import {resultB, bColor } from "../dataTools";


const MARGIN = { top: 30, right: 30, bottom: 80, left: 100 };
const BUBBLE_MIN_SIZE = 4;
const BUBBLE_MAX_SIZE = 40;

export const data = resultB
// type DataPoint = {
//     date: number;
//     totals: number;
//     event: string;
// };

type BubblePlotProps = {
    width: number;
    height: number;
    // data: DataPoint[] | any; 
};

export const BubblePlot = ({ width, height }: BubblePlotProps) => {
    // Layout. The div size is set by the given props.
    // The bounds (=area inside the axis) is calculated by substracting the margins
    const axesRef = useRef(null);
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    console.log('resultB', resultB)

    // Scales
    const yScale = useMemo(() => {
        const [min, max] = d3.extent(data.map((d: any) => d.totals)) as [
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
        return d3.scaleLinear().domain([0, max]).range([0, boundsWidth]).nice();
    }, [data, width]);

    const sizeScale = useMemo(() => {
        const [min, max] = d3.extent(data.map((d: any) => d.totals)) as [number, number];
        return d3
            .scaleSqrt()
            .domain([min, max])
            .range([BUBBLE_MIN_SIZE, BUBBLE_MAX_SIZE]);
    }, [data, width]);

    // Render the X and Y axis using d3.js, not react
    useEffect(() => {
        const svgElement = d3.select(axesRef.current);
        svgElement.selectAll("*").remove();

        const xAxisGenerator = d3.axisBottom(xScale);
        svgElement
            .append("g")
            .attr("transform", "translate(0," + (boundsHeight + 20) + ")")
            .call(xAxisGenerator);
        svgElement
            .append("text")
            .attr("font-size", 12)
            .attr("text-anchor", "end")
            .attr("x", boundsWidth)
            .attr("y", boundsHeight + 60)

        const yAxisGenerator = d3.axisLeft(yScale);
        svgElement
            .append("g")
            .attr("transform", "translate(" + -20 + ",0)")
            .call(yAxisGenerator);
        svgElement
            .append("text")
            .attr("font-size", 12)
            .attr("text-anchor", "end")
            .attr("x", 0)
            .attr("y", -60)
            .attr("transform", "rotate(-90)");
    }, [xScale, yScale, boundsHeight, boundsWidth]);

    // Build the shapes
    const allShapes = data
        .map((d: any, i: number) => {
            return (
                <circle
                    key={i}
                    r={sizeScale(d.totals)}
                    cx={xScale(d.date)}
                    cy={yScale(d.totals)}
                    opacity={1}
                    stroke={'gray'}
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
