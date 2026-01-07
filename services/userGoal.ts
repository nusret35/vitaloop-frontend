import { UserGoalLogOfWeekDay } from "@/types/userGoalLogOfWeekDay";
import { createApi } from "@reduxjs/toolkit/query/react";
import fetchWithAuthBaseQuery from "./fetchWithAuthBaseQuery";

export const userGoalApi = createApi({
  reducerPath: "userGoalApi",
  baseQuery: fetchWithAuthBaseQuery({
    baseUrl: `${process.env.EXPO_PUBLIC_API_URL}/user-goal`,
  }),
  tagTypes: ["Goal"],
  endpoints: (builder) => ({
    getUserGoal: builder.query<UserGoal | undefined, void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["Goal"],
    }),
    getUserGoalCount: builder.query<number, void>({
      query: () => ({
        url: "completed-count",
        method: "GET",
      }),
      providesTags: ["Goal"],
    }),
    getGoalComment: builder.query<AiCommentResponse | undefined, void>({
      query: () => ({
        url: "goal-comment",
        method: "GET",
      }),
      providesTags: ["Goal"],
    }),
    getUserGoalProgressLogsOfWeek: builder.query<UserGoalLogOfWeekDay[], void>({
      query: () => ({
        url: "progress-logs/week",
        method: "GET",
      }),
      providesTags: ["Goal"],
    }),
    addProgress: builder.mutation<UserGoal, number | undefined>({
      query: (progress) => ({
        url: "add-progress",
        body: { progress },
        method: "POST",
      }),
      invalidatesTags: ["Goal"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userGoalApi.util.resetApiState());
        } catch (error) {
          console.error(error);
        }
      },
    }),
    deleteGoal: builder.mutation<UserGoal, string>({
      query: (id) => ({
        url: "/delete",
        method: "POST",
        body: {
          goalId: id,
        },
      }),
      invalidatesTags: ["Goal"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(userGoalApi.util.resetApiState());
        } catch (error) {
          console.error(error);
        }
      },
    }),
    createNewGoal: builder.mutation<GoalDetail, string>({
      query: (goalName) => ({
        url: "/create-new-goal",
        method: "POST",
        body: {
          goalName,
        },
      }),
      invalidatesTags: ["Goal"],
    }),
    setNewGoal: builder.mutation<void, GoalDetail>({
      query: (body) => ({
        url: "/set-new-goal",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Goal"],
    }),
    getAllUserGoals: builder.query<UserGoal[], void>({
      query: () => {
        return {
          url: "/all-goals",
          method: "GET",
        };
      },
      providesTags: ["Goal"],
    }),
  }),
});

export const {
  useGetUserGoalQuery,
  useGetUserGoalCountQuery,
  useAddProgressMutation,
  useGetUserGoalProgressLogsOfWeekQuery,
  useDeleteGoalMutation,
  useCreateNewGoalMutation,
  useSetNewGoalMutation,
  useGetGoalCommentQuery,
  useGetAllUserGoalsQuery,
  useLazyGetGoalCommentQuery,
} = userGoalApi;
