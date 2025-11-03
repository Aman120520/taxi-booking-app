import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  BackHandler,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  PrimaryButton,
  Textinput,
  ImagePickerDilouge,
  PrimaryDropDown,
  ModalProgressLoader,
} from "../../../Components/Comman";
import Header from "../../../Components/Comman/Header";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import Utils from "../../../Helpers/Utils";
import moment from "moment";
import "../../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import { CarBrand } from "../../../Actions/authentication";
import { CarMedia } from "../../../Actions/authentication";
import { userDetails } from "../../../Actions/authentication";
import { BecomeDriver } from "../../../Actions/authentication";
import ImagePicker from "react-native-image-crop-picker";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutoComplete } from "../../../Components/Comman/GooglePlacesAutoComplete";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import DateTimePicker from "../../../Components/Comman/DateTimePicker";
import { changeRole } from "../../../Actions/Settings";

const BecomeDriverScreen = ({ navigation, route }) => {
  ////////////////// States /////////////////
  const [carModel, setCarModel] = useState("");
  const { t, i18n } = useTranslation();
  const [carYear, setCarYear] = useState("");
  const [carColor, setCarColor] = useState("");
  const [operationCity, setOperationCity] = useState("");
  const [operationCityId, setOperationCityId] = useState("");
  const [operationCity2, setOperationCity2] = useState("");
  const [operationCityId2, setOperationCityId2] = useState("");
  const [licensePlateNumber, setLicenePlateNumber] = useState("");
  const [registrationImagePath, setRegistrationImagePath] = useState([]);
  const [licenseImagePath, setLicenseImagePath] = useState([]);
  const [carImagePath, setCarImagePath] = useState([]);
  const [isRegistrationImageSelected, setIsRegistrationSelected] =
    useState(false);
  const [isLicenseImageSelected, setLicenseImageSelected] = useState(false);
  const [isCarImageSelected, setIsCarImageSelected] = useState(false);
  const [registerationPressed, setRegistartionPressed] = useState(false);
  const [licensePressed, setLicensePressed] = useState(false);
  const [carImagePressed, setCarImagePressed] = useState(false);
  const [selectedCarBrand, setSelectedCarBrand] = useState();
  const [selectedCarType, setSelectedCarType] = useState();
  const [selectedCountry, setSelectedCountry] = useState();
  const [isFromSocial, setIsFromSocial] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [countryId, setCountryId] = useState("");
  const { isFromAccountScreen } = route.params;
  const dispatch = useDispatch();
  const {
    countryData,
    carBrand,
    carType,
    generalSettingsData,
    isLoading,
    userData,
  } = useSelector((state) => state.Authentication);
  const [date, setDate] = useState(
    moment(userData?.date_of_birth).format("YYYY-MM-DD")
  );

  ///////////////// Error States /////////////////
  const [countryError, setCountryError] = useState("");
  const [carBrandError, setCarBrandError] = useState("");
  const [carTypeError, setCarTypeError] = useState("");
  const [isLoadingDialog, setLoading] = useState("");
  const [carModelError, setCarModelError] = useState("");
  const [carColorError, setCarColorError] = useState("");
  const [carYearError, setCarYearError] = useState("");
  const [licenceError, setLicenceError] = useState("");
  const [DateError, setDateError] = useState("");
  const [licenceImageError, setLicenceImageError] = useState("");
  const [carImageError, setCarImageError] = useState("");
  const [operationCityError, setOperationCityError] = useState("");
  const [operationCity2Error, setOperationCity2Error] = useState("");
  const [isCarBrand, setIsCarBrand] = useState(false);
  const [isCarType, setIsCarType] = useState(false);
  const [isCountry, setIsCountry] = useState(false);

  ////////////////// Refs //////////////////
  const carYearRef = useRef(null);
  const carColorRef = useRef(null);
  const carModelRef = useRef(null);
  const licensePlateNumberRef = useRef(null);
  const datePickerRef = useRef(null);
  const scrollViewRef = useRef(null);
  const operationCityRef = useRef(null);
  const operationCity2Ref = useRef(null);
  const backHandlerRef = useRef(null);

  ////////////////// useEffect /////////////////
  useEffect(() => {
    getUser();
  }, []);

  ////////////////// UseEffect //////////////////
  useEffect(() => {
    const backHandler = back();
    backHandlerRef.current = backHandler;
    return () => {
      if (backHandlerRef.current) {
        backHandlerRef.current.remove();
      }
    };
  }, []);

  const back = () => {
    const handleBackBtn = () => {
      if (isFromAccountScreen === true) {
        navigation.goBack();
      } else {
        navigation.reset({
          index: 0,
          routes: [
            { name: "BottomTabNavigator", screen: "RiderIntercityHomeScreen" },
          ],
        });
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackBtn
    );

    return backHandler;
  };

  const getUser = async () => {
    try {
      if (await Utils.isNetworkConnected()) {
        dispatch(CarBrand());
        const savedUser = await AsyncStorage.getItem("@userData");
        const currentUser = JSON.parse(savedUser);

        // const selectedDate = new Date(
        //   moment(currentUser?.date_of_birth).format("YYYY-MM-DD")
        // );
        // setDate(selectedDate);
        if (currentUser.authorization_platform === 0) {
          isFromSocial(false);
        } else if (currentUser.authorization_platform === 1) {
          isFromSocial(true);
        } else if (currentUser.authorization_platform === 2) {
          isFromSocial(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  ///////////////// Function for Image Picker /////////////////
  const handleSingleTakePicture = () => {
    setPopupOpen(false);
    setTimeout(
      () => {
        ImagePicker.openCamera({
          cropping: true,
          compressImageQuality: 0.4,
        })
          .then((selectedImages) => {
            setRegistrationImagePath(selectedImages);
            setIsRegistrationSelected(true);
          })
          .catch((error) => {
            console.log("Image picker error: ", error);
          });
      },
      Platform.OS === "ios" ? 1000 : 0
    );
  };

  const handleSingleChooseFromGallery = () => {
    setPopupOpen(false);
    setTimeout(
      () => {
        ImagePicker.openPicker({
          mediaType: "photo",
          cropping: true,
          multiple: false,
          compressImageQuality: 0.4,
        })
          .then((selectedImages) => {
            setRegistrationImagePath(selectedImages);
            setIsRegistrationSelected(true);
          })
          .catch((error) => {
            console.log("Image picker error: ", error);
          });
      },
      Platform.OS === "ios" ? 1000 : 0
    );
  };

  ///////// For TakePicture ////////
  const handleTakePicture = async () => {
    setPopupOpen(false);
    setTimeout(
      async () => {
        try {
          const selectedImages = await ImagePicker.openCamera({
            multiple: true,
            mediaType: "photo",
            compressImageQuality: 0.4,
          });

          if (registerationPressed === true) {
            setRegistrationImagePath(selectedImages.path);
            setIsRegistrationSelected(true);
          } else if (licensePressed === true) {
            setLicenseImagePath([...licenseImagePath, selectedImages]);
            setLicenseImageSelected(true);
            setLicenceImageError(false);
          } else if (carImagePressed === true) {
            setCarImagePath([...carImagePath, selectedImages]);
            setIsCarImageSelected(true);
            setCarImageError(false);
          }
        } catch (error) {
          console.log("Error selecting image:", error);
        }
      },
      Platform.OS === "ios" ? 1000 : 0
    );
  };

  ////////// For ChoosePicture ////////////
  const handleChooseFromGallery = () => {
    setPopupOpen(false);
    setTimeout(
      async () => {
        ImagePicker.openPicker({
          multiple: true,
          mediaType: "photo",
          compressImageQuality: 0.4,
        })
          .then((selectedImages) => {
            if (registerationPressed === true) {
              setRegistrationImagePath(selectedImages);
              setIsRegistrationSelected(true);
            } else if (licensePressed === true) {
              setLicenseImagePath([...licenseImagePath, ...selectedImages]);
              setLicenseImageSelected(true);
              setLicenceImageError(false);
            } else if (carImagePressed === true) {
              setCarImagePath([...carImagePath, ...selectedImages]);
              setIsCarImageSelected(true);
              setCarImageError(false);
            }
          })
          .catch((error) => {
            console.log("Image picker error: ", error);
          });
      },
      Platform.OS === "ios" ? 1000 : 0
    );
  };

  const handleBackBtn = () => {
    if (isFromAccountScreen === true) {
      navigation.goBack();
    } else {
      navigation.reset({
        index: 0,
        routes: [
          { name: "BottomTabNavigator", screen: "RiderIntercityHomeScreen" },
        ],
      });
    }
  };

  /////////////// Function for RemoveImage /////////////
  const handleDelete = (index, type) => {
    if (type === 0) {
      setRegistrationImagePath(null);
      setIsRegistrationSelected(false);
    } else if (type === 1) {
      const newLicenseImage = [...licenseImagePath];
      newLicenseImage.splice(index, 1);
      setLicenseImagePath(newLicenseImage);
    } else if (type === 2) {
      const newCarImage = [...carImagePath];
      newCarImage.splice(index, 1);
      setCarImagePath(newCarImage);
    }
  };

  //////////////// Function for validation /////////////////
  const valid = async () => {
    try {
      const User = await AsyncStorage.getItem("@userData");
      const UserId = await AsyncStorage.getItem("@id");
      const currentUserId = JSON.parse(UserId);
      const currentUser = JSON.parse(User);
      const currentDate = moment(date).format("DD-MM-YYYY");

      var isValid = true;

      if (Utils.isNull(carModel)) {
        isValid = false;
        setCarModelError(t("blank_field_error"));
        carModelRef.current.focus();
      } else if (Utils.isEmojis(carModel)) {
        isValid = false;
        carModelRef.current.focus();
        setCarModelError(t("emojis_error"));
      } else {
        setCarModelError(null);
      }

      if (selectedCarBrand === undefined) {
        isValid = false;
        setCarBrandError(t("blank_field_error"));
      } else {
        setCarBrandError(null);
      }

      if (selectedCarType === undefined) {
        isValid = false;
        setCarTypeError(t("blank_field_error"));
      } else {
        setCarTypeError(null);
      }

      if (selectedCountry === undefined) {
        isValid = false;
        setCountryError(t("blank_field_error"));
      } else {
        setCountryError(null);
      }

      if (Utils.isNull(carYear)) {
        isValid = false;
        setCarYearError(t("blank_field_error"));
      } else if (!Utils.isCarYearValid(generalSettingsData.car_year, carYear)) {
        isValid = false;
        setCarYearError(
          t("select_year_between") +
            " " +
            generalSettingsData.car_year +
            " " +
            t("and_current_year")
        );
        carYearRef.current.focus();
      } else if (Utils.isEmojis(carYear)) {
        isValid = false;
        setCarYearError(t("emojis_error"));
      } else {
        setCarYearError(null);
      }

      if (Utils.isNull(operationCity)) {
        isValid = false;
        setOperationCityError(t("blank_field_error"));
      } else {
        setOperationCityError(null);
      }

      if (Utils.isNull(carColor)) {
        isValid = false;
        setCarColorError(t("blank_field_error"));
      } else {
        setCarColorError(null);
      }

      if (Utils.isNull(licensePlateNumber)) {
        isValid = false;
        setLicenceError(t("blank_field_error"));
      } else if (Utils.isEmojis(licensePlateNumber)) {
        isValid = false;
        setLicenceError(t("emojis_error"));
      } else {
        setLicenceError(null);
      }

      if (licenseImagePath.length === 0) {
        isValid = false;
        setLicenceImageError(t("blank_field_error"));
      } else {
        setLicenceImageError(null);
      }

      if (carImagePath.length === 0) {
        isValid = false;
        setCarImageError(t("blank_field_error"));
      } else {
        setCarImageError(null);
      }

      if (!Utils.isDriverAgeValid(date)) {
        isValid = false;
        setDateError(t("invalid_age"));
      } else {
        setDateError(null);
      }
      if (!isValid) {
        scrollViewRef.current?.scrollTo({ y: 0 });
      }

      if (isValid) {
        if (await Utils.isNetworkConnected()) {
          let body = new FormData();
          body.append("gender", userData?.gender);
          body.append("date_of_birth", moment(date).format("YYYY-MM-DD"));
          body.append("car_model_name", carModel);
          body.append("car_brand", selectedCarBrand.id);
          body.append("car_type", selectedCarType.id);
          body.append("car_year", carYear);
          body.append("car_color", carColor);
          body.append("operation_country", countryId);
          body.append("operation_city", operationCity);
          body.append("operation_city_two", operationCity2);
          body.append("license_plate_number", licensePlateNumber);
          body.append("user_id", currentUserId);
          if (registrationImagePath && registrationImagePath?.path) {
            body.append("car_registration_photo", {
              uri: registrationImagePath.path,
              type: "image/jpg",
              name: registrationImagePath.path.replace(/^.*[\\/]/, ""),
              filename: registrationImagePath.path.replace(/^.*[\\/]/, ""),
            });
          }
          if (await Utils.isNetworkConnected()) {
            setLoading(true);
            dispatch(
              BecomeDriver(body, async (data, isSuccess) => {
                if (isSuccess === true) {
                  await AsyncStorage.setItem(
                    "@becomeDriverData",
                    JSON.stringify(data.data)
                  );
                  await AsyncStorage.setItem(
                    "@userData",
                    JSON.stringify(data.data)
                  );
                  await AsyncStorage.setItem(
                    "@driverId",
                    JSON.stringify(data.data.driver_id)
                  );

                  uploadImagesCarAndLicence(0, 0);
                } else {
                  setLoading(false);
                }
              })
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  /////////////////// Function for Car and license Image upload ///////////////////
  // Type = 0 then License Image and Type = 1 then Car Image
  const uploadImagesCarAndLicence = async (type, index) => {
    try {
      const driverId = await AsyncStorage.getItem("@driverId");

      var body = new FormData();

      body.append("user_id", userData?.id);
      body.append("driver_id", driverId);
      body.append("type", type);
      if (type === 1) {
        body.append("car_images", {
          uri: carImagePath[index].path,
          type: "image/jpg",
          name: carImagePath[index].path.replace(/^.*[\\/]/, ""),
          filename: carImagePath[index].path.replace(/^.*[\\/]/, ""),
        });
      } else {
        body.append("licence_images", {
          uri: licenseImagePath[index].path,
          type: "image/jpg",
          name: licenseImagePath[index].path.replace(/^.*[\\/]/, ""),
          filename: licenseImagePath[index].path.replace(/^.*[\\/]/, ""),
        });
      }

      dispatch(
        CarMedia(body, async (data, isSuccess) => {
          if (isSuccess === true) {
            if (type === 0) {
              if (
                licenseImagePath &&
                licenseImagePath.length > 0 &&
                index < licenseImagePath.length - 1
              ) {
                uploadImagesCarAndLicence(type, index + 1);
              } else {
                uploadImagesCarAndLicence(1, 0);
              }
            } else {
              if (type === 1) {
                if (
                  carImagePath &&
                  carImagePath.length > 0 &&
                  index < carImagePath.length - 1
                ) {
                  uploadImagesCarAndLicence(type, index + 1);
                } else {
                  setLoading(false);
                  if (isFromAccountScreen === true) {
                    try {
                      // var body = {
                      //   user_id: userData?.id,
                      // };
                      // dispatch(
                      //   userDetails(body, async (data, isSuccess) => {
                      //     setLoading(false);
                      //     if (isSuccess === true) {
                      var body = {
                        role: 1,
                        user_id: userData?.id,
                      };
                      dispatch(
                        changeRole(body, navigation, (isSuccess) => {
                          setLoading(false);
                          setTimeout(
                            () => {
                              navigation.reset({
                                index: 0,
                                routes: [
                                  {
                                    name: "BottomTabNavigator",
                                  },
                                ],
                              });
                              // navigation.replace("BottomTabNavigator");
                            },
                            Platform.OS === "ios" ? 1000 : 0
                          );
                        })
                      );
                      // }
                      // })
                      // );
                    } catch {}
                  } else {
                    try {
                      // var body = {
                      //   user_id: userData?.id,
                      // };
                      // dispatch(
                      //   userDetails(body, async (data, isSuccess) => {
                      //     if (isSuccess === true) {
                      var body = {
                        role: 1,
                        user_id: userData?.id,
                      };
                      dispatch(
                        changeRole(body, navigation, (isSuccess) => {
                          setLoading(false);
                          setTimeout(
                            () => {
                              navigation.reset({
                                index: 0,
                                routes: [
                                  {
                                    name: "BottomTabNavigator",
                                  },
                                ],
                              });
                              // navigation.replace("BottomTabNavigator");
                            },
                            Platform.OS === "ios" ? 1000 : 0
                          );
                        })
                      );
                      // setTimeout(
                      //   () => {
                      //     navigation.reset({
                      //       index: 0,
                      //       routes: [
                      //         {
                      //           name: "BottomTabNavigator",
                      //           state: {
                      //             index: 0,
                      //             routes: [
                      //               { name: "RiderIntercityHomeScreen" },
                      //             ],
                      //           },
                      //         },
                      //       ],
                      //     });
                      //   },
                      //   Platform.OS === "ios" ? 1000 : 0
                      // );
                      //     }
                      //   })
                      // );
                    } catch {}
                  }
                }
              } else {
                setLoading(false);
              }
            }
          } else {
            setLoading(false);
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleOperationCityClear = () => {
    setOperationCity("");
    setOperationCityId("");
  };

  const handleOperationCity2Clear = () => {
    setOperationCity2("");
    setOperationCityId2("");
  };

  //////////// Function for Date /////////////
  const handleDateConfirm = (date) => {
    setDate(date);
    setDateError(false);
  };

  const handleColorTextChange = (text) => {
    const isValid = /^[a-zA-Z\s]*$/.test(text);
    if (isValid) {
      setCarColor(text.trim());
      setCarColorError(false);
    } else {
      setCarColorError(t("color_error"));
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <AutocompleteDropdownContextProvider>
          <View
            onStartShouldSetResponder={() => {
              operationCityRef?.current?.closeDropDown();
              operationCity2Ref?.current?.closeDropDown();
            }}
            style={{
              flex: 1,
              backgroundColor: "white",
            }}
          >
            <View style={{ width: "100%" }}>
              <Header title={t("become_driver")} goBack={handleBackBtn} />
            </View>

            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              ref={scrollViewRef}
              persistentScrollbar={true}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled
              keyboardDismissMode="on-drag"
              keyboardShouldPersistTaps="handled"
              contentInsetAdjustmentBehavior="automatic"
            >
              <View style={styles.container}>
                <StatusBar
                  backgroundColor={Colors.white}
                  barStyle={"dark-content"}
                />

                <ModalProgressLoader visible={isLoading || isLoadingDialog} />

                <View style={styles.tabsArea}>
                  <PrimaryDropDown
                    data={carBrand}
                    value={selectedCarBrand}
                    isSelect={isCarBrand}
                    renderItem={(selectedItem) =>
                      selectedItem && selectedItem.brand_name
                    }
                    string={t("placeholder_car_brand")}
                    error={carBrandError}
                    onSelect={(selectedItem) => {
                      setSelectedCarBrand(selectedItem);
                      setIsCarBrand(true);
                      setCarBrandError(false);
                    }}
                  />

                  {/* {carBrandError ? (
                    <View style={{ alignSelf: "flex-start" }}>
                      <View style={styles.errorTextArea}>
                        <Text style={styles.errorText}>{carBrandError}</Text>
                      </View>
                    </View>
                  ) : null} */}

                  <Textinput
                    placeholder={t("enter_car_model")}
                    placeholderTextColor={Colors.black}
                    refs={carModelRef}
                    value={carModel}
                    error={carModelError}
                    returnKeyType={carYear === "" ? "next" : "done"}
                    keyboardType="default"
                    onChangeText={(text) => {
                      setCarModel(text);
                      setCarModelError(false);
                    }}
                  />

                  <PrimaryDropDown
                    data={carType}
                    value={selectedCarType}
                    isSelect={isCarType}
                    renderItem={(selectedItem) =>
                      selectedItem && selectedItem.type_name
                    }
                    string={t("placeholder_car_type")}
                    error={carTypeError}
                    onSelect={(selectedItem) => {
                      setSelectedCarType(selectedItem);
                      setIsCarType(true);
                      setCarTypeError(false);
                    }}
                  />

                  {/* {carTypeError ? (
                    <View style={{ alignSelf: "flex-start" }}>
                      <View style={styles.errorTextArea}>
                        <Text style={styles.errorText}>{carTypeError}</Text>
                      </View>
                    </View>
                  ) : null} */}

                  <Textinput
                    placeholder={t("enter_car_year")}
                    placeholderTextColor={Colors.black}
                    refs={carYearRef}
                    value={carYear}
                    maxLength={4}
                    error={carYearError}
                    returnKeyType={carYear === "" ? "next" : "done"}
                    keyboardType="numeric"
                    onChangeText={(text) => {
                      setCarYear(text.trim());
                      setCarYearError(false);
                    }}
                  />

                  <Textinput
                    placeholder={t("placeholder_car_colour")}
                    placeholderTextColor={Colors.black}
                    refs={carColorRef}
                    value={carColor}
                    error={carColorError}
                    returnKeyType={carColor === "" ? "next" : "done"}
                    onChangeText={handleColorTextChange}
                  />

                  <PrimaryDropDown
                    data={countryData}
                    value={selectedCountry}
                    isSelect={isCountry}
                    error={countryError}
                    renderItem={(selectedItem) =>
                      selectedItem && selectedItem.country_name
                    }
                    string={t("placeholder_country")}
                    onSelect={(selectedItem) => {
                      setSelectedCountry(selectedItem);
                      setCountryId(selectedItem.id);
                      setIsCountry(true);
                      setCountryError(false);
                    }}
                  />

                  {/* {countryError ? (
                    <View style={{ alignSelf: "flex-start" }}>
                      <View style={styles.errorTextArea}>
                        <Text style={styles.errorText}>{countryError}</Text>
                      </View>
                    </View>
                  ) : null} */}

                  <View style={styles.dateArea}>
                    <DateTimePicker
                      value={date}
                      maximumDate={new Date()}
                      mode="date"
                      refs={datePickerRef}
                      placeholderText={moment(userData.date_of_birth).format(
                        "YYYY-MM-DD"
                      )}
                      minimumDate={new Date("1950-01-01")}
                      error={DateError}
                      onConfirm={(date) => {
                        handleDateConfirm(date);
                      }}
                    />

                    {/* <View
                  style={{
                    flex: 1,
                    height: ScaleSize.spacing_extra_large,
                  }}
                > */}
                    <GooglePlacesAutoComplete
                      onSelected={(selectedItem) => {
                        if (selectedItem) {
                          setOperationCity(selectedItem.city);
                          setOperationCityId(selectedItem.id);
                          setOperationCityError(false);
                        }
                      }}
                      ref={operationCityRef}
                      country={selectedCountry}
                      imageShow={false}
                      isBaseOnCountry={true}
                      error={operationCityError}
                      onClear={handleOperationCityClear}
                      isOptional={false}
                      placeholder={t("enter_operation_city")}
                    />

                    <GooglePlacesAutoComplete
                      onSelected={(selectedItem) => {
                        if (selectedItem) {
                          setOperationCity2(selectedItem.city);
                          setOperationCityId2(selectedItem.id);
                          setOperationCity2Error(false);
                        }
                      }}
                      ref={operationCity2Ref}
                      country={selectedCountry}
                      isBaseOnCountry={true}
                      imageShow={false}
                      onClear={handleOperationCity2Clear}
                      isOptional={true}
                      placeholder={t("enter_operation_city_2")}
                    />
                    {/* </View> */}

                    {operationCity2Error ? (
                      <View style={{ alignSelf: "flex-start" }}>
                        <View style={styles.errorTextArea}>
                          <Text style={styles.errorText}>
                            {operationCity2Error}
                          </Text>
                        </View>
                      </View>
                    ) : null}

                    <Textinput
                      placeholder={t("enter_lisence_plate_number")}
                      placeholderTextColor={Colors.black}
                      refs={licensePlateNumberRef}
                      value={licensePlateNumber}
                      autoCapitalize={"characters"}
                      error={licenceError}
                      returnKeyType={"done"}
                      keyboardType="default"
                      onChangeText={(text) => {
                        setLicenePlateNumber(text.trim());
                        setLicenceError(false);
                      }}
                    />
                  </View>
                </View>
                <ImagePickerDilouge
                  popupOpen={popupOpen}
                  handlePopup={() => setPopupOpen(false)}
                  handleTakePicture={
                    registerationPressed
                      ? handleSingleTakePicture
                      : handleTakePicture
                  }
                  handleChooseFromGallery={
                    registerationPressed
                      ? handleSingleChooseFromGallery
                      : handleChooseFromGallery
                  }
                />
              </View>

              <View style={styles.imagePickerContainer}>
                <Text style={styles.imagePickerHeadingText}>
                  {t("driver_car_registration_photo")}{" "}
                  <Text style={styles.optionalText}>{t("optional")}</Text>
                </Text>
                <View style={styles.ImagePickerContainer}>
                  <TouchableOpacity
                    style={styles.imagePickerBtn}
                    onPress={() => {
                      setRegistartionPressed(true);
                      setPopupOpen(true);
                    }}
                  >
                    <Text style={styles.imagePickerBtnText}>
                      {t("upload_file_or_take_photo")}
                    </Text>
                  </TouchableOpacity>
                </View>

                {isRegistrationImageSelected === true ? (
                  <View style={styles.selectedImageArea}>
                    <View style={styles.selectedImageTab}>
                      <Image
                        source={{ uri: registrationImagePath.path }}
                        style={styles.selectedImage}
                      />
                      <Text
                        style={styles.selectedImageNameText}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                      >
                        {registrationImagePath
                          ? registrationImagePath.path.replace(/^.*[\\/]/, "")
                          : ""}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          handleDelete(0, 0);
                        }}
                      >
                        <Image
                          source={Images.close_icon}
                          style={styles.closeIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}

                <Text style={styles.imagePickerHeadingText}>
                  {t("driver_lisence_picture")}
                </Text>
                <View style={styles.ImagePickerContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setCarImagePressed(false);
                      setRegistartionPressed(false);
                      setLicensePressed(true);
                      setPopupOpen(true);
                    }}
                    style={styles.imagePickerBtn}
                  >
                    <Text style={styles.imagePickerBtnText}>
                      {t("upload_file_or_take_photo")}
                    </Text>
                  </TouchableOpacity>
                </View>

                {isLicenseImageSelected === true ? (
                  <View style={styles.selectedImageArea}>
                    {licenseImagePath.map((image, index) => (
                      <View style={styles.selectedImageTab} key={index}>
                        <Image
                          source={{ uri: image.path }}
                          style={styles.selectedImage}
                        />

                        <Text
                          style={styles.selectedImageNameText}
                          numberOfLines={1}
                          ellipsizeMode="middle"
                        >
                          {image.path.replace(/^.*[\\/]/, "")}
                        </Text>

                        <TouchableOpacity
                          onPress={() => {
                            handleDelete(index, 1);
                          }}
                        >
                          <Image
                            source={Images.close_icon}
                            style={styles.closeIcon}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                ) : null}

                {licenceImageError ? (
                  <View style={styles.errorTextArea}>
                    <Text style={styles.errorText}>{licenceImageError}</Text>
                  </View>
                ) : null}

                <Text style={styles.imagePickerHeadingText}>
                  {t("car_images")}
                </Text>
                <View style={styles.ImagePickerContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      setRegistartionPressed(false);
                      setLicensePressed(false);
                      setCarImagePressed(true);
                      setPopupOpen(true);
                    }}
                    style={styles.imagePickerBtn}
                  >
                    <Text style={styles.imagePickerBtnText}>
                      {t("upload_file_or_take_photo")}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.selectedImageArea}>
                  {carImagePath.map((image, index) => (
                    <View style={styles.selectedImageTab} key={index}>
                      <Image
                        source={{ uri: image.path }}
                        style={styles.selectedImage}
                      />
                      <Text
                        style={styles.selectedImageNameText}
                        numberOfLines={1}
                        ellipsizeMode="middle"
                      >
                        {image.path.replace(/^.*[\\/]/, "")}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          handleDelete(index, 2);
                        }}
                      >
                        <Image
                          source={Images.close_icon}
                          style={styles.closeIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>

                {carImageError ? (
                  <View style={styles.errorTextArea}>
                    <Text style={styles.errorText}>{carImageError}</Text>
                  </View>
                ) : null}
              </View>

              <View style={styles.submitBtn}>
                <PrimaryButton
                  string={t("submit")}
                  onPress={() => {
                    valid();
                  }}
                />
              </View>
            </ScrollView>
          </View>
        </AutocompleteDropdownContextProvider>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default BecomeDriverScreen;

const styles = StyleSheet.create({
  selectedImageArea: {
    flex: 1,
    width: "100%",
    flexWrap: "wrap",
    paddingVertical: ScaleSize.spacing_small,
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
  },
  selectedImageTab: {
    backgroundColor: Colors.textinput_low_opacity,
    padding: ScaleSize.spacing_small,
    justifyContent: "space-between",
    width: "45%",
    alignItems: "center",
    margin: ScaleSize.spacing_small,
    flexDirection: "row",
    borderRadius: ScaleSize.very_small_border_radius,
  },
  selectedImage: {
    height: ScaleSize.very_large_icon,
    width: ScaleSize.very_large_icon,
    borderRadius: ScaleSize.very_small_border_radius,
  },
  closeIcon: {
    height: ScaleSize.very_small_icon,
    width: ScaleSize.very_small_icon,
    resizeMode: "contain",
  },
  selectedImageNameText: {
    fontFamily: AppFonts.medium,
    color: Colors.primary,
    width: "50%",
    fontSize: TextFontSize.extra_small_text,
  },
  scrollContainer: {
    alignItems: "center",
    flexGrow: 1,
    backgroundColor: Colors.white,
    paddingBottom: ScaleSize.spacing_small,
  },
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  backBtn: {
    position: "absolute",
    left: ScaleSize.spacing_medium,
  },
  tabsArea: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  submitBtn: {
    width: "100%",
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_medium,
    alignSelf: "center",
    alignItems: "center",
  },
  dropDown: {
    width: "90%",
    backgroundColor: "transparent",
  },
  imagePickerHeadingText: {
    color: Colors.black,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    marginTop: ScaleSize.spacing_semi_medium,
    alignSelf: "flex-start",
    marginLeft: ScaleSize.spacing_small,
  },
  ImagePickerContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: Colors.textinput_low_opacity,
    margin: ScaleSize.spacing_small,
    padding: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.small_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderStyle: "dashed",
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePickerBtn: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: ScaleSize.spacing_small,
  },
  imagePickerBtnText: {
    color: Colors.primary,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
  },
  modal: {
    backgroundColor: Colors.white,
    width: "100%",
    borderRadius: ScaleSize.small_border_radius,
    padding: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    height: ScaleSize.very_small_icon,
    width: ScaleSize.very_small_icon,
    resizeMode: "contain",
  },
  optionalText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: Colors.gray,
    fontSize: TextFontSize.extra_small_text,
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
  imagePickerContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    alignItems: "center",
  },
  dateArea: {
    width: "100%",
    flex: 1,
  },
});
