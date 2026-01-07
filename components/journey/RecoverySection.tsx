import { useGetUserAddictionsQuery } from "@/services/userAddiction";
import { TouchableOpacity, View } from "react-native";
import RecoveryEntry from "./RecoveryEntry";
import { ThemedText } from "../ThemedText";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const RecoverySection = () => {
  const userAddictions = useGetUserAddictionsQuery();
  const { t } = useTranslation();

  return (
    <View style={{ gap: 8 }}>
      {(userAddictions.data?.length ?? 0) > 0 ? (
        userAddictions.data?.map((addiciton, index) => (
          <RecoveryEntry key={index} userAddiction={addiciton} />
        ))
      ) : (
        <TouchableOpacity onPress={() => router.push("/allAddictions/page")}>
          <ThemedText
            style={{
              fontWeight: "600",
              fontSize: 20,
              maxWidth: 300,
              overflow: "hidden",
            }}
          >
            {t("journey.addNewRecovery")} +
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RecoverySection;
