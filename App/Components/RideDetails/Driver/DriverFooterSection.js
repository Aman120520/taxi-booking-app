import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../../Resources";
import moment from "moment";
import { AirbnbRating } from "react-native-ratings";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryButton } from "../../Comman";
import { Images } from "../../../Resources/Images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  driverCancelRide,
  completeRide,
  driverIntercityAllRideCancel,
  driverIntercityCancelRideBeforeDeparture,
} from "../../../Actions/Intercity";
import Utils from "../../../Helpers/Utils";
import AlertBox from "../../Comman/AlertBox";

const DriverFooterSection = ({
  navigation,
  getRideData,
  ride_id,
  booking_id,
}) => {
  const dispatch = useDispatch();
  const [showComplete, setShowComplete] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showWarn, setShowWarn] = useState(false);
  const [showCancelAll, setShowCancelAll] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [cancelMsg, setCancelMsg] = useState("");
  const [warnMsg, setWarnMsg] = useState("");
  var dates = moment(intercityAllRideData?.date).format("YYYY/MM/DD");
  var time = moment(intercityAllRideData?.date).format("HH:mm");
  var dateTime = moment(dates + " " + time, "YYYY/MM/DD HH:mm");
  const { t } = useTranslation();
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { intercityAllRideData } = useSelector((state) => state.Intercity);

  //////////// Function for cancel ride /////////////
  const DriverCancelRide = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      const RideId = await AsyncStorage.getItem("@rideId");
      const userRideId = JSON.parse(RideId);
      var body = {
        user_id: UserId,
        ride_id: userRideId,
        total_seats: intercityAllRideData?.total_seat,
      };
      var endPoint = "intercity/driverIntercityCancelRide";
      if (await Utils.isNetworkConnected()) {
        dispatch(
          driverCancelRide(body, endPoint, async (data, isSuccess) => {
            var dates = moment(intercityAllRideData?.date);
            if (isSuccess === true) {
              setShowCancel(false);
              // if (
              //   Utils.isGreaterThanOneHour(dates) &&
              //   intercityAllRideData?.rideBookCount === 0
              // ) {
              //   setSuccessMsg(data.message);
              //   setShowSuccess(true);
              // } else {
              if (
                data?.data?.cancel_status === 1 ||
                data?.data?.cancel_status === "1"
              ) {
                setSuccessMsg(data.message);
                setShowSuccess(true);
              } else if (
                data?.data?.cancel_status === 3 ||
                data?.data?.cancel_status === "3"
              ) {
                setWarnMsg(data?.data?.cancel_model_msg);
                setShowWarn(true);
              } else {
                setCancelMsg(data?.data?.cancel_model_msg);
                setShowCancelAll(true);
              }
              // }
            }
          })
        );
      }
    } catch {}
  };

  //////////// Function for cancel all ride /////////////
  const handleWarn = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      const RideId = await AsyncStorage.getItem("@rideId");
      const userRideId = JSON.parse(RideId);
      var body = {
        user_id: UserId,
        ride_id: userRideId,
        total_seats: intercityAllRideData?.total_seat,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          driverIntercityCancelRideBeforeDeparture(
            body,
            async (data, isSuccess) => {
              if (isSuccess === true) {
                setShowCancelAll(false);
                getRideData();
              }
            }
          )
        );
      }
    } catch {}
  };

  //////////// Function for cancel all ride /////////////
  const handleContinuePressed = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        ride_id: ride_id,
        total_seats: intercityAllRideData?.total_seat,
        booking_id: booking_id,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          driverIntercityAllRideCancel(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setShowCancelAll(false);
              await AsyncStorage.clear();
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "AuthenticationNavigator",
                    state: {
                      routes: [
                        {
                          name: "SignInScreen",
                        },
                      ],
                    },
                  },
                ],
              });
            }
          })
        );
      }
    } catch {}
  };

  ///////////// Function for complete ride ////////////
  const DriverCompleteRide = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        ride_id: JSON.parse(ride_id),
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          completeRide(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setShowComplete(false);
              getRideData();
            }
          })
        );
      }
    } catch {}
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

  const rideDateMinus60Minutes = moment(intercityAllRideData?.date).subtract(
    60,
    "minutes"
  );

  return (
    <>
      {intercityAllRideData?.status === 0 &&
        (Utils.isGreaterThanOneHour(dateTime) ||
        intercityAllRideData?.rideBookCount === 0 ||
        moment().isBefore(rideDateMinus60Minutes) ? (
          <PrimaryButton
            string={t("cancel_ride") + " "}
            customStyle={true}
            buttonStyle={styles.cancelBtn}
            textStyle={styles.cancelBtnText}
            onPress={() => setShowCancel(true)}
          />
        ) : intercityAllRideData?.is_complet_button === 1 &&
          moment(intercityAllRideData?.timezon_date).isAfter(
            moment(intercityAllRideData?.date)
          ) ? (
          <PrimaryButton
            customStyle={true}
            buttonStyle={styles.completeButton}
            textStyle={styles.completeButtonText}
            string={t("complete_ride")}
            onPress={() => setShowComplete(true)}
          />
        ) : null)}

      {intercityAllRideData?.status === 1 &&
        intercityAllRideData?.reviews_rating.length !== 0 &&
        handleReviews()}

      <AlertBox
        visible={showComplete}
        title={"Complete Ride"}
        message={t("complete_ride_alert")}
        positiveBtnText={"Yes"}
        negativeBtnText={"No"}
        onPress={() => {
          setShowComplete(false);
          DriverCompleteRide();
        }}
        onPressNegative={() => setShowComplete(false)}
      />

      <AlertBox
        visible={showCancel}
        title={"Cancel Ride"}
        message={t("cancel_ride_alert")}
        positiveBtnText={"Cancel Ride"}
        negativeBtnText={"Go Back"}
        onPress={() => {
          setShowCancel(false);
          DriverCancelRide();
        }}
        onPressNegative={() => setShowCancel(false)}
      />

      <AlertBox
        visible={showCancelAll}
        title={"Warning ⚠️"}
        message={
          // "At least 1 passenger has booked a seat on this trip and you're cancelling less than 24 hours before departure. All your trips will be cancelled and your account suspended. Contact admin to reactivate."
          // "Multiple trip cancellations with booked passengers may lead to account suspension. We will document this."
          cancelMsg
        }
        positiveBtnText={"Cancel Ride"}
        negativeBtnText={"Go Back"}
        onPress={() => {
          setShowCancelAll(false);
          handleContinuePressed();
        }}
        onPressNegative={() => setShowCancelAll(false)}
      />

      <AlertBox
        visible={showWarn}
        title={"Warning ⚠️"}
        message={warnMsg}
        positiveBtnText={"Cancel Ride"}
        negativeBtnText={"Go Back"}
        onPress={() => {
          setShowWarn(false);
          handleWarn();
        }}
        onPressNegative={() => setShowWarn(false)}
      />

      <AlertBox
        visible={showSuccess}
        title={"Success"}
        message={successMsg}
        positiveBtnText={"Yes"}
        onPress={() => {
          setShowSuccess(false);
          getRideData();
        }}
      />
    </>
  );
};

