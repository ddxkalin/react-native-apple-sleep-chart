import React from "react";
import { Text, type LayoutChangeEvent, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
  useSharedValue,
} from "react-native-reanimated";

import type { SleepSegment, ChartInternalProps } from "./types";

type CursorData = {
  segment: SleepSegment;
  durationMin: number;
};

type CursorHandle = {
  setData: (data: CursorData) => void;
};

type Props = {
  panX: SharedValue<number>;
  opacity: SharedValue<number>;
  minPanX: number;
  maxPanX: number;
  layout: ChartInternalProps;
};

const Cursor = React.forwardRef<CursorHandle, Props>(
  ({ panX, opacity, minPanX, maxPanX, layout }, ref) => {
    const { resolvedTheme, chartWidthPx, chartHeightPx } = layout;

    const [data, setData] = React.useState<CursorData>();
    const cardLayout = useSharedValue({ width: 0, height: 0 });

    const onCardLayout = (event: LayoutChangeEvent) => {
      cardLayout.value = event.nativeEvent.layout;
    };

    const barAnimation = useAnimatedStyle(
      () => ({
        transform: [
          {
            translateX: interpolate(
              panX.value,
              [minPanX, maxPanX],
              [minPanX, maxPanX],
              Extrapolation.CLAMP,
            ),
          },
        ],
        opacity: opacity.value,
      }),
      [minPanX, maxPanX],
    );

    const cardAnimation = useAnimatedStyle(
      () => ({
        transform: [
          {
            translateX: interpolate(
              panX.value - cardLayout.value.width / 2,
              [0, chartWidthPx - cardLayout.value.width],
              [0, chartWidthPx - cardLayout.value.width],
              Extrapolation.CLAMP,
            ),
          },
        ],
        opacity: opacity.value,
        top: -cardLayout.value.height,
      }),
      [chartWidthPx],
    );

    React.useImperativeHandle(
      ref,
      () => ({
        setData: (newData) => {
          if (newData.segment.id != data?.segment.id) {
            setData(newData);
          }
        },
      }),
      [data],
    );

    if (!data) {
      return null;
    }

    const stageInfo = resolvedTheme.stages[data.segment.type];
    let label =
      data.segment.type === "awake"
        ? "AWAKE"
        : `${stageInfo.label} sleep`.toUpperCase();

    const dateFormatted =
      "Today, " +
      new Date(data.segment.from).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) +
      " - " +
      new Date(data.segment.to).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

    return (
      <>
        <Animated.View
          pointerEvents={"none"}
          onLayout={onCardLayout}
          style={[
            {
              position: "absolute",
              padding: 10,
              alignSelf: "baseline",
              backgroundColor: resolvedTheme.colors.background.secondary,
              borderRadius: 12,
              borderCurve: "continuous",
            },
            cardAnimation,
          ]}
        >
          <Text
            style={{ fontSize: 12, color: resolvedTheme.colors.text.secondary }}
          >
            {label}
          </Text>
          <Text
            style={{ fontSize: 12, color: resolvedTheme.colors.text.secondary }}
          >
            <Text
              style={{
                fontSize: 24,
                fontWeight: "500",
                color: resolvedTheme.colors.text.primary,
              }}
            >
              {data.durationMin}
            </Text>
            {" min"}
          </Text>
          <Text
            style={{ fontSize: 12, color: resolvedTheme.colors.text.secondary }}
          >
            {dateFormatted}
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            {
              width: 2.5,
              height: chartHeightPx,
              position: "absolute",
              backgroundColor: resolvedTheme.colors.background.secondary,
            },
            barAnimation,
          ]}
        />
      </>
    );
  },
);

export { Cursor };
export type { CursorHandle, CursorData };
