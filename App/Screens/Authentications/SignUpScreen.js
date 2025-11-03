import {
  ScrollView,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  ImageBackground,
  Text,
  View,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import {
  PrimaryButton,
  PrimaryDropDown,
  ImagePickerDilouge,
  ModalProgressLoader,
  Textinput,
} from "../../Components/Comman";
// import { requestNotifications } from "react-native-permissions";
import Utils from "../../Helpers/Utils";
import { sha512 } from "js-sha512";
import SelectDropdown from "react-native-select-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { SignUp } from "../../Actions/authentication";
import { AddProfilePicture } from "../../Actions/authentication";
import { userDetails } from "../../Actions/authentication";
import { GooglePlacesAutoComplete } from "../../Components/Comman/GooglePlacesAutoComplete";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { getTimeZone } from "react-native-localize";
import messaging from "@react-native-firebase/messaging";
import ImagePicker from "react-native-image-crop-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import { getCountries } from "../../Actions/authentication";
import AlertBox from "../../Components/Comman/AlertBox";
import DateTimePicker from "../../Components/Comman/DateTimePicker";
import { SafeAreaView } from "react-native";

const SignUpScreen = ({ navigation, route }) => {
  ///////////////// States /////////////////
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberCode, setNumberCode] = useState("+1");
  const [countryId, setCountryId] = useState("1");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [isStateFocused, setIsStateFocused] = useState(false);
  const [date, setDate] = useState();
  const [openDate, setOpenDate] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDateConfirmed, setIsDateConfirmed] = useState(false);
  const [gender, setGender] = useState("");
  const [isGenderSelected, setIsGenderSelected] = useState(false);
  const [images, setImages] = useState();
  const [genderCode, setGenderCode] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const { t, i18n } = useTranslation();
  const [isAgree, setIsAgree] = useState(false);
  const [isAgreeError, setIsAgreeError] = useState(false);
  const { isFromSocial } = route.params;
  const dispatch = useDispatch();
  const { countryData, tosData } = useSelector((state) => state.Authentication);
  const genderData = [
    { label: "Male", value: 1 },
    { label: "Female", value: 2 },
    { label: "Other", value: 3 },
  ];
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  //////////////// useEffect ////////////////
  useEffect(async () => {
    init();
  }, []);

  async function init() {
    if (await Utils.isNetworkConnected()) {
      dispatch(getCountries());
      get_Time_Zone();
      if (route.params && route.params.social_id) {
        const { firstName, lastName, email } = route.params;
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(email);
      }
    }
  }

  const get_Time_Zone = () => {
    const time_zone = getTimeZone();
    setTimeZone(time_zone);
  };

  ///////////////// Refs /////////////////
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const bioRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);
  const referralCodeRef = useRef(null);
  const datePickerRef = useRef(null);
  const stateRef = useRef(null);
  const imageRef = useRef(null);
  const scrollViewRef = useRef(null);

  ///////////////// Error States /////////////////
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [bioError, setBioError] = useState("");
  const [DateError, setDateError] = useState("");
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");
  const [imageError, setImageError] = useState("");
  const [agreementError, setAgreementError] = useState("");

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

  ///////////////// Function for Image Picker /////////////////
  const handleTakePicture = () => {
    setPopupOpen(false);
    ImagePicker.openCamera({
      cropping: true,
      cropperCircleOverlay: true,
      compressImageQuality: 0.4,
    })
      .then((selectedImages) => {
        setImages(selectedImages);
        setImageError(false);
      })

      .catch((error) => {
        console.log("Image picker error: ", error);
      });
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
            setImages(selectedImages);
            setImageError(false);
          })
          .catch((error) => {
            console.log("Image picker error: ", error);
          });
      },
      Platform.OS === "ios" ? 1500 : 0
    );
  };

  ////////////// Function for confirm profile picture /////////////
  const handleComplete = async (data) => {
    var body = new FormData();
    body.append("user_id", data.data.user_id);
    //if (route.params && route.params.social_id) {
    // body.append("profile_picture", {
    //   uri: route.params.socialProfile,
    //   type: "image/jpg",
    //   name: route.params.socialProfile.replace(/^.*[\\/]/, ""),
    //   filename: route.params.socialProfile.replace(/^.*[\\/]/, ""),
    // });
    //} else
    {
      body.append("profile_picture", {
        uri: images.path,
        type: "image/jpg",
        name: images.path.replace(/^.*[\\/]/, ""),
        filename: images.path.replace(/^.*[\\/]/, ""),
      });
    }

    if (await Utils.isNetworkConnected()) {
      dispatch(
        AddProfilePicture(body, async (data, isSuccess) => {
          if (isSuccess === true) {
            await AsyncStorage.setItem(
              "@userProfile",
              JSON.stringify(data.data.profile_picture)
            );
            var body = {
              user_id: data.data.user_id,
            };
            dispatch(
              userDetails(body, async (data, isSuccess) => {
                setLoaderVisible(false);
                if (isSuccess === true) {
                  // requestNotificationPermission();
                  setTimeout(
                    () => {
                      navigation.replace("MobileVerification", {
                        isFromAccountScreen: false,
                        isFromSignUp: true,
                        isFromEditProfile: false,
                        isFromMyBookings: true,
                      });
                    },
                    Platform.OS === "ios" ? 1000 : 0
                  );
                }
              })
            );
          } else {
            setLoaderVisible(false);
          }
        })
      );
    }
  };

  ///////////////// Function for Validation /////////////////
  const valid = async () => {
    if (Platform.OS === "android") {
      await messaging().registerDeviceForRemoteMessages();
      var token = await messaging().getToken();
    }
    const hashedPassword = sha512(password);
    const language = await AsyncStorage.getItem("@language");

    var isValid = true;

    if (Utils.isEmojis(firstName)) {
      isValid = false;
      firstNameRef.current.focus();
      setFirstNameError(t("emojis_error"));
    } else if (Utils.isNull(firstName)) {
      isValid = false;
      firstNameRef.current.focus();
      setFirstNameError(t("blank_field_error"));
    } else if (firstName.length < 2 || firstName.length > 20) {
      isValid = false;
      firstNameRef.current.focus();
      setFirstNameError(t("Please enter proper firstName"));
    } else {
      setFirstNameError(null);
    }

    if (Utils.isEmojis(lastName)) {
      isValid = false;
      lastNameRef.current.focus();
      setLastNameError(t("emojis_error"));
    } else if (Utils.isNull(lastName)) {
      isValid = false;
      lastNameRef.current.focus();
      setLastNameError(t("blank_field_error"));
    } else if (lastName.length < 2 || lastName.length > 20) {
      isValid = false;
      lastNameRef.current.focus();
      setLastNameError(t("Please enter proper lastName"));
    } else {
      setLastNameError(null);
    }

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

    if (Utils.isNull(phoneNumber)) {
      isValid = false;
      phoneNumberRef.current.focus();
      setPhoneNumberError(t("blank_field_error"));
    } else if (phoneNumber.length < 10) {
      isValid = false;
      phoneNumberRef.current.focus();
      setPhoneNumberError(t("Please enter valid phone number"));
    } else if (Utils.isEmojis(phoneNumber)) {
      isValid = false;
      phoneNumberRef.current.focus();
      setPhoneNumberError(t("blank_field_error"));
    } else {
      setPhoneNumberError(null);
    }

    if (Utils.isNull(password)) {
      if (!route.params || !route.params.social_id) {
        isValid = false;
        passwordRef.current.focus();
        setPasswordError(t("blank_field_error"));
      }
    } else if (!Utils.isPasswordValid(password)) {
      if (!route.params || !route.params.social_id) {
        isValid = false;
        passwordRef.current.focus();
        setPasswordError(t("invalid_password"));
      }
    } else if (Utils.isEmojis(password)) {
      isValid = false;
      passwordRef.current.focus();
      setPasswordError(t("blank_field_error"));
    } else {
      setPasswordError(null);
    }

    if (Utils.isNull(gender)) {
      isValid = false;
      setGenderError(t("blank_field_error"));
    } else {
      setGenderError(null);
    }

    if (Utils.isNull(bio)) {
      isValid = false;
      setBioError(t("blank_field_error"));
    } else {
      setBioError(null);
    }

    if (isDateConfirmed === false) {
      isValid = false;
      setDateError(t("blank_field_error"));
    } else {
      setDateError(null);
    }

    if (Utils.isNull(city)) {
      isValid = false;
      setCityError(t("blank_field_error"));
    } else {
      setCityError(null);
    }

    if (Utils.isNull(state)) {
      isValid = false;
      stateRef.current.focus();
      setStateError(t("blank_field_error"));
    } else {
      setStateError(null);
    }

    if (!isAgree) {
      isValid = false;
      stateRef.current.focus();
      setIsAgreeError(t("blank_field_error"));
    } else {
      setIsAgreeError(null);
    }

    if (!route.params || !route.params.socialProfile || !isFromSocial) {
      if (Utils.isNull(images)) {
        scrollViewRef.current?.scrollTo({ y: imageRef.current?.y || 0 });
        setImageError(t("blank_field_error"));
        isValid = false;
      }
    } else {
      setImageError(null);
    }

    if (route.params || route.params.socialProfile || isFromSocial) {
      if (!route.params.socialProfile) {
        if (Utils.isNull(images)) {
          if (isValid) {
            scrollViewRef.current?.scrollTo({ y: imageRef.current?.y || 0 });
          }
          isValid = false;
        }
      }
    } else {
      setImageError(null);
    }

    if (
      Utils.isNull(firstName) &&
      Utils.isNull(lastName) &&
      Utils.isNull(email) &&
      Utils.isNull(phoneNumber) &&
      Utils.isNull(password) &&
      Utils.isNull(gender) &&
      Utils.isNull(bio) &&
      Utils.isNull(city) &&
      Utils.isNull(state) &&
      !isAgree
    ) {
      scrollViewRef.current?.scrollTo({ y: firstNameRef.current?.y || 0 });
      firstNameRef.current?.focus();
    }

    var body = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: hashedPassword,
      phone_code: numberCode,
      country_id: countryId,
      phone_number: phoneNumber,
      used_referral_code: referralCode,
      city_of_residence: city,
      state_or_province: state,
      bio: bio,
      date_of_birth: date,
      gender: genderCode,
      time_zone: timeZone,
      device_type: Platform.OS === "ios" ? 1 : 0,
      device_token: Platform.OS === "ios" ? "android" : token,
      currnet_language: language,
    };
    var endPoint = "sign_up";
    if (route.params && route.params.social_id) {
      endPoint = "social_signup";
      body.social_id = route.params.social_id;
      body.social_type = route.params.social_type;
      body.socialProfile = route.params.socialProfile;
    } else {
      body.password = hashedPassword;
    }

    if (isValid) {
      if (await Utils.isNetworkConnected()) {
        setLoaderVisible(true);
        dispatch(
          SignUp(body, endPoint, async (data, isSuccess) => {
            if (isSuccess === true) {
              if (referralCode === "") {
                await AsyncStorage.setItem("@isReferralCode", "0");
              }
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
                "@is_phone_verify",
                data.data.is_phone_verify + ""
              );
              await AsyncStorage.setItem(
                "@authorization_token",
                data.data.authorization_token
              );
              if (
                route.params &&
                route.params.social_id &&
                (!images || !images.path)
              ) {
                await AsyncStorage.setItem(
                  "@userProfile",
                  JSON.stringify(data.data.profile_picture)
                );
                var body = {
                  user_id: data.data.user_id,
                };
                dispatch(
                  userDetails(body, async (data, isSuccess) => {
                    if (isSuccess === true) {
                      setLoaderVisible(false);
                      setTimeout(
                        () => {
                          navigation.replace("MobileVerification", {
                            isFromAccountScreen: false,
                            isFromSignUp: true,
                            isFromEditProfile: false,
                            isFromMyBookings: true,
                          });
                        },
                        Platform.OS === "ios" ? 1000 : 0
                      );
                    }
                  })
                );
              } else {
                handleComplete(data);
              }
            } else {
              setAlertMessage(data.data.message || "Something went wrong");
              setAlertVisible(true);
              setLoaderVisible(false);
            }
          })
        );
      }
    }
  };

  ///////////// Functions for Date /////////////
  const handleDateConfirm = (date) => {
    setDate(date);
    setIsDatePickerOpen(true);
    setIsDateConfirmed(true);
    setOpenDate(false);
    setDateError(false);
  };

  ///////////// Functions For render Dropdown Item /////////////
  const renderNumberCodeDropDownItem = (item) => {
    return (
      <View style={styles.dropDownMenuStyle}>
        <Text style={styles.dropDownMenuText}>{item.country_name}</Text>
      </View>
    );
  };

  const handleClear = () => {
    setCity("");
    setState("");
  };
  const cityRef = useRef(null);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.white,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <AutocompleteDropdownContextProvider>
            <View
              onStartShouldSetResponder={() => {
                cityRef?.current?.closeDropDown();
              }}
            >
              <ScrollView
                contentContainerStyle={styles.container}
                persistentScrollbar={true}
                showsVerticalScrollIndicator={false}
                ref={scrollViewRef}
                nestedScrollEnabled
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                contentInsetAdjustmentBehavior="automatic"
              >
                <StatusBar
                  backgroundColor={Colors.white}
                  barStyle={"dark-content"}
                />

                <ModalProgressLoader visible={loaderVisible} />

                <View style={styles.textInputArea}>
                  <View style={styles.headerTextArea}>
                    <Text style={styles.createAccountText}>
                      {t("signup_screen_header")}
                    </Text>
                    <Text style={styles.descriptionText}>
                      {t("signup_screen_description")}
                    </Text>
                  </View>

                  <View style={styles.profileImageArea}>
                    <View>
                      <Image source={Images.camera} style={styles.cameraIcon} />
                      <TouchableOpacity
                        style={[
                          styles.profileImageBtn,
                          {
                            borderWidth: imageError ? 2 : null,
                            borderColor: imageError ? Colors.red : null,
                          },
                        ]}
                        onPress={() => {
                          setPopupOpen(true);
                        }}
                      >
                        <ImageBackground
                          ref={imageRef}
                          source={Images.profilePlaceholder}
                          style={{
                            borderRadius: ScaleSize.primary_border_radius,
                          }}
                        >
                          {images ? (
                            <Image
                              style={styles.profileImage}
                              source={{ uri: images.path }}
                            />
                          ) : route.params ||
                            route.params.social_id ||
                            isFromSocial ? (
                            <Image
                              style={styles.profileImage}
                              source={{ uri: route.params.socialProfile }}
                            />
                          ) : (
                            <Image
                              style={styles.profileImage}
                              source={{ uri: images }}
                            />
                          )}
                        </ImageBackground>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {imageError ? (
                    <View style={styles.errorTextArea}>
                      <Text style={styles.errorText}>{imageError}</Text>
                    </View>
                  ) : null}

                  <Textinput
                    placeholder={t("placeholder_firstname")}
                    placeholderTextColor={Colors.black}
                    source={Images.full_name_icon}
                    refs={firstNameRef}
                    value={firstName}
                    error={firstNameError}
                    maxLength={20}
                    returnKeyType={"next"}
                    keyboardType="default"
                    onChangeText={(text) => {
                      setFirstNameError(false);
                      if (text.trim().length === 0) {
                        setFirstName("");
                        return;
                      }
                      if (/^[a-zA-Z\s]+$/.test(text)) {
                        setFirstName(text.trim().length === 0 ? "" : text);
                      }
                    }}
                    onSubmitEditing={() => {
                      lastNameRef.current.focus();
                    }}
                  />

                  <Textinput
                    placeholder={t("placeholder_lastname")}
                    placeholderTextColor={Colors.black}
                    source={Images.full_name_icon}
                    refs={lastNameRef}
                    value={lastName}
                    error={lastNameError}
                    maxLength={20}
                    returnKeyType={"next"}
                    keyboardType="default"
                    onChangeText={(text) => {
                      setLastNameError(false);
                      if (text.trim().length === 0) {
                        setLastName("");
                        return;
                      }
                      if (/^[a-zA-Z\s]+$/.test(text)) {
                        setLastName(text.trim().length === 0 ? "" : text);
                      }
                    }}
                    onSubmitEditing={() => {
                      emailRef.current.focus();
                    }}
                  />

                  <Textinput
                    placeholder={t("placeholder_email")}
                    placeholderTextColor={Colors.black}
                    source={Images.email_icon}
                    refs={emailRef}
                    autoCapitalize="none"
                    value={email}
                    error={emailError}
                    returnKeyType={"next"}
                    keyboardType="email-address"
                    onChangeText={(text) => {
                      setEmail(text.trim());
                      setEmailError(false);
                    }}
                    onSubmitEditing={() => {
                      phoneNumberRef.current.focus();
                    }}
                  />

                  <View style={styles.horizontalTextinputArea}>
                    <View style={styles.dropDownArea}>
                      <SelectDropdown
                        style={{ width: "100%" }}
                        data={countryData}
                        onSelect={(selectedItem) => {
                          setNumberCode(selectedItem.phone_code);
                          setCountryId(selectedItem.id);
                        }}
                        renderButton={(selectedItem) => {
                          return (
                            <View style={styles.dropSelectedItemContainer}>
                              <Text style={[styles.dropDownSelectedItemText]}>
                                {(selectedItem &&
                                  "+" + selectedItem.phone_code) ||
                                  numberCode}
                              </Text>
                              <Image
                                source={Images.dropdown_arrow_icon}
                                style={styles.dropDownIcon}
                              />
                            </View>
                          );
                        }}
                        renderItem={(item) =>
                          renderNumberCodeDropDownItem(item)
                        }
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropDownStyle}
                      />
                    </View>

                    <View style={styles.phoneNumberArea}>
                      <Textinput
                        textInputTabStyle={[
                          styles.textInputTabStyle(
                            phoneNumber,
                            phoneNumberError
                          ),
                        ]}
                        textInputStyle={styles.textInputStyle(phoneNumberError)}
                        placeholder={t("placeholder_phone_number")}
                        placeholderTextColor={Colors.black}
                        refs={phoneNumberRef}
                        value={phoneNumber}
                        keyboardType="numeric"
                        maxLength={10}
                        returnKeyType={"next"}
                        onChangeText={(text) => {
                          setPhoneNumber(text.trim());
                          setPhoneNumberError(false);
                        }}
                      />
                    </View>
                  </View>

                  {phoneNumberError ? (
                    <View style={styles.errorTextArea}>
                      <Text style={styles.errorText}>{phoneNumberError}</Text>
                    </View>
                  ) : (
                    <Text style={styles.optionalText}>
                      {"(verification code will be sent)"}
                    </Text>
                  )}

                  <PrimaryDropDown
                    data={genderData}
                    value={gender}
                    source={Images.gender_icon}
                    isSelect={isGenderSelected}
                    renderItem={(selectedItem) =>
                      selectedItem && selectedItem.label
                    }
                    error={genderError}
                    string={t("placeholder_gender")}
                    onSelect={(selectedItem) => {
                      setGender(selectedItem.label);
                      setGenderCode(selectedItem.value);
                      setIsGenderSelected(true);
                      setGenderError(false);
                    }}
                  />
                  {/* {genderError ? (
                    <View style={styles.errorTextArea}>
                      <Text style={styles.errorText}>{genderError}</Text>
                    </View>
                  ) : null} */}

                  {!route.params || !route.params.social_id || !isFromSocial ? (
                    <Textinput
                      placeholder={t("placeholder_password")}
                      placeholderTextColor={Colors.black}
                      source={Images.password_icon}
                      value={password}
                      autoCapitalize="none"
                      error={passwordError}
                      onChangeText={(text) => {
                        setPassword(text.trim());
                        setPasswordError(false);
                      }}
                      refs={passwordRef}
                      returnKeyType={"next"}
                      secureTextEntry={true}
                      keyboardType="default"
                    />
                  ) : null}

                  <View style={styles.dateArea}>
                    <DateTimePicker
                      value={date}
                      IconSource={Images.date_icon}
                      placeholderText={t("date_of_birth")}
                      mode="date"
                      minimumDate={new Date("1950-01-01")}
                      maximumDate={new Date()}
                      error={DateError}
                      onConfirm={(date) => {
                        handleDateConfirm(date);
                      }}
                    />
                  </View>

                  <GooglePlacesAutoComplete
                    onSelected={(selectedItem) => {
                      if (selectedItem) {
                        setCity(selectedItem.city);
                        setState(selectedItem.state);
                        setCityError(false);
                        setStateError(false);
                        setIsStateFocused(true);
                      }
                    }}
                    ref={cityRef}
                    isOptional={false}
                    isFromSignUp={true}
                    error={cityError}
                    onClear={handleClear}
                    imageShow={true}
                    placeholder={t("city_of_residence")}
                  />

                  <Textinput
                    placeholder={t("state_or_province")}
                    placeholderTextColor={Colors.black}
                    source={Images.location_icon}
                    value={state}
                    autoCapitalize="none"
                    error={stateError}
                    refs={stateRef}
                    returnKeyType={"next"}
                    keyboardType="default"
                    editable={false}
                  />

                  <Textinput
                    placeholderText={t("placeholder_referral_code_")}
                    keyboardType="default"
                    refs={referralCodeRef}
                    source={Images.referral_code_icon}
                    autoCapitalize="none"
                    returnKeyType={"done"}
                    value={referralCode}
                    isOptional={true}
                    onChangeText={(text) => {
                      setReferralCode(text.trim());
                    }}
                    onSubmitEditing={() => {
                      valid();
                    }}
                  />

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

                  <View style={styles.termsOfSerivceArea}>
                    <TouchableOpacity
                      style={styles.checkBox(isAgree)}
                      onPress={() => {
                        setIsAgreeError(null);
                        setIsAgree(!isAgree);
                      }}
                    >
                      {isAgree ? (
                        <Image
                          source={Images.check}
                          style={styles.checkBoxIcon}
                        />
                      ) : null}
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setIsAgreeError(null);
                        setIsAgree(!isAgree);
                      }}
                    >
                      <Text style={styles.termsOfSerivceText}>
                        {t("terms_of_service")}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={async () => {
                        if (await Utils.isNetworkConnected()) {
                          navigation.navigate("Webview", {
                            isFromSocial: isFromSocial,
                          });
                        }
                      }}
                    >
                      <Text style={styles.termsOfSerivceBtnText}>
                        {t("terms_of_service_btn")}.
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {isAgreeError ? (
                    <View style={styles.errorTextArea}>
                      <Text style={styles.errorText}>{isAgreeError}</Text>
                    </View>
                  ) : null}

                  <View style={styles.signinBtnPrimary}>
                    <PrimaryButton
                      string={t("signup")}
                      onPress={() => {
                        valid();
                      }}
                    />
                  </View>

                  <View style={styles.signinArea}>
                    <Text style={styles.alreadyHaveAccText}>
                      {t("already_have_an_account")}
                    </Text>
                    <TouchableOpacity
                      style={styles.signinBtn}
                      onPress={() => navigation.goBack()}
                    >
                      <Text style={styles.signinBtnText}>
                        {t("signin_small")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <ImagePickerDilouge
                  popupOpen={popupOpen}
                  handlePopup={() => setPopupOpen(false)}
                  handleTakePicture={handleTakePicture}
                  handleChooseFromGallery={handleChooseFromGallery}
                />
              </ScrollView>
              <AlertBox
                visible={alertVisible}
                title="Alert"
                error={true}
                message={alertMessage}
                positiveBtnText="OK"
                onPress={() => setAlertVisible(false)}
              />
            </View>
          </AutocompleteDropdownContextProvider>
        </KeyboardAvoidingView>
        {/* )}         */}
      </SafeAreaView>
    </>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  optionalText: {
    fontFamily: AppFonts.medium_italic,
    color: Colors.gray,
    fontSize: TextFontSize.extra_small_text,
    textAlign: "left",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  webView: {
    flex: 1,
    backgroundColor: "pink",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
  },
  textInputArea: {
    flex: 1,
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    alignItems: "center",
  },
  headerTextArea: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
    marginTop: ScaleSize.spacing_very_large,
    paddingRight: ScaleSize.spacing_large,
    marginVertical: ScaleSize.spacing_small,
  },
  createAccountText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.large_text,
    color: Colors.black,
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    marginRight: ScaleSize.spacing_semi_medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
  },
  horizontalTextinputArea: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dropDown: {
    width: ScaleSize.spacing_large * 2,
    marginRight: -ScaleSize.spacing_semi_medium,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  dateArea: {
    width: "100%",
    flex: 1,
  },
  title: {
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.semi_bold,
    textAlignVertical: "center",
    verticalAlign: "center",
    left: ScaleSize.spacing_very_small - 5,
    color: Colors.primary,
    position: "absolute",
  },
  item: {
    fontFamily: AppFonts.medium,
  },
  phoneNumberArea: {
    width: "65%",
    alignItems: "flex-end",
  },
  termsOfSerivceArea: {
    alignSelf: "flex-start",
    flexDirection: "row",
    top: ScaleSize.font_spacing,
    marginVertical: ScaleSize.spacing_small,
    paddingRight: ScaleSize.spacing_small,
    alignItems: "flex-start",
  },
  termsOfSerivceBtnText: {
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.semi_bold,
    color: Colors.secondary,
    right: ScaleSize.spacing_medium,
  },
  termsOfSerivceText: {
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
    right: ScaleSize.spacing_medium,
  },
  signinArea: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: ScaleSize.spacing_semi_medium,
  },
  alreadyHaveAccText: {
    color: Colors.black,
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.medium,
  },
  signinBtn: {
    padding: ScaleSize.spacing_very_small,
  },
  signinBtnText: {
    color: Colors.secondary,
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.medium,
    textTransform: "capitalize",
  },
  signinBtnPrimary: {
    width: "100%",
    marginVertical: -ScaleSize.spacing_very_small,
    marginBottom: -ScaleSize.spacing_small,
  },
  errorTextArea: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    bottom: ScaleSize.spacing_very_small,
    width: "100%",
    paddingLeft: ScaleSize.spacing_medium + 2,
  },
  errorText: {
    fontFamily: AppFonts.medium,
    color: Colors.red,
    alignSelf: "flex-start",
  },

  callIcon: {
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    left: ScaleSize.spacing_semi_medium,
    resizeMode: "contain",
    tintColor: Colors.primary,
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
    height: ScaleSize.spacing_small + 4,
    tintColor: Colors.primary,
    width: ScaleSize.spacing_small + 4,
    marginLeft: ScaleSize.spacing_very_small,
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
  profileImageBtn: {
    height: 130,
    width: 130,
    overflow: "hidden",
    marginVertical: ScaleSize.spacing_medium,
    borderRadius: ScaleSize.primary_border_radius,
  },
  profileImageArea: {
    flex: 1,
    width: "100%",
    alignItems: "flex-start",
  },
  checkBox: (isAgree) => ({
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    justifyContent: "center",
    alignItems: "center",
    padding: ScaleSize.spacing_very_small,
    marginLeft: ScaleSize.spacing_medium,
    marginRight: ScaleSize.spacing_large,
    borderWidth: ScaleSize.spacing_minimum + 1,
    borderColor: Colors.secondary,
    backgroundColor: isAgree ? Colors.secondary : Colors.light_orange,
    borderRadius: 5,
  }),
  checkBoxIcon: {
    height: ScaleSize.very_small_icon,
    width: ScaleSize.very_small_icon,
  },
  textInputTabStyle: (phoneNumber, phoneNumberError) => ({
    flex: 1,
    flexDirection: "row",
    backgroundColor: phoneNumber ? Colors.textinput_low_opacity : Colors.white,
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
    height: ScaleSize.spacing_extra_large * 1.7,
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
