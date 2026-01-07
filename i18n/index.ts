import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import translationEn from "./locales/en.json";
import translationTr from "./locales/tr.json";

const resources = {
  "en-US": { translation: translationEn },
  "tr-TR": { translation: translationTr },
};

const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem("language");

  if (!savedLanguage) {
    savedLanguage = Localization.getLocales()[0].languageTag;
  }

  const language = savedLanguage ?? "en-US";

  i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: "en-US",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
