import {
  Image,
  StyleSheet,
  StatusBar,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  View,
  BackHandler,
} from "react-native";
import React, { useRef, useState, useEffect } from "react";
import {
  PrimaryButton,
  ModalProgressLoader,
  VerificationCodeTextinput,
} from "../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import Utils from "../../Helpers/Utils";
import messaging from "@react-native-firebase/messaging";
import { useDispatch, useSelector } from "react-redux";
import {
  OtpVerification,
  resendOtp,
  userDetails,
} from "../../Actions/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import AlertBox from "../../Components/Comman/AlertBox";

const MobileVerification = ({ navigation, route }) => {
  ////////////////// States //////////////////
  const [firstDigit, setFirstDigit] = useState("");
  const { isLoading, userData } = useSelector((state) => state.Authentication);
  const [secondDigit, setSecondDigit] = useState("");
  const [thirdDigit, setThirdDigit] = useState("");
  const [fourthDigit, setFourthDigit] = useState("");
  const [fifthDigit, setFifthDigit] = useState("");
  const [sixthDigit, setSixthDigit] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberCode, setNumberCode] = useState("");
  const [userId, setUserId] = useState("");
  const { t, i18n } = useTranslation();
  const { isFromEditProfile, isFromMyBookings } = route.params;
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertError, setAlertError] = useState(false);
  const [confirmationAlert, setConfirmationAlert] = useState(false);
  const dispatch = useDispatch();

  ////////////////// Refs //////////////////
  const FirstDigitRef = useRef(null);
  const SecondDigitRef = useRef(null);
  const ThirdDigitRef = useRef(null);
  const FourthDigitRef = useRef(null);
  const FifthDigitRef = useRef(null);
  const SixthDigitRef = useRef(null);
  const backHandlerRef = useRef(null);

  const RESEND_OTP_TIME_LIMIT = 60;

  let resendOtpTimerInterval = "90";

  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );

  //to start resent otp option
  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  ////////////////// UseEffect //////////////////
  useEffect(() => {
    getUser();
    const backHandler = back();
    backHandlerRef.current = backHandler;
    startResendOtpTimer();
    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
      if (backHandlerRef.current) {
        backHandlerRef.current.remove();
      }
    };
  }, [resendButtonDisabledTime]);

  const back = () => {
    const handleBackBtn = () => {
      if (route?.params?.isFromSignUp) {
        navigation.reset({
          index: 0,
          routes: [
            { name: "BottomTabNavigator", screen: "RiderIntercityHomeScreen" },
          ],
        });
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

  const getUser = async () => {
    try {
      const currentUserId = await AsyncStorage.getItem("@id");

      if (isFromEditProfile === true) {
        const updateNumber = await AsyncStorage.getItem("@verifyUpdateNumber");
        const currentNumber = JSON.parse(updateNumber);
        setPhoneNumber(currentNumber);
      } else {
        setPhoneNumber(userData.phone_number);
      }
      setUserId(currentUserId);
      setNumberCode(userData.phone_code);
    } catch (error) {
      console.log(error);
    }
  };

  ////////////////// Function for Validation //////////////////
  const valid = async () => {
    if (Platform.OS === "android") {
      await messaging().registerDeviceForRemoteMessages();
      var token = await messaging().getToken();
    }
    var isValid = true;

    if (
      Utils.isNull(firstDigit) ||
      Utils.isNull(secondDigit) ||
      Utils.isNull(thirdDigit) ||
      Utils.isNull(fourthDigit) ||
      Utils.isNull(fifthDigit) ||
      Utils.isNull(sixthDigit)
    ) {
      isValid = false;
      setAlertMessage("Verification Code is required");
      setAlertVisible(true);
      setAlertTitle("Alert");
      setAlertError(true);
    }

    var body = {
      user_id: userData.id,
      verification_code:
        firstDigit +
        secondDigit +
        thirdDigit +
        fourthDigit +
        fifthDigit +
        sixthDigit,
      device_type: Platform.OS === "ios" ? 1 : 0,
      device_token: Platform.OS === "ios" ? "android" : token,
    };
    if (isValid) {
      if (await Utils.isNetworkConnected()) {
        dispatch(
          OtpVerification(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              handleSubmit(data, isSuccess);
            } else {
              setAlertMessage(data.data.message);
              setAlertVisible(true);
              setAlertTitle("Alert");
              setAlertError(true);
            }
          })
        );
      }
    } else {
      setAlertMessage("Please enter verification code.");
      setAlertError(true);
      setAlertVisible(true);
      setAlertTitle("Alert");
    }
  };

  const handleSubmit = async (data, isSuccess) => {
    var body = {
      user_id: userData.id,
    };
    await dispatch(
      userDetails(body, async (data, isSuccess) => {
        if (isSuccess === true) {
          console.log();
        }
      })
    );
    if (data.data.id) {
      await AsyncStorage.setItem("@id", data.data.id + "");
    }
    await AsyncStorage.setItem(
      "@is_phone_verify",
      data.data.is_phone_verify + ""
    );
    await AsyncStorage.setItem(
      "@authorization_token",
      data.data.authorization_token
    );
    const token = data.data.authorization_token;
    if (isFromEditProfile === true) {
      navigation.goBack();
    } else {
      setTimeout(
        () => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: !isFromMyBookings
                  ? "BottomTabNavigator"
                  : "RoleSelection",
                params: { user_token: token, isFromSignUp: true },
              },
            ],
          });
        },
        Platform.OS === "ios" ? 1000 : 0
      );
    }
  };

  ////////////// Function for resend otp /////////////
  const handleResend = () => {
    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    startResendOtpTimer();
    var body = {
      user_id: userData.id,
      phone_number: phoneNumber,
    };
    dispatch(
      resendOtp(body, async (data, isSuccess) => {
        setConfirmationAlert(false);
        if (isSuccess) {
          setAlertMessage(data.message || "Something went wrong");
          setAlertVisible(true);
          setAlertError(false);
          setAlertTitle("Success");
        } else {
          setAlertMessage(data.message || "Something went wrong");
          setAlertVisible(true);
          setAlertError(true);
          setAlertTitle("Alert");
        }
      })
    );
  };

  ////////////// Function for Back Button /////////////
  const handleBackBtn = () => {
    if (route?.params?.isFromSignUp) {
      navigation.reset({
        index: 0,
        routes: [
          { name: "BottomTabNavigator", screen: "RiderIntercityHomeScreen" },
        ],
      });
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.white} barStyle={"dark-content"} />

        <ModalProgressLoader visible={isLoading} />

        <View style={styles.backBtnArea}>
          <TouchableOpacity onPress={() => handleBackBtn()}>
            <Image style={styles.backBtnIcon} source={Images.backBtn} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerTextArea}>
          <Text style={styles.verificationCodeText}>
            {t("mobile_verification_header_Text")}
          </Text>
          <Text style={styles.descriptionText}>
            {t("mobile_verification_description_Text") + " "}
            <Text style={styles.phoneNumberText}>
              +{numberCode} {phoneNumber}
              <Text style={{ color: Colors.gray }}>.</Text>
            </Text>
          </Text>
          <Text
            style={[
              styles.descriptionText,
              { marginTop: ScaleSize.spacing_small },
            ]}
          >
            {t("mobile_verification_not_receive_code_text") +
              " " +
              t("please_click_here_text")}
            <Text style={styles.resendCodeText}>
              {resendButtonDisabledTime > 0 ? (
                <Text style={styles.resendText}>
                  {resendButtonDisabledTime} S
                </Text>
              ) : (
                <Text
                  onPress={() => setConfirmationAlert(true)}
                  style={styles.resendText}
                >
                  {" " + t("resend")}
                </Text>
              )}
              <Text style={{ color: Colors.gray }}>.</Text>
            </Text>
          </Text>
        </View>

        <View style={styles.textInputArea}>
          <VerificationCodeTextinput
            keyboardType="numeric"
            textAlignVertical="center"
            textAlign="center"
            returnKeyType="next"
            refs={FirstDigitRef}
            maxLength={1}
            autoFocus={false}
            onSubmitEditing={() => SecondDigitRef.current.focus()}
            onChangeText={(text) => {
              setFirstDigit(text);
              if (text.length === 1) {
                SecondDigitRef.current.focus();
              }
            }}
          />

          <VerificationCodeTextinput
            keyboardType="numeric"
            returnKeyType="next"
            refs={SecondDigitRef}
            textAlignVertical="center"
            textAlign="center"
            maxLength={1}
            autoFocus={false}
            onChangeText={(text) => {
              setSecondDigit(text);
              if (text.length === 1) {
                ThirdDigitRef.current.focus();
              }
            }}
            onSubmitEditing={() => ThirdDigitRef.current.focus()}
            onKeyPress={(event) => {
              if (event.nativeEvent.key === "Backspace" && secondDigit === "") {
                FirstDigitRef.current.focus();
              } else if (event.nativeEvent.key === "Backspace") {
                setSecondDigit("");
              }
            }}
          />

          <VerificationCodeTextinput
            keyboardType="numeric"
            returnKeyType="next"
            refs={ThirdDigitRef}
            textAlignVertical="center"
            textAlign="center"
            maxLength={1}
            onSubmitEditing={() => FourthDigitRef.current.focus()}
            onChangeText={(text) => {
              setThirdDigit(text);
              if (text.length === 1) {
                FourthDigitRef.current.focus();
              }
            }}
            onKeyPress={(event) => {
              if (event.nativeEvent.key === "Backspace" && thirdDigit === "") {
                SecondDigitRef.current.focus();
              }
            }}
          />

          <VerificationCodeTextinput
            keyboardType="numeric"
            returnKeyType="next"
            refs={FourthDigitRef}
            maxLength={1}
            textAlignVertical="center"
            textAlign="center"
            onSubmitEditing={() => FifthDigitRef.current.focus()}
            onChangeText={(text) => {
              setFourthDigit(text);
              if (text.length === 1) {
                FifthDigitRef.current.focus();
              }
            }}
            onKeyPress={(event) => {
              if (event.nativeEvent.key === "Backspace" && fourthDigit === "") {
                ThirdDigitRef.current.focus();
              }
            }}
          />

          <VerificationCodeTextinput
            keyboardType="numeric"
            returnKeyType="next"
            refs={FifthDigitRef}
            textAlignVertical="center"
            textAlign="center"
            maxLength={1}
            onSubmitEditing={() => SixthDigitRef.current.focus()}
            onChangeText={(text) => {
              setFifthDigit(text);
              if (text.length === 1) {
                SixthDigitRef.current.focus();
              }
            }}
            onKeyPress={(event) => {
              if (event.nativeEvent.key === "Backspace" && fifthDigit === "") {
                FourthDigitRef.current.focus();
              }
            }}
          />

          <VerificationCodeTextinput
            keyboardType="numeric"
            returnKeyType="done"
            maxLength={1}
            textAlignVertical="center"
            textAlign="center"
            onChangeText={(text) => setSixthDigit(text)}
            refs={SixthDigitRef}
            onKeyPress={(event) => {
              if (event.nativeEvent.key === "Backspace" && sixthDigit === "") {
                FifthDigitRef.current.focus();
              }
            }}
          />
        </View>

        <View style={styles.verfityBtn}>
          <PrimaryButton string={t("verify_code_btn_text")} onPress={valid} />
        </View>

        <AlertBox
          visible={alertVisible}
          title={alertTitle}
          error={alertError}
          message={alertMessage}
          positiveBtnText="OK"
          onPress={() => setAlertVisible(false)}
        />

        <AlertBox
          visible={confirmationAlert}
          title={"Alert"}
          message={t("resend_otp_alert")}
          positiveBtnText="Yes"
          negativeBtnText={"No"}
          onPress={() => {
            setConfirmationAlert(false);
            handleResend();
          }}
          onPressNegative={() => setConfirmationAlert(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default MobileVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_semi_medium,
  },
  backBtnArea: {
    width: "100%",
    alignItems: "flex-start",
  },
  backBtnIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    left: ScaleSize.spacing_very_small,
    resizeMode: "contain",
    marginTop: ScaleSize.spacing_large,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  headerTextArea: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    marginVertical: ScaleSize.spacing_small + 5,
  },
  verificationCodeText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.large_text,
    color: Colors.black,
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    top: ScaleSize.spacing_very_small,
    marginRight: ScaleSize.spacing_small,
    fontSize: TextFontSize.very_small_text + 1,
    color: Colors.gray,
  },
  phoneNumberText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text,
    color: Colors.secondary,
    top: ScaleSize.spacing_very_small,
    bottom: ScaleSize.spacing_very_small,
  },
  resendText: {
    fontFamily: AppFonts.semi_bold,
    top: ScaleSize.spacing_very_small,
    fontSize: TextFontSize.very_small_text,
    color: Colors.secondary,
  },
  verfityBtn: {
    width: "100%",
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_medium,
    position: "absolute",
    bottom: ScaleSize.spacing_medium,
  },
  textInputArea: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: ScaleSize.spacing_medium,
    bottom: ScaleSize.spacing_semi_medium,
    width: "100%",
  },
  textInput: {
    marginHorizontal: ScaleSize.spacing_very_small,
    borderBottomWidth: ScaleSize.spacing_small,
    borderColor: Colors.primary,
  },
  resendCodeText: {
    fontFamily: AppFonts.medium,
    top: ScaleSize.font_spacing + 3,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
    alignItems: "center",
    justifyContent: "center",
  },
});
