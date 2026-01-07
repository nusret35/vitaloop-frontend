import { useState } from "react";
import { Text, useColorScheme, View, ViewStyle } from "react-native";
import RNPickerSelect, { Item } from "react-native-picker-select";
import { ThemedText } from "../ThemedText";

export const Dropdown = ({
  disabled = false,
  value,
  placeholder,
  items,
  setValue,
  style,
}: {
  disabled?: boolean;
  value: string | null;
  placeholder?: string;
  items: Item[];
  setValue: (newValue: string) => void;
  style?: ViewStyle;
}) => {
  const colorScheme = useColorScheme();
  const [currentValue, setCurrentValue] = useState<string | null>(null);

  return (
    <RNPickerSelect
      disabled={disabled}
      value={currentValue}
      darkTheme={colorScheme === "dark"}
      onValueChange={(value) => {
        setCurrentValue(value);
      }}
      onDonePress={() => {
        if (currentValue) {
          setValue(currentValue);
        }
      }}
      items={items}
    >
      {
        <View
          style={{
            ...style,
            justifyContent: "center",
            backgroundColor: disabled
              ? colorScheme === "dark"
                ? "#3b3b3b"
                : "#D8D8D8"
              : "transparent",
          }}
        >
          {value ? (
            <ThemedText>{value}</ThemedText>
          ) : (
            <Text style={{ color: "grey" }}>{placeholder}</Text>
          )}
        </View>
      }
    </RNPickerSelect>
  );
};
