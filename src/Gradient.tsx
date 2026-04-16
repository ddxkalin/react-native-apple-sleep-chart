import React from "react";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import type { ChartInternalProps } from "./types";

type Props = {
  layout: ChartInternalProps;
};

const Component: React.FC<Props> = ({ layout }) => {
  const { resolvedTheme, chartWidthPx, chartHeightPx } = layout;
  const stages = Object.values(resolvedTheme.stages);
  const stageCount = stages.length;

  return (
    <Svg width={chartWidthPx} height={chartHeightPx}>
      <Defs>
        <LinearGradient x1={0} y1={0.2} x2={0} y2={0.95} id={"grad"}>
          {stages.map((stage) => (
            <Stop
              key={stage.label}
              offset={stage.position / stageCount}
              stopColor={stage.color}
              stopOpacity={"0.3"}
            />
          ))}
        </LinearGradient>
      </Defs>
      <Rect
        x={0}
        y={0}
        fill={"url(#grad)"}
        width={chartWidthPx}
        height={chartHeightPx}
      />
    </Svg>
  );
};

export const Gradient = React.memo(Component);
