import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import Icon from "react-native-vector-icons/MaterialIcons";
import MinaMessage from "../MinaMessage";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";
import {
  useGetGoalCommentQuery,
  useGetUserGoalCountQuery,
  useGetUserGoalQuery,
} from "@/services/userGoal";
import { router } from "expo-router";
import { Trans, useTranslation } from "react-i18next";

const GoalSection = ({
  setNewGoalAction,
}: {
  setNewGoalAction: () => void;
}) => {
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  const userGoalCount = useGetUserGoalCountQuery();
  const currentGoal = useGetUserGoalQuery();
  const userGoalComment = useGetGoalCommentQuery();
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      <ThemedText>
        <Trans
          i18nKey="goal.totalGoalCount"
          values={{ dayCount: userGoalCount.data }}
          components={{
            strong: <ThemedText style={{ fontWeight: "bold" }} />,
          }}
        />
      </ThemedText>
      <TouchableOpacity
        onPress={() => {
          if (currentGoal.data) {
            router.navigate("/goal");
            return;
          }
          setNewGoalAction();
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 16,
        }}
      >
        {currentGoal.data ? (
          <View>
            <ThemedText style={{ fontSize: 16 }}>
              {t("journey.currentGoal")}
            </ThemedText>
            <ThemedText
              numberOfLines={2}
              style={{
                fontWeight: "600",
                fontSize: 20,
                maxWidth: 300,
                overflow: "hidden",
              }}
            >
              {currentGoal.data.name}
            </ThemedText>
          </View>
        ) : (
          <View>
            <ThemedText
              style={{
                fontWeight: "600",
                fontSize: 20,
                maxWidth: 300,
                overflow: "hidden",
              }}
            >
              {t("journey.setNewGoal")} +
            </ThemedText>
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Icon name="chevron-right" size={24} color={color} />
        </View>
      </TouchableOpacity>
      {userGoalComment.data && (
        <MinaMessage
          onPress={() => {
            router.push("/goalAdvice/page");
          }}
          maxLines={4}
          message={userGoalComment.data?.aiCommentResponse}
        />
      )}
    </View>
  );
};

export default GoalSection;
