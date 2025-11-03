import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import React, { useRef, useEffect } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { useTranslation } from "react-i18next";

const RiderInvoice = ({ navigation, route }) => {
  const { t } = useTranslation();
  const backHandlerRef = useRef(null);
  const {
    pickup_address,
    dropoff_address,
    pickup_date,
    dropoff_date,
    booked_seat,
    total_amount,
  } = route.params || {};

  useEffect(() => {
    const backHandler = back();
    backHandlerRef.current = backHandler;
    return () => {
      if (backHandlerRef.current) {
        backHandlerRef.current.remove();
      }
    };
  }, []);

  const back = () => {
    const handleBackBtn = () => {
      navigation.navigate("BottomTabNavigator", {
        screen: "RiderMyBookingsScreen",
        params: { isFromInvoice: true },
      });
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackBtn
    );
    return backHandler;
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar backgroundColor={Colors.primary} />
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            navigation.navigate("BottomTabNavigator", {
              screen: "RiderMyBookingsScreen",
              params: { isFromInvoice: true },
            });
          }}
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
              {t("thank_you_for_booking")}
            </Text>
          </View>
          <View style={styles.detailsTextArea}>
            <Text style={styles.invoiceText}>{t("invoice")}</Text>

            <Text style={styles.titleBarText}>{t("pickup_address")}</Text>

            <Text style={styles.descriptionText}>{pickup_address}</Text>

            <Text style={styles.titleBarText}>{t("pickup_time")}</Text>

            <Text style={styles.dateAndTimeText}>{pickup_date}</Text>

            <Text style={styles.titleBarText}>{t("drop_off_address")}</Text>

            <Text style={styles.descriptionText}>{dropoff_address}</Text>

            {dropoff_date && (
              <>
                <Text style={styles.titleBarText}>
                  {t("approx_dropoff_time")}
                </Text>
                <Text style={styles.descriptionText}>{dropoff_date}</Text>
              </>
            )}

            <View style={styles.sepraterDashedLine} />

            <View style={styles.footerArea}>
              <View style={styles.totalAmountSeatsTextArea}>
                <Text style={styles.totalAmountText}>{t("total_amount")}:</Text>
                <Text style={styles.seatsText}>
                  {booked_seat} {t("seats")}
                </Text>
              </View>
              <Text style={styles.finalPriceText}>
                ${total_amount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>

  );
};

export default RiderInvoice;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: Platform.OS === 'ios' ? 40 : null,
    paddingHorizontal: ScaleSize.spacing_small,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    marginTop: ScaleSize.spacing_medium,
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
    paddingTop: ScaleSize.spacing_large,
    paddingBottom: ScaleSize.spacing_semi_medium,
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
    fontSize: TextFontSize.small_text,
    color: Colors.black,
    marginTop: ScaleSize.spacing_very_small,
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    top: Platform.OS === 'ios' ? ScaleSize.font_spacing : null,
    fontSize: TextFontSize.very_small_text,
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
    fontSize: TextFontSize.very_small_text,
    color: Colors.primary,
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
