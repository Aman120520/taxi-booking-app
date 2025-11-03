import {
  StyleSheet,
  Text,
  View,
  Linking,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import Utils from "../../../Helpers/Utils";
import moment from "moment";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { driverCancelBooking } from "../../../Actions/Intercity";
import { useTranslation } from "react-i18next";
import AlertBox from "../../Comman/AlertBox";
import BioBox from "../../Comman/BioBox";

const BookedRideList = ({ intercityAllRideData, getRideData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [showCancel, setShowCancel] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [bio, setBio] = useState("");

  const toggleText = (index) => {
    setIsExpanded(!isExpanded);
  };

  //////////// Function for remove rider ///////////
  const handleRemoveRider = async (id) => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        booking_id: id,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          driverCancelBooking(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setShowCancel(false);
              setSuccessMsg(data.message);
              setShowSuccess(true);
            }
          })
        );
      }
    } catch {}
  };

  //////////// Flatlist RenderItem /////////////
  const renderItem = ({ item, index }) => {
    var dates = moment(intercityAllRideData?.date).format("YYYY/MM/DD");
    var time = moment(intercityAllRideData?.date).format("HH:mm");
    var dateTime = moment(dates + " " + time, "YYYY/MM/DD HH:mm");

    /////////// Function for call ///////////
    const handleCallPress = () => {
      Linking.openURL(`tel:${item.phone_number}`);
    };

    return (
      <View style={styles.tabArea}>
        <View style={styles.tab}>
          <View style={styles.tabImageAndTextArea}>
            <ImageBackground
              source={Images.profilePlaceholder}
              style={styles.profileImageArea}
            >
              <Image
                source={{ uri: item.profile_picture }}
                style={styles.tabProfileImg}
              />
            </ImageBackground>
            <View style={styles.textArea}>
              <Text style={styles.nameText}>{item.first_name}</Text>
              <View style={{ flexDirection: "row" }}>
                <Image style={styles.tabIcon} source={Images.seat} />
                <Text style={styles.seatBookedText}>
                  {item.booked_seat} {item.booked_seat > 1 ? "seats" : "seat"}{" "}
                  booked
                </Text>
              </View>
            </View>

            {intercityAllRideData?.status !== 1 && (
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => handleCallPress()}
              >
                <Image
                  source={Images.phone_number_icon}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            )}

            {item.status === 1 &&
              intercityAllRideData?.status === 0 &&
              Utils.isGreaterThanOneHour(dateTime) && (
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setShowCancel(true)}
                >
                  <Image source={Images.close_icon} style={styles.closeIcon} />
                </TouchableOpacity>
              )}
          </View>

          <AlertBox
            visible={showCancel}
            title={"Cancel Ride"}
            message={t("cancel_ride_alert")}
            positiveBtnText={"Cancel Ride"}
            negativeBtnText={"Go Back"}
            onPress={() => {
              setShowCancel(false);
              handleRemoveRider(item.id);
            }}
            onPressNegative={() => setShowCancel(false)}
          />

          <View style={styles.tabPickupDropAddressArea}>
            <Text style={styles.tabTitleBarText}>{t("bio")}</Text>
            <Text
              style={styles.tabDescriptionText}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item?.bio}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setBio(item?.bio);
                toggleText();
              }}
            >
              <Text style={styles.showMoreText}>Show More</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabPickupDropAddressArea}>
            {intercityAllRideData?.status !== 1 && (
              <Text style={styles.tabTitleBarText}>
                {t("phone_no")}{" "}
                <Text style={styles.tabDescriptionText}>
                  {item.phone_number}
                </Text>
              </Text>
            )}
            <Text style={styles.tabDescriptionText}>
              {Utils.getGender(item.gender, t)}
            </Text>
            <Text style={styles.tabDescriptionText}>
              {Utils.getCommunicationLanguage(item?.communication_language, t)}
            </Text>
          </View>

          <View style={styles.tabPickupDropAddressArea}>
            <View style={styles.tabPickupAddressTitleBar}>
              <Text style={styles.tabTitleBarText}>{t("pickup_address")}</Text>
              <Text style={styles.tabPriceText}>
                {t("price")}: ${item.driver_fee}
              </Text>
            </View>
            <Text style={styles.tabDescriptionText}>{item.pickup_address}</Text>
          </View>

          <View style={styles.tabPickupDropAddressArea}>
            <Text style={styles.tabTitleBarText}>{t("drop_off_address")}</Text>
            <Text style={styles.tabDescriptionText}>
              {item.dropoff_address}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <FlatList
        style={styles.flatlist}
        data={intercityAllRideData?.riderList}
        renderItem={renderItem}
        ListHeaderComponent={
          intercityAllRideData?.riderList?.length === 0 ? null : (
            <Text style={[styles.titleBarText, { width: "100%" }]}>
              {intercityAllRideData?.riderList ? t("rider_details") : null}
            </Text>
          )
        }
        keyExtractor={(item, index) => index}
      />
      <AlertBox
        visible={showSuccess}
        title={"Success"}
        message={successMsg}
        positiveBtnText={"Ok"}
        onPress={() => {
          setShowSuccess(false);
          getRideData();
        }}
      />
      <BioBox
        visible={isExpanded}
        bio={bio}
        onPressNegative={() => setIsExpanded(false)}
      />
    </>
  );
};

export default BookedRideList;

const styles = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
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
    borderRadius: ScaleSize.small_border_radius * 1.2,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  tabImageAndTextArea: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  textArea: {
    flex: 1,
    marginHorizontal: ScaleSize.spacing_small,
    alignItems: "flex-start",
  },
  nameText: {
    color: Colors.black,
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.small_text + 2,
  },
  tabIcon: {
    height: ScaleSize.small_icon * 0.9,
    width: ScaleSize.small_icon * 0.9,
  },
  seatBookedText: {
    color: Colors.black,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  closeBtn: {
    padding: ScaleSize.spacing_small,
    right: ScaleSize.spacing_small,
    borderRadius: 5,
    marginLeft: ScaleSize.spacing_small,
    backgroundColor: Colors.textinput_low_opacity,
    bottom: ScaleSize.spacing_semi_medium,
  },
  closeIcon: {
    height: ScaleSize.very_small_icon + 2,
    width: ScaleSize.very_small_icon + 2,
  },
  tabPickupAddressTitleBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabPickupDropAddressArea: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_small,
    marginVertical: ScaleSize.spacing_very_small / 2,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  TabPickupAddressTitleBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tabTitleBarText: {
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.very_small_text - 1,
    color: Colors.black,
  },
  tabDescriptionText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text - 1,
    color: Colors.black,
  },
  tabPriceText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text - 3,
    color: Colors.black,
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
  pickupDropAddressArea: {
    flex: 1,
    alignSelf: "flex-start",
    marginVertical: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
  },
  showMoreText: {
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.very_small_text - 1,
    color: Colors.primary,
  },
});
