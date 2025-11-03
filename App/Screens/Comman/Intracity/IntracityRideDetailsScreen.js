import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  SafeAreaView,
  BackHandler,
  TouchableOpacity,
  Linking,
  RefreshControl,
  ImageBackground,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  Header,
  DirectionMapView,
  ModalProgressLoader,
  PrimaryButton,
} from "../../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { AirbnbRating } from "react-native-ratings";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  acceptRide,
  cancelRide,
  completeRide,
  getIntracityRideDetails,
  startRide,
} from "../../../Actions/Intracity";
import { useTranslation } from "react-i18next";
import Utils from "../../../Helpers/Utils";
import VehicleDetailsArea from "../../../Components/Intercity/VehicleDetailsArea";
import AddressRenderItems from "../../../Components/RideDetails/AddressRenderItems";
import RideRatingPopup from "../RideRatingPopup";
import IntracityRideDetailsHeader from "../../../Components/RideDetails/IntracityRideDetailsHeader";
import { userDetails } from "../../../Actions/authentication";
import AlertBox from "../../../Components/Comman/AlertBox";

const IntracityRideDetailsScreen = ({ navigation, route }) => {
  /////////// States ///////////
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.Authentication);
  const [refreshingData, setRefreshingData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(false);
  const [alertTitle, setAlertTitle] = useState(false);
  const [functionType, setFunctionType] = useState(false);

  const { t } = useTranslation();
  const backHandlerRef = useRef(null);
  const { intracityAllRideData, isLoading } = useSelector(
    (state) => state.Intracity
  );
  const { isFromMyBookings, isFromNotification, booking_id, isRider, is_bold } =
    route.params || {};

  //////////////// useEffect ////////////////
  useFocusEffect(
    React.useCallback(() => {
      getRideData();
    }, [])
  );

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
      if (isFromNotification) {
        getUserData();
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackBtn
    );
    return backHandler;
  };

  const getUserData = async () => {
    const UserId = await AsyncStorage.getItem("@id");
    var body = {
      user_id: UserId,
    };
    dispatch(
      userDetails(body, async (data, isSuccess) => {
        if (isSuccess === true) {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "BottomTabNavigator",
                screen: "DriverIntercityHomeScreen",
              },
            ],
          });
        }
      })
    );
  };

  /////////// Function for fetch ride details ///////////
  const getRideData = async () => {
    try {
      const RideId = await AsyncStorage.getItem("@rideId");
      const userRideId = JSON.parse(RideId);
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        ride_id: userRideId,
        user_id: UserId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          getIntracityRideDetails(body, async (data, isSuccess) => {
            setRefreshingData(false);
            if (isSuccess === true) {
            }
          })
        );
      }
    } catch {}
  };

  /////////// Function for refresh //////////
  const refresh = () => {
    setRefreshingData(true);
    getRideData();
  };

  /////////// Function for call ///////////
  const handleCallPress = () => {
    Linking.openURL(
      `tel:${
        isRider
          ? intracityAllRideData?.driverDetails?.phone_number
          : intracityAllRideData?.phone_number
      }`
    );
  };

  //////////// Function for cancel ride /////////////
  const handleCancelRide = async () => {
    try {
      const RideId = await AsyncStorage.getItem("@rideId");
      const userRideId = JSON.parse(RideId);
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        ride_id: userRideId,
      };
      var endPoint = isRider
        ? "intracity/cancelRideByRider"
        : "intracity/cancelRideByDriver";
      if (await Utils.isNetworkConnected()) {
        dispatch(
          cancelRide(body, endPoint, async (data, isSuccess) => {
            if (isSuccess === true) {
              setShowAlert(false);
              getRideData();
            }
          })
        );
      }
    } catch {}
  };

  //////////// Function for cancel ride /////////////
  const handleAcceptRide = async () => {
    try {
      const RideId = await AsyncStorage.getItem("@rideId");
      const userRideId = JSON.parse(RideId);
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        ride_id: userRideId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          acceptRide(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setShowAlert(false);
              getRideData();
            }
          })
        );
      }
    } catch {}
  };

  //////////// Function for cancel ride /////////////
  const handleStartRide = async () => {
    try {
      const RideId = await AsyncStorage.getItem("@rideId");
      const userRideId = JSON.parse(RideId);
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        ride_id: userRideId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          startRide(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setShowAlert(false);
              getRideData();
            }
          })
        );
      }
    } catch {}
  };

  //////////// Function for complete ride /////////////
  const handleCompleteRide = async () => {
    try {
      const RideId = await AsyncStorage.getItem("@rideId");
      const userRideId = JSON.parse(RideId);
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        ride_id: userRideId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          completeRide(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setShowAlert(false);
              getRideData();
            }
          })
        );
      }
    } catch {}
  };

  function getActionButton() {
    if (intracityAllRideData?.timezon_date) {
      const timeZoneMoment = moment(
        intracityAllRideData?.timezon_date,
        "YYYY-MM-DD HH:mm:ss"
      );
      const currentDateTime = timeZoneMoment.clone().add(10, "minutes");
      const formattedDateTime = currentDateTime.format("YYYY-MM-DD HH:mm:ss");
      const startTimeMoment = timeZoneMoment.clone().subtract(10, "minutes");
      const formattedStartTime = startTimeMoment.format("YYYY-MM-DD HH:mm:ss");

      if (
        intracityAllRideData?.status === 3 &&
        intracityAllRideData?.is_review === 0
      ) {
        return {
          title: t("add_review"),
          onPress: () => setModalVisible(true),
        };
      } else {
        if (isRider) {
          if (
            intracityAllRideData?.status === 0 ||
            intracityAllRideData?.status === 1
          ) {
            if (moment(intracityAllRideData?.date).isAfter(formattedDateTime)) {
              return {
                title: t("cancel_ride"),
                isCancelBtn: true,
                onPress: () => {
                  setAlertMsg(t("cancel_ride_alert"));
                  setAlertTitle("Cancel Ride");
                  setShowAlert(true);
                  setFunctionType(0);
                },
              };
            }
          }
        } else if (intracityAllRideData?.status === 2) {
          return {
            title: t("complete_ride"),
            onPress: () => {
              setAlertMsg(t("complete_ride_alert"));
              setAlertTitle("Complete Ride");
              setShowAlert(true);
              setFunctionType(1);
            },
          };
        } else if (intracityAllRideData?.status === 1 && formattedDateTime) {
          if (moment(intracityAllRideData?.date).isAfter(formattedDateTime)) {
            return {
              title: t("cancel_ride"),
              isCancelBtn: true,
              onPress: () => {
                setAlertMsg(t("cancel_ride_alert"));
                setAlertTitle("Cancel Ride");
                setShowAlert(true);
                setFunctionType(0);
              },
            };
          } else if (
            formattedStartTime &&
            formattedDateTime &&
            moment(formattedStartTime).isBefore(formattedDateTime)
          ) {
            return {
              title: t("start_ride"),
              onPress: () => {
                setAlertMsg(t("start_ride_alert"));
                setAlertTitle("Start Ride");
                setShowAlert(true);
                setFunctionType(2);
              },
            };
          }
        } else if (intracityAllRideData?.status === 0) {
          if (moment(intracityAllRideData?.date).isAfter(timeZoneMoment)) {
            return {
              title: t("accept_ride"),
              onPress: () => {
                setAlertMsg(t("accept_ride_alert"));
                setAlertTitle("Accept Ride");
                setShowAlert(true);
                setFunctionType(3);
              },
            };
          }
        }
      }
      return null;
    } else {
      return null;
    }
  }

  const getFunction = () => {
    if (functionType === 0) {
      return handleCancelRide();
    } else if (functionType === 1) {
      return handleCompleteRide();
    } else if (functionType === 2) {
      return handleStartRide();
    } else if (functionType === 3) {
      return handleAcceptRide();
    }
  };

  function Footer() {
    var actionButton = getActionButton();
    if (actionButton) {
      return (
        <PrimaryButton
          customStyle={true}
          buttonStyle={
            actionButton.isCancelBtn ? styles.cancelBtn : styles.completeButton
          }
          textStyle={
            actionButton.isCancelBtn
              ? styles.cancelBtnText
              : styles.completeButtonText
          }
          string={actionButton.title}
          onPress={actionButton.onPress}
        />
      );
    }
  }

  function DriverDetails() {
    return (
      <>
        <Text
          style={[
            styles.titleBarText,
            { alignSelf: "flex-start", left: ScaleSize.spacing_medium },
          ]}
        >
          {t("Driver Details")}
        </Text>
        <View style={styles.riderDetailsTabArea}>
          <View style={styles.riderDetailsTab}>
            <ImageBackground
              source={Images.profilePlaceholder}
              style={styles.profileImageArea}
            >
              <Image
                source={{
                  uri: intracityAllRideData?.driverDetails?.profile_picture,
                }}
                style={styles.tabProfileImg}
              />
            </ImageBackground>
            <View style={styles.riderDetailsTextArea}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.driverNameText}>
                  {intracityAllRideData?.driverDetails?.first_name}
                </Text>

                <Text style={styles.genderAndLanguageText}>
                  {intracityAllRideData?.driverDetails?.communication_language
                    ? "(" +
                      Utils.getGender(
                        intracityAllRideData?.driverDetails?.gender,
                        t
                      ) +
                      " - " +
                      Utils.getCommunicationLanguage(
                        intracityAllRideData?.driverDetails
                          ?.communication_language,
                        t
                      ) +
                      ")"
                    : ""}
                </Text>
              </View>
              <Text style={styles.phoneNoHeading}>
                {t("phone_no")}
                <Text style={styles.phoneNo}>
                  {intracityAllRideData?.driverDetails?.phone_number}
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </>
    );
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
                count={intracityAllRideData?.rating}
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
            showAllReviews && !isFromNotification
              ? intracityAllRideData?.reviews_rating
              : intracityAllRideData?.reviews_rating.slice(0, 2)
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

  const handleBackBtn = () => {
    if (isFromNotification) {
      getUserData();
    } else {
      navigation.goBack();
    }
  };

  const actionButton = getActionButton();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingBottom: 80,
        height: "100%",
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          paddingHorizontal: ScaleSize.spacing_small,
          backgroundColor: Colors.white,
        }}
      >
        <Header
          title={t("ride_details")}
          source={
            intracityAllRideData?.status === 0 ||
            intracityAllRideData?.status === 4
              ? null
              : Images.phone_number_icon
          }
          onPressCall={handleCallPress}
          goBack={() => handleBackBtn()}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={true}
          refreshControl={
            <RefreshControl refreshing={refreshingData} onRefresh={refresh} />
          }
        >
          <ModalProgressLoader visible={isLoading} />

          {/* Direction MapView */}
          <View style={styles.mapView}>
            {intracityAllRideData && intracityAllRideData?.pickup_latitude && (
              <DirectionMapView data={intracityAllRideData} />
            )}
          </View>

          {/* Ride Details */}
          <IntracityRideDetailsHeader
            isFromMyBookings={isFromMyBookings}
            isRider={isRider}
            navigation={navigation}
          />

          <AddressRenderItems
            title={t("pickup_address")}
            value={intracityAllRideData?.pickup_address}
            pickupCitySearchText={is_bold ? pickupCitySearchText : ""}
            dropOffCitySearchText={is_bold ? dropOffCitySearchText : ""}
            date={intracityAllRideData?.date}
          />

          <AddressRenderItems
            title={t("drop_off_address")}
            value={intracityAllRideData?.dropoff_address}
            pickupCitySearchText={is_bold ? pickupCitySearchText : ""}
            dropOffCitySearchText={is_bold ? dropOffCitySearchText : ""}
            date={intracityAllRideData?.approx_dropoff_time}
            price={
              isRider
                ? intracityAllRideData?.total_price
                : intracityAllRideData?.driver_payout
            }
          />

          {/* Render Trip Details */}
          {intracityAllRideData?.trip_details && (
            <View style={styles.pickupDropAddressArea}>
              <Text style={styles.titleBarText}>{t("trip_details")}</Text>
              <Text style={styles.descriptionText}>
                {intracityAllRideData?.trip_details}
              </Text>
            </View>
          )}

          {/* Render Driver Details */}
          {isRider &&
            intracityAllRideData?.status !== 0 &&
            intracityAllRideData?.driverDetails &&
            intracityAllRideData?.driverDetails?.car_images && (
              <DriverDetails />
            )}

          {/* Render Car Images */}
          {isRider &&
            intracityAllRideData?.status !== 0 &&
            intracityAllRideData?.driverDetails &&
            intracityAllRideData?.driverDetails?.car_images && (
              <VehicleDetailsArea data={intracityAllRideData?.driverDetails} />
            )}

          {/* Render Footer */}
          <Footer />

          {/* Render Rating Popuop */}
          <RideRatingPopup
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            isRider={isRider}
            isIntracity={true}
            booking_id={booking_id}
            getRideData={() => getRideData()}
          />

          {/* Render Reviews */}
          {intracityAllRideData?.is_review === 0 ? null : handleReviews()}

          <AlertBox
            visible={showAlert}
            title={alertTitle}
            message={alertMsg}
            positiveBtnText={"Yes"}
            negativeBtnText={"No"}
            onPress={() => {
              setShowAlert(false);
              getFunction();
            }}
            onPressNegative={() => setShowAlert(false)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default IntracityRideDetailsScreen;

const styles = StyleSheet.create({
  mapView: {
    width: "90%",
    height: ScaleSize.spacing_extra_large * 4,
    overflow: "hidden",
    backgroundColor: Colors.light_gray,
    margin: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.medium_border_radius,
  },
  modal: {
    width: "100%",
    borderTopLeftRadius: ScaleSize.small_border_radius,
    borderTopRightRadius: ScaleSize.small_border_radius,
    justifyContent: "center",
    alignItems: "center",
    padding: ScaleSize.spacing_medium,
    backgroundColor: Colors.white,
  },
  ratingStarsArea: {
    justifyContent: "space-between",
  },
  ratingStars: {
    width: "65%",
    justifyContent: "space-between",
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_small - 3,
    alignItems: "center",
  },
  backBtn: {
    position: "absolute",
    left: ScaleSize.spacing_medium,
  },
  tabProfileImg: {
    height: "100%",
    width: "100%",
    margin: ScaleSize.spacing_small,
    resizeMode: "cover",
    borderRadius: ScaleSize.small_border_radius - 5,
  },
  profileImageArea: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: ScaleSize.tab_profile_icon + 5,
    width: ScaleSize.tab_profile_icon + 5,
    backgroundColor: Colors.gray,
    margin: ScaleSize.spacing_small,
    borderRadius: ScaleSize.small_border_radius - 5,
  },
  genderAndLanguageText: {
    fontSize: TextFontSize.extra_small_text - 2.5,
    color: Colors.black,
    left: ScaleSize.spacing_small,
    fontFamily: AppFonts.medium_italic,
  },
  pickupDropAddressArea: {
    flex: 1,
    alignSelf: "flex-start",
    marginVertical: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  pickupAddressTitleBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
  },
  btnArea: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    top: ScaleSize.spacing_very_small,
    marginVertical: ScaleSize.spacing_small,
    justifyContent: "space-between",
    paddingHorizontal: ScaleSize.spacing_medium,
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
  tabPickupAddressTitleBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  TabPickupAddressTitleBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  riderDetailsTabArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: ScaleSize.spacing_small,
  },
  riderDetailsTab: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: ScaleSize.spacing_minimum,
    borderRadius: ScaleSize.very_small_border_radius,
    backgroundColor: Colors.textinput_low_opacity,
    borderColor: Colors.primary,
    width: "95%",
  },
  riderDetailsTextArea: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  driverNameText: {
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
    paddingLeft: ScaleSize.spacing_small,
  },
  phoneNoHeading: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text,
    color: Colors.black,
    bottom: ScaleSize.spacing_very_small - 1,
    paddingLeft: ScaleSize.spacing_small,
  },
});
