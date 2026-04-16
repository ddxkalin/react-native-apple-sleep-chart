import React from "react";
import { Text, TouchableOpacity, Image, View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

import { AnimatedNums } from "./AnimatedNums";
import type { ResolvedTheme } from "./types";

type Props = {
  opacity: SharedValue<number>;
  startDate: Date;
  endDate: Date;
  resolvedTheme: ResolvedTheme;
  showRefreshButton?: boolean;
  onRefreshPress?: () => void;
};

const Header: React.FC<Props> = ({
  opacity,
  startDate,
  endDate,
  resolvedTheme,
  showRefreshButton,
  onRefreshPress,
}) => {
  const mins = (endDate.getTime() - startDate.getTime()) / 1000 / 60;
  const hours = Math.floor(mins / 60);
  const minsFormatted = (mins % 60).toString().padStart(2, "0");
  const dateFormatted = startDate.toLocaleDateString([], dateOptions);

  const opacityAnimation = useAnimatedStyle(
    () => ({
      opacity: 1 - opacity.value,
    }),
    [],
  );

  return (
    <Animated.View style={[styles.container, opacityAnimation]}>
      <Animated.View style={styles.infoContainer}>
        <Text
          style={[
            styles.regular,
            { color: resolvedTheme.colors.text.tertiary },
          ]}
        >
          TIME ASLEEP
        </Text>
        <View style={styles.timeContainer}>
          <AnimatedNums
            nums={hours}
            textStyle={[
              styles.prominent,
              { color: resolvedTheme.colors.text.primary },
            ]}
          />
          <Text
            style={[
              styles.regular,
              { color: resolvedTheme.colors.text.tertiary },
            ]}
          >
            {" hr "}
          </Text>
          <AnimatedNums
            nums={minsFormatted}
            textStyle={[
              styles.prominent,
              { color: resolvedTheme.colors.text.primary },
            ]}
          />
          <Text
            style={[
              styles.regular,
              { color: resolvedTheme.colors.text.tertiary },
            ]}
          >
            {" min"}
          </Text>
        </View>
        <Text
          style={[
            styles.regular,
            { color: resolvedTheme.colors.text.tertiary },
          ]}
        >
          {dateFormatted}
        </Text>
      </Animated.View>

      {showRefreshButton && onRefreshPress && (
        <TouchableOpacity onPress={onRefreshPress} style={styles.refreshButton}>
          <Image style={styles.refreshIcon} source={require("./refresh.png")} />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeContainer: {
    marginVertical: 4,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  infoContainer: {
    margin: 16,
    flex: 1,
  },
  regular: {
    fontSize: 14,
  },
  prominent: {
    fontSize: 24,
    fontWeight: "500",
  },
  refreshButton: {
    padding: 16,
  },
  refreshIcon: {
    width: 24,
    height: 24,
  },
});

const dateOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
} as const;

export { Header };
