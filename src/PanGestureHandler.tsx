import React from "react";
import { StyleSheet, View } from "react-native";
import {
  withTiming,
  runOnJS,
  withSpring,
  type SharedValue,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import type { ChartInternalProps } from "./types";

type Props = React.PropsWithChildren & {
  opacity: SharedValue<number>;
  panX: SharedValue<number>;
  onPan: (x: number) => void;
  layout: ChartInternalProps;
};

const PanGestureHandler: React.FC<Props> = ({
  onPan,
  panX,
  opacity,
  children,
  layout,
}) => {
  const { chartWidthPx, chartHeightPx, lineSizePx, resolvedTheme } = layout;

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      panX.value = event.x;
      opacity.value = withTiming(1);
      runOnJS(onPan)(event.x);
    })
    .onChange((event) => {
      runOnJS(onPan)(event.x);

      panX.value = withSpring(event.x, {
        mass: 0.5,
        damping: 18,
        stiffness: 300,
      });
    })
    .onTouchesUp(() => {
      opacity.value = withTiming(0);
    })
    .onEnd(() => {
      opacity.value = withTiming(0);
    });

  return (
    <GestureDetector gesture={gesture}>
      <View
        style={[
          styles.container,
          {
            width: chartWidthPx,
            height: chartHeightPx,
            borderLeftWidth: lineSizePx,
            borderRightWidth: lineSizePx,
            borderColor: resolvedTheme.colors.background.tertiary,
          },
        ]}
      >
        {children}
      </View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
});

export { PanGestureHandler };
