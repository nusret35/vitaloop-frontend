import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { useTranslation } from "react-i18next";
import PrimaryButton from "./PrimaryButton";
import { ThemedText } from "./ThemedText";
import Purchases from "react-native-purchases";
import PaywallModal from "./PaywallModal";
import { useState } from "react";

const UpgradeButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  async function presentPaywall() {
    setIsVisible(true);
  }

  return (
    <>
      <PrimaryButton
        style={{ alignItems: "center", marginTop: 24 }}
        onPress={() => presentPaywall()}
      >
        <ThemedText style={{ color: "#fff" }}>
          {t("sidebar.upgradeToPremium")}
        </ThemedText>
      </PrimaryButton>
      <PaywallModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        daysRemaining={7}
      />
    </>
  );
};

export default UpgradeButton;
