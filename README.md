# react-native-apple-sleep-chart

A React Native sleep stages chart (hypnogram) component inspired by the iOS Health app. Features interactive pan gesture with cursor, haptic feedback on segment transitions, customizable themes, and smooth Reanimated animations.

<!-- Screenshots and demo video coming soon -->

---

## Features

- iOS Health app-style sleep stages hypnogram
- Interactive pan gesture with animated cursor and info card
- Haptic feedback when crossing segment boundaries (optional)
- Fully customizable theme (colors, stage labels, stage colors)
- Dark mode support out of the box (iOS `DynamicColorIOS`)
- Smooth spring-based animations via `react-native-reanimated`
- Gradient underlay with masked view
- TypeScript-first with full type exports
- `onSegmentChange` callback for external integrations

## Installation

```sh
# Using npm
npm install react-native-apple-sleep-chart

# Using yarn
yarn add react-native-apple-sleep-chart
```

### Peer Dependencies

This library requires the following peer dependencies. Install any you don't already have:

```sh
yarn add react-native-gesture-handler react-native-reanimated react-native-svg @react-native-masked-view/masked-view
```

For haptic feedback support (optional):

```sh
yarn add react-native-haptic-feedback
```

Then install iOS pods:

```sh
cd ios && pod install
```

> **Note:** Make sure `react-native-reanimated` is properly configured in your `babel.config.js` with the Reanimated plugin. See the [Reanimated installation docs](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/).

## Quick Start

```tsx
import React from "react";
import { SafeAreaView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  SleepStagesChart,
  type SleepSegment,
} from "react-native-apple-sleep-chart";

const sleepData: SleepSegment[] = [
  {
    id: 0,
    type: "core",
    from: new Date("2024-01-15T00:00:00"),
    to: new Date("2024-01-15T00:45:00"),
  },
  {
    id: 1,
    type: "deep",
    from: new Date("2024-01-15T00:45:00"),
    to: new Date("2024-01-15T01:30:00"),
  },
  {
    id: 2,
    type: "rem",
    from: new Date("2024-01-15T01:30:00"),
    to: new Date("2024-01-15T02:10:00"),
  },
  {
    id: 3,
    type: "core",
    from: new Date("2024-01-15T02:10:00"),
    to: new Date("2024-01-15T03:00:00"),
  },
  {
    id: 4,
    type: "awake",
    from: new Date("2024-01-15T03:00:00"),
    to: new Date("2024-01-15T03:02:00"),
  },
  {
    id: 5,
    type: "deep",
    from: new Date("2024-01-15T03:02:00"),
    to: new Date("2024-01-15T04:00:00"),
  },
];

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <SleepStagesChart
          data={sleepData}
          enableHaptics={true}
          onSegmentChange={(segment) => {
            console.log("Now viewing:", segment.type);
          }}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
```

## Props

### `SleepStagesChartProps`

| Prop                | Type                              | Default      | Description                                                                                                                 |
| ------------------- | --------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `data`              | `SleepSegment[]`                  | **required** | Array of sleep segments to display. Must be sorted by `from` date ascending.                                                |
| `theme`             | `SleepChartTheme`                 | `undefined`  | Optional theme overrides for colors and stage appearance.                                                                   |
| `enableHaptics`     | `boolean`                         | `true`       | Enable haptic feedback when the cursor crosses segment boundaries. Requires `react-native-haptic-feedback` to be installed. |
| `onSegmentChange`   | `(segment: SleepSegment) => void` | `undefined`  | Callback fired when the cursor enters a different segment during pan gesture.                                               |
| `showHeader`        | `boolean`                         | `true`       | Whether to show the header displaying total sleep time.                                                                     |
| `showRefreshButton` | `boolean`                         | `false`      | Whether to show the refresh button in the header.                                                                           |
| `onRefreshPress`    | `() => void`                      | `undefined`  | Callback fired when the refresh button is pressed. Only relevant if `showRefreshButton` is true.                            |

## Types

### `SleepSegment`

Represents a single sleep segment in the chart.

```ts
type SleepSegment = {
  id: number; // Unique identifier for the segment
  type: SleepStageKey; // "awake" | "rem" | "core" | "deep"
  from: Date; // Start time of the segment
  to: Date; // End time of the segment
};
```

### `SleepStageKey`

```ts
type SleepStageKey = "awake" | "rem" | "core" | "deep";
```

### `SleepChartTheme`

