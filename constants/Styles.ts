import { Platform } from "react-native";

export const GlobalStyles = {
  androidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 50 : 0,
  },
};
