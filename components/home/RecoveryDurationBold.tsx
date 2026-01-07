import React, { useEffect, useState } from "react";
import { getDuration } from "@/app/util/recoveryUtils";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

const RecoveryDurationBold = ({
  lastRelapseDate,
  title,
  color,
}: {
  lastRelapseDate: Date;
  title?: string;
  color?: string;
}) => {
  const { t } = useTranslation();
  const [duration, setDuration] = useState(getDuration(lastRelapseDate));

  const themeColor = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(getDuration(lastRelapseDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastRelapseDate]);

  const { years, months, days, hours, minutes, seconds } = duration;

  return (
    <View style={{ alignItems: "center", gap: 4 }}>
      {title && <ThemedText>{title}</ThemedText>}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
        {!!years && years > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline", // Align values and units at the same vertical level
              marginRight: 4,
            }}
          >
            <ThemedText
              style={{
                fontSize: 24, // Value font size
                fontWeight: "600",
                color: color ?? themeColor,
              }}
            >
              {years}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 16, // Unit font size
                fontWeight: "400",
                color: color ?? themeColor,
                marginLeft: 2,
              }}
            >
              {t("duration.yearShort")}
            </ThemedText>
          </View>
        )}
        {!!months && months > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline", // Align values and units at the same vertical level
              marginRight: 4,
            }}
          >
            <ThemedText
              style={{
                fontSize: 24, // Value font size
                fontWeight: "600",
                color: color ?? themeColor,
              }}
            >
              {months}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 16, // Unit font size
                fontWeight: "400",
                color: color ?? themeColor,
                marginLeft: 2,
              }}
            >
              {t("duration.monthShort")}
            </ThemedText>
          </View>
        )}
        {!!days && days > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline", // Align values and units at the same vertical level
              marginRight: 4,
            }}
          >
            <ThemedText
              style={{
                fontSize: 24, // Value font size
                fontWeight: "600",
                color: color ?? themeColor,
              }}
            >
              {days}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 16, // Unit font size
                fontWeight: "400",
                color: color ?? themeColor,
                marginLeft: 2,
              }}
            >
              {t("duration.dayShort")}
            </ThemedText>
          </View>
        )}
        {!!hours && hours > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline", // Align values and units at the same vertical level
              marginRight: 4,
            }}
          >
            <ThemedText
              style={{
                fontSize: 24, // Value font size
                fontWeight: "600",
                color: color ?? themeColor,
              }}
            >
              {hours}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 16, // Unit font size
                fontWeight: "400",
                color: color ?? themeColor,
                marginLeft: 2,
              }}
            >
              {t("duration.hourShort")}
            </ThemedText>
          </View>
        )}
        {!!minutes && minutes > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline", // Align values and units at the same vertical level
              marginRight: 4,
            }}
          >
            <ThemedText
              style={{
                fontSize: 24, // Value font size
                fontWeight: "600",
                color: color ?? themeColor,
              }}
            >
              {minutes}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 16, // Unit font size
                fontWeight: "400",
                color: color ?? themeColor,
                marginLeft: 2,
              }}
            >
              {t("duration.minuteShort")}
            </ThemedText>
          </View>
        )}
        {!!seconds && seconds > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline", // Align values and units at the same vertical level
              marginRight: 4,
            }}
          >
            <ThemedText
              style={{
                fontSize: 24, // Value font size
                fontWeight: "600",
                color: color ?? themeColor,
              }}
            >
              {seconds}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 16, // Unit font size
                fontWeight: "400",
                color: color ?? themeColor,
                marginLeft: 2,
              }}
            >
              {t("duration.secondShort")}
            </ThemedText>
          </View>
        )}
      </View>
    </View>
  );
};

export default RecoveryDurationBold;
