import CardView from "@/components/CardView";
import CircularProgressBar from "@/components/CircularProgressBar";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  useAddProgressMutation,
  useGetUserGoalQuery,
} from "@/services/userGoal";
import { Dimensions, ScrollView, View } from "react-native";
import { formatDateToMMDDYYYY } from "../util/goalUtils";
import GoalProgressBarChart from "@/components/home/goal/GoalProgressBarChart";
import { useLayoutEffect, useState } from "react";
import { router, useNavigation } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";
import * as Haptics from "expo-haptics";
import SecondaryButton from "@/components/SecondaryButton";
import GoalLogProgressModal from "@/components/home/goal/GoalLogProgressModal";
import OverlayActivityIndicator from "@/components/OverlayActivityIndicator";
import GoalSuccessModal from "@/components/home/goal/GoalSuccessModal";
import GoalDeleteModal from "@/components/home/goal/GoalDeleteModal";
import { useTranslation } from "react-i18next";

export default function GoalScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const userGoal = useGetUserGoalQuery();
  const { height: deviceHeight } = Dimensions.get("window");
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [addProgress, { isLoading }] = useAddProgressMutation();
  const [successMessages, setSuccessMessages] = useState<{
    title: string;
    description: string;
  }>();

  const addProgressAction = async (progress: number) => {
    const response = await addProgress(progress).unwrap();
    if (response.isCompleted) {
      setIsSuccessModalVisible(true);
      setSuccessMessages({
        title: response.successTitle,
        description: response.successDescription,
      });
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "600",
            color: Colors.dark.primary,
          }}
          numberOfLines={1}
        >
          {userGoal.data?.name}
        </ThemedText>
      ),
    });
  }, [navigation, userGoal.data?.name]);

  return (
    <View style={{ height: "100%" }}>
      <OverlayActivityIndicator isVisible={isLoading} />
      {userGoal.data && (
        <GoalDeleteModal
          goal={userGoal.data}
          isVisible={isDeleteModalVisible}
          onClose={() => setIsDeleteModalVisible(false)}
        />
      )}
      <ThemedView style={{ height: deviceHeight, paddingVertical: 16 }}>
        {successMessages && (
          <GoalSuccessModal
            isVisible={isSuccessModalVisible}
            onClose={() => {
              setSuccessMessages(undefined);
              setIsSuccessModalVisible(false);
              router.back();
            }}
            title={successMessages.title}
            description={successMessages.description}
          />
        )}
        <ScrollView>
          <ThemedText style={{ paddingHorizontal: 16 }} type="header1">
            {t("goal.currentProgress")}
          </ThemedText>
          <CardView>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ gap: 8 }}>
                {userGoal.data?.createdDate && (
                  <View>
                    <ThemedText
                      type="defaultSemiBold"
                      style={{ fontSize: 16, color }}
                    >
                      {t("goal.startDate")}
                    </ThemedText>
                    <ThemedText>
                      {formatDateToMMDDYYYY(userGoal.data?.createdDate)}
                    </ThemedText>
                  </View>
                )}
                <View>
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ fontSize: 16, color }}
                  >
                    {t("goal.progress")}
                  </ThemedText>
                  <ThemedText>
                    {userGoal.data?.progress} {userGoal.data?.progressUnit}
                  </ThemedText>
                </View>
                <View>
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ fontSize: 16, color }}
                  >
                    {t("goal.remaining")}
                  </ThemedText>
                  <ThemedText>
                    {userGoal.data?.remainingProgress}{" "}
                    {userGoal.data?.progressUnit}
                  </ThemedText>
                </View>
              </View>
              <CircularProgressBar
                type="secondary"
                size={100}
                strokeWidth={15}
                progress={userGoal.data?.progressInPercent ?? 0}
              />
            </View>
          </CardView>
          <ThemedText style={{ paddingHorizontal: 16 }} type="header1">
            Highlights
          </ThemedText>
          <CardView>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <GoalProgressBarChart />
            </View>
          </CardView>
          <View style={{ marginHorizontal: 16, gap: 8 }}>
            <PrimaryButton
              style={{ alignItems: "center" }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsModalVisible(true);
              }}
            >
              <ThemedText style={{ color: "#fff" }}>
                {t("goal.logProgress")}
              </ThemedText>
            </PrimaryButton>
            <SecondaryButton
              style={{ alignItems: "center" }}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                setIsDeleteModalVisible(true);
              }}
            >
              <ThemedText style={{ color: Colors.dark.primary }}>
                {t("goal.deleteGoal")}
              </ThemedText>
            </SecondaryButton>
          </View>
        </ScrollView>
        <GoalLogProgressModal
          isVisible={isModalVisible}
          addProgressAction={addProgressAction}
          onClose={() => setIsModalVisible(false)}
        />
      </ThemedView>
    </View>
  );
}
