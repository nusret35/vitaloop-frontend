import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import CheckButton from "../CheckButton";
import { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import {
  useGetActiveTaskQuery,
  useUpdateTaskStatusByIdMutation,
} from "@/services/userRoutine";
import TaskStatus from "@/types/taskStatus";
import { useTranslation } from "react-i18next";
import { analytics } from "@/firebaseConfig";
import { logEvent } from "@react-native-firebase/analytics";

const RoutineView = () => {
  const { t } = useTranslation();
  const currentTime = new Date();
  const activeTask = useGetActiveTaskQuery();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [updateTaskStatusByIdQuery] = useUpdateTaskStatusByIdMutation();

  useEffect(() => {
    if (activeTask.isSuccess) {
      setIsChecked(activeTask.data?.taskStatus === TaskStatus.Done);
    }
  }, [activeTask]);

  useEffect(() => {
    if (activeTask.data) {
      const { routineDate, routineDay } = activeTask.data;
      const { endTime } = routineDay.routineTask;
      const endDateTimeStr = `${routineDate}T${endTime}`;
      const endDateTime = new Date(endDateTimeStr);

      const checkEndTime = () => {
        const now = new Date();
        if (now.getTime() >= endDateTime.getTime()) {
          return true;
        }
        return false;
      };

      const intervalId = setInterval(() => {
        if (checkEndTime()) {
          activeTask.refetch();
          clearInterval(intervalId);
        }
      }, 4000);

      return () => clearInterval(intervalId);
    }
  }, [activeTask]);

  if (!activeTask.data) {
    return null;
  }

  return (
    <TouchableOpacity activeOpacity={0.7} style={styles.container}>
      <View>
        <ThemedText
          style={{ color: "#ffffff", fontWeight: "600" }}
          type="subtitle"
        >
          {activeTask.data?.routineDay.routineTask.taskName}
        </ThemedText>
        <ThemedText style={{ color: "#ffffff", fontSize: 14 }}>
          {currentTime.getDate() ===
          Number(activeTask.data?.routineDate.substring(8, 10))
            ? t("routine.fromTo", {
                startTime:
                  activeTask.data?.routineDay.routineTask.startTime.substring(
                    0,
                    5
                  ),
                endTime:
                  activeTask.data?.routineDay.routineTask.endTime.substring(
                    0,
                    5
                  ),
              })
            : t("routine.tomorrowFromTo", {
                startTime:
                  activeTask.data?.routineDay.routineTask.startTime.substring(
                    0,
                    5
                  ),
                endTime:
                  activeTask.data?.routineDay.routineTask.endTime.substring(
                    0,
                    5
                  ),
              })}
        </ThemedText>
      </View>
      <CheckButton
        checked={isChecked}
        onChange={async () => {
          const status = !isChecked ? TaskStatus.Done : TaskStatus.Neutral;
          if (activeTask.data?.id) {
            updateTaskStatusByIdQuery({ id: activeTask.data?.id, status });
          }
          setIsChecked(!isChecked);
          logEvent(analytics, "button_pressed", {
            button_name: "routine_task_done",
          });
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    backgroundColor: Colors.dark.routineColor,
    borderRadius: 16,
    padding: 16,
    height: 120,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
});

export default RoutineView;
