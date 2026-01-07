import { ScrollView, View } from "react-native";
import SecondaryPressable from "../SecondaryPressable";
import { ThemedText } from "../ThemedText";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import EmotionsModal from "./EmotionsModal";
import { useTranslation } from "react-i18next";
import { useSetDailyFeelingMutation } from "@/services/user";
import { useDispatch } from "react-redux";
import Feeling from "@/types/feeling";
import { useDailyFeeling } from "@/redux/hooks";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { logEvent } from "@react-native-firebase/analytics";
import { analytics } from "@/firebaseConfig";

export default function EmotionsScrollView() {
  const { t } = useTranslation();
  const emotions = [
    {
      title: t("feelings.happy"),
      emoji: "😊",
      value: Feeling.Happy,
    },
    {
      title: t("feelings.sad"),
      emoji: "😢",
      value: Feeling.Sad,
    },
    {
      title: t("feelings.angry"),
      emoji: "😡",
      value: Feeling.Angry,
    },
    {
      title: t("feelings.anxious"),
      emoji: "😰",
      value: Feeling.Anxious,
    },
    {
      title: t("feelings.stressed"),
      emoji: "😖",
      value: Feeling.Stressed,
    },
    {
      title: t("feelings.excited"),
      emoji: "😆",
      value: Feeling.Excited,
    },
    {
      title: t("feelings.tired"),
      emoji: "😴",
      value: Feeling.Tired,
    },
    {
      title: t("feelings.calm"),
      emoji: "😌",
      value: Feeling.Calm,
    },
  ];

  const negativeFeelings = [
    Feeling.Sad,
    Feeling.Angry,
    Feeling.Anxious,
    Feeling.Stressed,
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState<Feeling | undefined>(
    undefined
  );
  const [setDailyFeeling] = useSetDailyFeelingMutation();
  const { feeling, date, updateFeeling, resetFeeling } = useDailyFeeling();
  const dispatch = useDispatch();
  const secondaryBackground = useThemeColor(
    {
      light: Colors.light.secondaryBackground,
      dark: Colors.dark.secondaryBackground,
    },
    "background"
  );

  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getLastFeelingDateString = () => {
    return date?.split("T")[0];
  };

  const checkAndResetFeeling = () => {
    const today = getTodayDateString();
    const lastFeelingDate = getLastFeelingDateString();
    if (today !== lastFeelingDate) {
      resetFeeling();
    }
  };

  useEffect(() => {
    checkAndResetFeeling();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkAndResetFeeling();
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <EmotionsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        selectedEmotion={selectedEmotion}
      />
      <View style={{ width: 16 }} />
      {emotions.map((emotion, index) => (
        <SecondaryPressable
          key={index}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            updateFeeling(emotion.value);
            setDailyFeeling({
              feeling: emotion.value,
              date: new Date().toISOString(),
            });
            if (negativeFeelings.some((f) => f === emotion.value)) {
              setSelectedEmotion(emotion.value);
              setIsModalVisible(true);
            }
            logEvent(analytics, `emotion_pressed`, {
              emotion_name: emotion.title,
            });
          }}
          style={{
            borderRadius: 16,
            padding: 12,
            marginRight: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            backgroundColor:
              feeling === emotion.value
                ? Colors.dark.primary
                : secondaryBackground,
          }}
        >
          <ThemedText
            style={{
              color: emotion.value === feeling ? "#fff" : color,
            }}
          >
            {emotion.title}
          </ThemedText>
          <ThemedText>{emotion.emoji}</ThemedText>
        </SecondaryPressable>
      ))}
    </ScrollView>
  );
}
