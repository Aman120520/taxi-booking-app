import { StyleSheet, Text, Image, View, ImageBackground } from "react-native";
import React from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Images } from "../../Resources/Images";
import Utils from "../../Helpers/Utils";
import { useSelector } from "react-redux";

const IntracityRideDetailsHeader = ({ navigation }) => {
  const { t } = useTranslation();
  const { intracityAllRideData } = useSelector((state) => state.Intracity);

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.riderDetailsArea}>
        <ImageBackground
          source={Images.profilePlaceholder}
          style={styles.profileImageArea}
        >
          <Image
            source={{ uri: intracityAllRideData?.profile_picture }}
            style={styles.tabProfileImg}
          />
        </ImageBackground>
        <Text style={styles.riderNameText}>
          {intracityAllRideData?.first_name}
        </Text>

        <Text style={styles.genderAndLanguageText}>
          {intracityAllRideData?.communication_language
            ? "(" +
              Utils.getGender(intracityAllRideData?.gender, t) +
              " - " +
              Utils.getCommunicationLanguage(
                intracityAllRideData?.communication_language,
                t
              ) +
              ")"
            : ""}
        </Text>

        <View style={styles.ratingArea}>
          <Image source={Images.date_icon} style={styles.dateIcon} />
          <Text style={styles.dateText}>
            {moment(intracityAllRideData?.date).format(
              "ddd, DD MMM [at] hh:mm A"
            )}
          </Text>
        </View>
        <View style={styles.locationArea}>
          <Image source={Images.seat} style={styles.seatIcon} />
          <Text style={styles.requiredSeatText}>
            {intracityAllRideData?.required_seats} {t("Seats Required")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default IntracityRideDetailsHeader;

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
  dateIcon: {
    height: ScaleSize.medium_icon - 3,
    width: ScaleSize.medium_icon - 3,
    resizeMode: "cover",
    tintColor: Colors.secondary,
    marginVertical: ScaleSize.spacing_very_small,
  },
  seatIcon: {
    height: ScaleSize.large_icon - 2,
    width: ScaleSize.large_icon,
    resizeMode: "cover",
    margin: ScaleSize.spacing_very_small,
  },
  dateText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text - 1,
    top: ScaleSize.font_spacing,
    color: Colors.black,
    left: ScaleSize.spacing_small,
  },
  requiredSeatText: {
    fontFamily: AppFonts.semi_bold,
    top: ScaleSize.font_spacing,
    left: ScaleSize.spacing_minimum,
    fontSize: TextFontSize.small_text - 1,
    color: Colors.black,
  },
  profileImage: {
    height: ScaleSize.small_icon * 2,
    width: ScaleSize.small_icon * 2,
    borderRadius: ScaleSize.very_small_border_radius,
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
});
