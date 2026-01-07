import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import SkippedSymbol from "./stateSymbols/SkippedSymbol";
import DoneSymbol from "./stateSymbols/DoneSymbol";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "../ThemedView";
import { useGetDailyRoutineByDateQuery } from "@/services/userRoutine";
import { format } from "date-fns";
import TaskStatus from "@/types/taskStatus";
import NeutralSymbol from "./stateSymbols/NeutralSymbol";
import { useTranslation } from "react-i18next";

const DailyRoutine = ({ selectedDate }: { selectedDate: Date }) => {
  const { t } = useTranslation();
  const routineTasks = useGetDailyRoutineByDateQuery(
    format(selectedDate, "yyyy-MM-dd")
  );

  const getTaskStatusSymbol = (taskStatus: TaskStatus) => {
    if (taskStatus === TaskStatus.Done) {
      return <DoneSymbol />;
    } else if (taskStatus === TaskStatus.Skipped) {
      return <SkippedSymbol />;
    } else {
      return <NeutralSymbol />;
    }
  };

  return (
    <ThemedView style={styles.container}>
      {routineTasks.data?.length === 0 ? (
        <ThemedText>{t("journey.noTasksForToday")}</ThemedText>
      ) : (
        routineTasks.data?.map((task, index) => {
          return (
            <View
              key={index}
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              {getTaskStatusSymbol(task.taskStatus)}
              <View>
                <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
                  {task.routineDay.routineTask.taskName}
                </ThemedText>
                <ThemedText style={{ fontSize: 14 }}>
                  {task.routineDay.routineTask.startTime.substring(0, 5)} -{" "}
                  {task.routineDay.routineTask.endTime.substring(0, 5)}
                </ThemedText>
              </View>
            </View>
          );
        })
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    rowGap: 16,
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 9,
    borderLeftColor: Colors.dark.routineColor,
  },
});

export default DailyRoutine;