export default DriverFooterSection;

const styles = StyleSheet.create({
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
  completeButton: {
    width: "90%",
    margin: ScaleSize.spacing_small,
    top: ScaleSize.spacing_small,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    padding: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  completeButtonText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.white,
    fontSize: TextFontSize.small_text,
  },
  reviewArea: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: ScaleSize.spacing_medium,
    paddingTop: ScaleSize.spacing_small,
    paddingBottom: ScaleSize.spacing_medium,
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
  tabImageArea: {
    height: "100%",
    marginHorizontal: ScaleSize.spacing_small - 2,
    marginTop: ScaleSize.spacing_small - 2,
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
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.very_small_text,
  },
  dateText: {
    color: Colors.gray,
    fontSize: TextFontSize.extra_small_text * 0.9,
    fontFamily: AppFonts.medium_italic,
  },
  tabRatingStarsArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    bottom: ScaleSize.spacing_very_small / 2,
  },
  tabRatingStars: {
    alignSelf: "flex-start",
  },
  commentText: {
    color: Colors.gray,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
  },
  completeButton: {
    width: "90%",
    margin: ScaleSize.spacing_small,
    top: ScaleSize.spacing_small,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    padding: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  completeButtonText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.white,
    fontSize: TextFontSize.small_text,
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
  },
});
