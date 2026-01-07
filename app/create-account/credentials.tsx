import CardView from "@/components/CardView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import VitaLogo from "@/components/icons/VitaLogo";
import CreateAccountCredentialsForm from "@/components/createAccount/CreateAccountCredentialsForm";
import { useTranslation } from "react-i18next";

const CreateAccountCredentials = () => {
  const { t } = useTranslation();
  const { height } = Dimensions.get("window");
  const backgroundColor = useThemeColor(
    { light: Colors.light.background, dark: Colors.dark.background },
    "background"
  );

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ height, backgroundColor }}>
      <StatusBar backgroundColor={backgroundColor} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <ScrollView
            style={{ height }}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              paddingVertical: 20,
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
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
              <ThemedText type="header1">
                {" "}
                {t("login.createNewAccount")}
              </ThemedText>
              <ThemedText>{t("login.sloganNewAccount")}</ThemedText>
            </View>
            <CardView>
              <CreateAccountCredentialsForm />
            </CardView>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateAccountCredentials;
