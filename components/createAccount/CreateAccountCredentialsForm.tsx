import CommonTextInput from "@/components/CommonTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { Formik } from "formik";
import * as Yup from "yup";
import { View } from "react-native";
import SecondaryButton from "../SecondaryButton";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useDispatch } from "react-redux";
import { setCreateAccountCredentials } from "@/redux/slices/createAccountSlice";
import { useLazyCheckUsernameForNewAccountQuery } from "@/services/auth";
import { useToast } from "@/toast/ToastContext";
import { useTranslation } from "react-i18next";

const CreateAccountCredentialsForm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { showFailToast } = useToast();
  const [checkUsernameForNewAccount] = useLazyCheckUsernameForNewAccountQuery();
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Email or phone number is required"),
    password: Yup.string().required("Password is required"),
  });

  interface LoginValues {
    username: string;
    password: string;
  }

  interface FormikHelpers {
    setSubmitting: (isSubmitting: boolean) => void;
    setErrors: (errors: { [key: string]: string }) => void;
  }

  const onSubmit = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    try {
      await checkUsernameForNewAccount({ username }).unwrap();
      dispatch(setCreateAccountCredentials({ username, password }));
      router.push("/create-account/profileInfo");
    } catch (error) {
      showFailToast("User already exists");
    }
  };

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={LoginSchema}
      onSubmit={onSubmit}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        isSubmitting,
      }) => (
        <View style={{ gap: 8, padding: 12 }}>
          <View>
            <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
              {t("login.emailPhoneNumber")}
            </ThemedText>
            <CommonTextInput
              value={values.username}
              onChangeValue={handleChange("username")}
              placeholder={t("login.emailPhoneNumberPlaceholder")}
              keyboardType="email-address"
            />
          </View>
          <View>
            <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
              {t("login.password")}
            </ThemedText>
            <CommonTextInput
              value={values.password}
              onChangeValue={handleChange("password")}
              placeholder={t("login.passwordPlaceholder")}
              secureTextEntry={true}
            />
          </View>
          <View style={{ gap: 8 }}>
            <PrimaryButton
              style={{ alignItems: "center" }}
              onPress={() => handleSubmit()}
            >
              <ThemedText style={{ color: "#fff" }}>
                {t("login.continue")}
              </ThemedText>
            </PrimaryButton>
            <SecondaryButton
              style={{ alignItems: "center" }}
              onPress={() => router.back()}
            >
              <ThemedText
                style={{
                  color: Colors.dark.primary,
                }}
              >
                {t("login.goBack")}
              </ThemedText>
            </SecondaryButton>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default CreateAccountCredentialsForm;
