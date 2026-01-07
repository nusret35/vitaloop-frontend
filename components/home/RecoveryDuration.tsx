import React, { useEffect, useState } from "react";
import { getDuration } from "@/app/util/recoveryUtils";
import { View } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";

const RecoveryDuration = ({
  lastRelapseDate,
  color,
}: {
  lastRelapseDate: Date;
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
    <View style={{ flexDirection: "row" }}>
      {!!years && (
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "400",
            color: color ?? themeColor,
          }}
        >
          {years}
          {t("duration.yearShort")}{" "}
        </ThemedText>
      )}
      {!!months && (
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "400",
            color: color ?? themeColor,
          }}
        >
          {months}
          {t("duration.monthShort")}{" "}
        </ThemedText>
      )}
      {!!days && (
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "400",
            color: color ?? themeColor,
          }}
        >
          {days}
          {t("duration.dayShort")}{" "}
        </ThemedText>
      )}
      {!!hours && (
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "400",
            color: color ?? themeColor,
          }}
        >
          {hours}
          {t("duration.hourShort")}{" "}
        </ThemedText>
      )}
      {!!minutes && (
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "400",
            color: color ?? themeColor,
          }}
        >
          {minutes}
          {t("duration.minuteShort")}{" "}
        </ThemedText>
      )}
      <ThemedText
        style={{ fontSize: 18, fontWeight: "400", color: color ?? themeColor }}
      >
        {seconds}
        {t("duration.secondShort")}
      </ThemedText>
    </View>
  );
};

export default RecoveryDuration;
