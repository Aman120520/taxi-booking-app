import {
  StyleSheet,
  Image,
  Text,
  View,
  ScrollView,
  Button,
} from "react-native";
import {
  PrimaryButton,
  Textinput,
  Header,
  ModalProgressLoader,
} from "../../../Components/Comman";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../../Resources";
import { intercityPaymentInsert } from "../../../Actions/Intercity";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import {
  useStripe,
  useConfirmPayment,
  CardField,
} from "@stripe/stripe-react-native";
import Utils from "../../../Helpers/Utils";
import { paymentInsert, updateSeats } from "../../../Actions/Intercity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlertBox from "../../../Components/Comman/AlertBox";
import { Images } from "../../../Resources/Images";
import moment from "moment";

const RiderBookingSummary = ({ navigation, route }) => {
  const [cardDetails, setCardDetails] = useState(null);
  const { createPaymentMethod, confirmPayment } = useStripe();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const {
    total_seats,
    isAdditionalDropoffAddress,
    isAdditionalPickupAddress,
    ride_date,
    available_seat,
    isSeatUpdated,
    booked_seat,
    total_amount,
    price,
  } = route.params || {};
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [nameOnCardError, setNameOnCardError] = useState(false);
  const [cardNumberError, setCardNumberError] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [expireDateError, setExpireDateError] = useState(false);
  const [cvvError, setCvvError] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [isLoadingDialog, setLoading] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [cardShow, setCardShow] = useState(true);
  const { intercityAllRideData, updateSeatsData, isLoading } = useSelector(
    (state) => state.Intercity
  );
  const { userData } = useSelector((state) => state.Authentication);

  const fetchPaymentIntent = async () => {
    setIsDisabled(true);
    try {
      if (await Utils.isNetworkConnected()) {
        const RideId = await AsyncStorage.getItem("@rideId");
        const UserId = await AsyncStorage.getItem("@id");
        console.log("CARD DETA", cardDetails);
        if (cardDetails.complete === true) {
          setLoading(true);
          dispatch(
            intercityPaymentInsert(
              {
                user_id: UserId,
                ride_id: RideId,
                amount: total_amount,
                currency: "usd",
              },
              async (data, isSuccess) => {
                if (isSuccess) {
                  try {
                    const { error, paymentIntent } = await confirmPayment(
                      data.data.client_secret,
                      {
                        type: "Card",
                        paymentMethodType: "Card",
                        paymentMethodData: {
                          cardDetails,
                        },
                      }
                    );
                    console.log("paymentIntent", paymentIntent);

                    // // Handle payment success or failure
                    if (error) {
                      setErrorAlert(true);
                      setAlertMsg(`${error.message}`);
                      setIsDisabled(false);
                      setLoading(false);
                    } else if (paymentIntent?.status === "Succeeded") {
                      handleContinue(data, paymentIntent);
                    } else {
                      console.error("Payment failed:", paymentIntent.error);
                      setIsDisabled(false);
                      setLoading(false);
                    }
                  } catch (error) {
                    setIsDisabled(false);
                    setLoading(false);
                    console.error("Error:", error);
                  }
                } else {
                  setIsDisabled(false);
                  setLoading(false);
                }
              }
            )
          );
        } else {
          setIsDisabled(false);
          alert("Card details not complete.");
        }
      } else {
        setIsDisabled(false);
      }
    } catch (error) {
      setIsDisabled(false);
      console.error("Error fetching payment intent:", error);
    }
  };

  // const fetchPaymentIntent = async () => {
  //   try {
  //     const RideId = await AsyncStorage.getItem("@rideId");
  //     dispatch(
  //       intercityPaymentInsert(
  //         {
  //           user_id: userData.id,
  //           ride_id: RideId,
  //           amount: total_amount,
  //           currency: "usd",
  //         },
  //         async (data, isSuccess) => {
  //           if (isSuccess) {
  //             try {
  //               const { paymentMethod, error: paymentMethodError } =
  //                 await createPaymentMethod({
  //                   type: "card",
  //                   card: {
  //                     number: cardNumber.replace(/\s/g, ""),
  //                     exp_month: parseInt(expireDate.slice(0, 2), 10),
  //                     exp_year: parseInt(expireDate.slice(3, 5), 10),
  //                     cvc: cvv,
  //                   },
  //                 });
  //               if (paymentMethodError) {
  //                 console.error(
  //                   "Payment method creation error:",
  //                   paymentMethodError
  //                 );
  //                 return;
  //               }

  //               // Confirm the PaymentIntent
  //               const { error: confirmError, paymentIntent } =
  //                 await confirmPayment(data.data.client_secret, {
  //                   payment_method: paymentMethod.id,
  //                 });

  //               if (confirmError) {
  //                 console.error("Payment confirmation error:", confirmError);
  //               } else if (paymentIntent.status === "succeeded") {
  //                 console.log("Payment successful!");
  //               } else {
  //                 console.error("Payment failed:", paymentIntent.status);
  //               }
  //             } catch (error) {
  //               console.error("Error in payment flow:", error);
  //             }
  //           }
  //         }
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error fetching payment intent:", error);
  //   }
  // };

  const handleContinue = async (data, paymentIntent) => {
    console.log(
      "ISSEATUPDATE",
      isSeatUpdated,
      intercityAllRideData,
      updateSeatsData,
      ride_date
    );
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
          : intercityAllRideData?.rides?.dropoff_city,
        isCredit: isSeatUpdated
          ? updateSeatsData.isCredit
          : intercityAllRideData?.isCredit,
        usedCredit: isSeatUpdated
          ? updateSeatsData.usedCredit
          : intercityAllRideData?.usedCredit,
        customer_id: data.data.customer_id,
        payment_intent_status: paymentIntent.status,
        payment_intent_id: data.data.payment_intents_id,
      };
      if (isValid) {
        dispatch(
          paymentInsert(body, async (data, isSuccess) => {
            setIsDisabled(false);
            setLoading(false);
            if (isSuccess === true) {
              setSuccessAlert(true);
            } else {
            }
          })
        );
      } else {
        setIsDisabled(false);
        setLoading(false);
      }
    } catch {
      setIsDisabled(false);
    }
  };

  const handleParams = async () => {
    navigation.navigate("RiderInvoice", {
      pickup_address: isAdditionalPickupAddress
        ? intercityAllRideData?.address_pickup?.address
        : intercityAllRideData?.pickup_address,
      dropoff_address: isAdditionalDropoffAddress
        ? intercityAllRideData?.address_dropoff?.address
        : intercityAllRideData?.dropoff_address,
      pickup_date: isAdditionalPickupAddress
        ? moment(
            intercityAllRideData?.address_pickup?.date,
            "YYYY-MM-DD HH:mm:ss"
          ).format("ddd, DD MMMM [at] hh:mm A")
        : intercityAllRideData?.rides.ride_date,
      dropoff_date: isAdditionalDropoffAddress
        ? intercityAllRideData?.address_dropoff?.date
        : intercityAllRideData?.rides.dropoff_date,
      booked_seat: booked_seat,
      total_amount: updateSeatsData?.totalAmount,
    });
  };

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
        setExpireDateError("please enter valid year");
        return `${month}/`;
      } else {
        setExpireDateError(null);
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

  const isValid = async () => {
    var isValid = true;
    try {
      if (Utils.isStringNull(nameOnCard)) {
        isValid = false;
        setNameOnCardError(t("blank_field_error"));
      } else {
        setNameOnCardError(null);
      }

      if (Utils.isStringNull(cardNumber)) {
        isValid = false;
        setCardNumberError(t("blank_field_error"));
      } else if (cardNumber.length < 22) {
        isValid = false;
        setCardNumberError("Enter valid card number");
      } else {
        setNameOnCardError(null);
      }

      if (Utils.isStringNull(expireDate)) {
        isValid = false;
        setExpireDateError(t("blank_field_error"));
      } else if (expireDate.length < 5) {
        isValid = false;
        setExpireDateError("Enter valid expire date");
      } else {
        setExpireDateError(null);
      }

      if (Utils.isStringNull(cvv)) {
        isValid = false;
        setCvvError(t("blank_field_error"));
      } else if (cvv.length < 3) {
        isValid = false;
        setCvvError("Enter valid card number");
      } else {
        setCvvError(null);
      }

      if ((await Utils.isNetworkConnected()) && isValid) {
        fetchPaymentIntent();
      }
    } catch {}
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps={"always"}
      showsVerticalScrollIndicator={false}
    >
      <Header
        title={t("booking_summary")}
        goBack={() => navigation.goBack("RiderBookingDetails")}
      />

      <ModalProgressLoader visible={isLoading || isLoadingDialog} />
      <View style={styles.bookingSummaryTabArea}>
        <View style={styles.bookingSummaryTab}>
          {/* {<Text style={styles.titleBarText}>{t("booking_summary")}</Text>

          <View style={styles.priceSeatsTextArea}>
            <Text style={styles.priceSeatsText}>{t("price")}</Text>
            <Text style={styles.priceSeatsText}>$ {price}</Text>
          </View>

          <View style={styles.priceSeatsTextArea}>
            <Text style={styles.priceSeatsText}>{t("seats")}</Text>
            <Text style={styles.priceSeatsText}>x {booked_seat}</Text>
          </View>} */}

          <View style={styles.totalAmountArea}>
            {/* <View style={styles.sepraterDashedLine} /> */}
            <View style={styles.priceSeatsTextArea}>
              <View>
                <Text style={styles.totalAmountLabelText}>
                  {t("total_amount")}
                </Text>
                <Text style={styles.priceSeatsText}>
                  {booked_seat < 2
                    ? booked_seat + " Seat"
                    : booked_seat + " " + t("seats")}
                </Text>
              </View>
              <Text style={styles.totalAmountText}>$ {total_amount}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.sepraterLine} />

      {/* <View style={styles.cardArea}>
        <View style={styles.card}> */}
      <View
        style={{
          width: "100%",
          // paddingHorizontal: ScaleSize.spacing_large,
        }}
      >
        <Text style={styles.cardDetailsTitleText}>{t("card_details")}</Text>
        {/* <View style={styles.cardNameAndNumberArea}>
            <Text style={styles.cardDetailHeadingText}>
              {t("name_on_card")}
            </Text>
            <Textinput
              customStyle={true}
              cursorColor={"white"}
              error={nameOnCardError}
              customFont={nameOnCardError ? Colors.red : Colors.white}
              textInputTabStyle={[
                styles.textinputTab,
                {
                  borderColor: nameOnCardError ? Colors.red : Colors.primary,
                  borderWidth: 2,
                },
              ]}
              textInputStyle={styles.textinput}
              value={nameOnCard}
              onChangeText={(text) => {
                setNameOnCard(text);
                setNameOnCardError(null);
              }}
            />
          </View> */}

        {/* <View style={styles.cardNameAndNumberArea}> */}
        {/* <Text style={styles.cardDetailHeadingText}>{t("card_number")}</Text> */}
        {/* <Textinput
              customStyle={true}
              cursorColor={"white"}
              customFont={cardNumberError ? Colors.red : Colors.white}
              error={cardNumberError}
              textInputTabStyle={[
                styles.textinputTab,
                {
                  borderColor: cardNumberError ? Colors.red : Colors.primary,
                  borderWidth: 2,
                },
              ]}
              value={cardNumber}
              textInputStyle={styles.textinput}
              onChangeText={(text) => {
                const formattedText = formatCardNumber(text);
                setCardNumber(formattedText);
                setCardNumberError(null);
              }}
              keyboardType="numeric"
              maxLength={22} // Maximum length with spaces
            /> */}
        <View
          style={{
            // backgroundColor: "pink",
            paddingHorizontal: ScaleSize.spacing_medium,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "100%",
            }}
          >
            <CardField
              postalCodeEnabled={false}
              placeholders={{
                number: "4242 4242 4242 4242",
              }}
              cardStyle={{
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderRadius: ScaleSize.spacing_semi_medium,
                borderColor: Colors.primary,
                textColor: Colors.dark_gray,
              }}
              style={{
                width: "100%",
                height: 50,
                marginVertical: 10,
              }}
              onCardChange={(details) => {
                console.log("DETAILS", details);
                setCardDetails(details);
              }}
              onFocus={(focusedField) => {
                console.log("focusField", focusedField);
              }}
            />
          </View>
        </View>
      </View>
      {/* </View> */}

      {/* <View style={styles.expireDateAndCvvTabArea}>
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
                    borderColor: expireDateError ? Colors.red : Colors.primary,
                    borderWidth: 2,
                  },
                ]}
                textInputStyle={styles.textinput}
                onChangeText={(text) => {
                  setExpireDate(formatDate(text));
                  setExpireDateError(null);
                }}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={styles.expireDateAndCvvArea}>
              <Text style={styles.cardDetailHeadingText}>{t("cvv")}</Text>
              <Textinput
                customStyle={true}
                customFont={Colors.white}
                cursorColor={"white"}
                textInputTabStyle={[
                  styles.textinputTab,
                  {
                    borderColor: cvvError ? Colors.red : Colors.primary,
                    borderWidth: 2,
                  },
                ]}
                textInputStyle={styles.textinput}
                value={cvv}
                onChangeText={(text) => {
                  setCvv(text);
                  setCvvError(null);
                }}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>
          </View>
          {cvvError || expireDateError ? (
            <Text style={styles.errorText}>
              {cvvError ? cvvError : expireDateError}
            </Text>
          ) : null} */}
      {/* </View>
      </View> */}

      <View style={styles.payBtn}>
        <PrimaryButton
          string={t("pay") + " " + "$" + total_amount}
          disabled={isDisabled}
          onPress={() => fetchPaymentIntent()}
          // onPress={() => navigation.navigate("RiderInvoice")}
        />
      </View>
      <AlertBox
        visible={errorAlert}
        title={"Payment Failed"}
        message={alertMsg}
        error={true}
        positiveBtnText={"Ok"}
        onPress={() => {
          setErrorAlert(false);
        }}
      />

      <AlertBox
        visible={successAlert}
        title={"Payment Success"}
        positiveBtnText={"Ok"}
        onPress={() => {
          setSuccessAlert(false);
          handleParams();
        }}
      />
    </ScrollView>
  );
};

