import RecoveryView from "@/components/home/RecoveryView";
import GoalView from "@/components/home/goal/GoalView";
import EmotionsScrollView from "@/components/home/EmotionsScrollView";
import Header from "@/components/home/Header";
import RoutineView from "@/components/home/RoutineView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useGetUserAddictionsQuery } from "@/services/userAddiction";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useGetActiveTaskQuery } from "@/services/userRoutine";
import {
  useAddProgressMutation,
  useCreateNewGoalMutation,
  useGetUserGoalQuery,
  useSetNewGoalMutation,
} from "@/services/userGoal";
import { router } from "expo-router";
import NewGoalBottomSheet from "@/components/home/goal/NewGoalBottomSheet";
import { useEffect, useRef, useState } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import OverlayActivityIndicator from "@/components/OverlayActivityIndicator";
import TitleDetailModal from "@/components/TitleDetailModal";
import NewGoalTargetModal from "@/components/home/goal/NewGoalTargetModal";
import GoalSuccessModal from "@/components/home/goal/GoalSuccessModal";
import { useGetUserQuery } from "@/services/user";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import OnboardingModal from "@/components/OnboardingModal";
import { useOnboarding } from "@/hooks/useOnboarding";
import PaywallModal from "@/components/PaywallModal";
import { useTrial } from "@/hooks/useTrial";
import DailyQuote from "@/types/dailyQuote";

