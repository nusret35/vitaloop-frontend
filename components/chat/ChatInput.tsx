import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  Keyboard,
  View,
  Alert,
  Text,
} from "react-native";
import SendMessageButton from "./SendMessageButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/Colors";
import { useTranslation } from "react-i18next";
//import { useAudioRecorder, RecordingPresets } from "expo-audio";

interface ChatInputProps {
  type?: "default" | "withVoice";
  handleSend: (message: string) => void;
  onFocus?: () => void;
  isDisabled: boolean;
  isLimitReached: boolean;
}

const ChatInput = ({
  type = "default",
  handleSend,
  onFocus,
  isLimitReached,
  isDisabled = false,
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const { t } = useTranslation();
  const textColor = useThemeColor(
    { light: "#3F414E", dark: "#FFFFFF" },
    "text"
  );

  /*
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<any>();

  async function startRecording() {
    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function stopRecording() {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();
    setIsRecording(false);
  }*/

  const styles = StyleSheet.create({
    inputContainer: {
      padding: 10,
      borderTopWidth: 0.25,
      borderTopColor: Colors.border,
      zIndex: 100,
    },
    inputRow: {
      flexDirection: "row",
    },
    input: {
      flex: 1,
      borderWidth: 0.25,
      borderColor: Colors.border,
      borderRadius: 20,
      paddingHorizontal: 10,
      marginRight: 10,
      color: textColor,
    },
    disabledInput: {
      backgroundColor: Colors.border + "20",
      color: Colors.border,
    },
    limitMessage: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: Colors.border + "10",
      borderRadius: 10,
    },
    limitText: {
      color: "#FF6B6B",
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 2,
    },
    limitDescription: {
      color: textColor,
      fontSize: 12,
      opacity: 0.8,
    },
  });

  const handleSendMessage = () => {
    if (isLimitReached) {
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleSend(message);
    setMessage("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.inputContainer}>
      {isLimitReached && (
        <View style={styles.limitMessage}>
          <Text style={styles.limitDescription}>
            {t("chat.dailyLimitMessage")}
          </Text>
        </View>
      )}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, isLimitReached && styles.disabledInput]}
          value={message}
          onFocus={onFocus}
          onChangeText={isLimitReached ? undefined : setMessage}
          onSubmitEditing={handleSendMessage}
          placeholderTextColor={Colors.border}
          placeholder={
            isLimitReached
              ? t("chat.dailyLimitReached")
              : t("chat.inputPlaceholder")
          }
          editable={!isLimitReached}
        />
        {message.length > 0 && !isLimitReached ? (
          <SendMessageButton
            isDisabled={isDisabled || isLimitReached}
            onPress={handleSendMessage}
          />
        ) : (
          /*type === "withVoice" ? (
          <VoiceMessageButton
            isDisabled={isDisabled}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          />
        ) : */
          <SendMessageButton isDisabled={true} onPress={handleSendMessage} />
        )}
      </View>
    </View>
  );
};

export default ChatInput;
