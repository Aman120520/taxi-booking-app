import {
  Image,
  ScrollView,
  Platform,
  StatusBar,
  StyleSheet,
  PermissionsAndroid,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";
import React, { useState, useRef } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import {
  ModalProgressLoader,
  PrimaryButton,
  SocialButton,
  Textinput,
} from "../../Components/Comman";
import Utils from "../../Helpers/Utils";
import { useDispatch, useSelector } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import {
  SignIn,
  checkSocialId,
  userDetails,
} from "../../Actions/authentication";
import SocialLoginHelperService from "../../Helpers/SocialLoginHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import { sha512 } from "js-sha512";
//import { requestNotifications } from "react-native-permissions";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AlertBox from "../../Components/Comman/AlertBox";
import { useIsFocused } from "@react-navigation/native";
import {
  AppleButton,
  AppleRequestResponseFullName,
  appleAuth,
} from "@invertase/react-native-apple-authentication";
import { jwtDecode } from "jwt-decode";

const SignInScreen = ({ navigation, route }) => {
  ////////////// States ///////////////
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isLoading, userData } = useSelector((state) => state.Authentication);
  const dispatch = useDispatch();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // async function requestNotificationPermission() {
  //   try {
  //     if (Platform.OS === "android" && Platform.Version >= 11) {
  //       const { status } = await requestNotifications(["alert", "sound"]);
  //       if (status === "granted") {
  //         console.log("Notification permission granted");
  //       } else {
  //         console.log("Notification permission denied");
  //       }
  //     } else if (Platform.OS === "android") {
  //       const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
  //       );
  //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //         console.log("Notification permission granted");
  //       } else {
  //         console.log("Notification permission denied");
  //       }
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // }

  ////////////// Erros //////////////
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  ////////////// Refs ///////////////
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const scrollViewRef = useRef(null);

  ////////////// Function for validation /////////////
  const valid = async () => {
    var isValid = true;
    if (Platform.OS === "android") {
      await messaging().registerDeviceForRemoteMessages();
      var token = await messaging().getToken();
    }

    const hashedPassword = sha512(password);
    const language = await AsyncStorage.getItem("@language");

    if (Utils.isNull(email)) {
      isValid = false;
      emailRef.current.focus();
      setEmailError(t("blank_field_error"));
    } else if (!Utils.isEmailValid(email)) {
      isValid = false;
      emailRef.current.focus();
      setEmailError(t("invalid_email"));
    } else if (Utils.isEmojis(email)) {
      isValid = false;
      emailRef.current.focus();
      setEmailError(t("emojis_error"));
    } else {
      setEmailError(null);
    }

    if (Utils.isNull(password)) {
      isValid = false;
      passwordRef.current.focus();
      setPasswordError(t("blank_field_error"));
    } else if (Utils.isEmojis(password)) {
      isValid = false;
      passwordRef.current.focus();
      setPasswordError(t("emojis_error"));
    } else {
      setPasswordError(null);
    }

    if (Utils.isNull(email) && Utils.isNull(password)) {
      scrollViewRef.current?.scrollTo({ y: emailRef.current?.y || 0 });
      emailRef.current?.focus();
    }
    var body = {
      email: email,
      password: hashedPassword,
      device_type: Platform.OS === "ios" ? 1 : 0,
      device_token: Platform.OS === "ios" ? "android" : token,
      currnet_language: language,
    };
    if (isValid) {
      if (await Utils.isNetworkConnected()) {
        dispatch(
          SignIn(body, async (data, isSuccess) => {
            console.log("TOKENNNN", data.data.authorization_token);
            if (isSuccess === true) {
              await AsyncStorage.setItem(
                "@loginData",
                JSON.stringify(data.data)
              );
              await AsyncStorage.setItem(
                "@userData",
                JSON.stringify(data.data)
              );
              await AsyncStorage.setItem("@id", data.data.id + "");
              await AsyncStorage.setItem(
                "@referral",
                data.data.my_referral_code
              );
              await AsyncStorage.setItem(
                "@platform",
                JSON.stringify(data.data.authorization_platform)
              );
              await AsyncStorage.setItem(
                "@is_phone_verify",
                data.data.is_phone_verify + ""
              );
              await AsyncStorage.setItem(
                "@authorization_token",
                data.data.authorization_token
              );
              var body = {
                user_id: data.data.id,
              };
              dispatch(
                userDetails(body, async (data, isSuccess) => {
                  if (isSuccess === true) {
                    if (data.data.used_referral_code === "") {
                      await AsyncStorage.setItem("@isReferralCode", "0");
                    }
                    // requestNotificationPermission();
                    setTimeout(
                      () => {
                        navigation.reset({
                          index: 0,
                          routes: [{ name: "BottomTabNavigator" }],
                        });
                      },
                      Platform.OS === "ios" ? 1000 : 0
                    );
                  }
                })
              );
            } else {
              setAlertMessage(data.data.message || "Something went wrong");
              setAlertVisible(true);
            }
          })
        );
      }
    }
  };

  /////////////// Functions for social login //////////////
  //////// For Google ///////
  function doGoogleLogin() {
    SocialLoginHelperService.signInGoogle()
      .then((socialData) => {
        doSocialLogin(1, socialData);
      })
      .catch(function (error) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          Utils.DialogBox(t("you_have_cancel_login"));
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          Utils.DialogBox(t("unable_to_support_device_login"));
        } else {
          Utils.DialogBox(t("some_thing_went_wrong_please_try_later"));
        }
      });
  }

  //////// For Facebook ///////
  function doFacebookLogin() {
    SocialLoginHelperService.loginWithFacebook()
      .then((data) => doSocialLogin(2, data))
      .catch(function (error) {
        if (error && error !== "") {
          Utils.DialogBox(JSON.stringify(error));
        }
      });
  }

  //////// For Apple Login ///////
  function doAppleLogin() {
    SocialLoginHelperService.onAppleButtonPress()
      .then((data) => doSocialLogin(3, data))
      .catch(function (error) {
        if (error && error !== "") {
          Utils.DialogBox(error);
        }
      });
  }

  async function doSocialLogin(type, socialData) {
    if (Platform.OS === "android") {
      await messaging().registerDeviceForRemoteMessages();
    }
    var token = await messaging().getToken();

    const language = await AsyncStorage.getItem("@language");
    var body = {
      social_type: type,
      social_id: socialData.id,
      device_token: token,
      device_type: Platform.OS === "ios" ? 0 : 1,
      email: socialData.email,
      currnet_language: language,
    };
    dispatch(
      checkSocialId(body, async (data, isSuccess) => {
        if (isSuccess === true) {
          if (data.data.is_exists === 0) {
            console.log("SOCIALDATA", socialData);
            navigation.navigate("SignUpScreen", {
              isFromSocial: true,
              social_id: socialData.social_id,
              name: socialData.name,
              firstName: socialData.first_name,
              lastName: socialData.last_name,
              email: socialData.email,
              gender: socialData.gender,
              socialProfile: socialData.socialProfilePicture,
              social_type: type,
            });
          } else {
            await AsyncStorage.setItem("@userData", JSON.stringify(data.data));
            await AsyncStorage.setItem("@referral", data.data.my_referral_code);
            await AsyncStorage.setItem("@id", data.data.id + "");
            await AsyncStorage.setItem(
              "@platform",
              JSON.stringify(data.data.authorization_platform)
            );
            await AsyncStorage.setItem("@isSocialLogin", "true");
            await AsyncStorage.setItem(
              "@authorization_token",
              data.data.authorization_token
            );
            navigation.reset({
              index: 0,
              routes: [{ name: "BottomTabNavigator" }],
            });
          }
        }
      })
    );
  }

  const isFocused = useIsFocused();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.white,
      }}
    >
      <ScrollView
        scrollEnabled={true}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        persistentScrollbar={true}
        keyboardShouldPersistTaps={"always"}
        contentContainerStyle={styles.container}
      >
        <StatusBar backgroundColor={Colors.white} barStyle={"dark-content"} />

        <Image source={Images.signin_screen_logo} style={styles.logo} />

        <ModalProgressLoader visible={isLoading && isFocused} />

        <View style={styles.headerTextArea}>
          <Text style={styles.headerText}>{t("signin_screen_header")}</Text>
          <Text style={styles.descriptionText}>
            {t("signin_screen_appreciation")}
          </Text>
        </View>

        <View
          style={{ width: "100%", paddingHorizontal: ScaleSize.spacing_medium }}
        >
          <Textinput
            placeholder={t("placeholder_email")}
            placeholderTextColor={Colors.black}
            source={Images.email_icon}
            refs={emailRef}
            value={email}
            inputMode={"email"}
            error={emailError}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType={"next"}
            onChangeText={(text) => {
              setEmail(text.trim());
              setEmailError(false);
            }}
            onSubmitEditing={() => {
              passwordRef.current.focus();
            }}
          />

          <Textinput
            placeholder={t("placeholder_password")}
            placeholderTextColor={Colors.black}
            source={Images.password_icon}
            value={password}
            error={passwordError}
            autoCapitalize="none"
            refs={passwordRef}
            secureTextEntry={true}
            keyboardType="default"
            onChangeText={(text) => {
              setPassword(text.trim());
              setPasswordError(false);
            }}
            onSubmitEditing={valid}
          />
        </View>
        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => navigation.navigate("ForgotPasswordScreen")}
        >
          <Text style={styles.forgotBtnText}>{t("forget_password")}</Text>
        </TouchableOpacity>

        <View
          style={{ width: "100%", paddingHorizontal: ScaleSize.spacing_medium }}
        >
          <PrimaryButton string={t("signin")} onPress={valid} />
        </View>

        <View style={styles.sepraterArea}>
          <View style={styles.sepraterLine}></View>
          <Text style={styles.sepraterHeadingText}>
            {t("or_continue_with")}
          </Text>
          <View style={styles.sepraterLine}></View>
        </View>

        <SocialButton
          onGoogleSignInPress={doGoogleLogin}
          onFacebookSignInPress={doFacebookLogin}
          onAppleSignInPress={doAppleLogin}
        />

        <View style={styles.signupArea}>
          <Text style={styles.dontHaveAccText}>
            {t("dont_have_an_account")}
          </Text>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() =>
              navigation.navigate("SignUpScreen", { isFromSocial: false })
            }
          >
            <Text style={styles.signupBtnText}>{t("signup_small")}</Text>
          </TouchableOpacity>
        </View>
        <AlertBox
          visible={alertVisible}
          title="Alert"
          error={true}
          message={alertMessage}
          positiveBtnText="OK"
          onPress={() => setAlertVisible(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    alignItems: "center",
  },
  logo: {
    marginTop: ScaleSize.spacing_large,
    height: ScaleSize.small_image,
    alignSelf: "flex-start",
    width: ScaleSize.medium_image,
    resizeMode: "contain",
    left: ScaleSize.spacing_medium,
  },
  headerTextArea: {
    width: "100%",
    marginVertical: ScaleSize.spacing_semi_medium,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  headerText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_large_text,
    color: Colors.black,
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    paddingHorizontal: ScaleSize.spacing_large,
    paddingBottom: ScaleSize.spacing_small,
  },
  forgotBtnText: {
    color: Colors.black,
    top: ScaleSize.font_spacing + 2,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text,
  },
  sepraterArea: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: ScaleSize.spacing_small,
    marginBottom: ScaleSize.spacing_medium,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  sepraterLine: {
    backgroundColor: Colors.light_gray,
    height: 1,
    flex: 1,
  },
  sepraterHeadingText: {
    color: Colors.black,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.small_text - 2,
    marginHorizontal: ScaleSize.spacing_medium,
  },
  signupArea: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: ScaleSize.spacing_semi_medium,
  },
  dontHaveAccText: {
    color: Colors.black,
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.medium,
  },
  signupBtn: {
    padding: ScaleSize.spacing_small,
  },
  signupBtnText: {
    color: Colors.secondary,
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.medium,
    textTransform: "capitalize",
  },
});
