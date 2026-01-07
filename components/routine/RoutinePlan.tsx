import CardView from "@/components/CardView";
import WeekDaysScrollView from "@/components/routine/WeekDaysScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  useAddNewTaskMutation,
  useDeleteTaskMutation,
  useGetDailyRoutineQuery,
} from "@/services/userRoutine";
import DayOfWeek from "@/types/dayOfWeek";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AddTaskBottomSheet from "./AddTaskBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { useNavigation } from "expo-router";
import { getDayOfWeekIndex } from "@/app/util/routineUtils";
import OverlayActivityIndicator from "../OverlayActivityIndicator";
import DeleteRoutineTaskModal from "./DeleteRoutineTaskModal";
import { useToast } from "@/toast/ToastContext";
import { IconSymbol } from "../ui/IconSymbol";
import { useTranslation } from "react-i18next";

const RoutinePlan = () => {
  const { t } = useTranslation();
  const today = new Date().getDay();
  const dayMapping: DayOfWeek[] = [
    DayOfWeek.Sunday,
    DayOfWeek.Monday,
    DayOfWeek.Tuesday,
    DayOfWeek.Wednesday,
    DayOfWeek.Thursday,
    DayOfWeek.Friday,
    DayOfWeek.Saturday,
  ];
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(dayMapping[today]);
  const theme = useColorScheme() ?? "light";
  const [
    addNewTask,
    { isLoading: isAddLoading, isSuccess: isAddSuccess, isError: isAddError },
  ] = useAddNewTaskMutation();
  const { showSuccessToast, showFailToast } = useToast();
  const [
    deleteTask,
    {
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
      isError: isDeleteError,
    },
  ] = useDeleteTaskMutation();
  const dailyRoutine = useGetDailyRoutineQuery(selectedDay);
  const { height } = Dimensions.get("window");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );
  const navigation = useNavigation();
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [taskToBeDeleted, setTaskToBeDeleted] = useState<UserRoutineTaskDay>();
  const [isDeletePopupVisible, setIsDeletePopupVisible] =
    useState<boolean>(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (isEditMode) {
          return (
            <TouchableOpacity
              onPress={() => {
                bottomSheetRef.current?.close();
                setIsEditMode(false);
              }}
              style={{ marginBottom: 10 }}
            >
              <Icon size={28} name="check" color={Colors.dark.primary} />
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            onPress={() => {
              setIsEditMode(true);
            }}
            style={{ marginBottom: 10 }}
          >
            <Icon size={28} name="edit" color={Colors.dark.primary} />
          </TouchableOpacity>
        );
      },
    });
  }, [navigation, isEditMode]);

  useEffect(() => {
    if (isAddSuccess) {
      showSuccessToast(t("routine.newTaskAdded"));
    }
  }, [isAddSuccess]);

  useEffect(() => {
    if (isAddError) {
      showFailToast("Something went wrong");
    }
  }, [isAddError]);

  useEffect(() => {
    if (isDeleteSuccess) {
      showSuccessToast(t("routine.taskDeleted"));
    }
  }, [isDeleteSuccess]);

  useEffect(() => {
    if (isDeleteError) {
      showFailToast("Something went wrong");
    }
  }, [isDeleteError]);

  const renderEmptyState = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
        }}
      >
        <IconSymbol
          name="calendar"
          size={64}
          color={theme === "light" ? Colors.light.icon : Colors.dark.icon}
          style={{ opacity: 0.3, marginBottom: 14 }}
        />
        <ThemedText
          style={{
            fontSize: 14,
            fontWeight: "600",
            textAlign: "center",
            marginBottom: 8,
            opacity: 0.7,
          }}
        >
          {t("routine.noRoutineTasksYet")}
        </ThemedText>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <OverlayActivityIndicator
        isVisible={isAddLoading || isDeleteLoading || dailyRoutine.isLoading}
      />
      {taskToBeDeleted && (
        <DeleteRoutineTaskModal
          isVisible={isDeletePopupVisible}
          taskName={taskToBeDeleted.routineTask.taskName}
          deleteAction={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            deleteTask({ id: taskToBeDeleted.id });
            setIsDeletePopupVisible(false);
          }}
          onClose={() => setIsDeletePopupVisible(false)}
        />
      )}

      <ScrollView style={{ flex: 1 }}>
        <View style={{ paddingTop: 16 }}>
          <WeekDaysScrollView
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
          />
          <ThemedText
            style={{
              fontSize: 20,
              fontWeight: "bold",
              paddingHorizontal: 16,
              paddingTop: 16,
            }}
          >
            Plan
          </ThemedText>
          <CardView>
            {dailyRoutine.data?.length === 0 && !isEditMode ? (
              renderEmptyState()
            ) : (
              <View style={{ gap: 16 }}>
                {dailyRoutine.data?.map((entry, index) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    key={index}
                  >
                    <View>
                      <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
                        {entry.routineTask.taskName} {entry.routineTask.emoji}
                      </ThemedText>
                      <ThemedText>
                        {entry.routineTask.startTime.substring(0, 5)} -{" "}
                        {entry.routineTask.endTime.substring(0, 5)}
                      </ThemedText>
                    </View>
                    {isEditMode && (
                      <TouchableOpacity
                        onPress={() => {
                          setTaskToBeDeleted(entry);
                          setIsDeletePopupVisible(true);
                        }}
                      >
                        <Icon size={28} name="close" color={color} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}

                {isEditMode && (
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                      bottomSheetRef.current?.snapToIndex(1);
                    }}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <ThemedText style={{ fontSize: 18, fontWeight: "bold" }}>
                      {t("routine.addNewTask")}
                    </ThemedText>
                    <Icon size={28} name="add" color={color} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </CardView>
        </View>
        <View style={{ height: 50 }} />
      </ScrollView>
      <AddTaskBottomSheet
        addNewTask={addNewTask}
        weekDay={getDayOfWeekIndex(selectedDay)}
        routineTasks={dailyRoutine.data ?? []}
        bottomSheetRef={bottomSheetRef}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});

export default RoutinePlan;
