import CardView from "@/components/CardView";
import { Collapsible } from "@/components/Collapsible";
import Header from "@/components/home/Header";
import PrimaryButton from "@/components/PrimaryButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const Support = () => {
  const { t } = useTranslation();

  return (
    <ThemedView style={{ flex: 1 }}>
      <Header style={{ paddingBottom: 0 }} title={t("ticket.faq")} />
      <CardView>
        <Collapsible title={t("ticket.howCanIOrganizeRoutine")}>
          <ThemedText>{t("ticket.routinesCanBeOrganized")}</ThemedText>
        </Collapsible>
        <Collapsible title={t("ticket.howCanIUpgradeMyAccount")}>
          <ThemedText>{t("ticket.youCanUpgradeFrom")}</ThemedText>
        </Collapsible>
        {/*
        <Collapsible title={t("ticket.howCanIRestorePurchases")}>
          <ThemedText>{t("ticket.youCanRestoreYourPurchases")}</ThemedText>
        </Collapsible>
        */}
      </CardView>
      <Header
        style={{ paddingBottom: 0 }}
        title={t("ticket.stillHavingIssues")}
      />
      <PrimaryButton
        style={{ margin: 16, alignItems: "center" }}
        onPress={() => router.push("/support/supportTicket/page")}
      >
        <ThemedText style={{ color: "#fff" }}>
          {t("ticket.openSupportTicket")}
        </ThemedText>
      </PrimaryButton>
    </ThemedView>
  );
};

export default Support;