export default RiderBookingSummary;

const styles = StyleSheet.create({
  cardStyle: {
    flexDirection: "column",
    textColor: Colors.primary,
    fontFamily: AppFonts.semi_bold,
    color: Colors.primary,
    width: "100%",
    placeholderColor: Colors.primary,
    backgroundColor: "#f0fbfa",
    justifyContent: "center",
    borderRadius: ScaleSize.primary_border_radius - 5,
    alignItems: "center",
    borderWidth: ScaleSize.font_spacing + 1,
    borderColor: Colors.primary,
    borderRadius: ScaleSize.small_border_radius,
    height: 20,
    padding: ScaleSize.spacing_semi_medium,
    paddingVertical: ScaleSize.spacing_medium,
    // marginVertical: ScaleSize.spacing_semi_medium,
  },
  cardField: {
    width: "100%",
    color: Colors.primary,
    placeholder: {
      color: "red", // Placeholder color
    },
    alignSelf: "center",
    flexDirection: "row",
    height: 60,
  },
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    paddingBottom: ScaleSize.spacing_medium,
    paddingHorizontal: ScaleSize.spacing_semi_medium - 5,
  },
  bookingSummaryTabArea: {
    width: "100%",
    justifyContent: "center",
    padding: ScaleSize.spacing_medium,
    alignItems: "center",
  },
  bookingSummaryTab: {
    backgroundColor: Colors.textinput_low_opacity,
    justifyContent: "center",
    borderWidth: ScaleSize.font_spacing,
    borderColor: Colors.primary,
    borderRadius: ScaleSize.small_border_radius,
    borderStyle: "dashed",
    paddingHorizontal: ScaleSize.spacing_medium,
    paddingVertical: ScaleSize.spacing_small,
    alignItems: "center",
  },
  priceSeatsTextArea: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
    alignSelf: "flex-start",
  },
  errorText: {
    fontFamily: AppFonts.medium,
    color: Colors.red,
    marginHorizontal: ScaleSize.spacing_medium,
    alignSelf: "flex-start",
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
  totalAmountLabelText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
    //marginTop: ScaleSize.spacing_medium,
  },
  totalAmountText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_large_text,
    color: Colors.primary,
    //marginTop: ScaleSize.spacing_medium,
  },
  sepraterLine: {
    width: "85%",
    borderTopWidth: ScaleSize.spacing_minimum,
    borderColor: Colors.light_gray,
    margin: ScaleSize.spacing_small,
  },
  cardArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_medium,
    marginBottom: ScaleSize.spacing_large * 3,
  },
  card: {
    width: "100%",
    backgroundColor: Colors.primary,
    justifyContent: "center",
    borderRadius: ScaleSize.primary_border_radius - 5,
    alignItems: "center",
    padding: ScaleSize.spacing_semi_medium,
    paddingVertical: ScaleSize.spacing_medium,
    marginVertical: ScaleSize.spacing_semi_medium,
  },
  cardNameAndNumberArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardDetailsTitleText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
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
    width: "100%",
    backgroundColor: Colors.low_opacity_white,
    margin: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.white,
    justifyContent: "flex-start",
    color: Colors.white,
    alignItems: "center",
  },
  textinput: {
    width: "80%",
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
  payBtn: {
    width: "100%",
    flex: 1,
    bottom: ScaleSize.spacing_semi_medium,
    position: "absolute",
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    position: "absolute",
    left: 35,
    zIndex: 1,
  },
});
// setPaymentIntent(data.payment_intents_id);
// setClientsSecret(data.client_secret);
// const { error } = await initPaymentSheet({
//   merchantDisplayName: "JunnoExpress",
//   paymentIntentClientSecret: data.payment_intents_id,
// });
// if (error) {
//   console.error("Failed to initialize payment sheet", error);
// }
