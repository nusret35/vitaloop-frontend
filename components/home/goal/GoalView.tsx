import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../ThemedText";
import CircularProgressBar from "../../CircularProgressBar";
import { Colors } from "@/constants/Colors";
import { useGetUserGoalQuery } from "@/services/userGoal";
import { useState } from "react";
import GoalLogProgressModal from "./GoalLogProgressModal";

export default function GoalView({
  addProgressAction,
}: {
  addProgressAction: (progress: number) => void;
}) {
  const userGoal = useGetUserGoalQuery();
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  return (
    <View>
      <GoalLogProgressModal
        addProgressAction={addProgressAction}
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      />
      <TouchableOpacity
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}
        style={styles.container}
      >
        <View>
          <ThemedText
            style={{ color: "#ffffff", fontWeight: "600", maxWidth: 180 }}
            type="subtitle"
            numberOfLines={2}
          >
            {userGoal.data?.name}
          </ThemedText>
        </View>
        <CircularProgressBar
          size={80}
          strokeWidth={10}
          progress={userGoal.data?.progressInPercent ?? 0}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    backgroundColor: Colors.dark.primary,
    borderRadius: 16,
    height: 120,
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
