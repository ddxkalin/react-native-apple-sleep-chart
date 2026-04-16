import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  SleepStagesChart,
  type SleepSegment,
  type SleepStageKey,
} from "../src";

/**
 * Example app demonstrating the SleepStagesChart component.
 */
export default () => {
  const [sleepData, setSleepData] = React.useState<SleepSegment[]>(
    generateRandomSleepSegments(),
  );

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={styles.root}>
        <SleepStagesChart
          data={sleepData}
          enableHaptics={true}
          showHeader={true}
          showRefreshButton={true}
          onRefreshPress={() => setSleepData(generateRandomSleepSegments())}
          onSegmentChange={(segment) => {
            console.log("Segment changed:", segment.type, segment.id);
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});

// ---------- Random data generator (for demo purposes only) ----------

const SleepStageConfig: Record<
  SleepStageKey,
  { maxDuration: number; minDuration: number; percentage: number }
> = {
  awake: { maxDuration: 2, minDuration: 2, percentage: 3 },
  rem: { maxDuration: 45, minDuration: 5, percentage: 22 },
  core: { maxDuration: 45, minDuration: 5, percentage: 50 },
  deep: { maxDuration: 45, minDuration: 5, percentage: 25 },
};

function generateRandomSleepSegments(): SleepSegment[] {
  const startTime = new Date();
  startTime.setHours(0, Math.floor(Math.random() * 60), 0, 0);

  const totalSleepMinutes = Math.floor(Math.random() * (400 - 250) + 250);
  const sleepStages = Object.keys(SleepStageConfig) as SleepStageKey[];

  const stageDurations: Record<SleepStageKey, number> = {} as any;
  for (const stage of sleepStages) {
    stageDurations[stage] = Math.round(
      (SleepStageConfig[stage].percentage / 100) * totalSleepMinutes,
    );
  }

  let remainingMinutes = totalSleepMinutes;
  let segmentId = 0;
  let currentTime = new Date(startTime);
  const sleepSegments: SleepSegment[] = [];

  while (remainingMinutes > 0) {
    const possibleStages = sleepStages.filter(
      (stage) => stageDurations[stage] > 0,
    );

    if (possibleStages.length === 0) {
      break;
    }

    const stage =
      possibleStages[Math.floor(Math.random() * possibleStages.length)];
    const config = SleepStageConfig[stage];
    const maxDuration = Math.min(
      stageDurations[stage],
      remainingMinutes,
      config.maxDuration,
    );

    if (maxDuration < config.minDuration) {
      stageDurations[stage] = 0;
      continue;
    }

    const duration = Math.floor(
      Math.random() * (maxDuration - config.minDuration + 1) +
        config.minDuration,
    );

    sleepSegments.push({
      id: segmentId++,
      type: stage,
      from: new Date(currentTime),
      to: new Date(currentTime.getTime() + duration * 60000),
    });

    currentTime = new Date(currentTime.getTime() + duration * 60000);
    remainingMinutes -= duration;
    stageDurations[stage] -= duration;
  }

  sleepSegments.sort((a, b) => a.from.getTime() - b.from.getTime());
  return sleepSegments;
}
