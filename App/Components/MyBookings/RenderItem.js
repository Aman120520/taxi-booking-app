import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ImageBackground,
  Platform,
} from "react-native";
import {
  Colors,
  TextFontSize,
  ScaleSize,
  Images,
  AppFonts,
} from "../../Resources";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Utils from "../../Helpers/Utils";

const RenderItem = ({
  item,
  selectedAreaType,
  onPress,
  RiderCancelBooking,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.tabArea}>
      <TouchableOpacity
        style={[styles.tab, { paddingBottom: ScaleSize.spacing_medium * 3 }]}
        onPress={() => onPress(item)}
      >
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
                {selectedAreaType === "intercity"
                  ? item.booked_seat
                  : item.required_seats}{" "}
                {""}
                {selectedAreaType === "intercity"
                  ? item.booked_seat > 1
                    ? "Seats Booked"
                    : "Seat Booked"
                  : "Seat Required"}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image style={styles.dateIcon} source={Images.tab_date_icon} />
                <Text style={styles.dateAndPriceText}>
                  {moment(item.ride_date, "DD MMMM YYYY hh:mm A").format(
                    "ddd, DD MMMM [at] hh:mm A"
                  )}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.pendingArea,
              selectedAreaType === "intercity"
                ? {
                    backgroundColor:
                      item.status === 3
                        ? Colors.low_opacity_secondary
                        : Colors.textinput_low_opacity,
                    borderColor:
                      item.status === 3 ? Colors.secondary : Colors.primary,
                  }
                : {
                    backgroundColor:
                      item.status === 4 || item.ride_status === 0
                        ? Colors.low_opacity_secondary
                        : Colors.textinput_low_opacity,
                    borderColor:
                      item.status === 4 || item.ride_status === 0
                        ? Colors.secondary
                        : Colors.primary,
                  },
            ]}
          >
            <Text
              style={[
                styles.pendingText,
                selectedAreaType === "intercity"
                  ? {
                      color:
                        item.status === 3 ? Colors.secondary : Colors.primary,
                    }
                  : {
                      color:
                        item.status === 4 || item.ride_status === 0
                          ? Colors.secondary
                          : Colors.primary,
                    },
              ]}
            >
              {selectedAreaType === "intercity"
                ? Utils.getIntercityStatus(item.status, t)
                : Utils.getIntracityStatus(item.status, item.ride_status, t)}
            </Text>
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

        <Text style={styles.bottomPriceText}>
          $
          {selectedAreaType === "intercity"
            ? item.total_amount.toFixed(2)
            : item.total_price.toFixed(2)}
        </Text>

        {selectedAreaType === "intercity" &&
          item?.status === 1 &&
          Utils.isGreaterThanOneHour(item.pickup_date) && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => RiderCancelBooking(item.id)}
            >
              <Text style={styles.cancelBtnText}>Cancel Ride</Text>
            </TouchableOpacity>
          )}
      </TouchableOpacity>
    </View>
  );
};

export default RenderItem;

const styles = StyleSheet.create({
  bottomPriceText: {
    color: Colors.primary,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text,
    position: "absolute",
    left: ScaleSize.spacing_medium,
    bottom: ScaleSize.spacing_small + 2,
  },
  tabArea: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  tab: {
    width: "100%",
    flex: 1,
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
    resizeMode: "contain",
  },
  dateIconArea: {
    borderRadius: 100,
    backgroundColor: Colors.secondary,
    padding: ScaleSize.spacing_very_small - 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: ScaleSize.font_spacing,
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
    fontSize: TextFontSize.extra_small_text,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  dateAndPriceText: {
    color: Colors.black,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text - 1,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  priceText: {
    color: Colors.primary,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  pendingText: {
    top: Platform.OS === "ios" ? null : ScaleSize.font_spacing - 1,
    fontFamily: AppFonts.medium,
    fontSize: 10,
  },
  pendingArea: {
    position: "absolute",
    borderWidth: ScaleSize.smallest_border_width,
    right: ScaleSize.spacing_small + 5,
    borderRadius: ScaleSize.small_border_radius,
    paddingVertical: Platform.OS === "ios" ? 2 : 1,
    top: ScaleSize.spacing_semi_medium - 1,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
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
  cancelBtn: {
    backgroundColor: Colors.light_orange,
    right: -1,
    bottom: -1,
    borderTopLeftRadius: ScaleSize.very_small_border_radius,
    borderBottomRightRadius: ScaleSize.medium_border_radius - 2,
    borderColor: Colors.lightest_gray,
    paddingHorizontal: ScaleSize.spacing_small + 8,
    paddingVertical: ScaleSize.spacing_very_small,
    position: "absolute",
  },
  cancelBtnText: {
    top: ScaleSize.font_spacing,
    color: Colors.secondary,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text - 2,
  },
  HeaderProfileImageArea: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: ScaleSize.tab_profile_icon - 2,
    width: ScaleSize.tab_profile_icon - 2,
    backgroundColor: Colors.gray,
    borderRadius: ScaleSize.small_border_radius - 4,
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
    borderWidth: 1,
    flex: 0.3,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    height: ScaleSize.spacing_large,
  },
});
