import { ScrollView, StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import CommonModal from "@/components/CommonModal";
import PrimaryButton from "@/components/PrimaryButton";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import VitaLogo from "./icons/VitaLogo";
import { Colors } from "@/constants/Colors";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const { width: screenWidth } = Dimensions.get("window");

interface OnboardingModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const OnboardingModal = ({ isVisible, onClose }: OnboardingModalProps) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const onboardingSteps = [
    {
      title: t("onboarding.welcome"),
      description: t("onboarding.welcomeDescription"),
      icon: "👋",
    },
    {
      title: t("onboarding.emotionsTitle"),
      description: t("onboarding.emotionsDescription"),
      icon: "😊",
    },
    {
      title: t("onboarding.goalTitle"),
      description: t("onboarding.goalDescription"),
      icon: "🎯",
    },
    {
      title: t("onboarding.routineTitle"),
      description: t("onboarding.routineDescription"),
      icon: "📅",
    },
    {
      title: t("onboarding.recoveryTitle"),
      description: t("onboarding.recoveryDescription"),
      icon: "🕊️",
    },
    {
      title: t("onboarding.vitaTitle"),
      description: t("onboarding.vitaDescription"),
      icon: "vita",
    },
    {
      title: t("onboarding.readyTitle"),
      description: t("onboarding.readyDescription"),
      icon: "🚀",
    },
  ];

  const animateContentTransition = (direction: 'next' | 'previous', newStep: number) => {
    const slideDirection = direction === 'next' ? -screenWidth * 0.3 : screenWidth * 0.3;
    
    // Slide out and fade out current content
    translateX.value = withTiming(slideDirection, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 }, () => {
      // Update step on the UI thread
      runOnJS(setCurrentStep)(newStep);
      
      // Reset position and slide in from opposite direction
      translateX.value = direction === 'next' ? screenWidth * 0.3 : -screenWidth * 0.3;
      
      // Slide in and fade in new content
      translateX.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 250 });
    });
  };

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep < onboardingSteps.length - 1) {
      animateContentTransition('next', currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentStep > 0) {
      animateContentTransition('previous', currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  const currentStepData = onboardingSteps[currentStep];

  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <ThemedText style={styles.skipText}>
              {t("onboarding.skip")}
            </ThemedText>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.content, animatedContentStyle]}>
          {currentStepData.icon === "vita" ? (
            <View
              style={{
                backgroundColor: Colors.dark.primary,
                borderRadius: "50%",
                padding: 8,
                marginBottom: 12,
              }}
            >
              <VitaLogo size={70} />
            </View>
          ) : (
            <ThemedText style={styles.icon}>{currentStepData.icon}</ThemedText>
          )}
          <ThemedText type="header1" style={styles.title}>
            {currentStepData.title}
          </ThemedText>
          <ThemedText style={styles.description}>
            {currentStepData.description}
          </ThemedText>
        </Animated.View>

        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            {onboardingSteps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentStep ? styles.activeDot : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.buttons}>
          {currentStep > 0 && (
            <TouchableOpacity
              onPress={handlePrevious}
              style={styles.previousButton}
            >
              <ThemedText style={styles.previousText}>
                {t("onboarding.previous")}
              </ThemedText>
            </TouchableOpacity>
          )}
          <PrimaryButton onPress={handleNext} style={styles.nextButton}>
            <ThemedText style={styles.nextText}>
              {currentStep === onboardingSteps.length - 1
                ? t("onboarding.getStarted")
                : t("onboarding.next")}
            </ThemedText>
          </PrimaryButton>
        </View>
      </ScrollView>
    </CommonModal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxHeight: 600,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    fontSize: 16,
    opacity: 0.7,
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 16,
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  progressContainer: {
    marginBottom: 30,
  },
  progressDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: "#007AFF",
  },
  inactiveDot: {
    backgroundColor: "#D1D1D6",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  previousButton: {
    padding: 12,
    minWidth: 80,
  },
  previousText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
  },
  nextButton: {
    flex: 1,
    minHeight: 48,
  },
  nextText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default OnboardingModal;
