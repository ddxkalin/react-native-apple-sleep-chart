import type { SharedValue } from "react-native-reanimated";

/**
 * Represents a single sleep segment in the chart.
 */
export type SleepSegment = {
  id: number;
  type: SleepStageKey;
  from: Date;
  to: Date;
};

/**
 * The possible sleep stage keys.
 */
export type SleepStageKey = "awake" | "rem" | "core" | "deep";

/**
 * Definition of a single sleep stage (visual properties).
 */
export type SleepStageDefinition = {
  position: number;
  label: string;
  color: string;
};

/**
 * Map of sleep stage keys to their visual definitions.
 */
export type SleepStageMap = Record<SleepStageKey, SleepStageDefinition>;

/**
 * Theme color configuration for the chart.
 */
export type SleepChartThemeColors = {
  background?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
  text?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
  };
};

/**
 * Full theme override for the chart.
 */
export type SleepChartTheme = {
  colors?: SleepChartThemeColors;
  stages?: Partial<
    Record<
      SleepStageKey,
      Partial<Pick<SleepStageDefinition, "color" | "label">>
    >
  >;
};

/**
 * Props for the main SleepStagesChart component.
 */
export type SleepStagesChartProps = {
  /** Array of sleep segments to display. Must be sorted by `from` date. */
  data: SleepSegment[];

  /** Optional theme overrides for colors and stage appearance. */
  theme?: SleepChartTheme;

  /** Whether to enable haptic feedback when the cursor crosses segment boundaries. Defaults to `true`. */
  enableHaptics?: boolean;

  /** Callback fired when the cursor enters a different segment. */
  onSegmentChange?: (segment: SleepSegment) => void;

  /** Whether to show the header with total sleep time. Defaults to `true`. */
  showHeader?: boolean;

  /** Whether to show the refresh button in the header. Defaults to `false`. */
  showRefreshButton?: boolean;

  /** Callback fired when the refresh button is pressed. Only relevant if `showRefreshButton` is true. */
  onRefreshPress?: () => void;
};

/**
 * Internal resolved theme (all values guaranteed present).
 */
export type ResolvedTheme = {
  colors: {
    background: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
  };
  stages: SleepStageMap;
};

/** Internal props that carry resolved layout + theme */
export type ChartInternalProps = {
  resolvedTheme: ResolvedTheme;
  chartWidthPx: number;
  chartHeightPx: number;
  rowHeightPx: number;
  barHeightPx: number;
  barTopOffsetPx: number;
  borderWidthPx: number;
  lineSizePx: number;
};
