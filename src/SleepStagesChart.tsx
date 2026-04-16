import React from "react";
import { useSharedValue, interpolate } from "react-native-reanimated";

import { resolveTheme, computeLayout } from "./theme";
import { Cursor, type CursorHandle } from "./Cursor";
import { Bars } from "./Bars";
import { Header } from "./Header";
import { Axis } from "./Axis";
import { PanGestureHandler } from "./PanGestureHandler";
import { Underlay } from "./Underlay";
import type { SleepStagesChartProps, SleepSegment } from "./types";

let ReactNativeHapticFeedback: any = null;
try {
  ReactNativeHapticFeedback = require("react-native-haptic-feedback").default;
} catch {
  // react-native-haptic-feedback is an optional peer dependency
}

const triggerHaptic = () => {
  ReactNativeHapticFeedback?.trigger?.("impactLight", {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  });
};

const SleepStagesChart: React.FC<SleepStagesChartProps> = ({
  data,
  theme: userTheme,
  enableHaptics = true,
  onSegmentChange,
  showHeader = true,
  showRefreshButton = false,
  onRefreshPress,
}) => {
  const resolvedTheme = React.useMemo(
    () => resolveTheme(userTheme),
    [userTheme],
  );
  const layout = React.useMemo(
    () => computeLayout(resolvedTheme),
    [resolvedTheme],
  );

  const cursorRef = React.useRef<CursorHandle>(null);
  const lastSegmentIdRef = React.useRef<number | null>(null);

  const opacity = useSharedValue(0);
  const panX = useSharedValue(0);

  if (data.length === 0) {
    return null;
  }

  const startHours = data[0].from.getHours();
  const endHours = data[data.length - 1].to.getHours();
  const chartWidthMinutes = (endHours - startHours + 1) * 60;

  const leftmostSegmentMinutes = startHours * 60 + data[0].from.getMinutes();
  const rightmostSegmentMinutes =
    endHours * 60 + data[data.length - 1].to.getMinutes();

  const minPanX =
    interpolate(
      leftmostSegmentMinutes,
      [0, chartWidthMinutes],
      [0, layout.chartWidthPx],
    ) - layout.borderWidthPx;
  const maxPanX =
    interpolate(
      rightmostSegmentMinutes,
      [0, chartWidthMinutes],
      [0, layout.chartWidthPx],
    ) - layout.borderWidthPx;

  const seekSegment = (x: number) => {
    const minutes =
      interpolate(x, [0, layout.chartWidthPx], [0, chartWidthMinutes]) +
      layout.borderWidthPx;

    const date = new Date(data[0].from);
    date.setHours(Math.floor(minutes / 60));
    date.setMinutes(minutes % 60);

    const segment: SleepSegment =
      data.find((item) => date >= item.from && date <= item.to) ??
      (minutes <= leftmostSegmentMinutes ? data[0] : data[data.length - 1]);

    const segmentChanged = segment.id !== lastSegmentIdRef.current;

    if (segmentChanged) {
      lastSegmentIdRef.current = segment.id;

      // Haptic feedback on segment change
      if (enableHaptics && ReactNativeHapticFeedback) {
        triggerHaptic();
      }

      // Notify consumer
      onSegmentChange?.(segment);
    }

    cursorRef.current?.setData({
      segment: segment,
      durationMin: Math.floor(
        (segment.to.getTime() - segment.from.getTime()) / 1000 / 60,
      ),
    });
  };

  return (
    <>
      {showHeader && (
        <Header
          opacity={opacity}
          startDate={data[0].from}
          endDate={data[data.length - 1].to}
          resolvedTheme={resolvedTheme}
          showRefreshButton={showRefreshButton}
          onRefreshPress={onRefreshPress}
        />
      )}

      <PanGestureHandler
        panX={panX}
        onPan={seekSegment}
        opacity={opacity}
        layout={layout}
      >
        <Axis startHours={startHours} endHours={endHours} layout={layout} />
        <Underlay
          data={data}
          totalMinutes={chartWidthMinutes}
          layout={layout}
        />
        <Bars data={data} totalMinutes={chartWidthMinutes} layout={layout} />
        <Cursor
          ref={cursorRef}
          minPanX={minPanX}
          maxPanX={maxPanX}
          panX={panX}
          opacity={opacity}
          layout={layout}
        />
      </PanGestureHandler>
    </>
  );
};

export { SleepStagesChart };
