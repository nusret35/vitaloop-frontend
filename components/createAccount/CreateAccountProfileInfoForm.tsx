import CommonTextInput from "@/components/CommonTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { Dropdown } from "@/components/routine/Dropdown";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import Gender from "@/types/gender";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import * as Yup from "yup";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  View,
} from "react-native";
import DatePicker from "react-native-date-picker";
import {
  useRegisterUserMutation,
  useRegisterUserWithAppleMutation,
  useRegisterUserWithGoogleMutation,
} from "@/services/auth";
import { useAuthToken, useCreateAccount } from "@/redux/hooks";
import { useToast } from "@/toast/ToastContext";
import * as Notifications from "expo-notifications";
import * as Localization from "expo-localization";
import { useTranslation } from "react-i18next";
import { Trans } from "react-i18next";
import * as WebBrowser from "expo-web-browser";

const CreateAccountSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  surname: Yup.string().required("Surname is required"),
  gender: Yup.string().required("Gender is required"),
  birthDate: Yup.string()
    .required("Birthday is required")
    .test("min-age", "You must be at least 17 years old", function (value) {
      if (!value) return false;
      const today = new Date();
      const birthDate = new Date(value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        return age - 1 >= 17;
      }
      return age >= 17;
    }),
});

interface CreateAccountProfileInfoValues {
  name: string;
  surname: string;
  gender: Gender;
  birthDate: string;
}

interface FormikHelpers {
  setSubmitting: (isSubmitting: boolean) => void;
  setErrors: (errors: { [key: string]: string }) => void;
}

