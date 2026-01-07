import CommonTextInput from "@/components/CommonTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { RefObject, useState } from "react";
import { Keyboard, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import SecondaryButton from "@/components/SecondaryButton";
import { useTranslation } from "react-i18next";

const SetGoalBottomSheet = ({
  bottomSheetRef,
  getGoalDetail,
}: {
  bottomSheetRef: RefObject<BottomSheet>;
  getGoalDetail: (goalName: string) => void;
}) => {
  const { t } = useTranslation();
  const [goalName, setGoalName] = useState<string>("");

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  const styles = StyleSheet.create({
    contentContainer: {
      flex: 1,
      paddingHorizontal: 36,
      alignItems: "center",
      backgroundColor,
      zIndex: 2000,
    },
  });

  return (
    <BottomSheet
      ref={bottomSheetRef}
      handleIndicatorStyle={{ backgroundColor: color }}
      backgroundStyle={{ backgroundColor }}
      snapPoints={["75%"]}
      enablePanDownToClose={true}
      index={-1}
      style={{
        backgroundColor,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={{ width: "100%", gap: 8 }}>
          <ThemedText type="header1">{t("navBar.setNewGoal")}</ThemedText>
          <View>
            <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
              Goal name
            </ThemedText>
            <CommonTextInput
              style={{ height: 40 }}
              value={goalName}
              placeholder="Enter goal name"
              onChangeValue={(newValue: string) => setGoalName(newValue)}
            />
          </View>
          <View style={{ width: "100%", gap: 8 }}>
            <PrimaryButton
              style={{ marginTop: 8 }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                Keyboard.dismiss();
                getGoalDetail(goalName);
                bottomSheetRef.current?.close();
              }}
            >
              <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
                Continue
              </ThemedText>
            </PrimaryButton>
            <SecondaryButton
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                Keyboard.dismiss();
                bottomSheetRef.current?.close();
              }}
            >
              <ThemedText
                style={{
                  color: Colors.dark.primary,
                  fontWeight: "600",
                }}
              >
                {t("goal.cancel")}
              </ThemedText>
            </SecondaryButton>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default SetGoalBottomSheet;
