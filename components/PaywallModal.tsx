import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import CommonModal from "@/components/CommonModal";
import PrimaryButton from "@/components/PrimaryButton";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import * as Haptics from "expo-haptics";
import VitaLogo from "./icons/VitaLogo";
import CrossIcon from "./icons/CrossIcon";
import { Colors } from "@/constants/Colors";
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";
import SecondaryButton from "./SecondaryButton";
import { useToast } from "@/toast/ToastContext";

interface PaywallModalProps {
  isVisible: boolean;
  onClose: () => void;
  daysRemaining?: number;
}

const PaywallModal = ({
  isVisible,
  onClose,
  daysRemaining = 0,
}: PaywallModalProps) => {
  const { t } = useTranslation();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { showFailToast } = useToast();

  const premiumFeatures = [
    {
      icon: "🤖",
      title: t("paywall.aiSupportTitle"),
      description: t("paywall.aiSupportDescription"),
    },
    {
      icon: "📊",
      title: t("paywall.advancedAnalyticsTitle"),
      description: t("paywall.advancedAnalyticsDescription"),
    },
    {
      icon: "🎯",
      title: t("paywall.unlimitedGoalsTitle"),
      description: t("paywall.unlimitedGoalsDescription"),
    },
    {
      icon: "💎",
      title: t("paywall.premiumContentTitle"),
      description: t("paywall.premiumContentDescription"),
    },
    {
      icon: "🔔",
      title: t("paywall.smartNotificationsTitle"),
      description: t("paywall.smartNotificationsDescription"),
    },
    {
      icon: "☁️",
      title: t("paywall.cloudSyncTitle"),
      description: t("paywall.cloudSyncDescription"),
    },
  ];

  useEffect(() => {
    if (isVisible) {
      fetchOfferings();
    }
  }, [isVisible]);

  const fetchOfferings = async () => {
    try {
      setIsLoadingProducts(true);
      const offerings = await Purchases.getOfferings();

      console.warn("HERE ARE THE OFFERINGS: ", offerings);

      if (offerings.current && offerings.current.availablePackages.length > 0) {
        const availablePackages = offerings.current.availablePackages;
        setPackages(availablePackages);

        // Auto-select the first package (or you can implement logic to select monthly/yearly)
        setSelectedPackage(availablePackages[0]);
      }
    } catch (error) {
      console.error("Error fetching offerings:", error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const handleUpgrade = async () => {
    if (!selectedPackage) return;

    try {
      setIsPurchasing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);

      if (typeof customerInfo.entitlements.active !== "undefined") {
        // Purchase successful
        onClose();
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error("Purchase error:", error);
        // Handle error (you could show an alert here)
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      const restore = await Purchases.restorePurchases();
      // ... check restored purchaserInfo to see if entitlement is now active
    } catch (e) {
      showFailToast("Failed to restore purchases");
    }
  };

  const handleMaybeLater = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <CommonModal isVisible={isVisible} onClose={onClose}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <CrossIcon size={14} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <VitaLogo size={50} />
          </View>
          <ThemedText type="header1" style={styles.title}>
            {daysRemaining > 0
              ? t("paywall.trialTitle", { days: daysRemaining })
              : t("paywall.trialExpiredTitle")}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {daysRemaining > 0
              ? t("paywall.trialSubtitle")
              : t("paywall.trialExpiredSubtitle")}
          </ThemedText>
        </View>

        <View style={styles.featuresContainer}>
          <ThemedText style={styles.featuresTitle}>
            {t("paywall.unlockFeatures")}
          </ThemedText>

          {premiumFeatures.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <ThemedText style={styles.featureIcon}>{feature.icon}</ThemedText>
              <View style={styles.featureContent}>
                <ThemedText style={styles.featureTitle}>
                  {feature.title}
                </ThemedText>
                <ThemedText style={styles.featureDescription}>
                  {feature.description}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>

        {/* Product Selection */}
        {isLoadingProducts ? (
          <View style={styles.loadingContainer}>
            <ThemedText style={styles.loadingText}>
              {t("paywall.loadingProducts")}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.packagesContainer}>
            {packages.map((pkg, index) => (
              <TouchableOpacity
                key={pkg.identifier}
                style={[
                  styles.packageOption,
                  selectedPackage?.identifier === pkg.identifier &&
                    styles.selectedPackage,
                ]}
                onPress={() => {
                  setSelectedPackage(pkg);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <View style={styles.packageHeader}>
                  <ThemedText style={styles.packageTitle}>
                    {/*pkg.storeProduct.title.replace("(Vitaloop)", "").trim()*/}
                  </ThemedText>
                  {pkg.packageType === "ANNUAL" && (
                    <View style={styles.savingsBadge}>
                      <ThemedText style={styles.savingsText}>
                        {t("paywall.mostPopular")}
                      </ThemedText>
                    </View>
                  )}
                </View>
                <ThemedText style={styles.packagePrice}>
                  {/*pkg.storeProduct.priceString*/}
                </ThemedText>
                <ThemedText style={styles.packageDescription}>
                  {/*pkg.storeProduct.description*/}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.buttons}>
          <PrimaryButton onPress={handleUpgrade}>
            <ThemedText style={{ textAlign: "center", color: "#FFFFFF" }}>
              {/*isPurchasing
                ? t("paywall.loading")
                : selectedPackage
                ? t("paywall.upgradeForPrice", {
                    price: selectedPackage.storeProduct.priceString,
                  })
                : t("paywall.upgradeToVitaPlus")*/}
              Annual subscription $49.99 (16% off)
            </ThemedText>
          </PrimaryButton>
          <PrimaryButton onPress={handleUpgrade}>
            <ThemedText style={{ textAlign: "center", color: "#FFFFFF" }}>
              {/*isPurchasing
                ? t("paywall.loading")
                : selectedPackage
                ? t("paywall.upgradeForPrice", {
                    price: selectedPackage.storeProduct.priceString,
                  })
                : t("paywall.upgradeToVitaPlus")*/}
              Monthly subscription $4.99
            </ThemedText>
          </PrimaryButton>
          <SecondaryButton onPress={handleRestorePurchases}>
            <ThemedText
              style={{ textAlign: "center", color: Colors.dark.primary }}
            >
              Restore purchases
            </ThemedText>
          </SecondaryButton>

          {daysRemaining > 0 && (
            <TouchableOpacity
              onPress={handleMaybeLater}
              style={styles.laterButton}
            >
              <ThemedText style={styles.laterButtonText}>
                {t("paywall.maybeLater")}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </CommonModal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxHeight: 700,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#666666",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#555555",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoContainer: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 50,
    padding: 12,
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    opacity: 0.8,
    lineHeight: 22,
  },
  premiumBadge: {
    alignSelf: "center",
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  premiumText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresTitle: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "600",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 32,
    textAlign: "center",
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  pricing: {
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 12,
  },
  pricingText: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 4,
  },
  priceText: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.dark.primary,
    marginBottom: 4,
  },
  pricingNote: {
    fontSize: 12,
    opacity: 0.6,
  },
  buttons: {
    marginBottom: 16,
    gap: 8,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
  },
  packagesContainer: {},
  packageOption: {
    borderWidth: 2,
    borderColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  selectedPackage: {
    borderColor: Colors.dark.primary,
    backgroundColor: "rgba(0, 122, 255, 0.05)",
  },
  packageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  packageTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  savingsBadge: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  savingsText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.dark.primary,
    marginBottom: 4,
  },
  packageDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 18,
  },
  upgradeButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  upgradeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  laterButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  laterButtonText: {
    fontSize: 16,
    opacity: 0.7,
  },
  termsText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "center",
    lineHeight: 16,
  },
});

export default PaywallModal;
