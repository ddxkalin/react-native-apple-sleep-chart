import React from "react";
import { View, StyleSheet } from "react-native";

import Svg, { Path } from "react-native-svg";
import MaskedView from "@react-native-masked-view/masked-view";
import Animated, { interpolate } from "react-native-reanimated";

import { Transition } from "./theme";
import { Gradient } from "./Gradient";
import type { SleepSegment, ChartInternalProps } from "./types";

type Props = {
  data: SleepSegment[];
  totalMinutes: number;
  layout: ChartInternalProps;
};

const Underlay: React.FC<Props> = ({ data, totalMinutes, layout }) => {
  const {
    resolvedTheme,
    chartWidthPx,
    borderWidthPx,
    rowHeightPx,
    barTopOffsetPx,
    barHeightPx,
  } = layout;

  const underlay = data.map((item, index) => {
    const fromMinutes = item.from.getHours() * 60 + item.from.getMinutes();
    const toMinutes =
      new Date(item.to).getHours() * 60 + new Date(item.to).getMinutes();

    const topOffset =
      resolvedTheme.stages[item.type].position * rowHeightPx + barTopOffsetPx;
    const leftOffset =
      interpolate(fromMinutes, [0, totalMinutes], [0, chartWidthPx]) -
      borderWidthPx;
    const barWidth =
      interpolate(
        toMinutes - fromMinutes,
        [0, totalMinutes],
        [0, chartWidthPx],
      ) + borderWidthPx;

    const leftLinkHeight =
      index > 0
        ? (rowHeightPx - barHeightPx) *
          Math.abs(
            resolvedTheme.stages[item.type].position -
              resolvedTheme.stages[data[index - 1].type].position,
          )
        : 0;

    const rightLinkHeight =
      index < data.length - 1
        ? (rowHeightPx - barHeightPx) *
          Math.abs(
            resolvedTheme.stages[item.type].position -
              (resolvedTheme.stages[data[index + 1]?.type].position ?? 0),
          )
        : 0;

    return (
      <React.Fragment key={item.id}>
        <Animated.View
          layout={Transition}
          style={{
            top: topOffset,
            left: leftOffset,
            width: barWidth,
            position: "absolute",
          }}
        >
          <View style={[styles.bubble, { height: barHeightPx }]} />
        </Animated.View>

        {index != 0 && data[index - 1].type != item.type && (
          <>
            <Animated.View
              layout={Transition}
              style={[
                styles.line,
                {
                  width: borderWidthPx,
                  left: leftOffset,
                  height: leftLinkHeight,
                  top:
                    resolvedTheme.stages[data[index - 1]?.type].position >
                    resolvedTheme.stages[item.type].position
                      ? topOffset + barHeightPx / 2
                      : topOffset - leftLinkHeight + barHeightPx / 2,
                },
              ]}
            />
            <Animated.View
              layout={Transition}
              style={{
                position: "absolute",
                transform: [{ rotate: "180deg" }],
                left: leftOffset + 1.3,
                opacity: barWidth > 8 ? 1 : 0,
                top:
                  topOffset -
                  7.2 +
                  (resolvedTheme.stages[data[index - 1]?.type].position >
                  resolvedTheme.stages[item.type].position
                    ? barHeightPx - 1
                    : 1),
              }}
            >
              <CornerSVG />
            </Animated.View>
          </>
        )}
        {index != data.length - 1 && data[index + 1].type != item.type && (
          <>
            <Animated.View
              layout={Transition}
              style={[
                styles.line,
                {
                  width: borderWidthPx,
                  left: leftOffset + barWidth - borderWidthPx,
                  height: rightLinkHeight,
                  top:
                    resolvedTheme.stages[data[index + 1]?.type].position >
                    resolvedTheme.stages[item.type].position
                      ? topOffset + barHeightPx / 2
                      : topOffset - rightLinkHeight + barHeightPx / 2,
                },
              ]}
            />
            <Animated.View
              layout={Transition}
              style={{
                position: "absolute",
                left: leftOffset + barWidth - 7.3,
                opacity: barWidth > 8 ? 1 : 0,
                top:
                  topOffset -
                  7.2 +
                  (resolvedTheme.stages[data[index + 1]?.type].position >
                  resolvedTheme.stages[item.type].position
                    ? barHeightPx - 1
                    : 1),
              }}
            >
              <CornerSVG />
            </Animated.View>
          </>
        )}
      </React.Fragment>
    );
  });

  return (
    <MaskedView style={styles.maskedView} maskElement={<>{underlay}</>}>
      <Gradient layout={layout} />
    </MaskedView>
  );
};

const CornerSVG = () => (
  <Svg width={6} height={15}>
    <Path d={RoundCornerSVGPathTp} />
    <Path d={RoundCornerSVGPathBt} />
  </Svg>
);

const styles = StyleSheet.create({
  line: {
    position: "absolute",
    backgroundColor: "black",
  },
  bubble: {
    minWidth: 4,
    backgroundColor: "black",
    borderCurve: "continuous",
    borderRadius: 8,
  },
  maskedView: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
});

const RoundCornerSVGPathTp =
  "M6 7V15H5C5 15 5.30874 11.8133 4.02284 10.107C2.73695 8.40073 0 8 0 8V7H6Z";
const RoundCornerSVGPathBt =
  "M6 8V0H5C5 0 5.28401 3.15824 4 5C2.71599 6.84176 0 7 0 7V8H6Z";

export { Underlay };
