import { Keyboard, StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import CommonTextInput from "../CommonTextInput";
import PrimaryButton from "../PrimaryButton";
import * as Haptics from "expo-haptics";
import SecondaryButton from "../SecondaryButton";
import { Colors } from "@/constants/Colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { RefObject, useMemo, useState } from "react";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dropdown } from "./Dropdown";
import { Item } from "react-native-picker-select";
import { parseTime } from "@/app/util/routineUtils";
import { useTranslation } from "react-i18next";

const AddTaskBottomSheet = ({
  weekDay,
  addNewTask,
  routineTasks,
  bottomSheetRef,
}: {
  weekDay: number;
  addNewTask: (body: AddUserRoutineRequest) => void;
  routineTasks: UserRoutineTaskDay[];
  bottomSheetRef: RefObject<BottomSheetMethods>;
}) => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  const [taskName, setTaskName] = useState<string>("");
  const [fromTime, setFromTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const allTimes = Array.from({ length: 24 }, (_, index) => {
    const hours = Math.floor(index).toString().padStart(2, "0");
    const minutes = "00";
    return { label: `${hours}:${minutes}`, value: `${hours}:${minutes}` };
  });

  const availableStartTimes: Item[] = allTimes.filter((time) => {
    const isDuringTask = routineTasks.some((task) => {
      const timeValue = parseTime(time.value);
      const taskStart = parseTime(task.routineTask.startTime);
      const taskEnd = parseTime(task.routineTask.endTime);
      return timeValue >= taskStart && timeValue < taskEnd;
    });

    return !isDuringTask;
  });

  const availableEndTimes: Item[] = useMemo(
    () =>
      allTimes.filter((time) => {
        const parseTime = (timeString: string) => {
          const [hours, minutes] = timeString.split(":").map(Number);
          return hours * 60 + minutes;
        };

        const timeValue = parseTime(time.value);

        const isAfterStartTime = fromTime
          ? timeValue > parseTime(fromTime)
          : true;

        const firstStartTimeAfterFromTime = routineTasks
          .map((task) => parseTime(task.routineTask.startTime))
          .filter((startTime) => fromTime && startTime > parseTime(fromTime))
          .sort((a, b) => a - b)[0];

        const isBeforeOrEqualToFirstStartTime = firstStartTimeAfterFromTime
          ? timeValue <= firstStartTimeAfterFromTime
          : true;

        return isAfterStartTime && isBeforeOrEqualToFirstStartTime;
      }),
    [fromTime, allTimes, routineTasks]
  );

  const styles = StyleSheet.create({
    contentContainer: {
      flex: 1,
      paddingHorizontal: 36,
      alignItems: "center",
      backgroundColor,
      zIndex: 1000,
    },
  });

  return (
    <BottomSheet
      ref={bottomSheetRef}
      handleIndicatorStyle={{ backgroundColor: color }}
      backgroundStyle={{ backgroundColor }}
      snapPoints={["75%"]}
      enablePanDownToClose={true}
      index={-1}
      style={{
        backgroundColor,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={{ width: "100%", gap: 8 }}>
          <ThemedText
            style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}
          >
            {t("routine.setNewTask")}
          </ThemedText>
          <View style={{ marginTop: 8 }}>
            <View>
              <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
                {t("routine.taskName")}
              </ThemedText>
              <CommonTextInput
                value={taskName}
                placeholder={t("routine.enterTask")}
                onChangeValue={(newValue: string) => setTaskName(newValue)}
              />
            </View>
            <View style={{ flexDirection: "row", marginTop: 16 }}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <View style={{ width: "50%" }}>
                  <ThemedText
                    style={{
                      fontSize: 14,
                      marginBottom: 4,
                      fontWeight: "600",
                    }}
                  >
                    {t("routine.from")}
                  </ThemedText>
                  <Dropdown
                    items={availableStartTimes}
                    value={fromTime}
                    placeholder={t("routine.chooseStartTime")}
                    style={{
                      borderColor: Colors.border,
                      borderWidth: 1,
                      borderRightWidth: 0,
                      height: 52,
                      paddingHorizontal: 8,
                      borderTopLeftRadius: 8,
                      borderBottomLeftRadius: 8,
                    }}
                    setValue={(newValue) => {
                      setFromTime(newValue);
                      setEndTime(null);
                    }}
                  />
                </View>
                <View style={{ width: "50%" }}>
                  <ThemedText
                    style={{
                      fontSize: 14,
                      marginBottom: 4,
                      fontWeight: "600",
                    }}
                  >
                    {t("routine.to")}
                  </ThemedText>
                  <Dropdown
                    disabled={!fromTime}
                    items={availableEndTimes}
                    value={endTime}
                    placeholder={t("routine.chooseEndTime")}
                    style={{
                      borderColor: Colors.border,
                      borderWidth: 1,
                      height: 52,
                      paddingHorizontal: 8,
                      borderTopRightRadius: 8,
                      borderBottomRightRadius: 8,
                    }}
                    setValue={(newValue) => {
                      setEndTime(newValue);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={{ width: "100%", gap: 8, marginTop: 16 }}>
          <PrimaryButton
            disabled={!taskName || !fromTime || !endTime}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              if (fromTime && endTime) {
                addNewTask({
                  taskName,
                  startTime: fromTime,
                  endTime,
                  weekDay,
                });
              }
              Keyboard.dismiss();
              bottomSheetRef.current?.close();
              setTaskName("");
              setFromTime(null);
              setEndTime(null);
            }}
          >
            <ThemedText style={{ color: "#fff", fontWeight: "600" }}>
              {t("routine.complete")}
            </ThemedText>
          </PrimaryButton>
          <SecondaryButton
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setTaskName("");
              setFromTime(null);
              setEndTime(null);
              Keyboard.dismiss();
              bottomSheetRef.current?.close();
              setTaskName("");
              setFromTime(null);
              setEndTime(null);
            }}
          >
            <ThemedText
              style={{
                color: Colors.dark.primary,
                fontWeight: "600",
              }}
            >
              {t("routine.cancel")}
            </ThemedText>
          </SecondaryButton>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default AddTaskBottomSheet;
