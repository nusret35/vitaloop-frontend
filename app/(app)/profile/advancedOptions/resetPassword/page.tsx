import CardView from "@/components/CardView";
import CommonTextInput from "@/components/CommonTextInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useChangePasswordMutation } from "@/services/user";
import * as Yup from "yup";
import { router } from "expo-router";
import { useCallback } from "react";
import { View } from "react-native";
import OverlayActivityIndicator from "@/components/OverlayActivityIndicator";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuthToken } from "@/redux/hooks";
import { Formik } from "formik";
import { useToast } from "@/toast/ToastContext";
import { useTranslation } from "react-i18next";

const ChangePasswordScreen = () => {
  const { t } = useTranslation();
  const { updateAuthToken } = useAuthToken();
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const { showSuccessToast, showFailToast } = useToast();

  const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required(
      t("profile.currentPasswordIsRequired")
    ),
    newPassword: Yup.string()
      .required(t("profile.newPasswordIsRequired"))
      .min(6, t("profile.passwordShouldBeAtLeast6Characters"))
      .test(
        "not-same-as-current",
        t("profile.newPasswordShouldBeDifferentThanCurrent"),
        function (value) {
          return value !== this.parent.currentPassword;
        }
      ),
    reEnteredNewPassword: Yup.string()
      .required(t("profile.reEnterNewPasswordRequired"))
      .min(6, t("profile.passwordShouldBeAtLeast6Characters"))
      .test(
        "passwords-match",
        t("profile.passwordShouldMatch"),
        function (value) {
          return value === this.parent.newPassword;
        }
      ),
  });

  interface ChangePasswordValues {
    currentPassword: string;
    newPassword: string;
    reEnteredNewPassword: string;
  }

  interface FormikHelpers {
    setSubmitting: (isSubmitting: boolean) => void;
    setErrors: (errors: { [key: string]: string }) => void;
  }

  const handleChangePassword = useCallback(
    async (
      values: ChangePasswordValues,
      { setSubmitting, setErrors }: FormikHelpers
    ) => {
      // Additional validation check before submission
      if (values.newPassword !== values.reEnteredNewPassword) {
        setErrors({ reEnteredNewPassword: t("profile.passwordsDoNotMatch") });
        setSubmitting(false);
        return;
      }

      if (values.currentPassword === values.newPassword) {
        setErrors({
          newPassword: t("resetPassword.passwordMustBeDifferent"),
        });
        setSubmitting(false);
        return;
      }

      try {
        const response = await changePassword({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }).unwrap();
        updateAuthToken(response.token);
        showSuccessToast(t("toast.passwordChanged"));
        router.back();
      } catch (error: any) {
        if (error.data === "Bad credentials") {
          showFailToast(t("profile.currentPasswordIsNotCorrect"));
          setErrors({
            currentPassword: t("profile.currentPasswordIsNotCorrect"),
          });
          return;
        }
        showFailToast("Something went wrong!");
      } finally {
        setSubmitting(false);
      }
    },
    [changePassword, showFailToast, showSuccessToast]
  );

  return (
    <ThemedView style={{ flex: 1 }}>
      <OverlayActivityIndicator isVisible={isLoading} />
      <Formik
        initialValues={{
          currentPassword: "",
          newPassword: "",
          reEnteredNewPassword: "",
        }}
        validationSchema={ChangePasswordSchema}
        onSubmit={(values, { setSubmitting, setErrors }) => {
          handleChangePassword(
            {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
              reEnteredNewPassword: values.reEnteredNewPassword,
            },
            { setSubmitting, setErrors }
          );
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <>
            {isLoading && <OverlayActivityIndicator isVisible={isLoading} />}
            <CardView style={{ gap: 16 }}>
              <View style={{ gap: 16 }}>
                <View>
                  <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
                    {t("profile.currentPassword")}
                  </ThemedText>
                  <CommonTextInput
                    secureTextEntry
                    value={values.currentPassword}
                    onChangeValue={handleChange("currentPassword")}
                    placeholder={t("profile.enterCurrentPassword")}
                  />
                  {touched.currentPassword && errors.currentPassword && (
                    <ThemedText style={{ fontSize: 12, marginTop: 4 }}>
                      {errors.currentPassword}
                    </ThemedText>
                  )}
                </View>
                <View>
                  <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
                    {t("profile.newPassword")}
                  </ThemedText>
                  <View style={{ gap: 8 }}>
                    <View>
                      <CommonTextInput
                        secureTextEntry
                        value={values.newPassword}
                        onChangeValue={handleChange("newPassword")}
                        placeholder={t("profile.enterNewPassword")}
                      />
                      {touched.newPassword && errors.newPassword && (
                        <ThemedText style={{ fontSize: 12, marginTop: 4 }}>
                          {errors.newPassword}
                        </ThemedText>
                      )}
                    </View>
                    <View>
                      <CommonTextInput
                        secureTextEntry
                        value={values.reEnteredNewPassword}
                        onChangeValue={handleChange("reEnteredNewPassword")}
                        placeholder={t("profile.reEnterNewPassword")}
                      />
                      {touched.reEnteredNewPassword &&
                        errors.reEnteredNewPassword && (
                          <ThemedText
                            style={{
                              fontSize: 12,
                              marginTop: 4,
                            }}
                          >
                            {errors.reEnteredNewPassword}
                          </ThemedText>
                        )}
                    </View>
                  </View>
                </View>
              </View>
            </CardView>

            <PrimaryButton
              style={{ marginHorizontal: 16, alignItems: "center" }}
              onPress={handleSubmit}
            >
              <ThemedText style={{ color: "#fff" }}>
                {t("profile.changePassword")}
              </ThemedText>
            </PrimaryButton>
          </>
        )}
      </Formik>
    </ThemedView>
  );
};

export default ChangePasswordScreen;
