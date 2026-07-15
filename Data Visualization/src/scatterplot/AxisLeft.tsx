import { useMemo } from "react";
import type { ScaleLinear } from 'd3-scale';

type AxisLeftProps = {
  yScale: ScaleLinear<number, number>;
  pixelsPerTick: number;
  width: number;
};

const TICK_LENGTH = 10;

export const AxisLeft = ({ yScale, pixelsPerTick, width }: AxisLeftProps) => {
  const range = yScale.range();

  const ticks = useMemo(() => {
    const height = range[0] - range[1];
    const numberOfTicksTarget = Math.floor(height / pixelsPerTick);

    return yScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      yOffset: yScale(value),
    }));
  }, [yScale]);

  const convertTime = (time: number) => {
    const ampm = time >= 12 ? 'PM' : 'AM';

    let hours = time % 12 || 12; // Converts 0 to 12, and 13-23 to 1-11
    return `${hours} ${ampm}`;
  };

  return (
    <>
      {/* Ticks and labels */}
      {ticks.map(({ value, yOffset }) => (
        <g key={value} transform={`translate(0, ${yOffset})`}>
          <line
            x1={-TICK_LENGTH}
            x2={width + TICK_LENGTH}
            stroke="#D2D7D3"
            strokeWidth={0.5}
            shapeRendering={"crispEdges"}
          />
          {/* modify this show it works */}
          <text
            key={convertTime(value)}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateX(-20px)",
              fill: "#353936",
            }}
          >
            {convertTime(value)}
          </text>
        </g>
      ))}
    </>
  );
};
