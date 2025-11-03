import {
  ScrollView,
  StyleSheet,
  BackHandler,
  Platform,
  TouchableOpacity,
  Button,
  SafeAreaView,
  Image,
  ImageBackground,
  Text,
  View,
  TextInput,
  StatusBar,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../../Resources";
import {
  PrimaryButton,
  PrimaryDropDown,
  Header,
  ModalProgressLoader,
  Textinput,
} from "../../../Components/Comman";
import Utils from "../../../Helpers/Utils";
import { useDispatch, useSelector } from "react-redux";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { getTimeZone } from "react-native-localize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { getCountries } from "../../../Actions/authentication";
import { scaleZetaToMatchClamps } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";
import {
  updateBankAccountDetails,
  updateGetPaidAccountDetails,
} from "../../../Actions/Settings";
import AlertBox from "../../../Components/Comman/AlertBox";

const GetPaidUpdateDetailsScreen = ({ navigation, route }) => {
  ///////////////// States /////////////////
  const { getPaidAccData } = useSelector((state) => state.Settings);
  const [profileName, setProfileName] = useState(
    getPaidAccData?.business_profile_name
  );
  const [ssn, setSsn] = useState("");
  const [description, setDescription] = useState(
    getPaidAccData?.product_description
  );
  const [country, setCountry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [city, setCity] = useState(getPaidAccData?.city);
  const [address, setAddress] = useState(getPaidAccData?.address);
  const [postalCode, setPostalCode] = useState(getPaidAccData?.postal_code);
  const [holderName, setHolderName] = useState(
    getPaidAccData.account_holder_name
  );
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState(
    getPaidAccData?.routing_number
  );
  const [state, setState] = useState(getPaidAccData?.state);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const [loaderVisible, setLoaderVisible] = useState(false);
  const [timeZone, setTimeZone] = useState("");
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { countryData, userData, isLoading } = useSelector(
    (state) => state.Authentication
  );

  //////////////// useEffect ////////////////
  useEffect(() => {
    dispatch(getCountries());
    get_Time_Zone();
    getCountryName();
  }, [selectedCountry]);

  const getCountryName = () => {
    if (getPaidAccData?.country === "US") {
      setSelectedCountry("United States");
    } else if (getPaidAccData?.country === "IN") {
      setSelectedCountry("India");
    } else if (getPaidAccData?.country === "CA") {
      setSelectedCountry("Canada");
    }
  };

  const get_Time_Zone = () => {
    const time_zone = getTimeZone();
    setTimeZone(time_zone);
  };

  ///////////////// Refs /////////////////
  const profileNameRef = useRef(null);
  const ssnRef = useRef(null);
  const descriptionRef = useRef(null);
  const countryRef = useRef(null);
  const cityRef = useRef(null);
  const addressRef = useRef(null);
  const postalCodeRef = useRef(null);
  const holderNameRef = useRef(null);
  const accountNumberRef = useRef(null);
  const routingNumberRef = useRef(null);
  const stateRef = useRef(null);
  const scrollViewRef = useRef(null);

  ///////////////// Error States /////////////////
  const [profileNameError, setProfileNameError] = useState("");
  const [ssnError, setSsnError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [cityError, setCityError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [postalCodeError, setPostalCodeError] = useState("");
  const [holderNameError, setHolderNameError] = useState("");
  const [accountNumberError, setAccountNumberError] = useState("");
  const [routingNumberError, setRoutingNumberError] = useState("");
  const [stateError, setStateError] = useState("");

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

  const valid = async () => {
    var isValid = true;

    // if (Utils.isNull(profileName)) {
    //   isValid = false;
    //   setProfileNameError(t("blank_field_error"));
    //   scrollViewRef.current?.scrollTo({ y: profileNameRef.current?.y || 0 });
    // } else {
    //   setProfileNameError(null);
    // }

    if (ssn) {
      if (Utils.isNull(ssn)) {
        isValid = false;
        setSsnError(t("blank_field_error"));
        scrollViewRef.current?.scrollTo({ y: ssnRef.current?.y || 0 });
      } else if (ssn.length < 4) {
        isValid = false;
        setSsnError(t("ssn_last4_minimum_required"));
        scrollViewRef.current?.scrollTo({ y: ssnRef.current?.y || 0 });
      } else {
        setSsnError(null);
      }
    }

    if (Utils.isNull(description)) {
      isValid = false;
      setDescriptionError(t("blank_field_error"));
      scrollViewRef.current?.scrollTo({ y: descriptionRef.current?.y || 0 });
    } else {
      setDescriptionError(null);
    }

    if (Utils.isNull(selectedCountry)) {
      isValid = false;
      setCountryError(t("blank_field_error"));
      scrollViewRef.current?.scrollTo({ y: descriptionRef.current?.y || 0 });
    } else {
      setCountryError(null);
    }

    if (Utils.isNull(state)) {
      isValid = false;
      setStateError(t("blank_field_error"));
      scrollViewRef.current?.scrollTo({ y: stateRef.current?.y || 0 });
    } else {
      setStateError(null);
    }

    if (Utils.isNull(city)) {
      isValid = false;
      setCityError(t("blank_field_error"));
      scrollViewRef.current?.scrollTo({ y: cityRef.current?.y || 0 });
    } else {
      setCityError(null);
    }

    if (Utils.isNull(address)) {
      isValid = false;
      setAddressError(t("blank_field_error"));
      scrollViewRef.current?.scrollTo({ y: addressRef.current?.y || 0 });
    } else {
      setAddressError(null);
    }

    if (Utils.isNull(postalCode)) {
      isValid = false;
      setPostalCodeError(t("blank_field_error"));
      scrollViewRef.current?.scrollTo({ y: postalCodeRef.current?.y || 0 });
    } else {
      setPostalCodeError(null);
    }

    if (Utils.isNull(holderName)) {
      isValid = false;
      setHolderNameError(t("blank_field_error"));
      scrollViewRef.current?.scrollTo({ y: holderNameRef.current?.y || 0 });
    } else {
      setHolderNameError(null);
    }

    if (Utils.isNull(accountNumber)) {
      isValid = false;
      setAccountNumberError(t("blank_field_error"));
      scrollViewRef.current?.scrollTo({ y: accountNumberRef.current?.y || 0 });
    } else {
      setAccountNumberError(null);
    }

    if (Utils.isNull(routingNumber)) {
      isValid = false;
      setRoutingNumberError(t("blank_field_error"));
      scrollViewRef.current?.scrollTo({ y: routingNumberRef.current?.y || 0 });
    } else {
      setRoutingNumberError(null);
    }
    if (isValid && Utils.isNetworkConnected()) {
      var body = {
        mode: "edit",
        user_id: userData.id,
        stripe_account_id: getPaidAccData?.stripe_account_id,
        first_name: holderName,
        last_name: holderName,
        email: userData.email,
        phone: userData.phone_number,
        date_of_birth: userData.date_of_birth,
        ssn_last_4: ssn ? ssn : getPaidAccData?.ssn_last_4,
        // business_profile_name: profileName,
        product_description: description,
        country: country ? country.country_code : getPaidAccData?.country,
        state: state,
        city: city,
        address: address,
        postal_code: postalCode,
        currency: country ? country.currency : getPaidAccData?.currency,
      };
      console.log("BODYY", body);
      if (await Utils.isNetworkConnected()) {
        dispatch(
          updateGetPaidAccountDetails(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              handleBankDetails();
            } else {
              setAlertMsg(data.data.message);
              setErrorAlert(true);
            }
          })
        );
      }
    }
  };

  const handleBankDetails = async () => {
    if (Utils.isNetworkConnected()) {
      var body = {
        user_id: userData.id,
        stripe_account_id: getPaidAccData?.stripe_account_id,
        country: country ? country.country_code : getPaidAccData?.country,
        account_holder_name: holderName,
        account_number: accountNumber,
        routing_number: routingNumber,
        currency: country ? country.currency : getPaidAccData?.currency,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          updateBankAccountDetails(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setAlertMsg(data.message);
              setSuccessAlert(true);
            } else {
              setAlertMsg(data.data.message);
              setErrorAlert(true);
            }
          })
        );
      }
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
        <ModalProgressLoader visible={isLoading} />
        <View style={{ flexGrow: 1, backgroundColor: Colors.white }}>
          <Header
            title={t("Edit Account")}
            goBack={() => navigation.goBack()}
          />
          <AutocompleteDropdownContextProvider>
            <ScrollView
              contentContainerStyle={styles.container}
              persistentScrollbar={true}
              ref={scrollViewRef}
            >
              <StatusBar
                backgroundColor={Colors.white}
                barStyle={"dark-content"}
              />
              {/* <ModalProgressLoader visible={}/>             */}

              <View style={styles.sectionTopBar}>
                <Text style={styles.sectionTitle}>{t("acc_information")}</Text>
              </View>
              <View style={styles.textInputArea}>
                {/* <Text style={styles.titleText}>
                  {t("business_profile_name")}
                </Text>
                <Textinput
                  placeholderTextColor={Colors.black}
                  refs={profileNameRef}
                  value={profileName}
                  error={profileNameError}
                  returnKeyType={"next"}
                  keyboardType="default"
                  onChangeText={(text) => {
                    setProfileName(text);
                    setProfileNameError(false);
                  }}
                  onSubmitEditing={() => {
                    ssnRef.current.focus();
                  }}
                /> */}

                <Text style={styles.titleText}>{t("SSN Last 4")}</Text>
                <Textinput
                  placeholderTextColor={Colors.black}
                  refs={ssnRef}
                  value={ssn}
                  error={ssnError}
                  maxLength={4}
                  returnKeyType={"next"}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setSsn(text.trim());
                    setSsnError(false);
                  }}
                  onSubmitEditing={() => {
                    descriptionRef.current.focus();
                  }}
                />

                <Text style={styles.titleText}>{t("your_bio")}</Text>
                <Textinput
                  placeholderTextColor={Colors.black}
                  refs={descriptionRef}
                  autoCapitalize="none"
                  value={description}
                  error={descriptionError}
                  returnKeyType={"next"}
                  keyboardType="email-address"
                  onChangeText={(text) => {
                    setDescription(text);
                    setDescriptionError(false);
                  }}
                />
              </View>

              <View style={styles.sectionTopBar}>
                <Text style={styles.sectionTitle}>{t("billing_address")}</Text>
              </View>
              <View style={styles.textInputArea}>
                <Text style={styles.titleText}>{t("country")}</Text>
                <PrimaryDropDown
                  data={countryData}
                  value={selectedCountry}
                  error={countryError}
                  renderItem={(selectedItem) =>
                    (selectedItem && selectedItem.country_name) ||
                    selectedCountry
                  }
                  onSelect={(selectedItem) => {
                    setCountry(selectedItem);
                    setState("");
                    setCity("");
                    setAddress("");
                    setPostalCode("");
                  }}
                />
                {/* {countryError ? (
                  <View style={styles.errorTextArea}>
                    <Text style={styles.errorText}>{countryError}</Text>
                  </View>
                ) : null} */}

                <Text style={styles.titleText}>{t("state_or_province")}</Text>
                <Textinput
                  refs={stateRef}
                  value={state}
                  error={stateError}
                  returnKeyType={"next"}
                  keyboardType="default"
                  onChangeText={(text) => {
                    setState(text);
                    setStateError(false);
                  }}
                  onSubmitEditing={() => {
                    cityRef.current.focus();
                  }}
                />

                <Text style={styles.titleText}>{t("city")}</Text>
                <Textinput
                  placeholderTextColor={Colors.black}
                  refs={cityRef}
                  value={city}
                  error={cityError}
                  returnKeyType={"next"}
                  keyboardType="default"
                  onChangeText={(text) => {
                    setCity(text);
                    setCityError(false);
                  }}
                  onSubmitEditing={() => {
                    addressRef.current.focus();
                  }}
                />

                <Text style={styles.titleText}>{t("address")}</Text>
                <Textinput
                  placeholderTextColor={Colors.black}
                  refs={addressRef}
                  autoCapitalize="none"
                  value={address}
                  error={addressError}
                  returnKeyType={"next"}
                  keyboardType="email-address"
                  onChangeText={(text) => {
                    setAddress(text);
                    setAddressError(false);
                  }}
                  onSubmitEditing={() => {
                    postalCodeRef.current.focus();
                  }}
                />

                <Text style={styles.titleText}>{t("postal_code")}</Text>
                <Textinput
                  placeholderTextColor={Colors.black}
                  refs={postalCodeRef}
                  value={postalCode + ""}
                  error={postalCodeError}
                  returnKeyType={"next"}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setPostalCode(text.trim());
                    setPostalCodeError(false);
                  }}
                  onSubmitEditing={() => {
                    holderNameRef.current.focus();
                  }}
                />
              </View>
              <View style={styles.sectionTopBar}>
                <Text style={styles.sectionTitle}>{t("bank_accounts")}</Text>
              </View>

              <View style={styles.textInputArea}>
                <Text style={styles.titleText}>{t("acc_holder_name")}</Text>
                <Textinput
                  placeholderTextColor={Colors.black}
                  refs={holderNameRef}
                  value={holderName}
                  error={holderNameError}
                  returnKeyType={"next"}
                  keyboardType="default"
                  onChangeText={(text) => {
                    setHolderName(text);
                    setHolderNameError(false);
                  }}
                  onSubmitEditing={() => {
                    accountNumberRef.current.focus();
                  }}
                />

                <Text style={styles.titleText}>{t("acc_number")}</Text>
                <Textinput
                  placeholderTextColor={Colors.black}
                  refs={accountNumberRef}
                  autoCapitalize="none"
                  value={accountNumber}
                  error={accountNumberError}
                  returnKeyType={"next"}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setAccountNumber(text.trim());
                    setAccountNumberError(false);
                  }}
                  onSubmitEditing={() => {
                    routingNumberRef.current.focus();
                  }}
                />

                <Text style={styles.titleText}>{t("routing_number")}</Text>
                <Textinput
                  placeholderTextColor={Colors.black}
                  refs={routingNumberRef}
                  value={routingNumber + ""}
                  error={routingNumberError}
                  returnKeyType={"next"}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setRoutingNumber(text.trim());
                    setRoutingNumberError(false);
                  }}
                />
                <PrimaryButton
                  string={t("save")}
                  onPress={valid}
                  // onPress={() => { navigation.navigate('GetPaidDetailsScreen') }}
                />
              </View>
            </ScrollView>
            <AlertBox
              visible={successAlert}
              message={alertMsg}
              title={"Success"}
              positiveBtnText={"OK"}
              onPress={() => {
                setSuccessAlert(false);
                navigation.goBack();
              }}
            />

            <AlertBox
              visible={errorAlert}
              title={"Error"}
              message={alertMsg}
              error={true}
              positiveBtnText={"OK"}
              onPress={() => {
                setErrorAlert(false);
              }}
            />
          </AutocompleteDropdownContextProvider>
        </View>
      </SafeAreaView>
    </>
  );
};

