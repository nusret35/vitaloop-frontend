import DayOfWeek from "@/types/dayOfWeek";
import { ScrollView, View } from "react-native";
import SecondaryPressable from "../SecondaryPressable";
import { ThemedText } from "../ThemedText";
import * as Haptics from "expo-haptics";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useTranslation } from "react-i18next";

export default function WeekDaysScrollView({
  selectedDay,
  setSelectedDay,
}: {
  selectedDay: DayOfWeek;
  setSelectedDay: Dispatch<SetStateAction<DayOfWeek>>;
}) {
  const { t } = useTranslation();
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrollViewReady, setIsScrollViewReady] = useState(false);
  const weekDays = useMemo(
    () => [
      {
        name: t("days.monday"),
        value: DayOfWeek.Monday,
      },
      {
        name: t("days.tuesday"),
        value: DayOfWeek.Tuesday,
      },
      {
        name: t("days.wednesday"),
        value: DayOfWeek.Wednesday,
      },
      {
        name: t("days.thursday"),
        value: DayOfWeek.Thursday,
      },
      {
        name: t("days.friday"),
        value: DayOfWeek.Friday,
      },
      {
        name: t("days.saturday"),
        value: DayOfWeek.Saturday,
      },
      {
        name: t("days.sunday"),
        value: DayOfWeek.Sunday,
      },
    ],
    []
  );

  useEffect(() => {
    if (isScrollViewReady) {
      const selectedIndex = weekDays.findIndex(
        (day) => day.value === selectedDay
      );
      if (selectedIndex !== -1 && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: selectedIndex * 100,
          animated: true,
        });
      }
    }
  }, [selectedDay, isScrollViewReady, weekDays]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      ref={scrollViewRef}
      onLayout={() => setIsScrollViewReady(true)}
    >
      <View style={{ width: 16 }} />
      {weekDays.map((day, index) => (
        <SecondaryPressable
          key={index}
          isSelected={selectedDay === day.value}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setSelectedDay(day.value);
          }}
          style={{
            borderRadius: 16,
            padding: 12,
            marginRight: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <ThemedText
            style={{ color: selectedDay === day.value ? "#fff" : color }}
          >
            {day.name}
          </ThemedText>
        </SecondaryPressable>
      ))}
    </ScrollView>
  );
}