Optional theme overrides. All fields are optional -- only override what you need.

```ts
type SleepChartTheme = {
  colors?: {
    background?: {
      primary?: string; // Main background (default: white/black)
      secondary?: string; // Cursor card, cursor bar (default: light/dark gray)
      tertiary?: string; // Grid lines, borders (default: lighter gray)
    };
    text?: {
      primary?: string; // Prominent text (default: dark/light)
      secondary?: string; // Regular text in cursor card
      tertiary?: string; // Labels, axis text
    };
  };
  stages?: Partial<
    Record<
      SleepStageKey,
      {
        color?: string; // Override the bar color for a stage
        label?: string; // Override the axis label for a stage
      }
    >
  >;
};
```

## Theme Customization

### Custom Colors

```tsx
<SleepStagesChart
  data={sleepData}
  theme={{
    colors: {
      background: {
        primary: "#1a1a2e",
        secondary: "#16213e",
        tertiary: "#0f3460",
      },
      text: {
        primary: "#e94560",
        secondary: "#a8a8a8",
        tertiary: "#666666",
      },
    },
  }}
/>
```

### Custom Stage Colors and Labels

```tsx
<SleepStagesChart
  data={sleepData}
  theme={{
    stages: {
      awake: { color: "#FF6B6B", label: "Awake" },
      rem: { color: "#4ECDC4", label: "REM" },
      core: { color: "#45B7D1", label: "Light" },
      deep: { color: "#6C5CE7", label: "Deep" },
    },
  }}
/>
```

## Haptic Feedback

Haptic feedback triggers automatically when the user's pan gesture crosses from one sleep segment into another, providing tactile confirmation of segment transitions -- just like the iOS Health app.

- **Haptic type**: `impactLight` (subtle, non-intrusive)
- **Platform support**: iOS (native) and Android (vibration fallback)
- **Optional dependency**: If `react-native-haptic-feedback` is not installed, haptics are silently disabled
- **Control**: Set `enableHaptics={false}` to disable programmatically

## Data Format Requirements

1. **Segments must be sorted** by `from` date in ascending order
2. **Each segment needs a unique `id`** (used internally for change detection)
3. **Segments should be contiguous** (the `to` of one segment should match the `from` of the next) for proper visual rendering
4. **All segments must fall within the same date** -- the chart uses hours/minutes for positioning
5. **The `type` field** must be one of: `"awake"`, `"rem"`, `"core"`, `"deep"`

## Exported Utilities

In addition to the main component, the library exports these utilities:

```ts
import {
  // Component
  SleepStagesChart,

  // Default stage definitions (colors, labels, positions)
  DEFAULT_STAGES,

  // Default color palette
  DEFAULT_COLORS,

  // Function to merge custom theme with defaults
  resolveTheme,

  // Types
  type SleepSegment,
  type SleepStageKey,
  type SleepStageDefinition,
  type SleepStageMap,
  type SleepChartTheme,
  type SleepChartThemeColors,
  type SleepStagesChartProps,
} from "react-native-apple-sleep-chart";
```

## Default Stage Colors

| Stage | Color      | Hex       |
| ----- | ---------- | --------- |
| Awake | Orange     | `#FE8A73` |
| REM   | Light Blue | `#3FB1E7` |
| Core  | Blue       | `#1B81FE` |
| Deep  | Indigo     | `#403EA7` |

## Wrapping with GestureHandlerRootView

The chart uses `react-native-gesture-handler` for pan gestures. Your app must be wrapped with `GestureHandlerRootView` at the root level:

```tsx
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Your app content */}
    </GestureHandlerRootView>
  );
}
```

## Running the Example App

```sh
# Clone the repo
git clone https://github.com/ddxkalin/react-native-apple-sleep-chart.git
cd react-native-apple-sleep-chart

# Install dependencies
yarn install

# iOS
cd ios && pod install && cd ..
yarn example:ios

# Android
yarn example:android
```

## Compatibility

| Dependency                            | Minimum Version     |
| ------------------------------------- | ------------------- |
| React                                 | >= 18.0.0           |
| React Native                          | >= 0.70.0           |
| react-native-reanimated               | >= 3.0.0            |
| react-native-gesture-handler          | >= 2.0.0            |
| react-native-svg                      | >= 13.0.0           |
| @react-native-masked-view/masked-view | >= 0.3.0            |
| react-native-haptic-feedback          | >= 2.0.0 (optional) |

## License

MIT
