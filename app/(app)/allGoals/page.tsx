import { ThemedText } from "@/components/ThemedText";

import { useGetAllUserGoalsQuery } from "@/services/userGoal";
import { useRef } from "react";
import {
  View,
  ScrollView,
  Dimensions,
  Text,
  useColorScheme,
} from "react-native";
import React from "react";
import Svg, { Circle } from "react-native-svg";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useTranslation } from "react-i18next";

const ProgressCircle = ({
  progress,
  size = 56,
}: {
  progress: number;
  size?: number;
}) => {
  const radius = (size - 4) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Svg width={size} height={size} style={{ position: "absolute" }}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#4CAF50"
        strokeWidth="2"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

const LeftAlignedEntry = ({ userGoal }: { userGoal: UserGoal }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
      }}
    >
      <View style={{ flex: 1 }}>
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {userGoal.name}
        </ThemedText>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <ThemedView
          lightColor={"#fff"}
          darkColor={Colors.dark.secondaryBackground}
          style={{
            margin: 16,
            height: 56,
            width: 56,
            borderRadius: 56,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              opacity: userGoal.isCompleted ? 1 : 0.25,
              zIndex: 1,
            }}
          >
            🏆
          </Text>
          <ProgressCircle progress={userGoal.progressInPercent} />
        </ThemedView>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
};

const RightAlignedEntry = ({ userGoal }: { userGoal: UserGoal }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", width: "100%" }}>
      <View style={{ flex: 1 }} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
        }}
      >
        <ThemedView
          lightColor={"#fff"}
          darkColor={Colors.dark.secondaryBackground}
          style={{
            margin: 16,
            height: 56,
            width: 56,
            borderRadius: 56,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              opacity: userGoal.isCompleted ? 1 : 0.25,
              zIndex: 1,
            }}
          >
            🏆
          </Text>
          <ProgressCircle progress={userGoal.progressInPercent} />
        </ThemedView>
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText
          style={{
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {userGoal.name}
        </ThemedText>
      </View>
    </View>
  );
};

const AllGoalsScreen = () => {
  const { t } = useTranslation();
  const theme = useColorScheme() ?? "light";
  const { height: deviceHeight } = Dimensions.get("window");
  const scrollViewRef = useRef<ScrollView>(null);
  const userGoals = useGetAllUserGoalsQuery();

  const handleScrollToEnd = () => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderItem = ({
    userGoal,
    index,
  }: {
    userGoal: UserGoal;
    index: number;
  }) => {
    return (
      <View key={userGoal.id}>
        {index % 2 === 0 ? (
          <LeftAlignedEntry userGoal={userGoal} />
        ) : (
          <RightAlignedEntry userGoal={userGoal} />
        )}
      </View>
    );
  };

  const goalCount = userGoals.data?.length || 0;
  const lineHeight = goalCount > 1 ? (goalCount - 1) * 88 : 0;
  const lineTop = 52 + 44;

  const renderEmptyState = () => {
    return (
      <View
        style={{
          flex: 1,
          marginBottom: 180,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
          paddingBottom: 20,
        }}
      >
        <IconSymbol
          name="target"
          size={64}
          color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          style={{ opacity: 0.3, marginBottom: 12 }}
        />
        <ThemedText
          style={{
            fontSize: 20,
            fontWeight: "600",
            textAlign: "center",
            marginBottom: 8,
            opacity: 0.7,
          }}
        >
          {t("goal.goalsToCome")}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 16,
            textAlign: "center",
            opacity: 0.5,
            lineHeight: 22,
          }}
        >
          {t("goal.goalsWillAppearHere")}
        </ThemedText>
      </View>
    );
  };

  return (
    <ThemedView style={{ height: deviceHeight }}>
      {goalCount <= 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: 52,
            paddingBottom: 240,
          }}
          onLayout={handleScrollToEnd}
        >
          {goalCount > 1 && (
            <ThemedView
              lightColor="#e0e0e0"
              darkColor="#444"
              style={{
                position: "absolute",
                left: "50%",
                top: lineTop,
                height: lineHeight,
                width: 2,
                marginLeft: -1,
                zIndex: 0,
              }}
            />
          )}
          <View style={{ paddingHorizontal: 16 }}>
            {userGoals.data?.map((entry: UserGoal, index: number) =>
              renderItem({ userGoal: entry, index })
            )}
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
};

export default AllGoalsScreen;
