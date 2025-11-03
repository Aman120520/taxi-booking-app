import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Image,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import {
  PrimaryButton,
  Header,
  ImagePickerDilouge,
  ModalProgressLoader,
  Textinput,
} from "../../../Components/Comman";
import Utils from "../../../Helpers/Utils";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  editProfile,
  getCountries,
  userDetails,
} from "../../../Actions/authentication";
import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../../Resources/Languages/index";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Constant from "../../../Network/Constant";
import AlertBox from "../../../Components/Comman/AlertBox";

const EditProfileScreen = ({ navigation, route }) => {
  ///////////////// States /////////////////
  const dispatch = useDispatch();
  const { userData, isLoading } = useSelector((state) => state.Authentication);
  const [imageChanged, setImageChanged] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);
  const [email, setEmail] = useState(userData?.email);
  const [bio, setBio] = useState(userData?.bio);
  const [oldPhoneNumber, setOldPhoneNumber] = useState(
    userData?.phone_number + ""
  );
  const [numberCode, setNumberCode] = useState({
    id: userData?.country_id + "",
    phone_code: userData?.phone_code + "",
  });
  const [oldNumberCode, setOldNumberCode] = useState({
    id: userData?.country_id,
    phone_code: userData?.phone_code,
  });
  const [popupOpen, setPopupOpen] = useState(false);
  const [number, setNumber] = useState(userData?.phone_number + "");
  const [images, setImages] = useState("");
  const { t } = useTranslation();
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMsg, setSuccessMessage] = useState(false);
  const { countryData, tosData } = useSelector((state) => state.Authentication);
  const countriesList = [
    { label: "Canada +1", value: "+1", enabled: false },
    { label: "India +91", value: "+91" },
    { label: "United State +1", value: "+1" },
    { label: "France +33", value: "+33" },
  ];

  /////////////// useEffect //////////////
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
      };
      dispatch(
        userDetails(body, async (data, isSuccess) => {
          if (isSuccess === true) {
            await dispatch(getCountries());
            setNumberCode({
              id: data?.data?.country_id,
              phone_code: data?.data?.phone_code,
            });
          }
        })
      );
    } catch {}
  };

  ///////////////// Refs /////////////////
  const emailRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const bioRef = useRef(null);

  ///////////////// Error States /////////////////
  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [bioError, setBioError] = useState("");

  ///////////////// Function for Image Picker /////////////////
  const handleTakePicture = () => {
    setPopupOpen(false);
    setTimeout(
      () => {
        ImagePicker.openCamera({
          cropping: true,
          cropperCircleOverlay: true,
          compressImageQuality: 0.4,
        })
          .then((selectedImages) => {
            setImageChanged(true);
            setImages(selectedImages);
          })
          .catch((error) => {
            console.log("Image picker error: ", error);
          });
      },
      Platform.OS === "ios" ? 1000 : 0
    );
  };

  const handleChooseFromGallery = () => {
    setPopupOpen(false);
    setTimeout(
      () => {
        ImagePicker.openPicker({
          mediaType: "photo",
          cropping: true,
          cropperCircleOverlay: true,
          compressImageQuality: 0.4,
        })
          .then((selectedImages) => {
            setImageChanged(true);
            setImages(selectedImages);
          })
          .catch((error) => {
            console.log("Image picker error: ", error);
          });
      },
      Platform.OS === "ios" ? 1000 : 0
    );
  };

  ///////////////// Function for validation //////////////////
  const valid = async () => {
    var isValid = true;

    if (Utils.isNull(images)) {
    }

    if (Utils.isNull(email)) {
      isValid = false;
      emailRef.current.focus();
      setEmailError(t("blank_field_error"));
    } else if (!Utils.isEmailValid(email)) {
      isValid = false;
      emailRef.current.focus();
      setEmailError(t("invalid_email"));
    } else {
      setEmailError(null);
    }

    if (Utils.isNull(number)) {
      isValid = false;
      setPhoneNumberError(t("blank_field_error"));
    } else if (number.length < 10) {
      isValid = false;
      setPhoneNumberError(t("phone_number_text"));
    } else {
      setPhoneNumberError(null);
    }

    if (Utils.isNull(bio)) {
      isValid = false;
      bioRef.current.focus();
      setBioError(t("blank_field_error"));
    } else {
      setBioError(null);
    }

    console.log("number", number);
    console.log("oldNUmber", oldPhoneNumber);
    console.log("numberCode", numberCode.phone_code);
    console.log("oldNumberCode", oldNumberCode.phone_code);

    try {
      let body = new FormData();

      const UserId = await AsyncStorage.getItem("@id");
      body.append("user_id", UserId);
      body.append("email", email);
      body.append("phone_code", numberCode.phone_code);
      body.append("phone_number", number);
      body.append("country_id", numberCode.id);
      body.append("bio", bio);
      body.append("old_phone_number", numberCode.phone_code + oldPhoneNumber);
      body.append(
        "current_image",
        userData.profile_picture.replace(
          Constant.BASE_URl + "assets/upload/users/original/",
          ""
        )
      );
      if (images) {
        body.append("profile_picture", {
          uri: images.path,
          type: "image/jpg",
          name: images.path.replace(/^.*[\\/]/, ""),
          filename: images.path.replace(/^.*[\\/]/, ""),
        });
      }

      if (isValid) {
        if (await Utils.isNetworkConnected()) {
          dispatch(
            editProfile(body, async (data, isSuccess) => {
              if (isSuccess === true) {
                // var is_phone_verify = await AsyncStorage.getItem(
                //   "@is_phone_verify"
                // );
                //             if (data.data.is_phone_verify === 1) {
                if (oldPhoneNumber != number) {
                  // is_phone_verify = 1;
                  await AsyncStorage.setItem("@is_phone_verify", "1");
                }
                if (oldNumberCode.phone_code != numberCode.phone_code) {
                  console.log("yes");
                  await AsyncStorage.setItem("@is_phone_verify", "1");
                }
                const UserId = await AsyncStorage.getItem("@id");
                var body = {
                  user_id: UserId,
                };
                dispatch(
                  userDetails(body, async (data, isSuccess) => {
                    if (isSuccess === true) {
                      setSuccessAlert(true);
                      setSuccessMessage("Profile updated successfully.");
                    }
                  })
                );
              }
              // }
            })
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <Header title={t("edit_profile")} goBack={() => navigation.goBack()} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshingData} onRefresh={fetchData} />
          }
        >
          <View style={styles.container}>
            <StatusBar
              backgroundColor={Colors.white}
              barStyle={"dark-content"}
            />

            <ModalProgressLoader visible={isLoading} />

            <View style={styles.profileImageArea}>
              <View>
                <Image source={Images.camera} style={styles.cameraIcon} />
                <TouchableOpacity
                  style={styles.profileImageBtn}
                  onPress={() => {
                    setPopupOpen(true);
                  }}
                >
                  <ImageBackground
                    source={Images.profilePlaceholder}
                    style={{ borderRadius: ScaleSize.primary_border_radius }}
                  >
                    {imageChanged ? (
                      <Image
                        style={styles.profileImage}
                        source={{ uri: images.path }}
                      />
                    ) : (
                      <Image
                        style={styles.profileImage}
                        source={{ uri: userData.profile_picture }}
                      />
                    )}
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.textInputArea}>
              <Text style={styles.titleText}>{t("placeholder_firstname")}</Text>
              <Textinput
                placeholder={t("placeholder_firstname")}
                placeholderTextColor={Colors.black}
                isIcon={false}
                value={userData.first_name}
                isFilled={true}
                editable={false}
              />

              <Text style={styles.titleText}>{t("placeholder_lastname")}</Text>
              <Textinput
                placeholder={t("placeholder_lastname")}
                placeholderTextColor={Colors.black}
                isIcon={false}
                editable={false}
                isFilled={true}
                value={userData.last_name}
              />

              <Text style={styles.titleText}>{t("placeholder_email")}</Text>
              <Textinput
                placeholder={t("placeholder_email")}
                placeholderTextColor={Colors.black}
                refs={emailRef}
                value={email}
                autoCapitalize={false}
                isIcon={false}
                isFilled={true}
                error={emailError}
                returnKeyType={number === "" ? "next" : "done"}
                keyboardType="email-address"
                onChangeText={(text) => {
                  setEmail(text.trim());
                  setEmailError(false);
                }}
                onSubmitEditing={() => {
                  phoneNumberRef.current.focus();
                }}
              />

              <Text style={styles.titleText}>
                {t("placeholder_phone_number")}
              </Text>
              <View style={styles.horizontal_textinput_area}>
                <View style={styles.dropDownArea}>
                  <SelectDropdown
                    style={{ width: "100%" }}
                    data={countryData}
                    onSelect={(selectedItem) => {
                      setNumberCode(selectedItem);
                    }}
                    renderButton={(selectedItem) => {
                      return (
                        <View style={styles.dropSelectedItemContainer}>
                          <Text style={[styles.dropDownSelectedItemText]}>
                            {"+" + (selectedItem && selectedItem.phone_code) ||
                            numberCode
                              ? "+" + numberCode?.phone_code
                              : ""}
                          </Text>
                          <Image
                            source={Images.dropdown_arrow_icon}
                            style={styles.dropDownIcon}
                          />
                        </View>
                      );
                    }}
                    renderItem={(item) => {
                      return (
                        <View style={styles.dropDownMenuStyle}>
                          <Text style={styles.dropDownMenuText}>
                            {"+" + item.phone_code}
                          </Text>
                          <View
                            style={{
                              width: "100%",
                              height: 1,
                              backgroundColor: Colors.light_gray,
                            }}
                          />
                        </View>
                      );
                    }}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={styles.dropDownStyle}
                  />
                </View>

                <View style={styles.phoneNumberArea}>
                  <Textinput
                    textInputTabStyle={[
                      styles.textInputTabStyle(number, phoneNumberError),
                    ]}
                    textInputStyle={styles.textInputStyle(phoneNumberError)}
                    placeholder={t("placeholder_phone_number")}
                    placeholderTextColor={Colors.black}
                    refs={phoneNumberRef}
                    maxLength={10}
                    value={number + ""}
                    isFilled={true}
                    keyboardType="numeric"
                    returnKeyType={number === "" ? "next" : "done"}
                    onChangeText={(text) => {
                      setNumber(text.trim());
                      setPhoneNumberError(false);
                    }}
                  />
                </View>
              </View>

              {phoneNumberError ? (
                <View style={styles.errorTextArea}>
                  <Text style={styles.errorText}>{phoneNumberError}</Text>
                </View>
              ) : null}

              <Text style={styles.titleText}>{t("placeholder_gender")}</Text>
              <Textinput
                placeholder={t("placeholder_gender")}
                placeholderTextColor={Colors.black}
                value={
                  userData?.gender === 1
                    ? t("male")
                    : userData?.gender === 2
                    ? t("female")
                    : t("other")
                }
                isIcon={false}
                editable={false}
                isFilled={true}
              />

              <Text style={styles.titleText}>{t("date_of_birth")}</Text>
              <Textinput
                placeholder={t("date_of_birth")}
                placeholderTextColor={Colors.black}
                value={userData.date_of_birth}
                isIcon={false}
                editable={false}
                isFilled={true}
              />

              <Text style={styles.titleText}>{t("city_of_residence")}</Text>
              <Textinput
                placeholder={t("city_of_residence")}
                placeholderTextColor={Colors.black}
                value={userData.city_of_residence}
                isIcon={false}
                editable={false}
                isFilled={true}
              />

              <Text style={styles.titleText}>{t("state_or_province")}</Text>
              <Textinput
                placeholder={t("state_or_province")}
                placeholderTextColor={Colors.black}
                value={userData.state_or_province}
                isIcon={false}
                editable={false}
                isFilled={true}
              />

              <Text style={styles.titleText}>{t("bio")}</Text>
              <Textinput
                textInputTabStyle={styles.bioInput(bio, bioError)}
                textInputStyle={styles.bigTextInput}
                keyboardType="default"
                returnKeyType={"done"}
                refs={bioRef}
                value={bio}
                error={bioError}
                multiline={true}
                placeholder={t("bio")}
                placeholderTextColor={Colors.black}
                onChangeText={(text) => {
                  setBio(text);
                  setBioError(false);
                }}
              />

              <ImagePickerDilouge
                popupOpen={popupOpen}
                handlePopup={() => setPopupOpen(false)}
                handleTakePicture={handleTakePicture}
                handleChooseFromGallery={handleChooseFromGallery}
              />

              <PrimaryButton
                string={t("update_profile")}
                onPress={() => {
                  valid();
                }}
              />

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
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  uploadBtn: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    borderRadius: 100,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    padding: ScaleSize.spacing_small + 2,
  },
  uploadBtnText: {
    marginTop: ScaleSize.spacing_very_small,
    fontSize: TextFontSize.extra_small_text,
    fontFamily: AppFonts.medium,
    color: Colors.primary,
  },
  modalCancelBtn: {
    padding: ScaleSize.spacing_small + 2,
    margin: ScaleSize.spacing_small,
  },
  modal: {
    backgroundColor: Colors.white,
    width: "100%",
    borderRadius: ScaleSize.small_border_radius,
    padding: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text - 2,
    alignSelf: "flex-start",
    marginBottom: ScaleSize.spacing_small,
    color: Colors.black,
  },
  cameraIcon: {
    tintColor: Colors.primary,
    height: ScaleSize.very_large_icon,
    width: ScaleSize.very_large_icon,
  },
  uploadBtn: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    borderRadius: 100,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    padding: ScaleSize.spacing_small + 2,
  },
  uploadBtnText: {
    marginTop: ScaleSize.spacing_very_small,
    fontSize: TextFontSize.extra_small_text,
    fontFamily: AppFonts.medium,
    color: Colors.primary,
  },
  modalCancelBtn: {
    padding: ScaleSize.spacing_small + 2,
    margin: ScaleSize.spacing_small,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_small,
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  profileImageArea: {
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: ScaleSize.spacing_large,
  },
  profileImageBtn: {
    height: 130,
    width: 130,
    overflow: "hidden",
    marginVertical: ScaleSize.spacing_medium,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    borderRadius: ScaleSize.primary_border_radius,
  },
  cameraIcon: {
    position: "absolute",
    height: ScaleSize.extra_large_icon + 5,
    width: ScaleSize.extra_large_icon + 5,
    right: -ScaleSize.spacing_semi_medium + 2,
    top: ScaleSize.spacing_semi_medium,
    zIndex: 1,
  },
  profileImage: {
    height: "100%",
    zIndex: 1,
    borderRadius: ScaleSize.primary_border_radius,
    width: "100%",
  },
  confirmedProfileImage: {
    height: ScaleSize.semi_medium,
    width: ScaleSize.semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    right: ScaleSize.spacing_medium,
  },
  textInputArea: {
    paddingHorizontal: ScaleSize.spacing_medium + 2,
    flex: 1,
    alignItems: "center",
  },
  horizontal_textinput_area: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
    width: "100%",
  },
  titleText: {
    color: Colors.black,
    alignSelf: "flex-start",
    top: ScaleSize.spacing_very_small,
    fontFamily: AppFonts.semi_bold,
    left: ScaleSize.spacing_very_small,
  },
  dropDown: {
    width: ScaleSize.spacing_large * 2,
    marginRight: -ScaleSize.spacing_semi_medium,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  title: {
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.semi_bold,
    top: ScaleSize.spacing_minimum,
    left: ScaleSize.spacing_semi_medium,
    color: Colors.primary,
  },
  item: {
    fontFamily: AppFonts.medium,
  },
  phoneNumberArea: {
    width: "65%",
    alignItems: "flex-end",
  },
  errorTextArea: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    width: "100%",
    bottom: ScaleSize.spacing_very_small,
    flex: 1,
    paddingLeft: ScaleSize.spacing_medium + 2,
  },
  errorText: {
    fontFamily: AppFonts.medium,
    color: Colors.red,
    alignSelf: "flex-start",
  },
  dropSelectedItemContainer: {
    width: "70%",
    height: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_semi_medium + 2,
    paddingRight: ScaleSize.spacing_large,
  },
  dropDownSelectedItemText: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.semi_bold,
    color: Colors.primary,
  },
  dropDownMenuStyle: {
    margin: ScaleSize.spacing_small + 2,
    flex: 1,
  },
  dropDownMenuText: {
    color: "black",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
  },
  dropDownStyle: {
    width: "40%",
    flex: 1,
    justifyContent: "center",
    marginTop: ScaleSize.spacing_semi_medium,
    alignSelf: "flex-start",
    borderRadius: ScaleSize.small_border_radius,
    elevation: 10,
    padding: ScaleSize.spacing_small + 2,
  },
  dropDownIcon: {
    height: ScaleSize.spacing_small,
    width: ScaleSize.spacing_small,
    marginLeft: ScaleSize.spacing_very_small,
    tintColor: Colors.primary,
    resizeMode: "contain",
  },
  dropDownArea: {
    width: "35%",
    height: ScaleSize.spacing_extra_large - 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.textinput_low_opacity,
    borderWidth: ScaleSize.primary_border_width,
    marginRight: ScaleSize.spacing_small,
    marginVertical: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_very_small,
    borderColor: Colors.primary,
    borderRadius: ScaleSize.primary_border_radius,
  },
  textInputTabStyle: (number, phoneNumberError) => ({
    flex: 1,
    flexDirection: "row",
    backgroundColor:
      number && !phoneNumberError ? Colors.textinput_low_opacity : Colors.white,
    height: ScaleSize.spacing_extra_large - 10,
    marginVertical: ScaleSize.spacing_small,
    color: phoneNumberError ? Colors.red : Colors.primary,
    paddingVertical: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: phoneNumberError ? Colors.red : Colors.primary,
    alignItems: "center",
  }),
  textInputStyle: (phoneNumberError) => ({
    flex: 1,
    zIndex: -1,
    color: phoneNumberError ? Colors.red : Colors.primary,
    top: ScaleSize.font_spacing,
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_medium,
  }),
  bioInput: (bio, bioError) => ({
    flexDirection: "row",
    width: "100%",
    height: ScaleSize.spacing_extra_large * 1.8,
    backgroundColor: bio ? Colors.textinput_low_opacity : Colors.white,
    margin: ScaleSize.spacing_small,
    padding: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: bioError ? Colors.red : Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  }),
  bigTextInput: {
    position: "relative",
    flex: 1,
    height: ScaleSize.tab_height * 1.3,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    left: ScaleSize.spacing_semi_medium - 2,
    color: Colors.primary,
  },
});
