import {
  StyleSheet,
  Dimensions,
  DynamicColorIOS,
  Platform,
} from "react-native";
import { LinearTransition } from "react-native-reanimated";
import type {
  SleepChartTheme,
  ResolvedTheme,
  SleepStageMap,
  ChartInternalProps,
} from "./types";

const margin = 16;

const WINDOW_WIDTH_PX = Dimensions.get("window").width;

/** Default sleep stage definitions */
const DEFAULT_STAGES: SleepStageMap = {
  awake: {
    position: 0,
    label: "Awake",
    color: "#FE8A73FF",
  },
  rem: {
    position: 1,
    label: "REM",
    color: "#3FB1E7FF",
  },
  core: {
    position: 2,
    label: "Core",
    color: "#1B81FEFF",
  },
  deep: {
    position: 3,
    label: "Deep",
    color: "#403EA7FF",
  },
};

const dynamicColor = (light: string, dark: string) =>
  Platform.OS === "android" ? light : DynamicColorIOS({ light, dark });

/** Default theme colors */
const DEFAULT_COLORS = {
  background: {
    primary: dynamicColor("#ffffff", "#000000"),
    secondary: dynamicColor("#efefef", "#222222"),
    tertiary: dynamicColor("#e4e4e4", "#404040"),
  },
  text: {
    primary: dynamicColor("#272727", "#f0f0f0"),
    secondary: dynamicColor("#595959", "#b8b8b8"),
    tertiary: dynamicColor("#b8b8b8", "#595959"),
  },
} as const;

/**
 * Merge user-provided theme overrides with defaults.
 */
function resolveTheme(userTheme?: SleepChartTheme): ResolvedTheme {
  const colors = {
    background: {
      primary:
        userTheme?.colors?.background?.primary ??
        DEFAULT_COLORS.background.primary,
      secondary:
        userTheme?.colors?.background?.secondary ??
        DEFAULT_COLORS.background.secondary,
      tertiary:
        userTheme?.colors?.background?.tertiary ??
        DEFAULT_COLORS.background.tertiary,
    },
    text: {
      primary: userTheme?.colors?.text?.primary ?? DEFAULT_COLORS.text.primary,
      secondary:
        userTheme?.colors?.text?.secondary ?? DEFAULT_COLORS.text.secondary,
      tertiary:
        userTheme?.colors?.text?.tertiary ?? DEFAULT_COLORS.text.tertiary,
    },
  };

  const stages: SleepStageMap = { ...DEFAULT_STAGES };
  if (userTheme?.stages) {
    for (const key of Object.keys(
      userTheme.stages,
    ) as (keyof typeof DEFAULT_STAGES)[]) {
      const override = userTheme.stages[key];
      if (override) {
        stages[key] = {
          ...stages[key],
          ...override,
        };
      }
    }
  }

  return { colors, stages };
}

/**
 * Compute layout constants from the resolved theme.
 */
function computeLayout(resolvedTheme: ResolvedTheme): ChartInternalProps {
  const stageCount = Object.keys(resolvedTheme.stages).length;
  const chartWidthPx = WINDOW_WIDTH_PX - margin * 2;
  const chartHeightPx = 260;
  const barHeightPx = (chartHeightPx / stageCount) * 0.45;
  const barTopOffsetPx = barHeightPx * 0.8;
  const borderWidthPx = 2;
  const lineSizePx = 1 - StyleSheet.hairlineWidth;
  const rowHeightPx = (chartHeightPx - margin) / stageCount;

  return {
    resolvedTheme,
    chartWidthPx,
    chartHeightPx,
    rowHeightPx,
    barHeightPx,
    barTopOffsetPx,
    borderWidthPx,
    lineSizePx,
  };
}

const Transition = LinearTransition.springify()
  .mass(1.5)
  .damping(30)
  .stiffness(300);

export {
  DEFAULT_STAGES,
  DEFAULT_COLORS,
  resolveTheme,
  computeLayout,
  Transition,
  WINDOW_WIDTH_PX,
  margin,
};
