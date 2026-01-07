import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";
import { KeyboardTypeOptions, StyleProp, TextStyle, View } from "react-native";
import {
  NativeSyntheticEvent,
  TextInput,
  TextInputChangeEventData,
} from "react-native";
import { ThemedText } from "./ThemedText";

const CommonTextArea = ({
  value,
  editable = true,
  placeholder,
  onChangeValue,
  keyboardType,
  style,
  onPress,
  numberOfLines = 4,
  minHeight = 120,
  maxLength,
  autoCorrect = true,
  error = false,
}: {
  value?: string;
  editable?: boolean;
  placeholder?: string;
  onChangeValue?: (newValue: string) => void;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<TextStyle>;
  onPress?: () => void;
  numberOfLines?: number;
  minHeight?: number;
  maxLength?: number;
  autoCorrect?: boolean;
  error?: boolean | string;
}) => {
  const [borderColor, setBorderColor] = useState(Colors.border);
  const color = useThemeColor(
    { light: Colors.light.text, dark: Colors.dark.text },
    "text"
  );

  return (
    <View>
      <TextInput
        style={[
          {
            color,
            borderColor: error ? "red" : borderColor,
            borderWidth: 1,
            borderRadius: 8,
            padding: 14,
            textAlignVertical: "top",
            minHeight,
          },
          style,
        ]}
        multiline={true}
        numberOfLines={numberOfLines}
        onPress={onPress}
        autoCapitalize="sentences"
        autoCorrect={autoCorrect}
        maxLength={maxLength}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={Colors.border}
        keyboardType={keyboardType}
        onChange={(e: NativeSyntheticEvent<TextInputChangeEventData>) => {
          if (onChangeValue) {
            const newText = e.nativeEvent.text;
            if (
              keyboardType === "numeric" ||
              keyboardType === "number-pad" ||
              keyboardType === "decimal-pad"
            ) {
              if (newText === "" || /^-?\d*\.?\d*$/.test(newText)) {
                onChangeValue(newText);
              }
              return;
            }
            onChangeValue(newText);
          }
        }}
        editable={editable}
        onFocus={() => setBorderColor(Colors.dark.primary)}
        onBlur={() => setBorderColor(Colors.border)}
      />
      {error && typeof error === "string" ? (
        <ThemedText style={{ color: "red", marginTop: 4 }}>{error}</ThemedText>
      ) : null}
    </View>
  );
};

export default CommonTextArea;
