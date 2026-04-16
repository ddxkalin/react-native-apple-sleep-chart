import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

import { Transition } from "./theme";
import { DashedLine } from "./DashedLine";
import type { ChartInternalProps } from "./types";

type Props = {
  startHours: number;
  endHours: number;
  layout: ChartInternalProps;
};

const Axis: React.FC<Props> = ({ endHours, startHours, layout }) => {
  const {
    resolvedTheme,
    chartWidthPx,
    rowHeightPx,
    lineSizePx,
    chartHeightPx,
  } = layout;

  const cols = Array.from(
    { length: endHours - startHours + 1 },
    (_, index) => `${(index + startHours).toString().padStart(2, "0")}:00`,
  );

  const colWidth = chartWidthPx / cols.length;

  return (
    <>
      {Object.values(resolvedTheme.stages).map((stage, index) => (
        <Animated.View
          key={index}
          layout={Transition}
          style={{ height: rowHeightPx }}
        >
          {!!index && (
            <View
              style={{
                width: "100%",
                height: lineSizePx,
                backgroundColor: resolvedTheme.colors.background.tertiary,
              }}
            />
          )}
          <Text
            style={[
              styles.label,
              { color: resolvedTheme.colors.text.tertiary },
            ]}
          >
            {stage.label}
          </Text>
        </Animated.View>
      ))}
      {cols.map((hour, index) => (
        <Animated.View
          key={index}
          layout={Transition}
          style={[styles.col, { width: colWidth, left: colWidth * index }]}
        >
          <Text
            style={[
              styles.label,
              { color: resolvedTheme.colors.text.tertiary },
            ]}
          >
            {hour}
          </Text>
          {index != cols.length - 1 && <DashedLine layout={layout} />}
        </Animated.View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  col: {
    bottom: 0,
    height: "100%",
    position: "absolute",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  label: {
    fontSize: 10,
    left: 4,
    top: 4,
  },
});

export { Axis };
