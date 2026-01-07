import {
  addDays,
  eachDayOfInterval,
  eachWeekOfInterval,
  format,
  subDays,
} from "date-fns";
import { TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

export const DateSlider = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date;
  setSelectedDate: (newDate: Date) => void;
}) => {
  const { t } = useTranslation();
  const dates = eachWeekOfInterval(
    {
      start: subDays(new Date(), 14),
      end: addDays(new Date(), 14),
    },
    {
      weekStartsOn: 1,
    }
  ).reduce((acc: Date[][], cur: Date) => {
    const allDays = eachDayOfInterval({ start: cur, end: addDays(cur, 6) });
    acc.push(allDays);
    return acc;
  }, []);

  const textColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );

  return (
    <View style={{ flex: 1, backgroundColor, borderRadius: 16 }}>
      <PagerView
        initialPage={2}
        style={{
          flex: 1,
          borderRadius: 16,
          flexDirection: "column",
          height: 60,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {dates.map((week, index) => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              padding: 8,
            }}
            key={index}
          >
            {week.map((day, index) => {
              const txt = format(day, "EEE");
              const isSelected = selectedDate.getDate() === day.getDate();
              const isToday = new Date().getDate() === day.getDate();
              const backgroundColor = isSelected
                ? Colors.dark.primary
                : "transparent";
              const color = isSelected ? "#fff" : textColor;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedDate(day);
                  }}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    backgroundColor,
                    borderRadius: 8,
                    padding: 4,
                    borderBottomWidth: isToday ? 2 : 0,
                    borderBottomColor: Colors.dark.primary,
                  }}
                >
                  <ThemedText style={{ fontSize: 14, color }}>
                    {t(`routine.${txt}`)}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 16, color }}>
                    {day.getDate()}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </PagerView>
    </View>
  );
};
