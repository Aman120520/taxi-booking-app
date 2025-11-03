import {
  StyleSheet,
  Text,
  Vibration,
  Image,
  View,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import React, { useState } from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../../Resources";
import moment from "moment";
import { AirbnbRating } from "react-native-ratings";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getTimeZone } from "react-native-localize";
import { PrimaryButton, PrimaryDropDown, TextButton } from "../../Comman";
import BookNowButton from "../../Intercity/BookNowButton";
import { Images } from "../../../Resources/Images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  intercityBookRide,
  riderCancelBooking,
} from "../../../Actions/Intercity";
import Utils from "../../../Helpers/Utils";
import AlertBox from "../../Comman/AlertBox";

const RiderFooterSection = ({
  isFromMyBookings,
  ride_id,
  booking_id,
  navigation,
  getRideData,
  modalOnpress,
}) => {
  const dispatch = useDispatch();
  const [pickupCityError, setPickupCityError] = useState(false);
  const [dropOffCityError, setDropOffCityError] = useState(false);
  const [pickupCity, setPickupCity] = useState("");
  const [dropOffCity, setDropOffCity] = useState("");
  const [count, setCount] = useState(1);
  const { t } = useTranslation();
  const time_zone = getTimeZone();
  const [showCancel, setShowCancel] = useState(false);
  const [confirmAlert, setConfirmAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { intercityAllRideData, intercityRideBookingData } = useSelector(
    (state) => state.Intercity
  );
  const ONE_SECOND_IN_MS = 1000;

  ////////// Function for Add seat ///////////
  const handleAddSeatButton = () => {
    if (count < intercityAllRideData?.available_seat) {
      setCount(count + 1);
    }
  };

  ///////////// Function for Book Button //////////
  const handleBookNow = async () => {
    try {
      var isValid = true;
      if (Utils.isNull(pickupCity)) {
        isValid = false;
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
        setPickupCityError(t("blank_field_error"));
      } else {
        setPickupCityError(null);
      }
      if (Utils.isNull(dropOffCity)) {
        isValid = false;
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
        setDropOffCityError(t("blank_field_error"));
      } else {
        setDropOffCityError(null);
      }
      if (isValid) {
        const UserId = await AsyncStorage.getItem("@id");
        var date = moment(intercityAllRideData?.date).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        var body = {
          ride_id: ride_id,
          user_id: UserId,
          pickup_address_id: pickupCity.id,
          dropoff_address_id: dropOffCity.id,
          total_seats: count,
          time_zone: time_zone,
          ride_date: date,
        };
        if (await Utils.isNetworkConnected()) {
          dispatch(
            intercityBookRide(body, (data, isSuccess) => {
              if (isSuccess === true) {
                RedirectRideBookingDetails(data);
              }
            })
          );
        }
      }
    } catch {}
  };

  function RedirectRideBookingDetails(data) {
    navigation.navigate("RiderBookingDetails", {
      ride_id: ride_id,
      isAdditionalPickupAddress: pickupCity.id === 0 ? false : true,
      isAdditionalDropoffAddress: dropOffCity.id === 0 ? false : true,
      pickup_address_id: pickupCity.id,
      dropoff_address_id: dropOffCity.id,
      total_seats: count,
      available_seat: intercityAllRideData?.available_seat,
      time_zone: time_zone,
      ride_date: moment(intercityAllRideData?.date).format(
        "YYYY-MM-DD HH:mm:ss"
      ),
    });
  }

  ////////// Function for render review Items //////////
  const renderReviewItem = ({ item, index }) => {
    return (
      <View style={styles.reviewTabArea}>
        <View style={styles.reviewTab}>
          <View style={styles.tabImageArea}>
            <Image
              source={{ uri: item.profile_picture }}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.tabTextArea}>
            <View style={styles.nameAndDateTextArea}>
              <Text style={styles.reviewerNameText}>{item.first_name}</Text>
              <Text style={styles.dateText}>{item.post_date}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <AirbnbRating
                count={intercityAllRideData?.rating}
                selectedColor={Colors.secondary}
                starImage={Images.active_star}
                starContainerStyle={styles.tabRatingStars}
                showRating={false}
                ratingContainerStyle={styles.tabRatingStarsArea}
                defaultRating={item.rating}
                size={ScaleSize.small_icon / 1.5}
                isDisabled={true}
              />
              <Text
                style={[
                  styles.commentText,
                  {
                    position: "absolute",
                    left: (ScaleSize.small_icon / 1.5) * 7.3,
                    bottom: 0,
                  },
                ]}
              >
                {"(" + item?.rating.toFixed(1) + ")"}
              </Text>
            </View>
            <Text style={styles.commentText}>{item.review}</Text>
          </View>
        </View>
      </View>
    );
  };

  //////////// Function for handle Reivews ////////////
  const handleReviews = () => {
    return (
      <View style={styles.reviewArea}>
        <Text style={styles.titleBarText}>{t("ride_review")}</Text>
        <FlatList
          style={styles.reviewFlatList}
          data={
            showAllReviews
              ? intercityAllRideData?.reviews_rating
              : intercityAllRideData?.reviews_rating.slice(0, 2)
          }
          renderItem={renderReviewItem}
        />
        {!showAllReviews && (
          <TouchableOpacity onPress={() => setShowAllReviews(true)}>
            <Text style={styles.seeAllReviewBtnText}>
              {t("see_all_review")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  //////////// Function for Dropdown ////////////
  function HandlePickupAdressDropDown() {
    const pickupAddresses = intercityAllRideData?.pickupAddress || [];
    const allPickupAddresses = [
      { id: 0, address: intercityAllRideData?.pickup_address },
      ...pickupAddresses,
    ];
    return (
      <PrimaryDropDown
        data={allPickupAddresses}
        value={pickupCity}
        source={Images.location_icon}
        isCustom={true}
        error={pickupCityError}
        renderItem={(selectedItem) => selectedItem && selectedItem.address}
        string={pickupCity ? pickupCity.address : t("pickup_address")}
        selectedId={pickupCity.id}
        onSelect={(selectedItem) => {
          setPickupCity(selectedItem);
          setPickupCityError(null);
        }}
      />
    );
  }

  function HandleDropoffAdressDropDown() {
    const dropoffAddresses = intercityAllRideData?.dropoffAddress || [];
    const allDropoffAddresses = [
      { id: 0, address: intercityAllRideData?.dropoff_address },
      ...dropoffAddresses,
    ];
    return (
      <PrimaryDropDown
        data={allDropoffAddresses}
        isCustom={true}
        value={dropOffCity}
        error={dropOffCityError}
        source={Images.location_icon}
        renderItem={(selectedItem) => selectedItem && selectedItem.address}
        string={dropOffCity ? dropOffCity.address : t("drop_off_address")}
        selectedId={dropOffCity.id}
        onSelect={(selectedItem) => {
          setDropOffCity(selectedItem);
          setDropOffCityError(null);
        }}
      />
    );
  }

  /////////// Function for cancel booking ///////////
  const RiderCancelBooking = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        booking_id: booking_id,
        is_cancle: 0,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          riderCancelBooking(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setShowCancel(true);
              setAlertMsg(
                data?.message
                // "You’re cancelling a trip less than 24 hours before departure. You’ll receive a 50% refund minus late cancellation fee."
              );
            }
          })
        );
      }
    } catch {}
  };

  const RiderContinuePressed = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        booking_id: booking_id,
        is_cancle: 1,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          riderCancelBooking(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setShowCancel(false);
              getRideData();
            }
          })
        );
      }
    } catch {}
  };

  return !isFromMyBookings ? (
    <>
      {intercityAllRideData?.available_seat <= 0 ? null : (
        <>
          <Text
            style={[
              styles.titleBarText,
              {
                paddingLeft: ScaleSize.spacing_medium,
                alignSelf: "flex-start",
                marginTop: ScaleSize.spacing_small,
              },
            ]}
          >
            {t("seat_booking")}
          </Text>
          <View style={styles.dropDownContianer}>
            {intercityAllRideData && intercityAllRideData?.pickupAddress ? (
              <HandlePickupAdressDropDown />
            ) : null}
            {/* {pickupCityError ? (
              <View style={styles.errorTextArea}>
                <Text style={styles.errorText}>{pickupCityError}</Text>
              </View>
            ) : null} */}
          </View>
          <View style={styles.dropDownContianer}>
            {intercityAllRideData && intercityAllRideData?.dropoffAddress ? (
              <HandleDropoffAdressDropDown />
            ) : null}
            {/* {dropOffCityError ? (
              <View style={styles.errorTextArea}>
                <Text style={styles.errorText}>{dropOffCityError}</Text>
              </View>
            ) : null} */}
          </View>
          <View style={styles.counterTabArea}>
            <View style={styles.counterTab}>
              <TextButton
                source={Images.counter_minus}
                iconStyle={styles.minusText}
                buttonStyle={styles.plusMinusBtn}
                onPress={() => setCount(count < 2 ? 1 : count - 1)}
              />
              <ImageBackground source={Images.counterBg} style={styles.counter}>
                <Text style={styles.counterText}>{count}</Text>
              </ImageBackground>
              <TextButton
                source={Images.counter_plus}
                iconStyle={styles.plusText}
                onPress={handleAddSeatButton}
                buttonStyle={styles.plusMinusBtn}
              />
            </View>
          </View>
          <BookNowButton Count={count} onPress={handleBookNow} />
        </>
      )}
    </>
  ) : (
    <>
      {intercityRideBookingData?.status === 1 ? (
        Utils.isGreaterThanOneHour(intercityRideBookingData?.pickup_date) && (
          <PrimaryButton
            string={t("cancel_bookings")}
            customStyle={true}
            buttonStyle={styles.cancelBtn}
            textStyle={styles.cancelBtnText}
            onPress={RiderCancelBooking}
          />
        )
      ) : intercityRideBookingData?.status === 2 &&
        intercityAllRideData?.is_review !== 1 ? (
        <PrimaryButton
          customStyle={true}
          buttonStyle={styles.addReviewBtn}
          textStyle={styles.addReviewBtnText}
          string={t("add_review")}
          onPress={modalOnpress}
        />
      ) : intercityAllRideData?.is_review === 1 ? (
        handleReviews()
      ) : null}

      <AlertBox
        visible={showCancel}
        title={"Warning ⚠️"}
        message={alertMsg}
        positiveBtnText={"Cancel Ride"}
        negativeBtnText={"Go Back"}
        onPress={() => {
          setShowCancel(false);
          RiderContinuePressed();
        }}
        onPressNegative={() => setShowCancel(false)}
      />

      <AlertBox
        visible={confirmAlert}
        title={"Cancel Ride"}
        message={alertMsg}
        positiveBtnText={"Cancel Ride"}
        negativeBtnText={"Go Back"}
        onPress={() => {
          setConfirmAlert(false);
          getRideData();
        }}
        onPressNegative={() => setConfirmAlert(false)}
      />
    </>
  );
};

