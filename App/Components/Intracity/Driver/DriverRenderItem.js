import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../../Resources";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { Images } from "../../../Resources/Images";

const DriverRenderItem = ({ item, index, onPress }) => {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.tabArea}>
      <TouchableOpacity style={[styles.tab]} onPress={() => onPress(item)}>
        <View style={styles.tabHeaderArea}>
          <ImageBackground
            source={Images.profilePlaceholder}
            style={styles.profileImageArea}
          >
            <Image
              source={{ uri: item.profile_picture }}
              style={styles.tabProfile}
            />
          </ImageBackground>
          <View style={styles.riderDetailsArea}>
            <Text style={styles.nameText}>{item.first_name}</Text>
            <View style={{ flexDirection: "row" }}>
              <Image style={styles.tabIcon} source={Images.seat} />
              <Text style={styles.seatBookedText}>
                {item.required_seats} {t("Seats Required")}
              </Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image style={styles.dateIcon} source={Images.tab_date_icon} />
                <Text style={styles.dateAndPriceText}>
                  {moment(item.date).format("ddd, DD MMM")} at{" "}
                  {moment(item.date).format("hh:mm A")}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tabFooterArea}>
          <View style={styles.navigationArea}>
            <Image style={styles.locationIcon} source={Images.location_icon} />
            <View style={styles.navigatorLine}></View>
            <Image style={styles.dropOffIcon} source={Images.drop_off_icon} />
          </View>

          <View style={styles.addressArea}>
            <Text style={styles.pickupAddressText}>{item.pickup_address}</Text>
            <Text style={styles.dropoffAdressText}>{item.dropoff_address}</Text>
          </View>
        </View>

        <Text style={styles.bottomPriceText}>${item.driver_payout}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DriverRenderItem;

const styles = StyleSheet.create({
  tabArea: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  tab: {
    width: "100%",
    flex: 1,
    paddingBottom: ScaleSize.spacing_medium * 3,
    padding: ScaleSize.spacing_semi_medium - 2,
    borderWidth: ScaleSize.smallest_border_width,
    marginVertical: ScaleSize.spacing_small,
    borderRadius: ScaleSize.medium_border_radius,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  tabHeaderArea: {
    flex: 1,
    height: ScaleSize.spacing_large * 3,
    flexDirection: "row",
    paddingVertical: ScaleSize.spacing_small,
    padding: ScaleSize.spacing_minimum,
    paddingRight: ScaleSize.spacing_small,
    alignItems: "center",
    borderRadius: ScaleSize.small_border_radius + 4,
    backgroundColor: Colors.lightest_gray,
    justifyContent: "flex-start",
  },
  tabProfile: {
    height: ScaleSize.tab_profile_icon + 15,
    width: ScaleSize.tab_profile_icon + 15,
    resizeMode: "cover",
    position: "absolute",
    right: 0,
    borderRadius: ScaleSize.small_border_radius + 2,
  },
  riderDetailsArea: {
    paddingHorizontal: ScaleSize.spacing_very_small,
    flex: 1,
  },
  nameText: {
    color: Colors.black,
    width: "60%",
    bottom: Platform.OS === "ios" ? ScaleSize.font_spacing : null,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text,
  },
  tabIcon: {
    height: ScaleSize.flatlist_tab_icon,
    width: ScaleSize.small_icon,
    bottom: Platform.OS === "ios" ? ScaleSize.font_spacing : null,
    resizeMode: "contain",
  },
  dateIcon: {
    height: ScaleSize.small_icon - 1,
    width: ScaleSize.small_icon - 1,
    bottom: Platform.OS === "ios" ? null : ScaleSize.font_spacing,
    marginRight: ScaleSize.spacing_small - 5,
    resizeMode: "cover",
  },
  seatBookedText: {
    color: Colors.black,
    bottom: ScaleSize.font_spacing,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text - 1.5,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  dateAndPriceText: {
    color: Colors.black,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text - 1.5,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  bottomPriceText: {
    color: Colors.primary,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text,
    position: "absolute",
    left: ScaleSize.spacing_medium,
    bottom: ScaleSize.spacing_small + 2,
  },
  price: {
    color: Colors.primary,
    fontFamily: AppFonts.medium,
    alignSelf: "flex-start",
    fontSize: TextFontSize.medium_text - 2,
    top: ScaleSize.spacing_small,
    left: ScaleSize.spacing_small,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  priceText: {
    marginTop: ScaleSize.spacing_small,
    color: Colors.primary,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
  },
  tabFooterArea: {
    flex: 1,
    flexDirection: "row",
    marginTop: ScaleSize.spacing_semi_medium,
  },
  navigationArea: {
    alignItems: "center",
    top: ScaleSize.font_spacing,
    justifyContent: "center",
    justifyContent: "flex-start",
  },
  addressArea: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: ScaleSize.spacing_small,
    paddingRight: ScaleSize.spacing_medium,
  },
  pickupAddressText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
    color: Colors.black,
  },
  dropoffAdressText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
    color: Colors.black,
    top: ScaleSize.spacing_very_small,
  },
  dropOffIcon: {
    height: ScaleSize.small_icon,
    width: ScaleSize.small_icon,
    resizeMode: "contain",
    tintColor: Colors.gray,
  },
  locationIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    tintColor: Colors.primary,
    resizeMode: "contain",
  },
  navigatorLine: {
    width: ScaleSize.font_spacing,
    borderRightWidth: 1.5,
    flex: 0.3,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    height: ScaleSize.spacing_large,
  },
  profileImageArea: {
    justifyContent: "center",
    alignItems: "center",
    height: ScaleSize.tab_profile_icon + 15,
    width: ScaleSize.tab_profile_icon + 15,
    overflow: "hidden",
    backgroundColor: Colors.gray,
    marginHorizontal: ScaleSize.spacing_small,
    borderRadius: ScaleSize.small_border_radius + 2,
  },
});
