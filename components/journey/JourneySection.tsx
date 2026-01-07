import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ReactNode } from "react";
import CardView from "../CardView";
import { useTranslation } from "react-i18next";

const JourneySection = ({
  title,
  children,
  showSeeAll = false,
  seeAllAction,
  customSeeAllText,
}: {
  title: string;
  children: ReactNode;
  showSeeAll?: boolean;
  seeAllAction?: () => void;
  customSeeAllText?: string;
}) => {
  const { t } = useTranslation();
  return (
    <CardView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedText style={{ fontSize: 20, fontWeight: "bold" }}>
          {title}
        </ThemedText>
        {showSeeAll && (
          <TouchableOpacity
            onPress={() => {
              if (seeAllAction) {
                seeAllAction();
              }
            }}
          >
            <ThemedText>
              {customSeeAllText ? customSeeAllText : t("journey.seeAll")}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
      {children}
    </CardView>
  );
};

export default JourneySection;