export default RiderFooterSection;

const styles = StyleSheet.create({
  seeAllReviewBtnText: {
    color: Colors.primary,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.small_text,
  },
  reviewFlatList: {
    flex: 1,
    width: "100%",
    paddingBottom: ScaleSize.spacing_small,
  },
  reviewArea: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: ScaleSize.spacing_medium,
  },
  profileImage: {
    height: ScaleSize.small_icon * 2,
    width: ScaleSize.small_icon * 2,
    borderRadius: ScaleSize.very_small_border_radius,
  },
  reviewTabArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewTab: {
    width: "100%",
    flexDirection: "row",
    margin: ScaleSize.spacing_small,
    borderColor: Colors.gray,
    borderWidth: ScaleSize.smallest_border_width,
    padding: ScaleSize.spacing_small + 2,
    borderRadius: ScaleSize.small_border_radius,
  },
  reviewTabArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewTab: {
    width: "100%",
    flexDirection: "row",
    margin: ScaleSize.spacing_small,
    borderColor: Colors.gray,
    borderWidth: ScaleSize.smallest_border_width,
    padding: ScaleSize.spacing_small + 2,
    borderRadius: ScaleSize.small_border_radius,
  },
  tabImageArea: {
    height: "100%",
    marginHorizontal: ScaleSize.spacing_small - 2,
  },
  tabTextArea: {
    paddingHorizontal: ScaleSize.spacing_small,
    height: "100%",
    width: "85%",
  },
  nameAndDateTextArea: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  reviewerNameText: {
    color: Colors.black,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text,
  },
  dateText: {
    color: Colors.gray,
    fontSize: TextFontSize.extra_small_text,
    fontFamily: AppFonts.medium_italic,
  },
  tabRatingStarsArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    bottom: ScaleSize.spacing_very_small,
  },
  tabRatingStars: {
    alignSelf: "flex-start",
  },
  commentText: {
    color: Colors.gray,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
  },
  counterTabArea: {
    alignSelf: "flex-start",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: ScaleSize.spacing_medium,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  counterTab: {
    alignItems: "center",
    left: ScaleSize.spacing_very_small,
    height: ScaleSize.spacing_very_large,
    justifyContent: "space-between",
    borderRadius: ScaleSize.primary_border_radius,
    paddingHorizontal: ScaleSize.spacing_small,
    flexDirection: "row",
    backgroundColor: Colors.textinput_low_opacity,
  },
  minusText: {
    height: ScaleSize.small_icon,
    width: ScaleSize.small_icon,
    top: ScaleSize.spacing_small,
  },
  counter: {
    justifyContent: "center",
    alignItems: "center",
    width: ScaleSize.counter_ellipse_icon,
    height: ScaleSize.counter_ellipse_icon,
    resizeMode: "contain",
  },
  counterText: {
    color: Colors.white,
    fontSize: TextFontSize.medium_text,
    fontFamily: AppFonts.bold,
    top: ScaleSize.font_spacing,
  },
  plusText: {
    height: ScaleSize.small_icon,
    width: ScaleSize.small_icon,
    top: ScaleSize.spacing_small,
  },
  plusMinusBtn: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_semi_medium,
  },
  cancelBtn: {
    width: "92%",
    marginTop: ScaleSize.spacing_small,
    marginBottom: ScaleSize.spacing_very_small,
    alignSelf: "center",
    padding: ScaleSize.spacing_semi_medium,
    borderColor: Colors.gray,
    borderWidth: 2,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.gray,
    fontSize: TextFontSize.small_text,
  },
  addReviewBtn: {
    width: "90%",
    margin: ScaleSize.spacing_small,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    padding: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  addReviewBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.white,
    fontSize: TextFontSize.small_text,
  },
  dropDownContianer: {
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "center",
  },
  errorTextArea: {
    flexDirection: "row",
    justifyContent: "flex-start",
    bottom: ScaleSize.spacing_very_small,
    paddingLeft: ScaleSize.spacing_medium + 2,
  },
  errorText: {
    fontFamily: AppFonts.medium,
    color: Colors.red,
    alignSelf: "flex-start",
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
  },
});
