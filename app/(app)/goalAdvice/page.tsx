import CardView from "@/components/CardView";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useGetGoalCommentQuery } from "@/services/userGoal";
import { Dimensions, ScrollView } from "react-native";
import Markdown from "react-native-markdown-display";

const GoalAdvice = () => {
  const userGoalComment = useGetGoalCommentQuery();

  return (
    <ScrollView>
      <ThemedView style={{ flex: 1, height: Dimensions.get("screen").height }}>
        <CardView
          style={{ backgroundColor: Colors.dark.primary, marginBottom: 40 }}
        >
          <Markdown
            style={{
              body: {
                color: "#fff",
                fontFamily: "HelveticaNeue",
                lineHeight: 20,
              },
            }}
          >
            {userGoalComment.data?.aiCommentResponse}
          </Markdown>
        </CardView>
      </ThemedView>
    </ScrollView>
  );
};

export default GoalAdvice;
