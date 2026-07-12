import { useMemo } from "react";
import type { ScaleLinear } from 'd3-scale';

type AxisBottomProps = {
    xScale: ScaleLinear<Date, Date>;
    pixelsPerTick: number;
    height: number;
};

// tick length
const TICK_LENGTH = 10;

export const AxisBottom = ({
    xScale,
    pixelsPerTick,
    height,
}: AxisBottomProps) => {
    const range = xScale.range();

    const ticks = useMemo(() => {
        const width = range[1] - range[0];
        const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

        return xScale.ticks(numberOfTicksTarget).map((value) => ({
            value,
            xOffset: xScale(value),
        }));
    }, [xScale]);

    return (
        <>
            {/* Ticks and labels */}
            {ticks.map(({ value, xOffset }) => (
                <g key={value} transform={`translate(${xOffset}, 0)`}>
                    <line
                        y1={TICK_LENGTH}
                        y2={-height - TICK_LENGTH}
                        stroke="#D2D7D3"
                        strokeWidth={0.5}
                        shapeRendering={"crispEdges"}
                    />
                    <text
                        key={value}
                        style={{
                            fontSize: "10px",
                            textAnchor: "middle",
                            fill: "#353936",
                            transform: 'rotate(52deg) translateX(39px) translate(-5px, 10px)',
                        }}
                    >
                        {value}
                    </text>
                </g>
            ))}
        </>
    );
};
