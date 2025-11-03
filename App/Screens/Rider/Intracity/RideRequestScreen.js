import {
  StyleSheet,
  Text,
  Vibration,
  ScrollView,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState, useRef } from "react";
import {
  PrimaryDropDown,
  Textinput,
  PrimaryButton,
  Header,
} from "../../../Components/Comman";
import {
  Colors,
  Images,
  Strings,
  ScaleSize,
  TextFontSize,
  AppFonts,
} from "../../../Resources";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getIntracityDistance } from "../../../Actions/Intracity";
import { useFocusEffect } from "@react-navigation/native";
import { generalSettings, userDetails } from "../../../Actions/authentication";
import { useDispatch, useSelector } from "react-redux";
import { addIntracityRide } from "../../../Actions/Intracity";
import { useTranslation } from "react-i18next";
import Utils from "../../../Helpers/Utils";
import { GooglePlacesAutoComplete } from "../../../Components/Comman/GooglePlacesAutoComplete";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import DateTimePicker from "../../../Components/Comman/DateTimePicker";
import AlertBox from "../../../Components/Comman/AlertBox";
import { useStripe } from "@stripe/stripe-react-native";

const RideRequestScreen = ({ navigation, route }) => {
  //////////// States ////////////
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { isLoading, userData, generalSettingsData } = useSelector(
    (state) => state.Authentication
  );
  const ONE_SECOND_IN_MS = 1000;
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupCity, setPickupCity] = useState("");
  const [dropOffAddress, setDropOffAddress] = useState("");
  const [dropOffCity, setDropOffCity] = useState("");
  const [requiredSeat, setRequiredSeat] = useState("");
  const [tripDetails, setTripDetails] = useState("");
  const [intracityMinimumFare, setIntracityMinimumFare] = useState("");
  const [rideCost, setRideCost] = useState("");
  const [usedCreditCost, setUsedCreditCost] = useState("");
  const [finalCost, setFinalCost] = useState("");
  const [intracityPerKm, setIntracityPerKm] = useState("");
  const [pickupDistance, setPickupDistance] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [placeAlert, setPlaceAlert] = useState(false);
  const [isCostShow, setIsCostShow] = useState(false);
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCardError, setNameOnCardError] = useState(false);
  const [cardNumberError, setCardNumberError] = useState(false);
  const [expireDateError, setExpireDateError] = useState(false);
  const [cvvError, setCvvError] = useState(false);
  const [date, setDate] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDateConfirmed, setIsDateConfirmed] = useState(false);

  //////////// Errors ///////////
  const [pickupAddressError, setPickupAddressError] = useState("");
  const [dropOffAddressError, setDropOffAddressError] = useState("");
  const [requiredSeatError, setRequiredSeatError] = useState("");
  const [pickupCityError, setPickupCityError] = useState("");
  const [dropOffCityError, setDropOffCityError] = useState("");
  const [dateError, setDateError] = useState("");

  //////////// Refs //////////////
  const datePickerRef = useRef(null);
  const pickupAddressRef = useRef(null);
  const pickupCityRef = useRef(null);
  const dropOffAddressRef = useRef(null);
  const dropOffCityRef = useRef(null);
  const tripDetailsRef = useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      getGeneralSettings();
    }, [])
  );

  const setup = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      paymentIntentClientSecret: paymentIntent, // retrieve this from your server
    });
    if (error) {
      // handle error
    }
  };

  const checkout = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      // handle error
    } else {
      // success
    }
  };

  const getGeneralSettings = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(generalSettings());
        dispatch(
          userDetails(body, async (data, isSuccess) => {
            if (isSuccess === true) {
            }
          })
        );
      }
    } catch {}
  };

  ///////////// dynamic ////////////
  const data = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
  ];

  const isValid = async () => {
    try {
      var isValid = true;
      if (Utils.isStringNull(pickupAddress)) {
        isValid = false;
        setPickupAddressError(t("blank_field_error"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      }

      if (Utils.isNull(pickupAddress?.city)) {
        isValid = false;
        setPickupCityError(t("blank_field_error"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      }

      if (Utils.isStringNull(dropOffAddress)) {
        isValid = false;
        setDropOffAddressError(t("blank_field_error"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else {
        setDropOffAddressError(null);
      }

      if (Utils.isNull(dropOffAddress?.city)) {
        isValid = false;
        setDropOffCityError(t("blank_field_error"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      }

      if (Utils.isStringNull(requiredSeat)) {
        isValid = false;
        setRequiredSeatError(t("blank_field_error"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else {
        setRequiredSeatError(null);
      }

      if (Utils.isStringNull(date)) {
        isValid = false;
        setDateError(t("blank_field_error"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else if (!Utils.isGreaterThan15Minutes(date)) {
        isValid = false;
        setDateError(t("earliest_time_15_alert"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else {
        setDateError(null);
      }

      if ((await Utils.isNetworkConnected()) && isValid) {
        setSuccessAlert(true);
      }
      // if ((await Utils.isNetworkConnected()) && isValid) {
      //   var body = {
      //     user_id: userData.id,
      //     distance: pickupDistance,
      //     pickup_address: pickupAddress.title,
      //     pickup_city: pickupCity,
      //     pickup_latitude: pickupAddress?.latitude,
      //     pickup_longitude: pickupAddress?.longitude,
      //     dropoff_address: dropOffAddress.title,
      //     dropoff_city: dropOffCity,
      //     dropoff_latitude: dropOffAddress?.latitude,
      //     dropoff_longitude: dropOffAddress?.longitude,
      //     required_seats: requiredSeat,
      //     date: moment(date).format("YYYY/MM/DD hh:mm A"),
      //     maxPrice: rideCost,
      //     trip_details: tripDetails,
      //     isCredit: usedCreditCost === "" ? 0 : 1,
      //     payment_intent_id: "",
      //     payment_charge_id: "",
      //     usedCredit: usedCreditCost,
      //     time_zone: timeZone,
      //   };
      //   dispatch(
      //     addIntracityRide(body, async (body, isSuccess) => {
      //       if (isSuccess === true) {
      //         setSuccessAlert(true);
      //       }
      //     })
      //   );
      // }
    } catch {}
  };

  async function getDistanceBetweenTwoAddress(
    pickupAddress,
    dropOffAddress,
    type
  ) {
    var id = await AsyncStorage.getItem("@id");
    var body = {
      pickup_latitude: pickupAddress?.latitude,
      pickup_longitude: pickupAddress?.longitude,
      dropoff_latitude: dropOffAddress?.latitude,
      dropoff_longitude: dropOffAddress?.longitude,
      user_id: id,
      type: 0,
    };
    if (await Utils.isNetworkConnected()) {
      dispatch(
        getIntracityDistance(body, async (data, isSuccess) => {
          if (isSuccess) {
            switch (type) {
              case 1: // Main Pickup Address Checking
                await setPickupDistance(data.data.distance);
                getUsedCredit(data);
              case 2:
                await setPickupDistance(data.data.distance);
                getUsedCredit(data);
                break;
              default:
                break;
            }
          } else {
            setAlertMsg(data.data.message);
            setErrorAlert(true);
            switch (type) {
              case 1:
                setPickupAddress(null);
                setPickupCity(null);
                setPickupAddressError(null);
                setPickupCityError(null);
                pickupAddressRef.current.onClearPress();
                break;
              case 2:
                setDropOffAddress(null);
                setDropOffCity(null);
                setDropOffAddressError(null);
                setDropOffCityError(null);
                dropOffAddressRef.current.onClearPress();
                break;
              default:
                break;
            }
          }
        })
      );
    }
  }

  const getUsedCredit = (data) => {
    var maxPrice = data.data.distance * intracityPerKm;

    var ride_cost;

    if (maxPrice < intracityMinimumFare) {
      ride_cost = Math.round(intracityMinimumFare);
    } else {
      ride_cost = Math.round(maxPrice);
    }
    setRideCost(ride_cost + "");

    setIsCostShow(userData?.credit >= 10 ? true : false);
    if (userData?.credit >= 10) {
      if (generalSettingsData.use_credit !== 0) {
        var creditPertg = (generalSettingsData.use_credit / 100) * ride_cost;
        var roundedValue = Math.ceil(creditPertg * 10) / 10;

        if (creditPertg > userData?.credit) {
          setUsedCreditCost(userData?.credit.toFixed(2));
        } else {
          setUsedCreditCost(roundedValue.toFixed(2));
        }
      }
    }
    setFinalCost(rideCost - usedCreditCost);
    return;
  };

  /////////// For Autocomplete select place ///////////
  function setAddress(selectedItem, type) {
    if (selectedItem) {
      switch (type) {
        case "pickup_address":
          setPickupAddress(selectedItem);
          setPickupCity(selectedItem.city);
          setIntracityPerKm(
            (prevIntracityPerKm) =>
              selectedItem.intracity_per_km || prevIntracityPerKm
          );
          setIntracityMinimumFare(selectedItem.intracity_minimum_fare);
          setTimeZone(selectedItem.timezone);
          setPickupAddressError(null);
          setPickupCityError(null);
          if (dropOffAddress) {
            getDistanceBetweenTwoAddress(dropOffAddress, selectedItem, 1);
          }
          break;
        case "dropoff_address":
          setDropOffAddress(selectedItem);
          setDropOffCity(selectedItem.city);
          setIntracityPerKm(
            (prevIntracityPerKm) =>
              selectedItem.intracity_per_km || prevIntracityPerKm
          );
          setIntracityMinimumFare(selectedItem.intracity_minimum_fare);
          setDropOffAddressError(null);
          setDropOffCityError(null);
          if (pickupAddress) {
            getDistanceBetweenTwoAddress(pickupAddress, selectedItem, 2);
          }
          break;
        default:
          return <Text>Unknown</Text>;
      }
    }
  }

  const handleClearPickupAddress = () => {
    setPickupAddress("");
    setPickupCity("");
  };

  const handleClearDropoffAddress = () => {
    setDropOffAddress("");
    setDropOffCity("");
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate());

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 6);

  // const formatDate = (text) => {
  //   // Remove all non-digit characters
  //   let cleaned = text.replace(/\D/g, "");

  //   // Extract month and year parts
  //   let month = cleaned.slice(0, 2);
  //   let year = cleaned.slice(2, 4);

  //   // Format month to always be two digits
  //   if (month.length > 2) {
  //     month = month.slice(0, 2);
  //   }
  //   if (month.length === 1 && month > "1") {
  //     month = "0" + month;
  //   }

  //   // Format year to always be two digits
  //   if (year.length > 2) {
  //     year = year.slice(0, 2);
  //   }

  //   // Combine month and year with a slash
  //   if (month && year) {
  //     return `${month}/${year}`;
  //   } else if (month) {
  //     return month;
  //   } else {
  //     return "";
  //   }
  // };

  const formatDate = (text) => {
    // Remove all non-digit characters
    let cleaned = text.replace(/\D/g, "");

    // Extract month and year parts
    let month = cleaned.slice(0, 2);
    let year = cleaned.slice(2, 4);

    // Format month to always be two digits
    if (month.length > 2) {
      month = month.slice(0, 2);
    }
    if (month.length === 1 && month > "1") {
      month = "0" + month;
    }

    // Format year to always be two digits
    if (year.length > 2) {
      year = year.slice(0, 2);
    }

    // Get the current year and format it as 'YY'
    const currentYear = new Date().getFullYear() % 100;

    // Check for year validation only when two digits are entered
    if (year.length === 2) {
      if (parseInt(year) < currentYear) {
        setExpireDateError(true);
        return `${month}/--`; // Return a placeholder to indicate error
      } else {
        setExpireDateError(false);
      }
    }

    // Combine month and year with a slash
    if (month && year) {
      return `${month}/${year}`;
    } else if (month) {
      return month;
    } else {
      return "";
    }
  };

  const formatCardNumber = (text) => {
    let cleaned = text.replace(/\D/g, "");

    let chunks = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      chunks.push(cleaned.slice(i, i + 4));
    }

    return chunks.join("  ");
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.white,
        }}
      >
        <View style={{ width: "100%", backgroundColor: "white" }}>
          <Header
            title={t("ride_request")}
            goBack={() => navigation.goBack("BottomTabNavigator")}
          />
        </View>
        <AutocompleteDropdownContextProvider>
          <View style={{ flex: 1 }}>
            <ScrollView
              persistentScrollbar={true}
              contentContainerStyle={styles.container}
            >
              <View
                style={styles.tabsArea}
                onStartShouldSetResponder={() => {
                  pickupAddressRef?.current?.closeDropDown();
                  dropOffAddressRef?.current?.closeDropDown();
                }}
              >
                <GooglePlacesAutoComplete
                  onSelected={(selectedItem) => {
                    setAddress(selectedItem, "pickup_address");
                  }}
                  isOptional={false}
                  imageShow={false}
                  ref={pickupAddressRef}
                  type={2}
                  multiline={true}
                  onClear={handleClearPickupAddress}
                  editable={true}
                  selectTextOnFocus={true}
                  isAddressSearch={true}
                  value={pickupAddress}
                  error={pickupAddressError}
                  placeholder={t("post_pickup_address")}
                />

                <Textinput
                  isIcon={false}
                  error={pickupCityError}
                  value={pickupCity}
                  onChangeText={(text) => setPickupCity(text)}
                  placeholder={t("pickup_city")}
                  editable={false}
                  selectTextOnFocus={false}
                  placeholderTextColor={Colors.black}
                />

                <GooglePlacesAutoComplete
                  onSelected={(selectedItem) => {
                    setAddress(selectedItem, "dropoff_address");
                  }}
                  isOptional={false}
                  imageShow={false}
                  ref={dropOffAddressRef}
                  isAddressSearch={true}
                  onClear={handleClearDropoffAddress}
                  multiline={true}
                  value={dropOffAddress}
                  editable={true}
                  selectTextOnFocus={true}
                  error={dropOffAddressError}
                  placeholder={t("post_drop_off_address")}
                />

                <Textinput
                  placeholder={t("post_drop_off_city")}
                  placeholderTextColor={Colors.black}
                  value={dropOffCity}
                  error={dropOffCityError}
                  editable={false}
                  selectTextOnFocus={false}
                  onChangeText={(text) => setDropOffCity(text)}
                />

                <View style={{ flex: 1 }}>
                  <PrimaryDropDown
                    data={data}
                    isSelect={requiredSeat}
                    renderItem={(selectedItem) =>
                      selectedItem && selectedItem.label
                    }
                    string={t("select_required_seat")}
                    error={requiredSeatError}
                    onSelect={(selectedItem) => {
                      setRequiredSeat(selectedItem.value);
                      setRequiredSeatError(null);
                    }}
                    value={requiredSeat}
                  />
                </View>

                {/* {requiredSeatError ? (
                  <Text style={styles.errorText}>{requiredSeatError}</Text>
                ) : null} */}

                <DateTimePicker
                  value={date}
                  mode="datetime"
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  ref={datePickerRef}
                  placeholderText={t("date")}
                  disabled={false}
                  error={dateError}
                  onConfirm={(value) => {
                    setDate(value);
                    setDateError(null);
                  }}
                />

                <Textinput
                  textInputTabStyle={styles.tripDetailsInput(tripDetails)}
                  textInputStyle={styles.bigTextInput}
                  optional={t("optional")}
                  value={tripDetails}
                  multiline={true}
                  isMultiOpional={true}
                  placeholder={t("trip_details")}
                  placeholderTextColor={Colors.black}
                  onChangeText={(text) => setTripDetails(text)}
                />
              </View>
              {rideCost && (
                <View style={styles.bookingSummaryTabArea}>
                  <View style={styles.bookingSummaryTab}>
                    <View style={styles.priceSeatsTextArea}>
                      <Text style={styles.titleBarText}>{t("ride_cost")}:</Text>
                      <Text style={styles.titleBarText}>${rideCost}</Text>
                    </View>

                    {isCostShow === true && (
                      <>
                        <View style={styles.priceSeatsTextArea}>
                          <Text style={styles.titleBarText}>
                            {t("Used Credit Cost")}
                          </Text>
                          <Text style={styles.titleBarText}>
                            ${usedCreditCost}
                          </Text>
                        </View>

                        <View style={styles.priceSeatsTextArea}>
                          <Text style={styles.titleBarText}>
                            {t("Final Cost")}
                          </Text>
                          <Text style={styles.titleBarText}>
                            ${rideCost - usedCreditCost}
                          </Text>
                        </View>
                      </>
                    )}
                  </View>
                </View>
              )}

              <View style={styles.seprator} />

              {/* PAYMENT CARD */}
              {/* <View style={styles.cardArea}>
                <View style={styles.card}>
                  <Text style={styles.cardDetailsTitleText}>
                    {t("card_details")}
                  </Text>
                  <View style={styles.cardNameAndNumberArea}>
                    <Text style={styles.cardDetailHeadingText}>
                      {t("name_on_card")}
                    </Text>
                    <Textinput
                      customStyle={true}
                      cursorColor={"white"}
                      customFont={nameOnCardError ? Colors.red : Colors.white}
                      textInputTabStyle={[
                        styles.textinputTab,
                        {
                          borderColor: nameOnCardError
                            ? Colors.red
                            : Colors.primary,
                          borderWidth: 2,
                        },
                      ]}
                      textInputStyle={styles.textinput}
                      value={nameOnCard}
                      onChangeText={(text) => {
                        setNameOnCard(text.trim());
                        // setNameOnCardError(false);
                      }}
                    />
                  </View>

                  <View style={styles.cardNameAndNumberArea}>
                    <Text style={styles.cardDetailHeadingText}>
                      {t("card_number")}
                    </Text>
                    <Textinput
                      customStyle={true}
                      cursorColor={"white"}
                      customFont={cardNumberError ? Colors.red : Colors.white}
                      textInputTabStyle={[
                        styles.textinputTab,
                        { borderColor: Colors.primary, borderWidth: 2 },
                      ]}
                      value={cardNumber}
                      textInputStyle={styles.textinput}
                      // onChangeText={(text) => {
                      //   setCardNumber(text.trim());
                      //   setCardNumberError(false);
                      // }}
                      onChangeText={(text) => {
                        const formattedText = formatCardNumber(text);
                        setCardNumber(formattedText);
                        setCardNumberError(false);
                      }}
                      keyboardType="numeric"
                      maxLength={22} // Maximum length with spaces
                    />
                  </View>

                  <View style={styles.expireDateAndCvvTabArea}>
                    <View style={styles.expireDateAndCvvArea}>
                      <Text style={styles.cardDetailHeadingText}>
                        {t("expire_date")}
                      </Text>
                      <Textinput
                        customStyle={true}
                        customFont={expireDateError ? Colors.red : Colors.white}
                        cursorColor={"white"}
                        value={expireDate}
                        textInputTabStyle={[
                          styles.textinputTab,
                          {
                            borderColor: expireDateError
                              ? Colors.red
                              : Colors.primary,
                            borderWidth: 2,
                          },
                        ]}
                        textInputStyle={styles.textinput}
                        onChangeText={(text) => {
                          setExpireDate(formatDate(text));
                          // setExpireDateError(false);
                        }}
                        keyboardType="numeric"
                        maxLength={5}
                      />
                    </View>

                    <View style={styles.expireDateAndCvvArea}>
                      <Text style={styles.cardDetailHeadingText}>
                        {t("cvv")}
                      </Text>
                      <Textinput
                        customStyle={true}
                        customFont={cvvError ? Colors.red : Colors.white}
                        cursorColor={"white"}
                        textInputTabStyle={[
                          styles.textinputTab,
                          { borderColor: Colors.primary, borderWidth: 2 },
                        ]}
                        textInputStyle={styles.textinput}
                        value={cvv}
                        onChangeText={(text) => {
                          setCvv(text.trim());
                        }}
                        keyboardType="numeric"
                        maxLength={4}
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.cardNotificationTabArea}>
                <View style={styles.cardNotificationTab}>
                  <Image
                    source={Images.notifiaction}
                    style={styles.cardNotificationIcon}
                  />
                  <Text style={styles.cardNotificationText}>
                    {Strings.card_notification_text}
                  </Text>
                </View>
              </View> */}

              <View style={styles.btnArea}>
                <PrimaryButton
                  string={Strings.submit}
                  onPress={() => isValid()}
                />
              </View>
              <AlertBox
                visible={successAlert}
                // title={"Success"}
                // message={"Your ride request was succefully sent"}
                title={"Coming Soon"}
                message={"Intracity services are coming soon!"}
                positiveBtnText={"OK"}
                onPress={() => {
                  setSuccessAlert(false);
                  navigation.goBack();
                }}
                onPressNegative={() => setSuccessAlert(false)}
              />
              <AlertBox
                visible={errorAlert}
                title={"Alert!"}
                error={true}
                message={alertMsg}
                positiveBtnText={"OK"}
                onPress={() => {
                  setErrorAlert(false);
                }}
                onPressNegative={() => setErrorAlert(false)}
              />
            </ScrollView>
          </View>
        </AutocompleteDropdownContextProvider>
      </SafeAreaView>
    </>
  );
};

export default RideRequestScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
    paddingHorizontal: ScaleSize.spacing_medium,
    backgroundColor: Colors.white,
    paddingBottom: ScaleSize.spacing_small,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    marginTop: ScaleSize.spacing_medium,
    marginBottom: ScaleSize.spacing_small,
  },
  backBtn: {
    position: "absolute",
    left: ScaleSize.spacing_medium,
  },
  backBtnIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    resizeMode: "contain",
  },
  rideRequestText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text,
    color: Colors.black,
  },
  tabsArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  selectListIcons: {
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    top: ScaleSize.spacing_medium,
    left: ScaleSize.spacing_medium,
    bottom: 0,
    position: "absolute",
    resizeMode: "contain",
    tintColor: Colors.primary,
  },
  selectList: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    paddingVertical: ScaleSize.spacing_medium,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    margin: ScaleSize.spacing_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  dateArea: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  cardArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    borderRadius: ScaleSize.primary_border_radius - 5,
    alignItems: "center",
    padding: ScaleSize.spacing_semi_medium,
    paddingVertical: ScaleSize.spacing_medium,
  },
  cardNameAndNumberArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardDetailsTitleText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.white,
    alignSelf: "flex-start",
    left: ScaleSize.spacing_semi_medium,
  },
  cardDetailHeadingText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.white,
    alignSelf: "flex-start",
    left: ScaleSize.spacing_semi_medium,
    top: ScaleSize.font_spacing,
  },
  textinputTab: {
    flexDirection: "row",
    flex: 1,
    color: Colors.white,
    backgroundColor: Colors.low_opacity_white,
    margin: ScaleSize.spacing_very_small,
    paddingHorizontal: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  textinput: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: ScaleSize.spacing_semi_medium,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_small,
    color: Colors.white,
  },
  expireDateAndCvvTabArea: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  expireDateAndCvvArea: {
    width: "49%",
    justifyContent: "center",
    alignItems: "center",
  },
  smallTextinput: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.low_opacity_white,
    margin: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  btnArea: {
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
    paddingHorizontal: ScaleSize.spacing_very_small,
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
    top: ScaleSize.font_spacing,
    marginVertical: ScaleSize.spacing_very_small,
  },
  submitBtn: {
    flex: 1,
  },
  tripDetailsInput: (tripDetails) => ({
    flexDirection: "row",
    width: "100%",
    height: ScaleSize.spacing_extra_large * 1.7,
    backgroundColor: tripDetails ? Colors.textinput_low_opacity : Colors.white,
    margin: ScaleSize.spacing_small,
    padding: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  }),
  bigTextInput: {
    position: "relative",
    flex: 1,
    height: ScaleSize.tab_height * 1.3,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    left: ScaleSize.spacing_semi_medium - 2,
    color: Colors.primary,
  },
  cardNotificationTabArea: {
    flex: 1,
    marginBottom: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  cardNotificationTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: ScaleSize.spacing_medium + 3,
    justifyContent: "center",
    borderRadius: ScaleSize.medium_border_radius,
    paddingHorizontal: ScaleSize.spacing_large,
    paddingVertical: ScaleSize.spacing_very_small,
    backgroundColor: Colors.textinput_low_opacity,
  },
  cardNotificationIcon: {
    height: ScaleSize.large_icon,
    width: ScaleSize.large_icon,
    marginRight: ScaleSize.spacing_semi_medium,
  },
  cardNotificationText: {
    fontSize: TextFontSize.extra_small_text,
    fontFamily: AppFonts.medium,
    color: Colors.primary,
  },
  seprator: {
    borderBottomWidth: 1,
    borderColor: Colors.light_gray,
    marginVertical: ScaleSize.spacing_medium,
    width: "100%",
  },
  errorTextArea: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    bottom: ScaleSize.spacing_very_small,
    width: "100%",
    paddingLeft: ScaleSize.spacing_medium + 2,
  },
  errorText: {
    fontFamily: AppFonts.medium,
    color: Colors.red,
    alignSelf: "flex-start",
    paddingLeft: ScaleSize.spacing_medium + 2,
  },
  bookingSummaryTabArea: {
    width: "100%",
    justifyContent: "center",
    paddingVertical: ScaleSize.spacing_medium,
    paddingHorizontal: ScaleSize.spacing_very_small,
    alignItems: "center",
  },
  bookingSummaryTab: {
    justifyContent: "center",
    borderWidth: ScaleSize.font_spacing,
    borderColor: Colors.gray,
    borderRadius: ScaleSize.small_border_radius + 7,
    borderStyle: "dashed",
    paddingVertical: ScaleSize.spacing_small + 5,
    paddingHorizontal: ScaleSize.spacing_medium + 5,
    alignItems: "center",
  },
  priceSeatsTextArea: {
    width: "100%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  priceSeatsText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.black,
  },
  totalAmountArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  sepraterDashedLine: {
    width: "100%",
    top: ScaleSize.spacing_small,
    position: "absolute",
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.primary,
  },
  totalAmountText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.primary,
    marginTop: ScaleSize.spacing_medium,
  },
  sepraterLine: {
    width: "85%",
    borderTopWidth: ScaleSize.spacing_minimum,
    borderColor: Colors.light_gray,
    margin: ScaleSize.spacing_small,
  },
  optionalTextInline: {
    fontFamily: AppFonts.medium_italic,
    color: Colors.gray,
    position: "absolute",
    bottom: ScaleSize.spacing_large * 1.7,
    left: ScaleSize.spacing_large * 4.3,
    fontSize: TextFontSize.extra_small_text,
  },
});
