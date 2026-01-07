import CardView from "@/components/CardView";
import CommonTextArea from "@/components/CommonTextArea";
import CommonTextInput from "@/components/CommonTextInput";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSendSupportTicketMutation } from "@/services/supportTicket";
import { useToast } from "@/toast/ToastContext";
import { router } from "expo-router";
import { Formik } from "formik";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
} from "react-native";
import * as Yup from "yup";

const SupportTicket = () => {
  const { t } = useTranslation();
  const [sendSupportTicket] = useSendSupportTicketMutation();
  const { showSuccessToast, showFailToast } = useToast();
  const SupportTicketSchema = Yup.object().shape({
    title: Yup.string()
      .required(t("ticket.titleIsRequired"))
      .max(250, t("ticket.titleCanBeMax250")),
    description: Yup.string()
      .required(t("ticket.descriptionIsRequired"))
      .max(3000, t("ticket.descriptionCanBeMax3000")),
  });

  interface SupportTicketValues {
    title: string;
    description: string;
  }

  interface FormikHelpers {
    setSubmitting: (isSubmitting: boolean) => void;
    setErrors: (errors: { [key: string]: string }) => void;
  }

  const handleSubmitTicket = useCallback(
    async (values: SupportTicketValues) => {
      try {
        sendSupportTicket(values);
        router.back();
        showSuccessToast(t("toast.ticketIsSent"));
      } catch {
        showFailToast("Something went wrong");
      }
    },
    []
  );

  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor,
    },
    chatContainer: {
      height: Dimensions.get("window").height - 140,
    },
    dateSeparator: {
      alignSelf: "center",
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
      marginVertical: 8,
    },
    dateSeparatorText: {
      color: "#fff",
      fontSize: 12,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 120}
    >
      <ScrollView>
        <ThemedView
          style={{ flex: 1, height: Dimensions.get("screen").height }}
        >
          <Formik
            initialValues={{ title: "", description: "" }}
            validationSchema={SupportTicketSchema}
            onSubmit={handleSubmitTicket}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <View style={{ gap: 8 }}>
                <CardView>
                  <ThemedText style={{ fontSize: 14 }}>
                    {t("ticket.title")}
                  </ThemedText>
                  <CommonTextInput
                    value={values.title}
                    onChangeValue={handleChange("title")}
                    placeholder={t("ticket.enterTitle")}
                  />
                  <ThemedText style={{ fontSize: 12 }}>
                    {touched.title && errors.title}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 14 }}>
                    {t("ticket.description")}
                  </ThemedText>
                  <CommonTextArea
                    value={values.description}
                    onChangeValue={handleChange("description")}
                    placeholder={t("ticket.enterDescription")}
                  />
                  <ThemedText style={{ fontSize: 12, marginTop: -12 }}>
                    {touched.description && errors.description}
                  </ThemedText>
                </CardView>
                <View style={{ gap: 16, paddingHorizontal: 16 }}>
                  <PrimaryButton
                    style={{
                      alignItems: "center",
                    }}
                    onPress={handleSubmit}
                  >
                    <ThemedText style={{ color: "#fff" }}>
                      {t("ticket.sendTicket")}
                    </ThemedText>
                  </PrimaryButton>
                  <SecondaryButton
                    style={{
                      alignItems: "center",
                    }}
                    onPress={() => router.back()}
                  >
                    <ThemedText style={{ color: Colors.dark.primary }}>
                      {t("ticket.cancel")}
                    </ThemedText>
                  </SecondaryButton>
                </View>
              </View>
            )}
          </Formik>
        </ThemedView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SupportTicket;
