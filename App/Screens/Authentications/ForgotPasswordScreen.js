import {
  Image,
  StyleSheet,
  StatusBar,
  Text,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import {
  PrimaryButton,
  ModalProgressLoader,
  Textinput,
} from "../../Components/Comman";
import Utils from "../../Helpers/Utils";
import { useDispatch } from "react-redux";
import messaging from "@react-native-firebase/messaging";
import { ForgotPassword } from "../../Actions/authentication";
import "../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import AlertBox from "../../Components/Comman/AlertBox";

const ForgotPasswordScreen = ({ navigation, route }) => {
  ///////////////// States /////////////////
  const [email, setEmail] = useState("");
  const [loaderVisible, setLoaderVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const dispatch = useDispatch();

  ///////////////// Error States /////////////////
  const [emailError, setEmailError] = useState("");

  ///////////////// Refs /////////////////
  const emailRef = useRef(null);

  ///////////////// Function for Validation /////////////////
  const valid = async () => {
    if (Platform.OS === "android") {
      await messaging().registerDeviceForRemoteMessages();
      var token = await messaging().getToken();
    }
    var isValid = true;

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

    var body = {
      email: email,
      device_type: 0,
      device_token: Platform.OS === "ios" ? "android" : token,
    };

    if (isValid) {
      if (await Utils.isNetworkConnected()) {
        setLoaderVisible(true);
        dispatch(
          ForgotPassword(body, async (data, isSuccess) => {
            setLoaderVisible(false);
            if (isSuccess === true) {
              navigation.navigate("SignInScreen");
            } else {
              setAlertMessage(data.data.message || "Something went wrong");
              setAlertVisible(true);
            }
          })
        );
      }
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

        <ModalProgressLoader visible={loaderVisible} />

        <View style={styles.backBtnArea}>
          <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
            <Image style={styles.backBtnIcon} source={Images.backBtn} />
          </TouchableOpacity>
        </View>

        <View style={styles.headerTextArea}>
          <Text style={styles.passwordResetText}>
            {t("forgot_password_header")}
          </Text>
          <Text style={styles.descriptionText}>
            {t("forgot_password_description")}
          </Text>
        </View>

        <View
          style={[
            styles.textInputContainer,
            { height: emailError ? 100 : ScaleSize.spacing_extra_large * 1.2 },
          ]}
        >
          <Textinput
            placeholder={t("forgot_password_email_placeholder")}
            placeholderTextColor={Colors.black}
            source={Images.email_icon}
            refs={emailRef}
            value={email}
            keyboardType="email-address"
            error={emailError}
            returnKeyType={"done"}
            autoCapitalize={"none"}
            onChangeText={(text) => {
              setEmail(text.trim());
              setEmailError(false);
            }}
          />
        </View>

        <View style={styles.button}>
          <PrimaryButton string={t("reset_password")} onPress={valid} />
        </View>

        <AlertBox
          visible={alertVisible}
          title="Alert"
          error={true}
          message={alertMessage}
          positiveBtnText="OK"
          onPress={() => setAlertVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    alignItems: "center",
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
    marginTop: ScaleSize.spacing_medium,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  headerTextArea: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    paddingRight: ScaleSize.spacing_large,
    marginVertical: ScaleSize.spacing_small,
  },
  passwordResetText: {
    fontFamily: AppFonts.semi_bold,
    marginTop: ScaleSize.spacing_small,
    fontSize: TextFontSize.large_text,
    color: Colors.black,
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    marginRight: ScaleSize.spacing_very_large,
    bottom: ScaleSize.font_spacing,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
  },
  textInputContainer: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    alignItems: "center",
  },
  button: {
    width: "100%",
    bottom: ScaleSize.spacing_very_small,
    paddingHorizontal: ScaleSize.spacing_medium,
    height: ScaleSize.spacing_large * 3,
  },
});
