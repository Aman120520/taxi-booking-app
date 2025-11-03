import {
  StyleSheet,
  Text,
  View,
  Vibration,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  PrimaryButton,
  Textinput,
  Header,
  ModalProgressLoader,
} from "../../../Components/Comman";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../../Resources";
import Utils from "../../../Helpers/Utils";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { emailUs } from "../../../Actions/Settings";
import DialogHelper from "../../../Helpers/DilogHelper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EmailUsScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  const { isEmailUsLoading } = useSelector((state) => state.Settings);
  const ONE_SECOND_IN_MS = 1000;

  //////////// States ////////////
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  /////////// Errors ///////////
  const [subjectError, setSubjectError] = useState("");
  const [messageError, setMessageError] = useState("");

  /////////// Refs ///////////
  const subjectRef = useRef(null);
  const messageRef = useRef(null);

  const valid = async () => {
    var isValid = true;
    if (Utils.isNull(subject)) {
      isValid = false;
      Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      setSubjectError(t("blank_field_error"));
    } else {
      setSubjectError(null);
    }

    if (Utils.isNull(message)) {
      isValid = false;
      Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      setMessageError(t("blank_field_error"));
    } else {
      setMessageError(null);
    }

    if (isValid && (await Utils.isNetworkConnected())) {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        subject: subject,
        message: message,
      };
      dispatch(
        emailUs(body, (data, isSuccess) => {
          if (isSuccess) {
            DialogHelper.showAlertOkDialog("", data.message, t("ok"), () => {
              navigation.goBack();
            });
          }
        })
      );
    }
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View style={{ flexGrow: 1, backgroundColor: Colors.white }}>
          <Header
            title={t("contact_support")}
            goBack={() => navigation.goBack()}
          />

          <ModalProgressLoader visible={isEmailUsLoading} />

          <View style={styles.container}>
            <View style={styles.tabContainer}>
              <View
                style={{
                  height: ScaleSize.spacing_large * 2.8,
                  alignItems: "center",
                }}
              >
                <Textinput
                  textInputTabStyle={styles.textInputTabStyle(subjectError)}
                  textInputStyle={styles.textInputStyle(subjectError)}
                  placeholder={t("subject")}
                  placeholderTextColor={Colors.black}
                  refs={subjectRef}
                  value={subject}
                  returnKeyType={"next"}
                  onChangeText={(text) => {
                    setSubject(text.trim());
                    setSubjectError(false);
                  }}
                  onSubmitEditing={() => {
                    subjectRef.current.focus();
                  }}
                />
              </View>
              {subjectError ? (
                <View style={styles.errorTextArea}>
                  <Text style={styles.errorText}>{subjectError}</Text>
                </View>
              ) : null}

              <Textinput
                textInputTabStyle={styles.messageInput(message, messageError)}
                textInputStyle={styles.bigTextInput}
                placeholder={t("message")}
                placeholderTextColor={Colors.black}
                returnKeyType={"done"}
                value={message}
                multiline={true}
                refs={messageRef}
                error={messageError}
                onChangeText={(text) => {
                  setMessage(text);
                  setMessageError(false);
                }}
              />
            </View>
          </View>

          <View style={styles.sendButton}>
            <PrimaryButton string={t("send")} onPress={valid} />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default EmailUsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  tabContainer: {
    height: ScaleSize.spacing_very_large * 4,
    paddingHorizontal: ScaleSize.spacing_medium,
    alignItems: "center",
  },
  messageInput: (message, messageError) => ({
    flexDirection: "row",
    width: "100%",
    backgroundColor:
      message && !messageError ? Colors.textinput_low_opacity : Colors.white,
    margin: ScaleSize.spacing_small,
    // paddingHorizontal: ScaleSize.spacing_very_small,
    // paddingVertical: ScaleSize.spacing_small + 4,
    height: 150,
    borderRadius: ScaleSize.primary_border_radius,
    textAlignVertical: "top",
    borderWidth: ScaleSize.primary_border_width,
    borderColor: messageError ? Colors.red : Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  }),
  bigTextInput: {
    flex: 1,
    // backgroundColor: "pink",
    height: ScaleSize.tab_height,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_medium,
    paddingVertical: ScaleSize.spacing_semi_medium,
    color: Colors.primary,
    // bottom: ScaleSize.spacing_small,
  },
  sendButton: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    position: "absolute",
    bottom: ScaleSize.spacing_small,
  },
  errorTextArea: {
    alignItems: "center",
    alignSelf: "flex-start",
    paddingLeft: ScaleSize.spacing_medium + 5,
    flexDirection: "row",
    justifyContent: "flex-start",
    bottom: ScaleSize.spacing_very_small,
  },
  errorText: {
    fontFamily: AppFonts.medium,
    color: Colors.red,
    alignSelf: "flex-start",
  },
  textInputTabStyle: (subjectError) => ({
    flex: 1,
    flexDirection: "row",
    height: ScaleSize.spacing_extra_large,
    marginVertical: ScaleSize.spacing_small,
    paddingVertical: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: subjectError ? Colors.red : Colors.primary,
    alignItems: "center",
  }),
  textInputStyle: (subjectError) => ({
    flex: 1,
    zIndex: -1,
    top: ScaleSize.font_spacing,
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_medium,
  }),
});
