import iconMapping from "@/assets/iconMapping";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useGetAllAddictionsQuery } from "@/services/userAddiction";

import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Dimensions, TouchableOpacity, View } from "react-native";

const AllAddictions = () => {
  const { t } = useTranslation();
  const allAddictions = useGetAllAddictionsQuery();
  const renderItem = ({ item }: { item: Addiciton }) => {
    const IconComponent = iconMapping[item.icon];

    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            router.push(`/addNewAddiction/${item.name}/${item.icon}/${item.id}`)
          }
          style={{
            flex: 1,
            flexDirection: "row",
            padding: 18,
            alignItems: "center",
          }}
        >
          <View style={{ width: 48, marginLeft: 8 }}>
            {IconComponent ? (
              <IconComponent
                width={32}
                height={32}
                fill={Colors.dark.primary}
              />
            ) : (
              <ThemedText>No Icon</ThemedText>
            )}
          </View>
          <ThemedText style={{ fontSize: 18, fontWeight: "600" }}>
            {t(`addiction.${item.name}`)}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={{ height: Dimensions.get("window").height }}>
        <View style={{ marginVertical: 16, padding: 12 }}>
          <ThemedText style={{ fontWeight: "600", fontSize: 16 }}>
            {t("addiction.chooseTheAddictionYouWantToRecover")}
          </ThemedText>
        </View>
        <FlashList
          data={allAddictions.data}
          renderItem={renderItem}
          estimatedItemSize={68}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      </View>
    </ThemedView>
  );
};

export default AllAddictions;
