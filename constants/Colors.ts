/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  border: "#696969",
  disabled: "#999999",
  light: {
    primary: "#774afe",
    text: "#11181C",
    background: "#FBFBFB",
    secondaryBackground: "#CAE9F5",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    routineColor: "#D81B60",
    recoveryColor: "#7bbe3a",
    progressBarBackground: "#F1F1F1",
  },
  dark: {
    primary: "#774afe",
    text: "#ECEDEE",
    background: "#121212",
    secondaryBackground: "#242530",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    routineColor: "#D81B60",
    recoveryColor: "#7bbe3a",
  },
};
