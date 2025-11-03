import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  View,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import { useTranslation } from "react-i18next";
import { Images } from "../../Resources/Images";
import Utils from "../../Helpers/Utils";
import { useSelector } from "react-redux";
import BioBox from "../Comman/BioBox";

const RideDetailsHeader = ({
  navigation,
  isFromMyBookings,
  isRider,
  booked_seat,
}) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const bioText = intercityAllRideData?.bio ? intercityAllRideData?.bio : "";

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };
  const { intercityAllRideData, intercityRideBookingData, isLoading } =
    useSelector((state) => state.Intercity);

  function onRatePress() {
    navigation.navigate("RiderReviewScreen", {
      driver_user_id: intercityAllRideData?.driver_id,
    });
  }

  function Label({ icon, title }) {
    return (
      <View style={styles.seatsAndRideDetailsTab}>
        <Image source={icon} style={styles.driveTabIcon} />
        <Text style={styles.seatsAndRideDetailsTabText}>{title}</Text>
      </View>
    );
  }

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.riderDetailsArea}>
        <BioBox
          visible={isExpanded}
          bio={intercityAllRideData?.bio}
          onPressNegative={() => setIsExpanded(false)}
        />
        <ImageBackground
          source={Images.profilePlaceholder}
          style={styles.profileImageArea}
        >
          <Image
            source={{ uri: intercityAllRideData?.profile_picture }}
            style={styles.tabProfileImg}
          />
        </ImageBackground>
        <Text style={styles.riderNameText}>
          {intercityAllRideData?.first_name}
        </Text>

        <Text style={styles.genderAndLanguageText}>
          {intercityAllRideData?.communication_language
            ? "(" +
              Utils.getGender(intercityAllRideData?.gender, t) +
              " - " +
              Utils.getCommunicationLanguage(
                intercityAllRideData?.communication_language,
                t
              ) +
              ")"
            : ""}
        </Text>

        {intercityAllRideData?.bio && (
          <View style={styles.bioContainer}>
            <Text
              style={styles.yourBioText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {intercityAllRideData?.bio}
            </Text>
            {intercityAllRideData?.bio.split(" ").length > 24 && (
              <TouchableOpacity onPress={toggleText}>
                <Text style={styles.showMoreText}>{"Show More"}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.ratingArea}>
          <Image source={Images.rate} style={styles.rateIcon} />
          <TouchableOpacity onPress={onRatePress}>
            <Text style={styles.rateText}>
              {intercityAllRideData?.total_rating?.toFixed(1)}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.locationArea}>
          <Image source={Images.route_icon} style={styles.routeIcon} />
          {!isFromMyBookings || !isRider ? (
            <Text style={styles.destinationText}>
              {intercityAllRideData?.pickup_city} to{" "}
              {intercityAllRideData?.dropoff_city}
            </Text>
          ) : (
            <Text style={styles.destinationText}>
              {intercityRideBookingData?.pickup_city} to{" "}
              {intercityRideBookingData?.dropoff_city}
            </Text>
          )}
        </View>
      </View>

      <View style={styles.seatsAndRideDetailsTabArea}>
        <Label
          icon={Images.driver_icon}
          title={
            (intercityAllRideData?.total_rides
              ? intercityAllRideData?.total_rides
              : "") +
            " " +
            t("rides")
          }
        />
        <View style={styles.seatsAndRideDetailsTab}>
          <Image source={Images.seat} style={styles.seatsTabIcon} />

          <Text style={styles.seatsAndRideDetailsTabText}>
            {isLoading
              ? "Seat Booked"
              : isRider && isFromMyBookings
              ? booked_seat?.length > 1
                ? booked_seat + " " + t("seats_booked")
                : booked_seat + " " + "Seat Booked"
              : intercityAllRideData?.available_seat <= 0
              ? 0
              : intercityAllRideData?.available_seat > 1
              ? intercityAllRideData?.available_seat +
                " " +
                t("seats_available")
              : intercityAllRideData?.available_seat + " " + "Seat Available"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RideDetailsHeader;

const styles = StyleSheet.create({
  riderDetailsArea: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tabProfileImg: {
    height: "100%",
    width: "100%",
    margin: ScaleSize.spacing_small,
    resizeMode: "cover",
    borderRadius: ScaleSize.small_border_radius,
  },
  profileImageArea: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: ScaleSize.tab_profile_icon + 5,
    width: ScaleSize.tab_profile_icon + 5,
    backgroundColor: Colors.gray,
    margin: ScaleSize.spacing_small,
    borderRadius: ScaleSize.small_border_radius,
  },
  riderNameText: {
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.medium_text,
    color: Colors.black,
  },
  genderAndLanguageText: {
    fontSize: TextFontSize.extra_small_text - 2.5,
    color: Colors.black,
    bottom: ScaleSize.spacing_small - 2,
    fontFamily: AppFonts.medium_italic,
  },
  ratingArea: {
    flexDirection: "row",
    alignItems: "center",
    bottom: ScaleSize.spacing_small - 2,
    paddingRight: ScaleSize.spacing_small,
    justifyContent: "center",
  },
  locationArea: {
    flexDirection: "row",
    bottom: ScaleSize.spacing_small - 2,
    alignItems: "center",
    justifyContent: "center",
  },
  rateIcon: {
    height: ScaleSize.medium_icon - 2,
    width: ScaleSize.medium_icon - 2,
    resizeMode: "cover",
    marginVertical: ScaleSize.spacing_very_small,
  },
  routeIcon: {
    height: ScaleSize.large_icon,
    width: ScaleSize.large_icon,
    resizeMode: "cover",
    margin: ScaleSize.spacing_very_small,
  },
  rateText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    top: ScaleSize.font_spacing,
    color: Colors.black,
    left: ScaleSize.spacing_small,
  },
  destinationText: {
    fontFamily: AppFonts.semi_bold,
    left: ScaleSize.spacing_minimum + 2,
    fontSize: TextFontSize.small_text - 1,
    color: Colors.black,
  },
  seatsAndRideDetailsTabArea: {
    flexDirection: "row",
    marginBottom: ScaleSize.spacing_semi_medium - 2,
    marginTop: ScaleSize.spacing_small,
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_small + 2,
    alignItems: "center",
    justifyContent: "center",
  },
  seatsAndRideDetailsTab: {
    flexDirection: "row",
    flex: 0.5,
    height: ScaleSize.spacing_very_large,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ScaleSize.very_small_border_radius,
    marginHorizontal: ScaleSize.spacing_small + 2,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    backgroundColor: Colors.textinput_low_opacity,
  },
  seatsTabIcon: {
    height: ScaleSize.medium_icon - 2,
    width: ScaleSize.medium_icon - 2,
    resizeMode: "cover",
    marginRight: ScaleSize.spacing_very_small,
  },
  driveTabIcon: {
    height: ScaleSize.large_icon + 2,
    width: ScaleSize.extra_large_icon + 2,
    tintColor: Colors.primary,
    resizeMode: "cover",
  },
  seatsAndRideDetailsTabText: {
    top: ScaleSize.font_spacing,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.extra_small_text,
    color: Colors.primary,
  },
  counter: {
    justifyContent: "center",
    alignItems: "center",
    width: ScaleSize.counter_ellipse_icon,
    height: ScaleSize.counter_ellipse_icon,
    resizeMode: "contain",
  },
  profileImage: {
    height: ScaleSize.small_icon * 2,
    width: ScaleSize.small_icon * 2,
    borderRadius: ScaleSize.very_small_border_radius,
  },
  tabArea: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  tab: {
    width: "100%",
    padding: ScaleSize.spacing_small,
    borderWidth: ScaleSize.smallest_border_width,
    marginVertical: ScaleSize.spacing_small,
    borderRadius: ScaleSize.small_border_radius,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  nameText: {
    color: Colors.black,
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.small_text + 2,
  },
  tabIcon: {
    height: ScaleSize.small_icon,
    width: ScaleSize.small_icon,
  },
  bioContainer: {
    flex: 1,
    alignSelf: "center",
    marginBottom: ScaleSize.spacing_small + 2,
    marginTop: ScaleSize.spacing_very_small - 2,
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "center",
  },
  yourBioText: {
    fontFamily: AppFonts.medium,
    textAlign: "center",
    fontSize: TextFontSize.very_small_text - 2.3,
    color: Colors.black,
  },
  showMoreText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.primary,
  },
});
