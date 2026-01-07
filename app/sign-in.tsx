import CommonTextInput from "@/components/CommonTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useAuthToken } from "@/redux/hooks";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
  StatusBar,
  Dimensions,
  useColorScheme,
} from "react-native";
import GoogleIcon from "@/assets/icons/google-logo.svg";
import {
  useLoginUserMutation,
  useLoginUserWithAppleMutation,
} from "@/services/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import { useCallback, useEffect } from "react";
import CardView from "@/components/CardView";
import { useThemeColor } from "@/hooks/useThemeColor";
import VitaLogo from "@/components/icons/VitaLogo";
import { useToast } from "@/toast/ToastContext";
import * as WebBrowser from "expo-web-browser";
import * as AppleAuthentication from "expo-apple-authentication";
import { StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import {
  setAppleId,
  setNameAndSurname,
} from "@/redux/slices/createAccountSlice";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useTranslation } from "react-i18next";

const SignIn = () => {
  const params = useLocalSearchParams();
  const authToken = params["authToken"] as string;
  const { updateAuthToken } = useAuthToken();
  const { showFailToast } = useToast();
  const [loginUser] = useLoginUserMutation();
  const [loginUserWithApple] = useLoginUserWithAppleMutation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { height } = Dimensions.get("window");
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );
  const colorScheme = useColorScheme();

  const appleButtonStyle =
    colorScheme === "dark"
      ? AppleAuthentication.AppleAuthenticationButtonStyle.WHITE
      : AppleAuthentication.AppleAuthenticationButtonStyle.BLACK;

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required(t("login.enterEmailOrPassword")),
    password: Yup.string()
      .required(t("login.passwordIsRequired"))
      .min(6, t("login.passwordShouldBeAtLeast")),
  });

  interface LoginValues {
    username: string;
    password: string;
  }

  interface FormikHelpers {
    setSubmitting: (isSubmitting: boolean) => void;
    setErrors: (errors: { [key: string]: string }) => void;
  }

  const loginWithCredentials = useCallback(
    async (
      values: LoginValues,
      { setSubmitting, setErrors }: FormikHelpers
    ) => {
      try {
        const response = await loginUser({
          username: values.username,
          password: values.password,
        }).unwrap();
        updateAuthToken(response.token);
        router.replace("/(app)/(drawer)/(tabs)");
      } catch (error: any) {
        showFailToast(t("login.userNotFound"));
      } finally {
        setSubmitting(false);
      }
    },
    [loginUser, updateAuthToken]
  );

  const signInWithGoogle = async () => {
    if (process.env.EXPO_PUBLIC_GOOGLE_LOGIN_URL) {
      await WebBrowser.openBrowserAsync(
        process.env.EXPO_PUBLIC_GOOGLE_LOGIN_URL
      );
    }
  };

  const loginWithApple = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      dispatch(setAppleId(credential.user));
      const response = await loginUserWithApple({
        id: credential.user,
      }).unwrap();
      if (!response) {
        dispatch(
          setNameAndSurname({
            name: credential.fullName?.givenName,
            surname: credential.fullName?.familyName,
          })
        );
        router.push("/create-account/profileInfo");
      } else {
        const authToken = (response as AuthenticationResponse).token;
        updateAuthToken(authToken);
        router.replace("/(app)/(drawer)/(tabs)");
      }
    } catch (e) {
      console.log(e);
      showFailToast(t("login.appleLoginFailed"));
    }
  };

  useEffect(() => {
    if (authToken) {
      updateAuthToken(authToken as string);
      router.replace("/(app)/(drawer)/(tabs)");
      WebBrowser.dismissBrowser();
    }
  }, [authToken]);

  return (
    <SafeAreaView style={{ height, backgroundColor }}>
      <StatusBar backgroundColor={backgroundColor} />
      <KeyboardAwareScrollView bottomOffset={62} centerContent={true}>
        <View style={{ alignItems: "center", marginBottom: 14, gap: 8 }}>
          <View
            style={{
              backgroundColor: Colors.dark.primary,
              borderRadius: 44,
              padding: 8,
            }}
          >
            <VitaLogo size={72} />
          </View>
          <ThemedText type="header1">{t("login.title")}</ThemedText>
          <ThemedText>{t("login.slogan")}</ThemedText>
        </View>

        <CardView style={{ padding: 28 }}>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={loginWithCredentials}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleSubmit,
              isSubmitting,
            }) => (
              <View
                style={{
                  width: "100%",
                  gap: 8,
                }}
              >
                <CommonTextInput
                  value={values.username}
                  onChangeValue={handleChange("username")}
                  placeholder={t("login.emailPhoneNumberPlaceholder")}
                  error={!!(touched.username && errors.username)}
                />
                {touched.username && errors.username && (
                  <ThemedText
                    style={{ color: "red", fontSize: 12, marginTop: -12 }}
                  >
                    {errors.username}
                  </ThemedText>
                )}

                <CommonTextInput
                  value={values.password}
                  onChangeValue={handleChange("password")}
                  placeholder={t("login.passwordPlaceholder")}
                  secureTextEntry
                  error={!!(touched.password && errors.password)}
                />
                {touched.password && errors.password && (
                  <ThemedText
                    style={{ color: "red", fontSize: 12, marginTop: -12 }}
                  >
                    {errors.password}
                  </ThemedText>
                )}
                <TouchableOpacity
                  onPress={() => {}}
                  style={{ marginVertical: 8 }}
                >
                  <ThemedText style={{ fontWeight: "600" }}>
                    {t("login.forgotPassword")}
                  </ThemedText>
                </TouchableOpacity>
                <View style={{ gap: 8 }}>
                  <PrimaryButton
                    style={{ alignItems: "center" }}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator />
                    ) : (
                      <ThemedText style={{ color: "#fff" }}>
                        {t("login.login")}
                      </ThemedText>
                    )}
                  </PrimaryButton>
                  <SecondaryButton
                    style={{
                      alignItems: "center",
                    }}
                    onPress={() => {
                      Keyboard.dismiss();
                      router.push("/create-account/credentials");
                    }}
                  >
                    <ThemedText style={{ color: Colors.dark.primary }}>
                      {t("login.createNewAccount")}
                    </ThemedText>
                  </SecondaryButton>
                </View>
                <ThemedText style={{ textAlign: "center" }}>or</ThemedText>
                <View style={{ gap: 8 }}>
                  <SecondaryButton
                    style={{
                      alignItems: "center",
                    }}
                    onPress={() => signInWithGoogle()}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <GoogleIcon height={18} />
                      <ThemedText style={{ fontSize: 16 }}>
                        {t("login.loginWithGoogle")}
                      </ThemedText>
                    </View>
                  </SecondaryButton>
                  {Platform.OS === "ios" && (
                    <AppleAuthentication.AppleAuthenticationButton
                      buttonType={
                        AppleAuthentication.AppleAuthenticationButtonType
                          .SIGN_IN
                      }
                      buttonStyle={appleButtonStyle}
                      cornerRadius={12}
                      style={styles.button}
                      onPress={loginWithApple}
                    />
                  )}
                </View>
              </View>
            )}
          </Formik>
        </CardView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flex: 1,
    height: 48,
    fontSize: 12,
  },
});
