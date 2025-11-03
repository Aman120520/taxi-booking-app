import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Colors, ScaleSize, TextFontSize, Images } from "../../../Resources";
import PrimaryButton from "../../../Components/Comman/PrimaryButton";
import { AppFonts } from "../../../Resources/AppFonts";
import "../../../Resources/Languages/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

const WelcomeScreen = ({ navigation, route }) => {
  ///////////////States///////////////////
  const [languageBtnPressed, setLanguageBtnPressed] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const { t, i18n } = useTranslation();

  const handleLanguage = async (selectedLanguage) => {
    i18n.changeLanguage(selectedLanguage);
    await AsyncStorage.setItem("@language", selectedLanguage);
  };

  const handleButton = () => {
    setLanguageBtnPressed(!languageBtnPressed);
    if (selectedLanguage === "English") {
      setSelectedLanguage("French");
      handleLanguage("fr");
    } else {
      setSelectedLanguage("English");
      handleLanguage("en");
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={Images.welcome_screen_bg} style={styles.bg_img}>
        <SafeAreaView style={{ flex: 1 }}>
          <TouchableOpacity
            style={
              Platform.OS === "ios" ? styles.headerBtn : styles.languageBtn
            }
            onPress={handleButton}
          >
            <Image style={styles.languageIcon} source={Images.language_icon} />
            <Text style={styles.languageText}>{selectedLanguage}</Text>
          </TouchableOpacity>

          <View style={styles.contentArea}>
            <Text style={styles.headerText}>{t("launch_screen_header")}</Text>
            <Image
              source={Images.welcome_screen_logo}
              style={styles.welcome_logo}
            />
            <Text style={styles.footerText}>{t("launch_screen_footer")}</Text>
          </View>

          <View style={styles.letsGoBtn}>
            <PrimaryButton
              string={t("launch_screen_primary_button")}
              onPress={() => navigation.navigate("OnBoardingScreen")}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bg_img: {
    flex: 1,
    paddingBottom: ScaleSize.spacing_semi_medium,
    justifyContent: "flex-end",
  },
  welcome_logo: {
    height: ScaleSize.medium_image * 1.1,
    width: ScaleSize.large_image * 1.1,
    resizeMode: "contain",
  },
  letsGoBtn: {
    width: "100%",
    height: ScaleSize.spacing_extra_large * 1.3,
    paddingHorizontal: ScaleSize.spacing_large,
    alignSelf: "center",
    alignItems: "center",
    top: Platform.OS === "ios" ? ScaleSize.spacing_medium : null,
  },
  contentArea: {
    width: "100%",
    flex: 1,
    paddingVertical: ScaleSize.spacing_medium,
    top: ScaleSize.spacing_very_large,
    paddingBottom: ScaleSize.spacing_large + 5,
    alignSelf: "center",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingHorizontal: ScaleSize.spacing_large,
  },
  headerText: {
    fontSize: TextFontSize.large_text - 1,
    fontFamily: "Poppins-Medium",
    color: Colors.white,
    marginHorizontal: ScaleSize.spacing_small,
    marginVertical: ScaleSize.spacing_semi_medium,
    right: ScaleSize.spacing_small,
    top: ScaleSize.spacing_small,
  },
  footerText: {
    fontSize: TextFontSize.large_text - 2,
    fontFamily: "Poppins-Medium",
    color: Colors.white,
    marginHorizontal: ScaleSize.spacing_small,
    marginVertical: ScaleSize.spacing_semi_medium,
    right: ScaleSize.spacing_small,
  },
  languageBtn: {
    justifyContent: "center",
    position: "absolute",
    flexDirection: "row",
    top: ScaleSize.spacing_medium,
    right: ScaleSize.spacing_medium,
    alignItems: "center",
    borderWidth: ScaleSize.primary_border_width,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.white,
    padding: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  headerBtn: {
    justifyContent: "center",
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
    right: ScaleSize.spacing_large,
    borderWidth: ScaleSize.primary_border_width,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.white,
    padding: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  languageText: {
    color: Colors.white,
    top: Platform.OS === "ios" ? null : ScaleSize.font_spacing,
    fontFamily: AppFonts.medium,
    left: ScaleSize.spacing_very_small - 2,
  },
  languageIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    right: ScaleSize.spacing_small,
  },
});
