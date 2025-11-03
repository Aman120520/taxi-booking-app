import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Header } from "../../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Clipboard from "@react-native-clipboard/clipboard";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReferralCodeScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const { userData } = useSelector((state) => state.Authentication);
  const [referralCode, setReferralCode] = useState(userData?.my_referral_code);

  useEffect(() => {
    getUserData();
  }, [])

  const getUserData = async () => {
    try {
      const referralCode = await AsyncStorage.getItem("@referral");
      if (userData) {
        setReferralCode(referralCode);
      }
    } catch { }
  };

  const copyToClipboard = () => {
    console.log(userData);
    Clipboard.setString(referralCode);
    alert("Referral code copied to clipboard successfully! ")
  };

  return (
    <>
      <SafeAreaView style={{ flexGrow: 1, backgroundColor: Colors.white }}>
        <Header title={t("referral_code")} goBack={() => navigation.goBack()} />
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerImageContainer}>
            <Image
              source={Images.referral_code_popup}
              style={styles.headerImage}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.copyCodeDescription}>{t("copy_code")}</Text>
          </View>

          <Text style={styles.inviteSuggestionText}>
            {t("your_code_to_invite")}
          </Text>

          <View style={styles.codeTabContainer}>
            <View style={styles.codeTab}>
              <Text style={styles.codeText}>{referralCode}</Text>
              <TouchableOpacity
                style={styles.copyBtn}
                onPress={copyToClipboard}
              >
                <Text style={styles.copyBtnText}>{t("copy")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default ReferralCodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_medium + 5,
  },
  headerImageContainer: {
    backgroundColor: "#ffe4df",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: ScaleSize.primary_border_radius,
    height: ScaleSize.spacing_extra_large * 3.5,
  },
  headerImage: {
    height: ScaleSize.large_image,
    width: ScaleSize.medium_image * 2,
    resizeMode: "contain",
  },
  textContainer: {
    alignItems: "center",
    marginVertical: ScaleSize.spacing_large,
  },
  copyCodeDescription: {
    fontSize: TextFontSize.small_text + 2,
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
  },
  inviteSuggestionText: {
    bottom: ScaleSize.spacing_medium,
    alignSelf: "center",
    color: Colors.gray,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.small_text,
  },
  codeTabContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_large,
  },
  codeTab: {
    flexDirection: "row",
    borderWidth: 1.8,
    borderStyle: "dashed",
    backgroundColor: Colors.light_orange,
    borderColor: Colors.secondary,
    width: "100%",
    height: ScaleSize.spacing_large * 2,
    padding: ScaleSize.spacing_very_small - 1,
    paddingLeft: ScaleSize.spacing_medium + 5,
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: ScaleSize.primary_border_radius,
  },
  codeText: {
    color: Colors.secondary,
    fontSize: TextFontSize.medium_text - 2,
    fontFamily: AppFonts.medium,
    top: ScaleSize.font_spacing,
  },
  copyBtn: {
    backgroundColor: Colors.secondary,
    height: "100%",
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_medium + 5,
  },
  copyBtnText: {
    color: Colors.white,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text + 1,
  },
});
