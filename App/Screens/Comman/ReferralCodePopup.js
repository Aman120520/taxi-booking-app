import {
  StyleSheet,
  Text,
  Modal,
  Image,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import { ModalProgressLoader } from "../../Components/Comman";
import { useTranslation } from "react-i18next";
import { PrimaryButton, Textinput } from "../../Components/Comman";
import { useWindowDimensions } from "react-native";
import Utils from "../../Helpers/Utils";
import { addReferralCode } from "../../Actions/Settings";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ReferralCodePopup = (props) => {
  const dispatch = useDispatch();
  const { userData, isLoading } = useSelector((state) => state.Authentication);
  const { t, i18n } = useTranslation();
  const { width, height } = useWindowDimensions();
  const [referralCode, setReferralCode] = useState("");
  const [referralCodeError, setReferralCodeError] = useState("");

  const valid = async () => {
    var isValid = true;

    if (Utils.isNull(referralCode)) {
      isValid = false;
      setReferralCodeError(t("blank_field_error"));
    } else if (referralCode.length < 6) {
      isValid = false;
      setReferralCodeError(t("Code must be 6 charactors."));
    } else {
      setReferralCodeError(null);
    }

    if (isValid) {
      if (await Utils.isNetworkConnected()) {
        var body = {
          user_id: userData.id,
          used_referral_code: referralCode,
        };
        dispatch(
          addReferralCode(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              await AsyncStorage.setItem("@isReferralCode", "1");
              props.close();
            }
          })
        );
      }
    }
  };

  return (
    <Modal visible={props.visible} transparent={true} animationType="fade">
      <View style={styles.modalBg}>
        <ModalProgressLoader visible={isLoading} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ width: '100%' }}>
          <View style={[styles.modal, { height: height / 1.7 }]}>
            <View style={styles.headerImageContainer}>
              <Image
                source={Images.referral_code_popup}
                style={styles.headerImage}
              />
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => props.close()}
              >
                <Image style={styles.closeIcon} source={Images.close_icon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>{t("referral_code")}</Text>
            <Text style={styles.description}>{t("popup_description")}</Text>
            <View style={styles.tabsContainer}>
              <Textinput
                textInputTabStyle={styles.codeTab}
                textInputStyle={styles.codeTextInput}
                value={referralCode}
                isSecondary={true}
                maxLength={6}
                autoCapitalize={"characters"}
                selectionColor={Colors.secondary}
                onChangeText={(text) => {
                  setReferralCode(text);
                  setReferralCodeError(null);
                }}
              />
              {referralCodeError ? (
                <Text style={styles.errorText}>{referralCodeError}</Text>
              ) : null}

              <View style={styles.submitBtn}>
                <PrimaryButton string={t("submit")} onPress={valid} />
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: "100%",
                alignItems: "center",
              }}
              onPress={async () => {
                await AsyncStorage.setItem("@isReferralCode", "1");
                props.close();
              }}
            >
              <Text style={styles.dontShowAgainText}>{t("dont_show_again")}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default ReferralCodePopup;

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.modal_bg,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  modal: {
    width: "100%",
    alignItems: "center",
    padding: ScaleSize.spacing_very_small + 2,
    borderRadius: ScaleSize.primary_border_radius,
    backgroundColor: Colors.white,
  },
  headerImageContainer: {
    backgroundColor: "#ffe4df",
    justifyContent: "center",
    alignItems: "center",
    flex: 3,
    width: "100%",
    borderRadius: ScaleSize.primary_border_radius - 4,
    height: ScaleSize.spacing_extra_large * 4,
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
    tintColor: Colors.secondary,
    height: ScaleSize.small_icon + 2,
    width: ScaleSize.small_icon + 2,
  },
  title: {
    color: Colors.black,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.medium_text - 2,
    marginTop: ScaleSize.spacing_medium,
  },
  description: {
    fontFamily: AppFonts.medium,
    color: Colors.gray,
    bottom: ScaleSize.font_spacing + 2,
    fontSize: TextFontSize.small_text - 1,
  },
  tabsContainer: {
    flex: 2.2,
    width: "100%",
    height: ScaleSize.spacing_extra_large * 4,
    justifyContent: "center",
    marginVertical: ScaleSize.spacing_semi_medium,
    paddingHorizontal: ScaleSize.spacing_large,
    alignItems: "center",
  },
  codeTab: {
    flexDirection: "row",
    borderWidth: 1.8,
    borderStyle: "dashed",
    backgroundColor: Colors.light_orange,
    borderColor: Colors.secondary,
    color: Colors.secondary,
    width: "100%",
    height: ScaleSize.spacing_large * 1.9,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: ScaleSize.primary_border_radius,
  },
  codeTextInput: {
    color: Colors.black,
    width: "100%",
    textAlign: "center",
    textTransform: "uppercase",
    fontSize: TextFontSize.medium_text - 2,
    fontFamily: AppFonts.semi_bold,
    top: ScaleSize.font_spacing + 2,
  },
  submitBtn: {
    height: ScaleSize.spacing_large * 3,
    width: "100%",
  },
  dontShowAgainText: {
    color: Colors.secondary,
    fontSize: TextFontSize.small_text - 1,
    fontFamily: AppFonts.medium,
    bottom: ScaleSize.spacing_small + 3,
  },
  errorText: {
    top: ScaleSize.spacing_very_small + 2,
    width: "100%",
    paddingLeft: ScaleSize.spacing_medium + 2,
    fontFamily: AppFonts.medium,
    color: Colors.red,
    alignSelf: "flex-start",
  },
});
