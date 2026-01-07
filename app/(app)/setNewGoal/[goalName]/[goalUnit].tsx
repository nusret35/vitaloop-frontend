import CommonTextInput from "@/components/CommonTextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

const SetNewGoalScreen = () => {
  const { t } = useTranslation();
  const { goalName, goalUnit } = useLocalSearchParams();
  const [goalValue, setGoalValue] = useState("");

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <ThemedText type="header1">{goalName}</ThemedText>
        <View style={{ flex: 1, paddingTop: 16 }}>
          <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
            {t("sections.goal")}
          </ThemedText>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
            }}
          >
            <CommonTextInput
              style={{ flex: 1, height: 40 }}
              keyboardType="numeric"
              value={goalValue}
              onChangeValue={(newValue) => setGoalValue(newValue)}
              placeholder={t("goal.enterGoal")}
            />
            <ThemedText>{goalUnit}</ThemedText>
          </View>
        </View>
      </ScrollView>
    </ThemedView>
  );
};

export default SetNewGoalScreen;
