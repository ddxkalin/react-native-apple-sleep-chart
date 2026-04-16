import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, { interpolate } from "react-native-reanimated";

import { Transition } from "./theme";
import type { SleepSegment, ChartInternalProps } from "./types";

type Props = {
  data: SleepSegment[];
  totalMinutes: number;
  layout: ChartInternalProps;
};

const Bars: React.FC<Props> = ({ data, totalMinutes, layout }) => {
  const {
    resolvedTheme,
    chartWidthPx,
    borderWidthPx,
    rowHeightPx,
    barTopOffsetPx,
    barHeightPx,
  } = layout;

  return data.map((segment, index) => {
    const fromMinutes =
      segment.from.getHours() * 60 + segment.from.getMinutes();
    const toMinutes = segment.to.getHours() * 60 + segment.to.getMinutes();

    const top =
      resolvedTheme.stages[segment.type].position * rowHeightPx +
      barTopOffsetPx +
      borderWidthPx;
    const left = interpolate(fromMinutes, [0, totalMinutes], [0, chartWidthPx]);
    const width =
      interpolate(
        toMinutes - fromMinutes,
        [0, totalMinutes],
        [0, chartWidthPx],
      ) - borderWidthPx;

    return (
      <Animated.View
        key={index}
        layout={Transition}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
        }}
      >
        <View
          style={[
            styles.bar,
            {
              backgroundColor: resolvedTheme.stages[segment.type].color,
              height: barHeightPx - borderWidthPx * 2,
            },
          ]}
        />
      </Animated.View>
    );
  }) as unknown as React.JSX.Element;
};

const styles = StyleSheet.create({
  bar: {
    minWidth: 1,
    borderRadius: 6,
  },
});

export { Bars };
