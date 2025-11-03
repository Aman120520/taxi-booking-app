import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  ImageBackground,
} from "react-native";
import React, { useState, useRef, useEffect, memo } from "react";
import {
  PrimaryButton,
  Header,
  TextButton,
  ModalProgressLoader,
} from "../../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { paymentInsert, updateSeats } from "../../../Actions/Intercity";
import AddressStepsIndicator from "../../../Components/Comman/AddressStepsIndicator";
import Utils from "../../../Helpers/Utils";

const RiderBookingDetails = memo(({ navigation, route }) => {
  //////////// States ////////////
  const dispatch = useDispatch();
  const { intercityAllRideData, updateSeatsData } = useSelector(
    (state) => state.Intercity
  );
  const [loaderVisible, setLoaderVisible] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [isSeatAdded, setIsSeatAdded] = useState(false);
  const [isSeatUpdated, setIsSeatUpdated] = useState(false);
  const { t } = useTranslation();
  const {
    total_seats,
    isAdditionalDropoffAddress,
    isAdditionalPickupAddress,
    ride_date,
    available_seat,
  } = route.params || {};
  const [count, setCount] = useState(total_seats);

  const handleAddSeatButton = () => {
    if (count < available_seat) {
      setCount(count + 1);
      setIsSeatAdded(true);
    }
  };

  useEffect(() => {
    if (intercityAllRideData?.driver_free) handleUpdateSeat();
  }, [count, intercityAllRideData]);

  //////////// Function for handle continue ///////////
  const handleUpdateSeat = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      const RideId = await AsyncStorage.getItem("@rideId");
      var body = {
        user_id: UserId,
        ride_id: RideId,
        total_seat: count,
        driver_free: intercityAllRideData?.price_per_seat,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          updateSeats(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setIsSeatUpdated(true);
              setIsSeatAdded(false);
              setTotalAmount(data.totalAmount);
            } else {
              setLoaderVisible(false);
            }
          })
        );
      }
    } catch {}
  };

  const handleContinue = async () => {
    try {
      var isValid = true;
      const UserId = await AsyncStorage.getItem("@id");
      const RideId = await AsyncStorage.getItem("@rideId");
      var body = {
        intercity_ride_id: RideId,
        user_id: UserId,
        booked_seat: isSeatUpdated ? updateSeatsData.total_seat : count,
        price_per_seat: intercityAllRideData?.price_per_seat,
        driver_free: isSeatUpdated
          ? updateSeatsData.driver_free
          : intercityAllRideData?.driver_free,
        operation_free: isSeatUpdated
          ? updateSeatsData.operation_free
          : intercityAllRideData?.operation_free,
        credit_card_processing_fees: isSeatUpdated
          ? updateSeatsData.processing_fees
          : intercityAllRideData?.processing_fees,
        total_amount: updateSeatsData?.totalAmount,
        operation_fee_percentage: isSeatUpdated
          ? updateSeatsData.intercity_operation_free
          : intercityAllRideData?.intercity_operation_free,
        processing_fees_percentage: isSeatUpdated
          ? updateSeatsData.credit_card_processing_fees
          : intercityAllRideData?.credit_card_processing_fees,
        pickup_address: isAdditionalPickupAddress
          ? intercityAllRideData?.address_pickup?.address
          : intercityAllRideData?.pickup_address,
        dropoff_address: isAdditionalDropoffAddress
          ? intercityAllRideData?.address_dropoff?.address
          : intercityAllRideData?.dropoff_address,
        pickup_city: isAdditionalPickupAddress
          ? intercityAllRideData?.address_pickup?.city
          : intercityAllRideData?.rides.pickup_city,
        pickup_date: isAdditionalPickupAddress
          ? intercityAllRideData?.address_pickup?.date
          : ride_date,
        dropoff_city: isAdditionalDropoffAddress
          ? intercityAllRideData?.address_dropoff?.city
          : intercityAllRideData?.rides.dropoff_city,
        isCredit: isSeatUpdated
          ? updateSeatsData.isCredit
          : intercityAllRideData?.isCredit,
        usedCredit: isSeatUpdated
          ? updateSeatsData.usedCredit
          : intercityAllRideData?.usedCredit,
      };
      if (isValid) {
        // dispatch(
        //   paymentInsert(body, async (data, isSuccess) => {
        //     if (isSuccess === true) {
        handleParams();
        setLoaderVisible(false);
        //   } else {
        //     setLoaderVisible(false);
        //   }
        // })
        // );
      }
    } catch {}
  };

  const handleParams = async () => {
    navigation.navigate("RiderBookingSummary", {
      booked_seat: count,
      price: intercityAllRideData?.rideCost,
      total_amount: updateSeatsData?.totalAmount,
      isAdditionalPickupAddress: isAdditionalPickupAddress,
      isAdditionalDropoffAddress: isAdditionalDropoffAddress,
      total_seats: total_seats,
      available_seat: available_seat,
      ride_date: ride_date,
      isSeatUpdated: isSeatUpdated,
    });
    // navigation.navigate("RiderInvoice", {
    //   pickup_address: isAdditionalPickupAddress
    //     ? intercityAllRideData?.address_pickup?.address
    //     : intercityAllRideData?.pickup_address,
    //   dropoff_address: isAdditionalDropoffAddress
    //     ? intercityAllRideData?.address_dropoff?.address
    //     : intercityAllRideData?.dropoff_address,
    //   pickup_date: isAdditionalPickupAddress
    //     ? moment(
    //       intercityAllRideData?.address_pickup?.date,
    //       "YYYY-MM-DD HH:mm:ss"
    //     ).format("ddd, DD MMMM [at] hh:mm A")
    //     : intercityAllRideData?.rides.ride_date,
    //   dropoff_date: isAdditionalDropoffAddress
    //     ? intercityAllRideData?.address_dropoff?.date
    //     : intercityAllRideData?.rides.dropoff_date,
    //   booked_seat: count,
    //   total_amount: updateSeatsData?.totalAmount,
    // });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        persistentScrollbar={true}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title={t("booking_details")}
          goBack={() => navigation.goBack("IntercityRideDetailsScreen")}
        />

        <ModalProgressLoader visible={loaderVisible} />
        <View style={styles.addressArea}>
          <AddressStepsIndicator
            title={t("drop_off_address")}
            pickupAddress={
              isAdditionalPickupAddress
                ? intercityAllRideData?.address_pickup?.address
                : intercityAllRideData?.pickup_address
            }
            pickupAddressDate={
              isAdditionalPickupAddress
                ? moment(
                    intercityAllRideData?.address_pickup?.date,
                    "YYYY-MM-DD HH:mm:ss"
                  )
                : intercityAllRideData?.rides?.ride_date
            }
            dropOffAddress={
              isAdditionalDropoffAddress
                ? intercityAllRideData?.address_dropoff?.address
                : intercityAllRideData?.dropoff_address + ""
            }
            dropOffAddressDate={
              isAdditionalDropoffAddress
                ? moment(
                    intercityAllRideData?.address_dropoff?.date,
                    "YYYY-MM-DD HH:mm:ss"
                  )
                : intercityAllRideData?.rides?.dropoff_date
            }
          />
        </View>

        <View style={styles.riderDetailsTabArea}>
          <View style={styles.riderDetailsTab}>
            <Image
              source={{ uri: intercityAllRideData?.rides?.profile_picture }}
              style={styles.riderProfile}
            />
            <View style={styles.riderDetailsTextArea}>
              <Text style={styles.riderNameText}>
                {intercityAllRideData?.rides?.first_name}
              </Text>
              <View style={styles.tabRatingArea}>
                <Image style={styles.rateIcon} source={Images.rate} />
                <Text style={styles.rateText}>
                  {intercityAllRideData?.rides?.total_rating?.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sepraterLine} />

        <View style={styles.priceSeatsArea}>
          <View style={styles.priceSeatsTextArea}>
            <Text style={styles.priceSeatsText}>{"Ride Cost"}</Text>
            <Text style={styles.priceSeatsText}>
              {/* ${intercityAllRideData?.rides?.mainPrice} */}$
              {intercityAllRideData?.rideCost}
            </Text>
          </View>

          {updateSeatsData?.isCredit > 0 && updateSeatsData?.usedCredit > 0 && (
            <View style={styles.priceSeatsTextArea}>
              <Text style={styles.priceSeatsText}>{"Used Credit"}</Text>
              <Text style={styles.priceSeatsText}>
                $ {updateSeatsData?.usedCredit}
              </Text>
            </View>
          )}

          <View style={styles.priceSeatsTextArea}>
            <View>
              <Text style={styles.priceSeatsText}>{t("seats")}</Text>
              {intercityAllRideData && intercityAllRideData?.rides && (
                <Text style={styles.seatsAvailableText}>
                  ({intercityAllRideData?.rides.available_seat - count}{" "}
                  {t("seats_available")})
                </Text>
              )}
            </View>
            <View style={styles.counterTab}>
              <TextButton
                source={Images.counter_minus}
                iconStyle={styles.minusText}
                buttonStyle={styles.plusMinusBtn}
                onPress={() =>
                  setCount(
                    (prevCount) => (prevCount < 2 ? 1 : prevCount - 1),
                    setIsSeatAdded(false)
                  )
                }
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

          <View style={styles.sepraterDashedLine} />

          <View style={styles.totalAmontArea}>
            <Text style={styles.titleBarText}>{t("total_amount")}</Text>
            <Text style={styles.titleBarText}>
              ${updateSeatsData?.totalAmount}
            </Text>
          </View>
        </View>

        <View style={styles.footerArea}>
          <PrimaryButton onPress={handleContinue} string={t("continue")} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default RiderBookingDetails;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    paddingBottom: ScaleSize.spacing_medium,
    paddingHorizontal: ScaleSize.spacing_semi_medium - 5,
  },
  addressArea: {
    alignItems: "flex-start",
    paddingHorizontal: ScaleSize.spacing_large * 0.8,
    justifyContent: "space-between",
    flex: 0.001,
    flexDirection: "row",
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
  },
  riderDetailsTabArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: ScaleSize.spacing_medium,
  },
  riderDetailsTab: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    borderWidth: ScaleSize.spacing_minimum,
    borderRadius: ScaleSize.very_small_border_radius,
    backgroundColor: Colors.light_orange,
    borderColor: Colors.secondary,
    padding: ScaleSize.spacing_very_small,
    width: "95%",
  },
  riderProfile: {
    height: ScaleSize.spacing_very_large,
    width: ScaleSize.spacing_very_large,
    margin: ScaleSize.spacing_small,
    resizeMode: "cover",
    borderRadius: ScaleSize.very_small_border_radius,
  },
  rateIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    resizeMode: "cover",
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  riderDetailsTextArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  riderNameText: {
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
    paddingLeft: ScaleSize.spacing_small,
    marginVertical: ScaleSize.spacing_minimum + 2,
    top: ScaleSize.spacing_very_small,
  },
  tabRatingArea: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "flex-start",
    bottom: ScaleSize.spacing_very_small,
    margin: ScaleSize.font_spacing,
  },
  rateText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text,
    color: Colors.black,
  },
  sepraterLine: {
    width: "85%",
    borderTopWidth: ScaleSize.spacing_minimum,
    borderColor: Colors.light_gray,
    margin: ScaleSize.spacing_small,
  },
  sepraterDashedLine: {
    width: "90%",
    borderTopWidth: ScaleSize.smallest_border_width,
    borderColor: Colors.light_gray,
    borderStyle: "dashed",
    margin: ScaleSize.spacing_small,
  },
  counterTab: {
    alignItems: "center",
    left: ScaleSize.spacing_very_small,
    height: ScaleSize.spacing_very_large,
    justifyContent: "space-between",
    borderRadius: ScaleSize.primary_border_radius,
    paddingHorizontal: ScaleSize.spacing_very_small,
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
    paddingHorizontal: ScaleSize.spacing_small,
  },
  priceSeatsArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: ScaleSize.spacing_extra_large * 1.2,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  priceSeatsTextArea: {
    width: "100%",
    flexDirection: "row",
    padding: ScaleSize.spacing_small,
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceSeatsText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.small_text,
    color: Colors.gray,
  },
  seatsAvailableText: {
    fontFamily: AppFonts.regular,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
  },
  totalAmontArea: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: ScaleSize.spacing_semi_medium,
  },
  footerArea: {
    width: "100%",
    flex: 1,
    bottom: ScaleSize.spacing_semi_medium,
    position: "absolute",
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "center",
  },
});
