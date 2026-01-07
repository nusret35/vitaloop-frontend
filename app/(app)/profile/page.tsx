import CardView from "@/components/CardView";
import CommonTextInput from "@/components/CommonTextInput";
import { Dropdown } from "@/components/routine/Dropdown";
import SecondaryButton from "@/components/SecondaryButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useGetUserQuery, useUpdateUserProfileMutation } from "@/services/user";
import Gender from "@/types/gender";
import { router, useNavigation } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import DatePicker from "react-native-date-picker";
import OverlayActivityIndicator from "@/components/OverlayActivityIndicator";
import { useToast } from "@/toast/ToastContext";
import { useTranslation } from "react-i18next";

const ProfileScreen = () => {
  const { t } = useTranslation();
  const genderList = [
    { label: t("profile.genderFemale"), value: Gender.Female },
    { label: t("profile.genderMale"), value: Gender.Male },
    { label: t("profile.genderOther"), value: Gender.Other },
    { label: t("profile.genderNotSpecified"), value: Gender.Unknown },
  ];

  const getLocalizedGenderLabel = (
    genderValue: Gender | null | undefined
  ): string => {
    const genderItem = genderList.find((item) => item.value === genderValue);
    return genderItem?.label || t("profile.genderNotSpecified");
  };

  const colorScheme = useColorScheme();
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [gender, setGender] = useState<Gender | null>();
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const navigation = useNavigation();
  const { data, isLoading } = useGetUserQuery();
  const [updateUserProfile, { isLoading: isUpdateUserProfileLoading }] =
    useUpdateUserProfileMutation();
  const { showSuccessToast, showFailToast } = useToast();

  useEffect(() => {
    setName(data?.name ?? "");
    setSurname(data?.surname ?? "");
    setGender(data?.gender ?? Gender.Unknown);
    setBirthday(data?.birthDate ? new Date(data.birthDate) : null);
  }, [data]);

  const updateProfile = useCallback(() => {
    try {
      updateUserProfile({
        name,
        surname,
        gender,
        birthDate: birthday ? birthday.toISOString() : null,
      });
      showSuccessToast(t("toast.userProfileUpdated"));
    } catch {
      showFailToast("Something went wrong");
    } finally {
      setIsEditMode(false);
    }
  }, [name, surname, gender, birthday, updateUserProfile]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        if (isEditMode) {
          return (
            <TouchableOpacity
              onPress={() => updateProfile()}
              style={{ marginBottom: 10 }}
            >
              <Icon size={28} name="check" color={Colors.dark.primary} />
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            onPress={() => {
              setIsEditMode(true);
            }}
            style={{ marginBottom: 10 }}
          >
            <Icon size={28} name="edit" color={Colors.dark.primary} />
          </TouchableOpacity>
        );
      },
    });
  }, [navigation, isEditMode, updateProfile]);

  return (
    <ThemedView style={{ flex: 1 }}>
      {(isLoading || isUpdateUserProfileLoading) && (
        <OverlayActivityIndicator
          isVisible={isLoading || isUpdateUserProfileLoading}
        />
      )}
      <CardView style={{ gap: 16 }}>
        <View>
          <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
            {t("profile.name")}
          </ThemedText>
          <CommonTextInput
            editable={isEditMode}
            value={name}
            onChangeValue={(newValue) => setName(newValue)}
            placeholder={t("profile.enterName")}
          />
        </View>
        <View>
          <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
            {t("profile.surname")}
          </ThemedText>
          <CommonTextInput
            editable={isEditMode}
            value={surname}
            onChangeValue={(newValue) => setSurname(newValue)}
            placeholder={t("profile.enterSurname")}
          />
        </View>
        <View>
          <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
            {t("profile.gender")}
          </ThemedText>
          <Dropdown
            disabled={!isEditMode}
            value={getLocalizedGenderLabel(gender)}
            items={genderList}
            placeholder={t("profile.chooseGender")}
            style={{
              borderColor: Colors.border,
              borderWidth: 1,
              borderRadius: 8,
              padding: 14,
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
            }}
            setValue={(newValue) => {
              setGender(newValue as Gender | null);
            }}
          />
        </View>
        <View>
          <ThemedText style={{ fontSize: 14, marginBottom: 4 }}>
            {t("profile.birthday")}
          </ThemedText>
          <TouchableOpacity
            disabled={!isEditMode}
            onPress={() => setIsDateModalOpen(true)}
          >
            <View
              style={{
                justifyContent: "center",
                padding: 14,
                borderRadius: 8,
                borderColor: Colors.border,
                borderWidth: 1,
                backgroundColor: isEditMode
                  ? "transparent"
                  : colorScheme === "dark"
                  ? "#3b3b3b"
                  : "#D8D8D8",
              }}
            >
              {birthday ? (
                <ThemedText>{birthday.toLocaleDateString()}</ThemedText>
              ) : (
                <ThemedText>
                  {
                    <ThemedText>
                      {t("createAccount.chooseBirthdate")}
                    </ThemedText>
                  }
                </ThemedText>
              )}
            </View>
          </TouchableOpacity>
        </View>
        <DatePicker
          modal
          open={isDateModalOpen}
          onConfirm={(date) => {
            setBirthday(date);
            setIsDateModalOpen(false);
          }}
          onCancel={() => setIsDateModalOpen(false)}
          mode="date"
          date={birthday ?? new Date()}
          onDateChange={(newDate) => setBirthday(newDate)}
        />
      </CardView>
      {!isEditMode && (
        <View style={{ marginHorizontal: 16, gap: 8 }}>
          {/* 
            <UpgradeButton />
            */}
          <SecondaryButton
            style={{ alignItems: "center" }}
            onPress={() => router.push("/profile/advancedOptions/page")}
          >
            <ThemedText style={{ color: Colors.dark.primary }}>
              {t("profile.advancedOptions")}
            </ThemedText>
          </SecondaryButton>
        </View>
      )}
      {isEditMode && (
        <View style={{ marginHorizontal: 16, gap: 8 }}>
          <SecondaryButton
            onPress={() => {
              setName(data?.name ?? "");
              setSurname(data?.surname ?? "");
              setGender(data?.gender ?? Gender.Unknown);
              setBirthday(data?.birthDate ? new Date(data.birthDate) : null);
              setIsEditMode(false);
            }}
            style={{ alignItems: "center" }}
          >
            <ThemedText style={{ color: Colors.dark.primary }}>
              {t("profile.discard")}
            </ThemedText>
          </SecondaryButton>
        </View>
      )}
    </ThemedView>
  );
};

export default ProfileScreen;
