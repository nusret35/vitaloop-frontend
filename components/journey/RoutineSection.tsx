import { useState } from "react";
import MinaMessage from "../MinaMessage";
import DailyRoutine from "./DailyRoutine";
import { DateSlider } from "./DateSlider";
import { View } from "react-native";
import { useGetRoutineCommentQuery } from "@/services/userRoutine";
import { router } from "expo-router";

const RoutineSection = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const routineComment = useGetRoutineCommentQuery();

  return (
    <View style={{ gap: 16 }}>
      <DateSlider
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />
      <DailyRoutine selectedDate={selectedDate} />
      {routineComment.data && (
        <MinaMessage
          onPress={() => {
            router.push("/routineAdvice/page");
          }}
          maxLines={4}
          message={routineComment.data?.aiCommentResponse}
        />
      )}
    </View>
  );
};

export default RoutineSection;
