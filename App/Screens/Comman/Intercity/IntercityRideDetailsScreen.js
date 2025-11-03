import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  SafeAreaView,
  Linking,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useState, memo } from "react";
import {
  Header,
  DirectionMapView,
  ModalProgressLoader,
} from "../../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import RiderFooterSection from "../../../Components/RideDetails/Rider/RiderFooterSection";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getIntercityRideBookingDetails,
  getIntercityRideDetails,
} from "../../../Actions/Intercity";
import { useTranslation } from "react-i18next";
import Utils from "../../../Helpers/Utils";
import VehicleDetailsArea from "../../../Components/Intercity/VehicleDetailsArea";
import AmenitiesArea from "../../../Components/Intercity/AmenitiesArea";
import RideDetailsHeader from "../../../Components/RideDetails/RideDetailsHeader";
import AddressRenderItems from "../../../Components/RideDetails/AddressRenderItems";
import BookedRideList from "../../../Components/RideDetails/Driver/BookedRideList";
import RideRatingPopup from "../RideRatingPopup";
import DriverFooterSection from "../../../Components/RideDetails/Driver/DriverFooterSection";
import BioBox from "../../../Components/Comman/BioBox";

const IntercityRideDetailsScreen = memo(({ navigation, route }) => {
  /////////// States ///////////
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.Authentication);
  const [refreshingData, setRefreshingData] = useState(false);
  const [isHideBookButton, setHideBookButton] = useState(true);
  const [isHideBookButtonMsg, setHideBookButtonMsg] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const bioText = intercityAllRideData?.bio;

  // const truncatedText = `${bioText.split(" ").slice(0, 10).join(" ")}...`; // Show only the first 10 words

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };
  const {
    intercityAllRideData,
    intercityRideBookingData,
    isLoading,
    pickupCitySearchText,
    dropOffCitySearchText,
  } = useSelector((state) => state.Intercity);
  const {
    ride_id,
    isFromMyBookings,
    price,
    booked_seat,
    callIcon,
    booking_id,
    isRider,
    is_bold,
  } = route.params || {};

  //////////////// useEffect ////////////////
  useFocusEffect(
    React.useCallback(() => {
      getRideData();
    }, [])
  );

  /////////// Function for fetch ride details ///////////
  const getRideData = async () => {
    try {
      const RideId = await AsyncStorage.getItem("@rideId");
      const UserId = await AsyncStorage.getItem("@id");
      const userRideId = JSON.parse(RideId);
      var body = {
        ride_id: userRideId,
        user_id: UserId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          getIntercityRideDetails(body, isRider, async (data, isSuccess) => {
            setRefreshingData(false);
            if (isSuccess === true) {
              if (isFromMyBookings === true && isRider) {
                setTimeout(() => getRiderRideDetails(), 100);
              }
              //var userData = await AsyncStorage.getItem("@userData");
              console.log(
                "User Data ======>  ",
                data.data.female_passenger,
                userData.gender,
                data?.data?.verified_passenger,
                userData.persona_verification_status
              );
              // if (userData && data && data.data) {
              if (data?.data?.female_passenger === 1) {
                console.log("hereMain2");
                if (
                  // parseInt(data?.data?.female_passenger === 1) &&
                  data.data.female_passenger === 1 &&
                  userData?.gender === 2
                ) {
                  console.log("here3");
                  setHideBookButton(true);
                } else {
                  console.log("here4");
                  setHideBookButton(false);
                  setHideBookButtonMsg(
                    "Only Female passengers can book this ride."
                  );
                  return;
                }
              }
              if (data?.data?.verified_passenger === 1) {
                console.log("hereMain1");
                if (
                  data?.data?.verified_passenger === 1 &&
                  userData?.persona_verification_status === 1
                ) {
                  console.log("here1");
                  setHideBookButton(true);
                } else {
                  console.log("here2");
                  setHideBookButton(false);
                  setHideBookButtonMsg(
                    "Only verified passengers can book this ride."
                  );
                }
              }
              // }
            }
          })
        );
      }
    } catch {}
  };

  //////////// Function for Call Rider Intercity ride booking Api ///////////
  ///// If isRider and comes from my Bookings Screen /////
  const getRiderRideDetails = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        booking_id: booking_id,
        user_id: UserId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(getIntercityRideBookingDetails(body));
      }
    } catch {}
  };

  /////////// Function for call ///////////
  const handleCallPress = () => {
    Linking.openURL(`tel:${intercityAllRideData?.phone_number}`);
  };

  /////////// Function for refresh //////////
  const refresh = () => {
    setRefreshingData(true);
    getRideData();
  };
  const isFocused = useIsFocused();

  return (
    <SafeAreaView
      style={{
        flex: 1,
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
            callIcon === true && intercityAllRideData?.status !== 1
              ? Images.phone_number_icon
              : null
          }
          onPressCall={handleCallPress}
          goBack={() => {
            navigation.goBack();
          }}
        />

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps={true}
          refreshControl={
            <RefreshControl refreshing={refreshingData} onRefresh={refresh} />
          }
        >
          <ModalProgressLoader visible={isLoading && isFocused} />

          {/* Direction MapView */}
          <View style={styles.mapView}>
            {intercityAllRideData && intercityAllRideData?.pickup_latitude && (
              <DirectionMapView data={intercityAllRideData} />
            )}
          </View>

          {/* Ride Details */}
          <RideDetailsHeader
            isFromMyBookings={isFromMyBookings}
            isRider={isRider}
            navigation={navigation}
            booked_seat={booked_seat}
          />

          <AddressRenderItems
            title={t("pickup_address")}
            value={
              !isFromMyBookings || !isRider
                ? intercityAllRideData?.pickup_address
                : intercityRideBookingData?.pickup_address
            }
            pickupCitySearchText={is_bold ? pickupCitySearchText : ""}
            dropOffCitySearchText={is_bold ? dropOffCitySearchText : ""}
            date={
              !isFromMyBookings || !isRider
                ? intercityAllRideData?.date
                : intercityRideBookingData?.pickup_date
            }
          />

          {(!isFromMyBookings || (isFromMyBookings && !isRider)) && (
            <FlatList
              style={{ width: "100%" }}
              data={intercityAllRideData?.pickupAddress}
              renderItem={({ item, index }) => (
                <AddressRenderItems
                  title={t("pickup_address") + " " + (index + 2)}
                  value={item.address}
                  pickupCitySearchText={is_bold ? pickupCitySearchText : ""}
                  dropOffCitySearchText={is_bold ? dropOffCitySearchText : ""}
                  date={item.date}
                />
              )}
              keyExtractor={(item, index) => index}
            />
          )}

          <AddressRenderItems
            title={t("drop_off_address")}
            value={
              !isFromMyBookings || !isRider
                ? intercityAllRideData?.dropoff_address
                : intercityRideBookingData?.dropoff_address
            }
            pickupCitySearchText={is_bold ? pickupCitySearchText : ""}
            dropOffCitySearchText={is_bold ? dropOffCitySearchText : ""}
            date={intercityAllRideData?.approx_dropoff_time}
            price={
              !isRider
                ? intercityAllRideData?.price_per_seat
                : isFromMyBookings
                ? price
                : intercityAllRideData?.mainPrice
            }
          />

          {(!isFromMyBookings || (isFromMyBookings && !isRider)) && (
            <FlatList
              data={intercityAllRideData?.dropoffAddress}
              renderItem={({ item, index }) => (
                <AddressRenderItems
                  title={t("drop_off_address") + " " + (index + 2)}
                  value={item.address}
                  pickupCitySearchText={is_bold ? pickupCitySearchText : ""}
                  dropOffCitySearchText={is_bold ? dropOffCitySearchText : ""}
                  price={!isRider ? item.price : item.mainPrice}
                  date={item.date}
                />
              )}
              keyExtractor={(item, index) => index}
            />
          )}

          {intercityAllRideData?.trip_details && (
            <View style={styles.pickupDropAddressArea}>
              <Text style={styles.titleBarText}>{t("trip_details")}</Text>
              <Text style={styles.descriptionText}>
                {intercityAllRideData?.trip_details}
              </Text>
            </View>
          )}

          {/* Render Rider List */}
          <BookedRideList
            intercityAllRideData={intercityAllRideData}
            getRideData={() => getRideData()}
          />

          {/* Render Car Images */}
          {intercityAllRideData && intercityAllRideData?.car_images && (
            <VehicleDetailsArea data={intercityAllRideData} />
          )}

          <AmenitiesArea data={intercityAllRideData} />

          {isRider ? (
            intercityAllRideData && !isHideBookButton ? (
              <Text style={styles.noRideText}>{isHideBookButtonMsg}</Text>
            ) : (
              <RiderFooterSection
                isFromMyBookings={isFromMyBookings}
                ride_id={ride_id}
                booking_id={booking_id}
                navigation={navigation}
                getRideData={() => getRideData()}
                modalOnpress={() => setModalVisible(true)}
              />
            )
          ) : (
            <DriverFooterSection
              ride_id={ride_id}
              booking_id={booking_id}
              navigation={navigation}
              getRideData={() => getRideData()}
            />
          )}

          <RideRatingPopup
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            isRider={isRider}
            isIntracity={false}
            booking_id={booking_id}
            getRideData={() => getRideData()}
          />
          <BioBox
            visible={isExpanded}
            bio={intercityAllRideData?.bio}
            onPressNegative={() => setIsExpanded(false)}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
});

export default IntercityRideDetailsScreen;

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
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_small - 3,
    alignItems: "center",
    paddingBottom: ScaleSize.spacing_semi_medium * 6,
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
  noRideText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.small_text,
    color: Colors.red,
    marginVertical: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_medium,
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
  profileImage: {
    height: ScaleSize.small_icon * 2,
    width: ScaleSize.small_icon * 2,
    borderRadius: ScaleSize.very_small_border_radius,
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
  bioContainer: {
    flex: 1,
    alignSelf: "flex-start",
    marginVertical: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  yourBioText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
  },
  showMoreText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.primary,
    marginTop: ScaleSize.spacing_very_small,
  },
});
