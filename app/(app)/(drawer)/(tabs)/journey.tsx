import Header from "@/components/home/Header";
import JourneySection from "@/components/journey/JourneySection";
import RoutineSection from "@/components/journey/RoutineSection";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, StyleSheet, View } from "react-native";
import RecoverySection from "@/components/journey/RecoverySection";
import GoalSection from "@/components/journey/GoalSection";
import { router } from "expo-router";
import NewGoalBottomSheet from "@/components/home/goal/NewGoalBottomSheet";
import {
  useCreateNewGoalMutation,
  useSetNewGoalMutation,
} from "@/services/userGoal";
import { useEffect, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import TitleDetailModal from "@/components/TitleDetailModal";
import NewGoalTargetModal from "@/components/home/goal/NewGoalTargetModal";
import OverlayActivityIndicator from "@/components/OverlayActivityIndicator";
import { useGetUserAddictionsQuery } from "@/services/userAddiction";
import { useTranslation } from "react-i18next";

export default function Journey() {
  const [createNewGoal, { isLoading, isSuccess, data }] =
    useCreateNewGoalMutation();
  const [
    setNewGoal,
    { isLoading: isLoadingSetNewGoal, isSuccess: isSetNewGoalSuccess },
  ] = useSetNewGoalMutation();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [createdNewGoalModalIsVisible, setCreatedNewGoalModalIsVisible] =
    useState(false);
  const [goalTargetModalIsVisible, setGoalTargetModalIsVisible] =
    useState(false);
  const addictions = useGetUserAddictionsQuery();
  const { t } = useTranslation();

  useEffect(() => {
    if (isSuccess && data) {
      if (data.targetQuantity) {
        setCreatedNewGoalModalIsVisible(true);
      } else {
        setGoalTargetModalIsVisible(true);
      }
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (isSetNewGoalSuccess) {
      setCreatedNewGoalModalIsVisible(true);
    }
  }, [isSetNewGoalSuccess]);

  return (
    <>
      {(isLoading || isLoadingSetNewGoal) && (
        <OverlayActivityIndicator
          isVisible={isLoading || isLoadingSetNewGoal}
        />
      )}
      {isSetNewGoalSuccess && (
        <TitleDetailModal
          isVisible={createdNewGoalModalIsVisible}
          onClose={() => setCreatedNewGoalModalIsVisible(false)}
          title={t("newGoal.title")}
          description={t("newGoal.description")}
        />
      )}
      {data && (
        <NewGoalTargetModal
          isVisible={goalTargetModalIsVisible}
          goalName={data.goalName}
          goalUnit={data.goalUnit}
          setNewGoalAction={setNewGoal}
          onClose={() => setGoalTargetModalIsVisible(false)}
        />
      )}
      <ThemedView style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <Header title={t("journey.myJourney")} />
          <JourneySection
            title={`🎯 ${t("sections.goal")}`}
            showSeeAll={true}
            seeAllAction={() => router.push("/(app)/allGoals/page")}
          >
            <GoalSection
              setNewGoalAction={() => bottomSheetRef.current?.snapToIndex(1)}
            />
          </JourneySection>
          <JourneySection
            title={`📅 ${t("sections.routine")}`}
            showSeeAll={true}
            seeAllAction={() => router.push("/routine/page")}
          >
            <RoutineSection />
          </JourneySection>
          <JourneySection
            title={`🕊️ ${t("sections.recovery")}`}
            showSeeAll={(addictions.data ?? []).length > 0}
            seeAllAction={() => router.push("/addiction/editAddictions/page")}
            customSeeAllText={t("journey.edit")}
          >
            <RecoverySection />
          </JourneySection>
          <View style={{ height: 200 }}></View>
        </ScrollView>
      </ThemedView>
      <NewGoalBottomSheet
        getGoalDetail={createNewGoal}
        bottomSheetRef={bottomSheetRef}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
