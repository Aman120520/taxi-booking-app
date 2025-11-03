import {
  Alert,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ModalProgressLoader, PrimaryButton } from "../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import { Inquiry, Environment } from "react-native-persona";
import Constant from "../../Network/Constant";
import { updatePersonaStatus } from "../../Actions/authentication";
import Utils from "../../Helpers/Utils";
import { useDispatch } from "react-redux";

const VerifyIdentityScreen = ({ navigation, route }) => {
  ////////////////// States //////////////////
  const [isPassengerSelected, setisPassengerSelected] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isFromSocial, setIsFromSocial] = useState(false);
  const [selectedType, setSelectedType] = useState(1);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  ///////////// Function for next Button //////////
  const handleNextBtn = async () => {
    Inquiry.fromTemplate(Constant.VEIFY_IDENTITY_TEMPLATE_ID)
      .environment(Environment.SANDBOX)
      .onComplete((inquiryId, status, fields) => {
        console.log(inquiryId, " ===> ", status, " ===> ", fields);
        updateVerification(inquiryId);
      })
      .onCanceled((inquiryId, sessionToken) =>
        Alert.alert("Canceled", `Inquiry was cancelled`)
      )
      .onError((error) => {
        console.error("Error details: ", error);
      })
      .build()
      .start();
  };

  const updateVerification = async (persona_verification_id) => {
    try {
      if (await Utils.isNetworkConnected()) {
        setLoading(true);
        const UserId = await AsyncStorage.getItem("@id");
        var body = {
          user_id: UserId,
          persona_verification_id: persona_verification_id,
          persona_verification_status: 1,
        };
        dispatch(
          updatePersonaStatus(body, navigation, (isSuccess) => {
            setLoading(false);
            if (isSuccess) {
              if (route?.params?.isFromSignUp) {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "AuthenticationNavigator",
                      state: {
                        routes: [
                          {
                            name: "BecomeDriverScreen",
                            params: { isFromAccountScreen: false },
                          },
                        ],
                      },
                    },
                  ],
                });
              } else if (route?.params?.isFromAccountScreen) {
                navigation.goBack();
              } else if (route?.params?.isFromGetBecomeDriver) {
                navigation.replace("AuthenticationNavigator", {
                  screen: "BecomeDriverScreen",
                  params: { isFromAccountScreen: true },
                });
              } else {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "BottomTabNavigator",
                      // params: { user_token: route?.params?.user_token },
                    },
                  ],
                });
              }
            }
          })
        );
      }
    } catch {}
  };

  function closeScreen() {
    if (route?.params?.isFromSignUp) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "BottomTabNavigator",
            params: { user_token: route?.params?.token },
          },
        ],
      });
    } else {
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.white} barStyle={"dark-content"} />

        <View style={styles.backBtnArea}>
          {!route?.params?.isFromSignUp ? (
            <TouchableOpacity onPress={() => closeScreen()}>
              <Image style={styles.backBtnIcon} source={Images.backBtn} />
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtnIcon} source={Images.backBtn} />
          )}
        </View>
        <Image source={Images.verify_user} style={styles.headerIcon} />
        <ModalProgressLoader visible={isLoading} />
        <View style={styles.topBar}>
          <View style={styles.topBarTextArea}>
            <Text style={styles.headerText}>{t("identity_verification")}</Text>
            <Text style={styles.descriptionText}>
              {t("identity_description")}
            </Text>
          </View>
        </View>

        <View style={styles.btnArea}>
          <PrimaryButton
            string={t("begin_verifiying")}
            onPress={() => handleNextBtn()}
          />
          {/* {route?.params?.isFromSignUp ? (
            <PrimaryButton
              customStyle={true}
              buttonStyle={styles.skipBtn}
              textStyle={styles.skipBtnText}
              string={t("skip")}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: "BottomTabNavigator",
                      params: { user_token: route?.params?.user_token },
                    },
                  ],
                });
              }}
            />
          ) : null} */}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerifyIdentityScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    backgroundColor: Colors.white,
    alignItems: "center",
    // paddingTop: ScaleSize.spacing_large,
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
  closeButtonContainer: {
    position: "absolute",
    padding: ScaleSize.spacing_medium,
    top: 0,
    right: 0,
    margin: ScaleSize.spacing_small,
  },
  skipBtn: {
    backgroundColor: Colors.white,
    height: ScaleSize.spacing_extra_large - 5,
    flex: 1,
    width: "100%",
    marginHorizontal: ScaleSize.spacing_semi_medium,
    marginBottom: ScaleSize.spacing_semi_medium,
    alignSelf: "center",
    padding: ScaleSize.spacing_semi_medium,
    borderColor: Colors.gray,
    borderWidth: 1,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  skipBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.gray,
    top: Platform.OS === "ios" ? null : ScaleSize.font_spacing,
    fontSize: TextFontSize.small_text,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "center",
    marginTop: ScaleSize.spacing_large / 2,
  },
  topBarTextArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    height: ScaleSize.very_small_icon,
    width: ScaleSize.very_small_icon,
    resizeMode: "contain",
    tintColor: Colors.gray,
  },
  roleSelectionText: {
    fontFamily: AppFonts.bold,
    top: ScaleSize.spacing_very_small,
    fontSize: TextFontSize.large_text - 2,
    color: Colors.black,
  },
  headerText: {
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.large_text,
    color: Colors.black,
  },
  descriptionText: {
    fontFamily: AppFonts.semi_bold,
    bottom: ScaleSize.spacing_very_small,
    textAlign: "center",
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
  },
  headerTextArea: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    marginVertical: ScaleSize.spacing_medium,
  },
  passengerDriverBtnArea: {
    width: "100%",
    top: ScaleSize.spacing_small,
    flexDirection: "row",
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkIcon: {
    height: ScaleSize.large_icon * 1.1,
    width: ScaleSize.large_icon * 1.1,
    resizeMode: "contain",
    position: "absolute",
    top: ScaleSize.spacing_semi_medium,
    right: ScaleSize.spacing_semi_medium,
  },
  headerIcon: {
    height: ScaleSize.medium_image,
    width: ScaleSize.medium_image,
    marginTop: ScaleSize.spacing_large,
    resizeMode: "contain",
  },
  btnArea: {
    alignItems: "center",
    bottom: ScaleSize.spacing_semi_medium,
    position: "absolute",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_semi_medium,
  },
  nextBtn: {
    width: "50%",
  },
  passengerBtn: (isPassengerSelected) => ({
    borderRadius: ScaleSize.primary_border_radius * 0.8,
    padding: ScaleSize.spacing_small,
    backgroundColor: isPassengerSelected
      ? Colors.white
      : Colors.textinput_low_opacity,
    borderColor: isPassengerSelected ? Colors.black : Colors.primary,
    flex: 0.7,
    marginVertical: ScaleSize.spacing_very_small,
    marginRight: ScaleSize.spacing_semi_medium,
    borderWidth: ScaleSize.primary_border_width,
    justifyContent: "center",
    alignItems: "center",
  }),
  passengerBtnText: (isPassengerSelected) => ({
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text - 1,
    color: isPassengerSelected ? Colors.black : Colors.primary,
    bottom: ScaleSize.spacing_small,
  }),
  driverBtn: (isDriverSelected) => ({
    borderRadius: ScaleSize.primary_border_radius * 0.8,
    padding: ScaleSize.spacing_small,
    backgroundColor: isDriverSelected
      ? Colors.white
      : Colors.textinput_low_opacity,
    borderColor: isDriverSelected ? Colors.black : Colors.primary,
    flex: 0.7,
    marginVertical: ScaleSize.spacing_very_small,
    marginLeft: ScaleSize.spacing_semi_medium,
    borderWidth: ScaleSize.primary_border_width,
    justifyContent: "center",
    alignItems: "center",
  }),
  driverBtnText: (isDriverSelected) => ({
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text - 1,
    color: isDriverSelected ? Colors.black : Colors.primary,
    bottom: ScaleSize.spacing_small,
  }),
});
