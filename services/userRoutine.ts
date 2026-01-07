import DayOfWeek from "@/types/dayOfWeek";
import { createApi } from "@reduxjs/toolkit/query/react";
import fetchWithAuthBaseQuery from "./fetchWithAuthBaseQuery";
import { format } from "date-fns";

export const userRoutineApi = createApi({
  reducerPath: "userRoutineApi",
  baseQuery: fetchWithAuthBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/user-routine`,
  }),
  tagTypes: ["Routine"],
  endpoints: (builder) => ({
    getDailyRoutine: builder.query<UserRoutineTaskDay[], DayOfWeek>({
      query: (day) => ({
        url: `daily?day=${day}`,
        method: "GET",
      }),
      providesTags: ["Routine"],
    }),
    getDailyRoutineByDate: builder.query<UserRoutineTaskDayLog[], string>({
      query: (date) => {
        return {
          url: `routine-by-date?date=${date}`,
          method: "GET",
        };
      },
      providesTags: ["Routine"],
    }),
    getActiveTask: builder.query<UserRoutineTaskDayLog, void>({
      query: () => {
        const date = format(new Date(), "yyyy-MM-dd'T'HH:mm");
        return {
          url: `active-routine-task?date=${date}`,
          method: "GET",
        };
      },
      providesTags: ["Routine"],
    }),
    updateTaskStatusById: builder.mutation<
      UserRoutineTaskDayLog,
      UpdateTaskLogStatusRequest
    >({
      query: (body) => {
        return {
          url: "update-task-status",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Routine"],
    }),
    addNewTask: builder.mutation<object, AddUserRoutineRequest>({
      query: (body) => {
        return {
          url: "add-routine-task",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Routine"],
    }),
    deleteTask: builder.mutation<object, DeleteUserRoutineRequest>({
      query: (body) => {
        return {
          url: "delete-routine-task-day",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Routine"],
    }),
    getRoutineComment: builder.query<AiCommentResponse, void>({
      query: () => {
        return {
          url: "/routine-comment",
          method: "GET",
        };
      },
    }),
  }),
});

export const {
  useGetDailyRoutineQuery,
  useGetDailyRoutineByDateQuery,
  useGetActiveTaskQuery,
  useLazyGetActiveTaskQuery,
  useUpdateTaskStatusByIdMutation,
  useAddNewTaskMutation,
  useDeleteTaskMutation,
  useGetRoutineCommentQuery,
} = userRoutineApi;
