import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import Utils from "../../Helpers/Utils";
import { useDispatch, useSelector } from "react-redux";
import {
  subscriptionPayment,
  subscriptionSuccessDetails,
} from "../../Actions/Settings";
import { ModalProgressLoader } from "../../Components/Comman";
import { SafeAreaView } from "react-native-safe-area-context";

const SubscriptionInvoice = ({ navigation, route }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { payment_id } = route.params || {};
  const { subPlan, isLoading, subInvoiceData } = useSelector(
    (state) => state.Settings
  );

  useEffect(() => {
    fetchData();
  }, [payment_id]);

  const fetchData = async () => {
    try {
      var body = {
        payment_id: payment_id,
      };
      dispatch(
        subscriptionSuccessDetails(body, async (data, isSuccess) => {
          if (isSuccess === true) {
            console.log("subInvoiceData", subInvoiceData);
          } else {
          }
        })
      );
    } catch { }
  };

  return (
    <SafeAreaView style={styles.rootContainer} >
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar backgroundColor={Colors.primary} barStyle={"light-content"} />
        <ModalProgressLoader visible={isLoading} />
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Image style={styles.backBtnIcon} source={Images.backBtn} />
            <Text style={styles.backText}>{t("back")}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.invoiceTabArea}>
          <View style={styles.invoiceTabShadow} />
          <View style={styles.invoiceTab}>
            <View style={styles.successImgArea}>
              <Image source={Images.success} style={styles.successImg} />
              <Text style={styles.thankYouText}>
                {t("sub_invoice_confirmation_text")}
              </Text>
            </View>
            <View style={styles.detailsTextArea}>
              <Text style={styles.invoiceText}>{t("sub_information")}</Text>

              <Text style={styles.titleBarText}>{t("amount")}</Text>

              <Text style={styles.descriptionText}>
                ${subInvoiceData.total_amount}
              </Text>

              <Text style={styles.titleBarText}>{t("period_start")}</Text>

              <Text style={styles.dateAndTimeText}>
                {subInvoiceData.current_period_start}
              </Text>

              <Text style={styles.titleBarText}>{t("period_end")}</Text>

              <Text style={styles.dateAndTimeText}>
                {subInvoiceData.current_period_end}
              </Text>

              <Text style={styles.titleBarText}>{t("status")}</Text>

              <Text style={styles.descriptionText}>Succeeded</Text>

              <View style={styles.sepraterDashedLine} />

              <View style={styles.footerArea}>
                <Text style={styles.totalAmountText}>{t("total_amount")}:</Text>
                <Text style={styles.finalPriceText}>
                  ${subInvoiceData.total_amount}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubscriptionInvoice;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingBottom: 40,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    marginTop: Platform.OS === "ios" ? 0 : ScaleSize.spacing_medium,
    marginBottom: ScaleSize.spacing_small,
  },
  backBtn: {
    marginRight: ScaleSize.spacing_semi_medium,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backBtnIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    tintColor: Colors.white,
    marginRight: ScaleSize.spacing_semi_medium,
    resizeMode: "contain",
  },
  backText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text,
    color: Colors.white,
    textTransform: "capitalize",
  },

  invoiceTabArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_large,
    marginTop: ScaleSize.spacing_small,
  },
  invoiceTab: {
    width: "100%",
    padding: ScaleSize.spacing_small,
    backgroundColor: Colors.white,
    alignItems: "center",
    borderRadius: ScaleSize.medium_border_radius,
  },
  invoiceTabShadow: {
    width: "90%",
    height: ScaleSize.spacing_extra_large,
    position: "absolute",
    bottom: -ScaleSize.spacing_semi_medium,
    padding: ScaleSize.spacing_small,
    backgroundColor: "#ffffff38",
    borderRadius: ScaleSize.medium_border_radius,
  },
  successImgArea: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderRadius: ScaleSize.semi_medium_radius,
  },
  successImg: {
    height: ScaleSize.largest_image,
    width: ScaleSize.largest_image,
    top: ScaleSize.spacing_very_small,
    marginVertical: ScaleSize.spacing_very_small,
  },
  thankYouText: {
    color: Colors.white,
    marginVertical: ScaleSize.spacing_semi_medium,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.medium_text,
    textAlign: "center",
  },
  detailsTextArea: {
    width: "100%",
    padding: ScaleSize.spacing_semi_medium,
  },
  invoiceText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text,
    color: Colors.black,
    marginTop: ScaleSize.spacing_very_small,
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text - 1,
    color: Colors.black,
    marginTop: ScaleSize.spacing_very_small,
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text + 1,
    color: Colors.gray,
    marginBottom: ScaleSize.spacing_very_small,
    bottom: ScaleSize.spacing_very_small,
  },
  dateAndTimeText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
    marginBottom: ScaleSize.spacing_very_small,
    bottom: ScaleSize.spacing_very_small,
  },
  sepraterDashedLine: {
    width: "100%",
    marginVertical: ScaleSize.spacing_small,
    borderTopWidth: 1.5,
    borderStyle: "dashed",
    borderColor: Colors.gray,
  },
  footerArea: {
    width: "100%",
    top: ScaleSize.spacing_very_small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  totalAmountText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text + 1,
    color: Colors.black,
  },
  seatsText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.black,
    bottom: ScaleSize.spacing_very_small,
  },
  finalPriceText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.large_text,
    color: Colors.primary,
  },
});
