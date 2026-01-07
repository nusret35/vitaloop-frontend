import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import React, { useEffect, useMemo, useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, G, Text as SvgText } from "react-native-svg";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import * as Haptics from "expo-haptics";
import { useGetUserGoalProgressLogsOfWeekQuery } from "@/services/userGoal";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");
const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const yAxisWidth = 40;
const chartWidth = width * 0.84 - 40;
const barWidth = chartWidth / weekdays.length;
const barThickness = barWidth * 0.4;
const barRadius = 8;
const chartHeight = 100;
const svgHeight = 130;

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const WeeklyProgressChart = () => {
  const { t } = useTranslation();
  const userGoalProgressLogsOfWeek = useGetUserGoalProgressLogsOfWeekQuery();
  const data = useMemo(
    () =>
      userGoalProgressLogsOfWeek.data?.map((entry) => entry.progress) ?? [
        0, 0, 0, 0, 0, 0, 0,
      ],
    [userGoalProgressLogsOfWeek.data]
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const animatedValues = data?.map(() => useSharedValue(0));

  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  const animatedPropsArray = animatedValues.map((animatedValue) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedProps(() => {
      const height = interpolate(
        animatedValue.value,
        [0, 100],
        [0, chartHeight]
      );
      return {
        y: -height,
        height: height,
      };
    })
  );

  useEffect(() => {
    const calculatedMax = Math.max(...data, 50);

    animatedValues.forEach((value, index) => {
      const scaledValue = (data[index] / calculatedMax) * 100;
      value.value = withTiming(scaledValue, { duration: 1000 });
    });

    const average =
      data.length > 0
        ? data.reduce((sum, value) => sum + value, 0) / data.length
        : 0;
    const scaledAverage = (average / calculatedMax) * 100;
    withTiming(scaledAverage, { duration: 1000 });
  }, [data, animatedValues]);

  useEffect(() => setSelectedBar(null), [userGoalProgressLogsOfWeek.data]);

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={svgHeight}>
          <G y={svgHeight - chartHeight}>
            <G y={chartHeight}>
              {data.map((value, index) => {
                const animatedProps = animatedPropsArray[index];
                const barX = index * barWidth + (barWidth - barThickness) / 2;

                return (
                  <G key={index}>
                    {selectedBar === index && (
                      <>
                        <Rect
                          x={barX + barThickness / 2 - 20}
                          y={
                            -animatedValues[index].value * (chartHeight / 100) -
                            30
                          }
                          width={40}
                          height={20}
                          fill={Colors.dark.primary}
                          rx={4}
                          ry={4}
                        />
                        <SvgText
                          x={barX + barThickness / 2}
                          y={
                            -animatedValues[index].value * (chartHeight / 100) -
                            15
                          }
                          fontSize="10"
                          fill="#fff"
                          textAnchor="middle"
                        >
                          {value}
                        </SvgText>
                      </>
                    )}
                    <AnimatedRect
                      x={barX}
                      width={barThickness}
                      rx={barRadius}
                      ry={barRadius}
                      fill={Colors.dark.primary}
                      animatedProps={animatedProps}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedBar(index);
                      }}
                    />
                  </G>
                );
              })}
            </G>
          </G>
        </Svg>
      </View>
      <View style={styles.labelContainer}>
        {weekdays.map((day, index) => (
          <View key={index} style={[styles.labelWrapper, { width: barWidth }]}>
            <ThemedText style={styles.label}>{t(`routine.${day}`)}</ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
};
export default WeeklyProgressChart;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  chartContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  yAxisContainer: {
    width: yAxisWidth,
    position: "relative",
  },
  yAxisLabel: {
    position: "absolute",
    right: 5,
    fontSize: 10,
    color: "#666",
    textAlign: "right",
  },
  labelContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  labelWrapper: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
  },
  averageContainer: {
    marginTop: 12,
    alignItems: "flex-end",
  },
  averageLegend: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendLine: {
    width: 20,
    height: 2,
    marginRight: 8,
    backgroundColor: "#FF6347",
  },
  averageText: {
    fontSize: 12,
    color: "#666",
  },
});
