import {
  StyleSheet,
  Vibration,
  View,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useRef, useState } from "react";
import {
  PrimaryButton,
  Textinput,
  Header,
  ModalProgressLoader,
} from "../../../Components/Comman";
import { Colors, ScaleSize, AppFonts } from "../../../Resources";
import { sha512 } from "js-sha512";
import Utils from "../../../Helpers/Utils";
import { useDispatch, useSelector } from "react-redux";
import { changePassword } from "../../../Actions/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import AlertBox from "../../../Components/Comman/AlertBox";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePasswordScreen = ({ navigation, route }) => {
  /////////////// States ////////////////
  const [currentPassword, setCurrentPassword] = useState("");
  const { isLoading } = useSelector((state) => state.Authentication);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMsg, setSuccessMessage] = useState(false);
  const ONE_SECOND_IN_MS = 1000;

  ///////////////// Error States /////////////////
  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  /////////// refs ////////////
  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  ///////////// Function for Validation /////////=/////
  const valid = async () => {
    var isValid = true;

    try {
      const UserId = await AsyncStorage.getItem("@id");
      const currentUserId = JSON.parse(UserId);

      if (Utils.isNull(currentPassword)) {
        isValid = false;
        currentPasswordRef.current.focus();
        setCurrentPasswordError(t("blank_field_error"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else if (!Utils.isPasswordValid(currentPassword)) {
        isValid = false;
        currentPasswordRef.current.focus();
        setCurrentPasswordError(t("invalid_password"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else {
        setCurrentPasswordError(null);
      }

      if (Utils.isNull(newPassword)) {
        isValid = false;
        newPasswordRef.current.focus();
        setNewPasswordError(t("blank_field_error"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else if (!Utils.isPasswordValid(newPassword)) {
        isValid = false;
        newPasswordRef.current.focus();
        setNewPasswordError(t("invalid_password"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else if (currentPassword === newPassword) {
        isValid = false;
        newPasswordRef.current.focus();
        setNewPasswordError(t("unique_password_alert"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else {
        setNewPasswordError(null);
      }

      if (Utils.isNull(confirmPassword)) {
        isValid = false;
        confirmPasswordRef.current.focus();
        setConfirmPasswordError(t("blank_field_error"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else if (!Utils.isPasswordValid(confirmPassword)) {
        isValid = false;
        confirmPasswordRef.current.focus();
        setConfirmPasswordError(t("invalid_password"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else if (newPassword !== confirmPassword) {
        isValid = false;
        confirmPasswordRef.current.focus();
        setConfirmPasswordError(t("same_confirm_password"));
        Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
      } else {
        setConfirmPasswordError(null);
      }

      if (
        Utils.isNull(currentPassword) &&
        Utils.isNull(newPassword) &&
        Utils.isNull(confirmPassword)
      ) {
        currentPasswordRef.current?.focus();
      }
      var body = {
        password: sha512(currentPassword),
        new_password: sha512(newPassword),
        user_id: currentUserId,
      };

      if (isValid) {
        if (await Utils.isNetworkConnected()) {
          dispatch(
            changePassword(body, async (data, isSuccess) => {
              if (isSuccess === true) {
                setSuccessAlert(true);
                setSuccessMessage(data.message);
              }
            })
          );
        }
      }
    } catch (error) {
      console.log(error);
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
        <StatusBar backgroundColor={Colors.white} barStyle={"dark-content"} />
        <View style={{ flexGrow: 1, backgroundColor: Colors.white }}>
          <Header
            title={t("change_password")}
            goBack={() => navigation.goBack()}
          />
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps={"always"}
            showsVerticalScrollIndicator={false}
          >
            <ModalProgressLoader visible={isLoading} />

            <View style={[styles.tabArea]}>
              <View
                style={[
                  styles.tabs,
                  {
                    height: currentPasswordError
                      ? 100
                      : ScaleSize.spacing_extra_large * 1.2,
                  },
                ]}
              >
                <Textinput
                  placeholder={t("current_password")}
                  placeholderTextColor={Colors.black}
                  value={currentPassword}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    setCurrentPassword(text);
                    setCurrentPasswordError(false);
                  }}
                  refs={currentPasswordRef}
                  error={currentPasswordError}
                  returnKeyType={"next"}
                  secureTextEntry={true}
                  keyboardType="default"
                  onSubmitEditing={() => {
                    newPasswordRef.current.focus();
                  }}
                />
              </View>

              <View
                style={[
                  styles.tabs,
                  {
                    height:
                      (newPasswordError &&
                        newPasswordError === t("blank_field_error")) ||
                      newPasswordError === t("invalid_password")
                        ? 100
                        : newPasswordError === t("unique_password_alert")
                        ? 140
                        : ScaleSize.spacing_extra_large * 1.2,
                  },
                ]}
              >
                <Textinput
                  placeholder={t("new_password")}
                  placeholderTextColor={Colors.black}
                  value={newPassword}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    setNewPassword(text);
                    setNewPasswordError(false);
                  }}
                  refs={newPasswordRef}
                  error={newPasswordError}
                  returnKeyType={"next"}
                  secureTextEntry={true}
                  keyboardType="default"
                  onSubmitEditing={() => {
                    confirmPasswordRef.current.focus();
                  }}
                />
              </View>

              <View
                style={[
                  styles.tabs,
                  {
                    height: confirmPasswordError
                      ? 100
                      : ScaleSize.spacing_extra_large * 1.2,
                  },
                ]}
              >
                <Textinput
                  placeholder={t("confirm_password")}
                  placeholderTextColor={Colors.black}
                  value={confirmPassword}
                  autoCapitalize="none"
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setConfirmPasswordError(false);
                  }}
                  refs={confirmPasswordRef}
                  error={confirmPasswordError}
                  returnKeyType={"done"}
                  secureTextEntry={true}
                  keyboardType="default"
                  onSubmitEditing={valid}
                />
              </View>
            </View>
            <View style={styles.updateBtn}>
              <PrimaryButton string={t("update_password")} onPress={valid} />
            </View>

            <AlertBox
              visible={successAlert}
              title={"Success"}
              message={successMsg}
              positiveBtnText={"OK"}
              onPress={() => {
                setSuccessAlert(false);
                navigation.goBack();
              }}
              onPressNegative={() => setSuccessAlert(false)}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_small,
    backgroundColor: Colors.white,
  },
  tabArea: {
    height: ScaleSize.spacing_large * 4,
    paddingHorizontal: ScaleSize.spacing_medium,
    alignItems: "center",
  },
  tabs: {
    height: ScaleSize.spacing_large * 2.8,
    alignItems: "center",
  },
  updateBtn: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    position: "absolute",
    bottom: ScaleSize.spacing_small,
  },
});
