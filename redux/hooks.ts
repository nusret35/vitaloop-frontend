import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import { setAuthToken } from "./slices/authTokenSlice";
import Feeling from "@/types/feeling";
import { deleteFeeling, setFeeling } from "./slices/dailyFeelingSlice";

export const useAuthToken = () => {
  const dispatch = useDispatch();

  const token = useSelector((state: RootState) => state.auth.token);

  const updateAuthToken = (newToken: string) => {
    dispatch(setAuthToken(newToken));
  };

  return { token, updateAuthToken };
};

export const useCreateAccount = () => {
  const username = useSelector(
    (state: RootState) => state.createAccount.username
  );

  const password = useSelector(
    (state: RootState) => state.createAccount.password
  );

  const appleId = useSelector(
    (state: RootState) => state.createAccount.appleId
  );

  const name = useSelector(
    (state: RootState) => state.createAccount.name
  );

  const surname = useSelector(
    (state: RootState) => state.createAccount.surname
  );

  return { username, password, appleId, name, surname };
};

export const useDailyFeeling = () => {
  const dispatch = useDispatch();
  const feeling = useSelector((state: RootState) => state.dailyFeeling.feeling);

  const date = useSelector((state: RootState) => state.dailyFeeling.date);

  const updateFeeling = (feeling: Feeling) => {
    dispatch(
      setFeeling({
        feeling,
        date: new Date().toISOString(),
      })
    );
  };

  const resetFeeling = () => {
    dispatch(deleteFeeling());
  };

  return { feeling, date, updateFeeling, resetFeeling };
};