export default function HomeScreen() {
  const { t } = useTranslation();
  const userGoal = useGetUserGoalQuery();
  const userAddictions = useGetUserAddictionsQuery(undefined, {
    pollingInterval: 30000,
  });
  const activeTask = useGetActiveTaskQuery();
  const user = useGetUserQuery();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [createNewGoal, { isLoading, isSuccess, data }] =
    useCreateNewGoalMutation();
  const [
    setNewGoal,
    { isLoading: isLoadingSetNewGoal, isSuccess: isSetNewGoalSuccess },
  ] = useSetNewGoalMutation();

  const [createdNewGoalModalIsVisible, setCreatedNewGoalModalIsVisible] =
    useState(false);
  const [goalTargetModalIsVisible, setGoalTargetModalIsVisible] =
    useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const [addProgress, { isLoading: isAddProgressLoading }] =
    useAddProgressMutation();
  const [successMessages, setSuccessMessages] = useState<{
    title: string;
    description: string;
  }>();
  const {
    isOnboardingCompleted,
    isLoading: isOnboardingLoading,
    completeOnboarding,
  } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const {
    daysRemaining,
    isTrialExpired,
    isTrialActive,
    isLoading: isTrialLoading,
  } = useTrial();
  const [showPaywall, setShowPaywall] = useState(false);

  const getGreetMessage = (username: string) => {
    const currentHour = new Date().getHours();
    let greeting;

    if (currentHour < 12 && currentHour >= 5) {
      greeting = `${t("home.goodMorning")}, ${username} 🌞`;
    } else if (currentHour < 18 && currentHour >= 12) {
      greeting = `${t("home.goodAfternoon")}, ${username} 🌤️`;
    } else {
      greeting = `${t("home.goodEvening")}, ${username} 🌙`;
    }

    return greeting;
  };

  const getQuoteWithQuotationMarks = (quote: string) => {
    const currentLanguage = i18n.language;
    if (currentLanguage === "tr-TR") {
      return `"${quote}"`;
    } else {
      return `"${quote}"`;
    }
  };

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

  useEffect(() => {
    const fetchQuote = async () => {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/daily-quotes`
      );
      const quote = await response.json();
      setDailyQuote(quote);
    };

    fetchQuote();
  }, []);

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

  useEffect(() => {
    if (!isOnboardingLoading && isOnboardingCompleted === false) {
      setShowOnboarding(true);
    }
  }, [isOnboardingCompleted, isOnboardingLoading]);

  useEffect(() => {
    // Show paywall if trial expired and user is not premium
    if (!isTrialLoading && isTrialExpired && !user.data?.isPremium) {
      setShowPaywall(true);
    }
    // Show paywall reminder when trial is active but ending soon (last 2 days)
    else if (
      !isTrialLoading &&
      isTrialActive &&
      daysRemaining <= 2 &&
      daysRemaining > 0 &&
      !user.data?.isPremium
    ) {
      // Show paywall every other day during last 2 days
      const shouldShowReminder = Math.random() > 0.5; // 50% chance to avoid being too aggressive
      if (shouldShowReminder) {
        setShowPaywall(true);
      }
    }
  }, [
    isTrialLoading,
    isTrialExpired,
    isTrialActive,
    daysRemaining,
    user.data?.isPremium,
  ]);

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    completeOnboarding();
  };

  const handlePaywallClose = () => {
    setShowPaywall(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <OnboardingModal
        isVisible={showOnboarding}
        onClose={handleOnboardingClose}
      />
      {/*

              <PaywallModal
        isVisible={showPaywall}
        onClose={handlePaywallClose}
        daysRemaining={daysRemaining}
      />
         */}
      {successMessages && (
        <GoalSuccessModal
          isVisible={isSuccessModalVisible}
          onClose={() => {
            setSuccessMessages(undefined);
            setIsSuccessModalVisible(false);
          }}
          title={successMessages.title}
          description={successMessages.description}
        />
      )}
      {(isLoading || isLoadingSetNewGoal) && (
        <OverlayActivityIndicator
          isVisible={isLoading || isLoadingSetNewGoal || isAddProgressLoading}
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
        <ScrollView style={styles.container}>
          <Header
            title={getGreetMessage(user.data?.name ?? "")}
            subtitle={t("home.howAreYouFeeling")}
          />
          <EmotionsScrollView />
          <View style={styles.body}>
            <View>
              <View style={{ marginTop: 20, gap: 8 }}>
                <ThemedText type="header1">
                  {t("home.quoteOfTheDay")}
                </ThemedText>
                <ThemedText style={{ fontStyle: "italic", fontSize: 16 }}>
                  {dailyQuote &&
                    getQuoteWithQuotationMarks(
                      i18n.language === "tr-TR"
                        ? dailyQuote.turkish
                        : dailyQuote.english
                    )}
                </ThemedText>
              </View>
              <ThemedText
                style={{ marginTop: 8, fontSize: 16, alignSelf: "flex-end" }}
              >
                {dailyQuote?.author ?? ""}
              </ThemedText>
            </View>
            <View style={styles.stepContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ThemedText type="header1">🎯 {t("sections.goal")}</ThemedText>
              </View>
              {userGoal.data || userGoal.isLoading ? (
                <GoalView addProgressAction={addProgressAction} />
              ) : (
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() => bottomSheetRef.current?.snapToIndex(1)}
                >
                  <ThemedText
                    type="subtitle"
                    style={{ fontSize: 18, marginTop: 12 }}
                  >
                    {t("home.noGoalPlaceholder")}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
            {!!activeTask.data && (
              <View style={styles.stepContainer}>
                <ThemedText type="header1">
                  📅 {t("sections.routine")}
                </ThemedText>
                <RoutineView />
              </View>
            )}
            <View style={styles.stepContainer}>
              <ThemedText type="header1">
                🕊️ {t("sections.recovery")}
              </ThemedText>
              {userAddictions.data?.length &&
              userAddictions.data?.length > 0 ? (
                <View>
                  {userAddictions.data?.map((userAddiction, index) => (
                    <RecoveryView key={index} userAddiction={userAddiction} />
                  ))}
                </View>
              ) : (
                <TouchableOpacity
                  style={{ alignItems: "center" }}
                  onPress={() => router.push("/allAddictions/page")}
                >
                  <ThemedText
                    type="subtitle"
                    style={{ fontSize: 18, marginTop: 12 }}
                  >
                    {t("home.noRecoveryPlaceholder")}
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={{ height: 128 }} />
        </ScrollView>
      </ThemedView>
      <NewGoalBottomSheet
        getGoalDetail={createNewGoal}
        bottomSheetRef={bottomSheetRef}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepContainer: {
    marginVertical: 16,
    gap: 4,
  },
  container: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  body: {
    paddingHorizontal: 16,
  },
});