const CreateAccountProfileInfoForm = () => {
  const { t } = useTranslation();
  const { token, updateAuthToken } = useAuthToken();
  const params = useLocalSearchParams();
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const googleId = params["googleId"] as string;
  const googleEmail = params["googleEmail"] as string;

  const [registerUser] = useRegisterUserMutation();
  const [registerUserWithGoogle] = useRegisterUserWithGoogleMutation();
  const [registerUserWithApple] = useRegisterUserWithAppleMutation();
  const { username, password, appleId, name, surname } = useCreateAccount();
  const { showFailToast } = useToast();
  const deviceInfo = {
    language: Localization.getLocales()[0].languageCode,
    timeZone: Localization.getCalendars()[0].timeZone as string,
  };
  const genderList = [
    { label: t("profile.genderFemale"), value: Gender.Female },
    { label: t("profile.genderMale"), value: Gender.Male },
    { label: t("profile.genderOther"), value: Gender.Other },
    { label: t("profile.genderNotSpecified"), value: Gender.Unknown },
  ];

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return "";
    }
  };

  const registerWithGoogle = async (
    values: CreateAccountProfileInfoValues,
    notificationDeviceId: string
  ) => {
    const response = await registerUserWithGoogle({
      ...values,
      ...deviceInfo,
      username: googleEmail,
      googleId,
      notificationDeviceId,
    }).unwrap();

    updateAuthToken(response.token);
  };

  const registerWithApple = async (
    values: CreateAccountProfileInfoValues,
    notificationDeviceId: string
  ) => {
    const response = await registerUserWithApple({
      ...values,
      ...deviceInfo,
      appleId,
      notificationDeviceId,
    }).unwrap();
    updateAuthToken(response.token);
  };

  const register = async (
    values: CreateAccountProfileInfoValues,
    notificationDeviceId: string
  ) => {
    const response = await registerUser({
      ...values,
      ...deviceInfo,
      username,
      password,
      notificationDeviceId,
    }).unwrap();
    updateAuthToken(response.token);
  };

  const registerUserAction = useCallback(
    async (
      values: CreateAccountProfileInfoValues,
      { setSubmitting }: FormikHelpers
    ) => {
      try {
        const notificationDeviceId = (
          await Notifications.getExpoPushTokenAsync()
        ).data;
        if (appleId) {
          registerWithApple(values, notificationDeviceId);
        } else if (googleId) {
          registerWithGoogle(values, notificationDeviceId);
        } else {
          register(values, notificationDeviceId);
        }
      } catch (error) {
        showFailToast("Registering failed");
      } finally {
        setSubmitting(false);
      }
    },
    [registerWithGoogle, register]
  );

  useEffect(() => {
    if (token) {
      Keyboard.dismiss();
      router.replace("/(app)/(drawer)/(tabs)");
    }
  }, [token]);

  return (
    <Formik
      initialValues={{
        name: name || (params["name"] as string) || "",
        surname: surname || (params["surname"] as string) || "",
        gender: Gender.Unknown,
        birthDate: "",
      }}
      validationSchema={CreateAccountSchema}
      onSubmit={registerUserAction}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
        setFieldValue,
      }) => (
        <View style={{ gap: 8, padding: 8 }}>
          <View>
            <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
              {t("createAccount.name")}
            </ThemedText>
            <CommonTextInput
              value={values.name}
              onChangeValue={handleChange("name")}
              placeholder={t("createAccount.enterName")}
            />
            {touched.name && errors.name && (
              <ThemedText style={{ color: "red", fontSize: 12, marginTop: 12 }}>
                {errors.name}
              </ThemedText>
            )}
          </View>
          <View>
            <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
              {t("createAccount.surname")}
            </ThemedText>
            <CommonTextInput
              value={values.surname}
              onChangeValue={handleChange("surname")}
              placeholder={t("createAccount.enterSurname")}
            />
            {touched.surname && errors.surname && (
              <ThemedText style={{ color: "red", fontSize: 12, marginTop: 12 }}>
                {errors.surname}
              </ThemedText>
            )}
          </View>
          <View>
            <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
              {t("createAccount.gender")}
            </ThemedText>
            <Dropdown
              value={values.gender}
              items={genderList}
              placeholder={t("createAccount.chooseGender")}
              style={{
                borderColor: Colors.border,
                borderWidth: 1,
                borderRadius: 8,
                padding: 14,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              }}
              setValue={handleChange("gender")}
            />
          </View>
          <View>
            <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
              {t("createAccount.birthday")}
            </ThemedText>
            <TouchableOpacity onPress={() => setIsDateModalOpen(true)}>
              <View
                style={{
                  justifyContent: "center",
                  padding: 14,
                  borderRadius: 8,
                  borderColor: Colors.border,
                  borderWidth: 1,
                }}
              >
                {values.birthDate ? (
                  <ThemedText>
                    {formatDateForDisplay(values.birthDate)}
                  </ThemedText>
                ) : (
                  <ThemedText style={{ color: Colors.border }}>
                    {t("createAccount.chooseBirthdate")}
                  </ThemedText>
                )}
              </View>
            </TouchableOpacity>
            {touched.birthDate && errors.birthDate && (
              <ThemedText style={{ color: "red", fontSize: 12, marginTop: 12 }}>
                {errors.birthDate}
              </ThemedText>
            )}
          </View>
          <DatePicker
            modal
            date={
              values.birthDate && values.birthDate !== ""
                ? new Date(values.birthDate)
                : new Date()
            }
            open={isDateModalOpen}
            onConfirm={(date) => {
              setFieldValue("birthDate", date.toISOString());
              setIsDateModalOpen(false);
            }}
            onCancel={() => setIsDateModalOpen(false)}
            mode="date"
          />
          <ThemedText style={{ paddingVertical: 8 }}>
            <Trans
              i18nKey="createAccount.termsOfUseAndPrivacyPolicy"
              components={{
                strong1: (
                  <ThemedText
                    style={{
                      textDecorationLine: "underline",
                      color: "#007AFF",
                    }}
                    onPress={async () => {
                      await WebBrowser.openAuthSessionAsync(
                        "https://vitaloop.app/contracts/terms-and-conditions.html"
                      );
                    }}
                  />
                ),
                strong2: (
                  <ThemedText
                    style={{
                      textDecorationLine: "underline",
                      color: "#007AFF",
                    }}
                    onPress={async () => {
                      await WebBrowser.openAuthSessionAsync(
                        "https://vitaloop.app/contracts/privacy-policy.html"
                      );
                    }}
                  />
                ),
              }}
            />
          </ThemedText>
          <View style={{ gap: 8 }}>
            <PrimaryButton
              style={{ alignItems: "center" }}
              onPress={() => {
                handleSubmit();
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <ThemedText style={{ color: "#fff" }}>
                  {t("createAccount.startYourJourney")}
                </ThemedText>
              )}
            </PrimaryButton>
            <SecondaryButton
              style={{ alignItems: "center" }}
              onPress={() => {
                router.back();
              }}
            >
              <ThemedText
                style={{
                  color: Colors.dark.primary,
                }}
              >
                {t("createAccount.goBack")}
              </ThemedText>
            </SecondaryButton>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default CreateAccountProfileInfoForm;
