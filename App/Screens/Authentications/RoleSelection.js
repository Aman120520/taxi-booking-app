import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { PrimaryButton } from "../../Components/Comman";
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

const RoleSelection = ({ navigation, route }) => {
  ////////////////// States //////////////////
  const [isPassengerSelected, setisPassengerSelected] = useState(false);
  const [isDriverSelected, setIsDriverSelected] = useState(true);
  const [isFromSocial, setIsFromSocial] = useState(false);
  const [selectedType, setSelectedType] = useState(1);
  const { t, i18n } = useTranslation();

  //////////////// useEffect ////////////////
  useEffect(() => {
    setTimeout(() => {
      getUser();
    }, 2000);
  }, []);

  ///////////// Function for getUserData /////////////
  const getUser = async () => {
    try {
      const userPlatform = await AsyncStorage.getItem("@isSocialLogin");
      const currnetPlatform = JSON.parse(userPlatform);

      if (userPlatform) {
        isFromSocial(true);
      } else {
        isFromSocial(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  ///////////// Functions for Passenger And Driver Buttons ////////////
  const handlePassengerBtn = () => {
    setSelectedType(1);
    setisPassengerSelected(false);
    setIsDriverSelected(true);
    setisPassengerSelected(false);
  };

  const handleDriverBtn = () => {
    setSelectedType(2);
    setisPassengerSelected(true);
    setIsDriverSelected(false);
    setisPassengerSelected(true);
  };

  ///////////// Function for next Button //////////
  const handleNextBtn = async () => {
    await AsyncStorage.setItem("@userType", JSON.stringify(selectedType));
    if (isPassengerSelected) {
      navigation.navigate("VerifyIdentityScreen", { isFromSignUp: true });
    } else if (isDriverSelected) {
      var userData = JSON.parse(await AsyncStorage.getItem("@userData"));
      if (userData && isFromSocial === true) {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "BottomTabNavigator",
            },
          ],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "BottomTabNavigator",
              state: {
                index: 0,
                routes: [{ name: "RiderIntercityHomeScreen" }],
              },
            },
          ],
        });
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle={"dark-content"} />
      <View style={styles.topBar}>
        <View style={styles.topBarTextArea}>
          <Text style={styles.headerText}>{t("role_selection")}</Text>
          <Text style={styles.nextStepText}>
            {!isPassengerSelected
              ? t("countinue_as") + " " + t("passenger")
              : "Next: " + t("become_driver")}
          </Text>
        </View>
      </View>

      <View style={styles.headerTextArea}>
        <Text style={styles.roleSelectionText}>
          {t("role_selection_screen_header_text")}
        </Text>
        <Text style={styles.descriptionText}>
          {t("role_selection_screen_description_text")}
        </Text>
      </View>

      <View style={styles.passengerDriverBtnArea}>
        <TouchableOpacity
          style={styles.passengerBtn(isPassengerSelected)}
          onPress={() => handlePassengerBtn()}
        >
          <Image
            source={
              isPassengerSelected
                ? Images.passenger_icon
                : Images.passenger_active_icon
            }
            style={styles.maleFemaleIcon}
          />
          <Text style={styles.passengerBtnText(isPassengerSelected)}>
            {t("passenger")}
          </Text>
          <Image
            source={isPassengerSelected ? null : Images.check_icon}
            style={styles.checkIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.driverBtn(isDriverSelected)}
          onPress={() => handleDriverBtn()}
        >
          <Image
            source={
              isDriverSelected ? Images.driver_icon : Images.driver_active_icon
            }
            style={styles.maleFemaleIcon}
          />
          <Text style={styles.driverBtnText(isDriverSelected)}>
            {t("driver")}
          </Text>
          <Image
            source={isDriverSelected ? null : Images.check_icon}
            style={styles.checkIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.btnArea}>
        <PrimaryButton string={t("next")} onPress={() => handleNextBtn()} />
      </View>
    </View>
  );
};

export default RoleSelection;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    backgroundColor: Colors.white,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    marginTop: ScaleSize.spacing_large,
  },
  topBarTextArea: {
    justifyContent: "center",
    alignItems: "flex-start",
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
  nextStepText: {
    fontFamily: AppFonts.semi_bold,
    bottom: ScaleSize.spacing_very_small,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
  },
  headerTextArea: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    marginVertical: ScaleSize.spacing_medium,
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    top: ScaleSize.font_spacing,
    marginBottom: ScaleSize.font_spacing,
    fontSize: TextFontSize.very_small_text + 1,
    color: Colors.gray,
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
  maleFemaleIcon: {
    height: ScaleSize.medium_image,
    width: ScaleSize.medium_image,
    resizeMode: "contain",
  },
  btnArea: {
    flexDirection: "row",
    alignItems: "center",
    bottom: ScaleSize.spacing_small,
    position: "absolute",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_very_small,
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