export default GetPaidUpdateDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingBottom: ScaleSize.spacing_extra_large,
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  textInputArea: {
    flex: 1,
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    alignItems: "center",
  },
  headerTextArea: {
    flex: 1,
    marginTop: ScaleSize.spacing_very_large,
    paddingRight: ScaleSize.spacing_very_large,
    marginVertical: ScaleSize.spacing_small,
  },
  create_account_text: {
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
  pickerBtn: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectListIcons: {
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    top: ScaleSize.spacing_medium,
    left: ScaleSize.spacing_medium,
    bottom: 0,
    position: "absolute",
    resizeMode: "contain",
    tintColor: Colors.primary,
  },
  selectList: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    paddingVertical: ScaleSize.spacing_medium,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    margin: ScaleSize.spacing_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  dropDown: {
    width: ScaleSize.spacing_large * 2,
    marginRight: -ScaleSize.spacing_semi_medium,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  datePickerArea: {
    width: "100%",
    flexDirection: "row",
    margin: ScaleSize.spacing_small,
    alignSelf: "center",
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    padding: ScaleSize.spacing_medium,
    paddingHorizontal: ScaleSize.spacing_large,
    justifyContent: "flex-start",
    alignItems: "center",
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
  arrowIcon: {
    height: ScaleSize.very_small_icon,
    width: ScaleSize.very_small_icon,
    tintColor: Colors.primary,
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
    alignItems: "flex-start",
  },
  termsOfSerivceBtnArea: {
    flexDirection: "row",
    right: ScaleSize.spacing_very_small,
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
  sepraterArea: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: ScaleSize.spacing_semi_medium,
  },
  sepraterLine: {
    backgroundColor: Colors.textinput_low_opacity,
    height: ScaleSize.seprater_line_height,
    width: ScaleSize.seprater_line_width,
  },
  sepraterHeadingText: {
    color: Colors.black,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.small_text,
    marginHorizontal: ScaleSize.spacing_medium,
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
  genderTabIcon: {
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    marginLeft: ScaleSize.spacing_small,
    marginRight: ScaleSize.spacing_small + 2,
    resizeMode: "contain",
    tintColor: Colors.primary,
  },
  datePickerAreaStyles: (isDateConfirmed) => ({
    width: "100%",
    height: ScaleSize.spacing_extra_large - 5,
    flexDirection: "row",
    backgroundColor: isDateConfirmed
      ? Colors.textinput_low_opacity
      : Colors.white,
    margin: ScaleSize.spacing_small,
    alignSelf: "center",
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    paddingVertical: ScaleSize.spacing_semi_medium + 3,
    paddingHorizontal: ScaleSize.spacing_large,
    justifyContent: "flex-start",
    alignItems: "center",
  }),
  genderDropDownTextStyles: (genderSelected) => ({
    fontFamily: AppFonts.semi_bold,
    textAlignVertical: "center",
    fontSize: TextFontSize.very_small_text,
    color: genderSelected ? Colors.primary : Colors.black,
    position: "absolute",
    top: ScaleSize.spacing_font,
  }),
  signinBtnPrimary: {
    width: "100%",
    flex: 1,
    marginVertical: -ScaleSize.spacing_very_small,
    marginBottom: -ScaleSize.spacing_small,
  },
  referralCodeTab: (isReferralFocused) => ({
    flexDirection: "row",
    width: "90%",
    height: ScaleSize.spacing_extra_large - 5,
    backgroundColor: isReferralFocused
      ? Colors.textinput_low_opacity
      : Colors.white,
    margin: ScaleSize.spacing_small,
    padding: ScaleSize.spacing_very_small,
    paddingLeft: ScaleSize.spacing_large - 2,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    justifyContent: "flex-start",
    alignItems: "center",
  }),
  referralCodeTextInput: {
    width: "80%",
    height: "100%",
    top: ScaleSize.font_spacing,
    justifyContent: "center",
    alignItems: "center",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_small,
    color: Colors.primary,
  },
  referralCodeIcon: {
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    right: ScaleSize.spacing_very_small,
    resizeMode: "contain",
    tintColor: Colors.primary,
  },
  referralCodePlaceholder: {
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
  },
  optionalText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: Colors.gray,
    fontSize: ScaleSize.very_small_text,
    fontFamily: AppFonts.medium_italic,
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
  stateTab: (isReferralFocused) => ({
    flexDirection: "row",
    width: "90%",
    height: ScaleSize.spacing_extra_large - 5,
    backgroundColor: isReferralFocused
      ? Colors.textinput_low_opacity
      : Colors.white,
    margin: ScaleSize.spacing_small,
    padding: ScaleSize.spacing_very_small,
    paddingLeft: ScaleSize.spacing_large - 2,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    justifyContent: "flex-start",
    alignItems: "center",
  }),
  dropDownMenuStyle: {
    margin: ScaleSize.spacing_small + 2,
    width: "100%",
  },
  dropDownMenuText: {
    color: "black",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
  },
  sectionTitle: {
    fontSize: TextFontSize.small_text + 1,
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
  },
  sectionTopBar: {
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_medium + 2,
    alignSelf: "flex-start",
    marginVertical: ScaleSize.spacing_small,
  },
  titleText: {
    color: Colors.black,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    top: ScaleSize.font_spacing,
    alignSelf: "flex-start",
    marginLeft: ScaleSize.spacing_semi_medium,
  },
});
