import React from "react";
import { View, StyleSheet } from "react-native";
import type { ChartInternalProps } from "./types";

type Props = {
  layout: ChartInternalProps;
};

const DashedLine: React.FC<Props> = ({ layout }) => {
  const { chartHeightPx, lineSizePx, resolvedTheme } = layout;
  const DASH_SIZE = 3;

  return (
    <View style={[styles.container, { width: lineSizePx }]}>
      {Array.from({ length: chartHeightPx / 2 / DASH_SIZE }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 1,
            height: DASH_SIZE,
            marginTop: DASH_SIZE,
            marginLeft: 0,
            backgroundColor: resolvedTheme.colors.background.tertiary,
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    position: "absolute",
    right: 0,
  },
});

export { DashedLine };
