import {
  StyleSheet,
  Text,
  Modal,
  Image,
  View,
  TouchableOpacity,
  ImageBackground,
  Button,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ModalProgressLoader,
  PrimaryButton,
  Textinput,
} from "../../Components/Comman";
import { useWindowDimensions } from "react-native";
import Utils from "../../Helpers/Utils";
import { useDispatch, useSelector } from "react-redux";
import {
  useStripe,
  useConfirmPayment,
  CardField,
} from "@stripe/stripe-react-native";
import {
  addSubscription,
  getDriverSubscriptionPlan,
  subscriptionPayment,
} from "../../Actions/Settings";
import AlertBox from "../../Components/Comman/AlertBox";
import { userDetails } from "../../Actions/authentication";
import { debounce } from "lodash";

const SubscriptionPopup = (props) => {
  //////////// useStates //////////
  const { t, i18n } = useTranslation();
  const [cardDetails, setCardDetails] = useState(null);
  const { createPaymentMethod, confirmPayment } = useStripe();
  const dispatch = useDispatch();
  const { width, height } = useWindowDimensions();
  const [cardNumber, setCardNumber] = useState("");
  const [nameOnCard, setNameOnCard] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [cvv, setCvv] = useState("");
  const { userData } = useSelector((state) => state.Authentication);
  const { subPlan, isLoading } = useSelector((state) => state.Settings);
  const [errorAlert, setErrorAlert] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [paymentID, setPaymentID] = useState("");
  const [loading, setLoading] = useState(false);

  //////////// useStates //////////
  const [cardNumberError, setCardNumberError] = useState("");
  const [nameOnCardError, setNameOnCardError] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const [expireDateError, setExpireDateError] = useState("");
  const [cvvError, setCvvError] = useState("");

  const formatCardNumber = (text) => {
    // Add space after every 4 characters
    return text.replace(/\s?([0-9]{4})/g, "$1 ").trim();
  };

  const handleClose = () => {
    // Notify parent to close the modal
    if (props.onClose) {
      props.onClose(); // This callback should be defined in the parent component
    }
  };

  useEffect(() => {
    fetchSubData();
  }, []);

  const fetchSubData = async () => {
    try {
      if (Utils.isNetworkConnected()) {
        dispatch(getDriverSubscriptionPlan());
        console.log("SUB", subPlan);
      }
    } catch {}
  };

  const fetchPaymentIntent = async () => {
    try {
      setIsDisabled(true);
      console.log("CARD DETA", cardDetails);
      if (cardDetails?.complete === true) {
        setLoading(true);
        dispatch(
          addSubscription(
            {
              user_id: userData.id,
              full_name: userData.full_name,
            },
            async (data, isSuccess) => {
              if (isSuccess) {
                try {
                  console.log("CS", data.data.clientSecret);
                  const { error, paymentIntent } = await confirmPayment(
                    data.data.clientSecret,
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
                    setLoading(false);
                    setErrorAlert(true);
                    console.log(error);
                    setIsDisabled(false);
                    setAlertMsg(`${error.message}`);
                  } else if (paymentIntent?.status === "Succeeded") {
                    handleContinue(data, paymentIntent);
                  } else {
                    setIsDisabled(false);
                    setLoading(false);
                    console.error("Payment failed:", paymentIntent.error);
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
    } catch (error) {
      setIsDisabled(false);
      console.error("Error fetching payment intent:", error);
    }
  };

  const handleContinue = async (data, paymentIntent) => {
    try {
      var isValid = true;
      const UserId = await AsyncStorage.getItem("@id");
      const RideId = await AsyncStorage.getItem("@rideId");
      var body = {
        user_id: userData.id,
        subscription_id: data.data.subscriptionId,
        customer_id: data.data.customerId,
        payment_intent_status: paymentIntent.status,
        payment_intent_id: paymentIntent.id,
        payment_intent_amount: subPlan?.driver_subscription_fee,
      };
      if (isValid) {
        dispatch(
          subscriptionPayment(body, async (data, isSuccess) => {
            setIsDisabled(false);
            setLoading(false);
            if (isSuccess === true) {
              setPaymentID(data.data.payment_id);
              var body = {
                user_id: userData.id,
              };
              dispatch(
                userDetails(body, async (data, isSuccess) => {
                  if (isSuccess === true) {
                    setSuccessAlert(true);
                  }
                })
              );
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
      setLoading(false);
    }
  };

  const valid = (card) => {
    var isValid = true;

    if (Utils.isNull(nameOnCard)) {
      isValid = false;
      setNameOnCardError(t("blank_field_error"));
    } else {
      setNameOnCardError(null);
    }

    if (Utils.isNull(cardNumber)) {
      isValid = false;
      setCardNumberError(t("blank_field_error"));
    } else {
      setCardNumberError(null);
    }

    if (Utils.isNull(expireDate)) {
      isValid = false;
      setExpireDateError(t("blank_field_error"));
    } else {
      setExpireDateError(null);
    }

    if (Utils.isNull(cvv)) {
      isValid = false;
      setCvvError(t("blank_field_error"));
    } else {
      setCvvError(null);
    }
  };

  return (
    <Modal visible={props.visible} transparent={true}>
      <ModalProgressLoader visible={isLoading || loading} />
      <View style={styles.modalBg}>
        <View style={[styles.modal, { height: height / 2 }]}>
          <ImageBackground
            source={Images.subscription_bg}
            style={styles.headerImageContainer}
          >
            <View style={styles.priceTextContainer}>
              <Text style={styles.dollarText}>$</Text>
              <Text style={styles.price}>
                {subPlan?.driver_subscription_fee}
              </Text>
              <Text style={styles.yearText}>/{t("year")}</Text>
            </View>
            <Text style={styles.headerDescription}>
              {t("subscription_description")}
            </Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => props.onClose()}
            >
              <Image style={styles.closeIcon} source={Images.close_icon} />
            </TouchableOpacity>
          </ImageBackground>

          <View
            style={{
              paddingHorizontal: ScaleSize.spacing_medium,
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
                marginTop: ScaleSize.spacing_medium + 5,
                marginVertical: ScaleSize.spacing_medium,
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

          {/* <View style={styles.card}>
            <Text style={styles.cardDetailsTitleText}>{t("card_details")}</Text>
            <View style={styles.cardNameAndNumberArea}>
              <Text style={styles.cardDetailHeadingText}>
                {t("name_on_card")}
              </Text>
              <Textinput
                value={nameOnCard}
                numberOfLines={1}
                error={nameOnCardError}
                textInputTabStyle={styles.textinputTab}
                textInputStyle={styles.textinput}
                onChangeText={(text) => {
                  setNameOnCard(text.trim());
                  setNameOnCardError(false);
                }}
              />

              <Text style={styles.cardDetailHeadingText}>
                {t("card_number")}
              </Text>
              <Textinput
                value={formatCardNumber(cardNumber)}
                textInputTabStyle={styles.textinputTab}
                error={cardNumberError}
                textInputStyle={styles.textinput}
                keyboardType={"numeric"}
                maxLength={26}
                onChangeText={(text) => {
                  setCardNumber(text.trim());
                  setCardNumberError(false);
                }}
              />
            </View>

            <View style={styles.expireDateAndCvvTabArea}>
              <View style={styles.expireDateAndCvvArea}>
                <Text style={styles.cardDetailHeadingText}>
                  {t("expire_date")}
                </Text>
                <Textinput
                  value={expireDate}
                  textInputTabStyle={styles.textinputTab}
                  textInputStyle={styles.textinput}
                  keyboardType={"numeric"}
                  maxLength={5}
                  error={expireDateError}
                  onChangeText={(text) => {
                    setExpireDate(
                      text.length === 3 && !text.includes("/")
                        ? `${text.substring(0, 2)}/${text.substring(2)}`
                        : text
                    );
                    setExpireDateError(false);
                  }}
                />
              </View>

              <View style={styles.expireDateAndCvvArea}>
                <Text style={styles.cardDetailHeadingText}>{t("cvv")}</Text>
                <Textinput
                  value={cvv}
                  textInputTabStyle={styles.textinputTab}
                  textInputStyle={styles.textinput}
                  error={cvvError}
                  keyboardType={"numeric"}
                  maxLength={3}
                  onChangeText={(text) => {
                    setCvv(text.trim());
                    setCvvError(false);
                  }}
                />
              </View>
            </View>
          </View> */}

          <PrimaryButton
            customStyle={true}
            buttonStyle={styles.countinueBtn}
            textStyle={styles.countinueBtnText}
            string={t("continue")}
            disabled={isDisabled}
            onPress={fetchPaymentIntent}
          />
        </View>
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
          props.onClose();
          props.navigation.navigate("SubscriptionInvoice", {
            payment_id: paymentID,
          });
        }}
      />
    </Modal>
  );
};

export default SubscriptionPopup;

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  cardStyle: {
    borderColor: "#C3C3C3",
    textColor: "#FFFFFF",
    borderWidth: 1,
    color: "black",
    padding: ScaleSize.spacing_medium,
    borderRadius: ScaleSize.spacing_medium,
  },
  cardField: {
    width: "100%",
    color: "black",
    height: ScaleSize.spacing_extra_large,
    marginVertical: ScaleSize.spacing_medium * 1.5,
  },
  modal: {
    width: "100%",
    alignItems: "center",
    padding: ScaleSize.spacing_very_small + 2,
    borderRadius: ScaleSize.primary_border_radius,
    backgroundColor: Colors.white,
    elevation: 10,
  },
  headerImageContainer: {
    backgroundColor: "#ffe4df",
    justifyContent: "center",
    alignItems: "center",
    flex: 1.3,
    overflow: "hidden",
    resizeMode: "contain",
    width: "100%",
    borderRadius: ScaleSize.primary_border_radius - 4,
  },
  headerImage: {
    height: ScaleSize.large_image,
    width: ScaleSize.medium_image * 2,
    resizeMode: "contain",
  },
  closeBtn: {
    position: "absolute",
    padding: ScaleSize.spacing_very_small,
    right: ScaleSize.spacing_semi_medium,
    top: ScaleSize.spacing_semi_medium,
  },
  closeIcon: {
    tintColor: Colors.white,
    height: ScaleSize.small_icon + 2,
    width: ScaleSize.small_icon + 2,
  },
  title: {
    color: Colors.black,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.medium_text - 2,
    marginTop: ScaleSize.spacing_medium,
  },
  headerDescription: {
    color: Colors.white,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.extra_small_text - 1,
    bottom: ScaleSize.spacing_semi_medium,
  },
  description: {
    fontFamily: AppFonts.medium,
    color: Colors.gray,
    bottom: ScaleSize.font_spacing + 2,
    fontSize: TextFontSize.small_text - 1,
  },
  priceTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    top: ScaleSize.spacing_small,
    paddingVertical: -ScaleSize.spacing_small + 2,
    paddingHorizontal: ScaleSize.spacing_small + 3,
  },
  price: {
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.large_text * 3,
    color: Colors.white,
  },
  dollarText: {
    fontFamily: AppFonts.regular,
    position: "absolute",
    left: -ScaleSize.spacing_very_small,
    top: ScaleSize.spacing_large - 4,
    fontSize: TextFontSize.medium_text,
    color: Colors.white,
  },
  yearText: {
    fontFamily: AppFonts.regular,
    fontSize: TextFontSize.small_text + 2,
    color: Colors.white,
    top: ScaleSize.spacing_semi_medium - 2,
  },
  card: {
    flex: 2,
    justifyContent: "center",
    borderRadius: ScaleSize.primary_border_radius - 5,
    alignItems: "center",
    padding: ScaleSize.spacing_semi_medium,
  },
  cardNameAndNumberArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardDetailsTitleText: {
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
    marginVertical: ScaleSize.spacing_very_small,
    alignSelf: "flex-start",
    left: ScaleSize.spacing_semi_medium,
  },
  cardDetailHeadingText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.black,
    alignSelf: "flex-start",
    left: ScaleSize.spacing_semi_medium,
    marginVertical: ScaleSize.font_spacing + 2,
    marginTop: ScaleSize.spacing_very_small,
  },
  textinputTab: {
    flexDirection: "row",
    height: ScaleSize.spacing_extra_large - 10,
    color: Colors.white,
    backgroundColor: Colors.low_opacity_white,
    paddingHorizontal: ScaleSize.spacing_medium,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.primary,
    borderWidth: 2,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  textinput: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_medium,
    paddingTop: ScaleSize.spacing_semi_medium,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_small,
    color: Colors.primary,
  },
  expireDateAndCvvTabArea: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  expireDateAndCvvArea: {
    flex: 1,
    marginHorizontal: ScaleSize.spacing_very_small - 2,
    justifyContent: "center",
    alignItems: "center",
  },
  countinueBtn: {
    width: "90%",
    margin: ScaleSize.spacing_small,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    padding: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  countinueBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.white,
    fontSize: TextFontSize.small_text,
  },
});
