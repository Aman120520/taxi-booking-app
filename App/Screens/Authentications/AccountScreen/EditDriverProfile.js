import {
  Image,
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  PrimaryButton,
  Textinput,
  ImagePickerDilouge,
  PrimaryDropDown,
  ModalProgressLoader,
  Header,
} from "../../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import Utils from "../../../Helpers/Utils";
import { useTranslation } from "react-i18next";
import {
  CarBrand,
  updateDriverProfile,
  CarMedia,
  deleteDriverMedia,
  userDetails,
} from "../../../Actions/authentication";
import ImagePicker from "react-native-image-crop-picker";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutoComplete } from "../../../Components/Comman/GooglePlacesAutoComplete";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import AlertBox from "../../../Components/Comman/AlertBox";

const EditDriverProfile = ({ navigation, route }) => {
  ////////////////// useEffect /////////////////
  useEffect(() => {
    getUser();
  }, []);

  ////////////////// States /////////////////
  const {
    countryData,
    carBrand,
    carType,
    generalSettingsData,
    isLoading,
    userData,
    driverData,
  } = useSelector((state) => state.Authentication);
  const [carModel, setCarModel] = useState(driverData?.car_model_name);
  const { t, i18n } = useTranslation();
  const [carYear, setCarYear] = useState(driverData?.car_year + "");
  const [driverDatas, setDriversData] = useState(JSON.stringify(driverData));
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMsg, setSuccessMessage] = useState(false);
  const [carColor, setCarColor] = useState(driverData?.car_color + "");
  const [operationCity, setOperationCity] = useState(
    driverData?.operation_city + ""
  );
  const [operationCity2, setOperationCity2] = useState(
    driverData?.operation_city_two + ""
  );
  const [licensePlateNumber, setLicenePlateNumber] = useState(
    driverData?.license_plate_number
  );
  const [registrationImagePath, setRegistrationImagePath] = useState(
    driverData?.car_registration_photo
  );
  const [licenseImagePath, setLicenseImagePath] = useState(
    driverData?.licence_images || []
  );
  const [carImagePath, setCarImagePath] = useState(
    driverData?.car_images || []
  );
  const [isRegistrationImageSelected, setIsRegistrationSelected] = useState(
    driverData?.car_registration_photo ? true : false
  );
  const [isLicenseImageSelected, setLicenseImageSelected] = useState(
    driverData?.licence_images ? true : false
  );
  const [isCarImageSelected, setIsCarImageSelected] = useState(
    driverData?.car_images ? true : false
  );
  const [registerationPressed, setRegistartionPressed] = useState(false);
  const [newRegistrationImages, setNewRegistrationImages] = useState("");
  const [newLicenseImages, setNewLicenseImages] = useState([]);
  const [newCarImages, setNewCarImages] = useState([]);
  const [licensePressed, setLicensePressed] = useState(false);
  const [carImagePressed, setCarImagePressed] = useState(false);
  const [selectedCarBrand, setSelectedCarBrand] = useState(
    driverData?.brand_name
  );
  const [selectedCarType, setSelectedCarType] = useState(
    driverData?.car_type_name
  );
  const [carTypeId, setCarTypeId] = useState(driverData?.car_type);
  const [carBrandId, setCarBrandId] = useState(driverData?.car_brand);
  const [selectedCountry, setSelectedCountry] = useState(
    driverData?.country_name
  );
  const [popupOpen, setPopupOpen] = useState(false);
  const [countryId, setCountryId] = useState(driverData?.operation_country);
  const dispatch = useDispatch();

  ///////////////// Error States ////////////////
  const [countryError, setCountryError] = useState("");
  const [carBrandError, setCarBrandError] = useState("");
  const [carTypeError, setCarTypeError] = useState("");
  const [carModelError, setCarModelError] = useState("");
  const [carYearError, setCarYearError] = useState("");
  const [licenceError, setLicenceError] = useState("");
  const [carColorError, setCarColorError] = useState("");
  const [licenceImageError, setLicenceImageError] = useState("");
  const [carImageError, setCarImageError] = useState("");
  const [operationCityError, setOperationCityError] = useState("");
  const [operationCity2Error, setOperationCity2Error] = useState("");
  const [isCarBrand, setIsCarBrand] = useState(false);
  const [isCarType, setIsCarType] = useState(false);
  const [isCountry, setIsCountry] = useState(false);
  const [isLoadingForm, setLoading] = useState(false);

  ////////////////// Refs //////////////////
  const carYearRef = useRef(null);
  const carModelRef = useRef(null);
  const carColorRef = useRef(null);
  const licensePlateNumberRef = useRef(null);
  const scrollViewRef = useRef(null);
  const operationCityRef = useRef(null);
  const operationCity2Ref = useRef(null);

  const getUser = async () => {
    try {
      dispatch(CarBrand());
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
          cropperCircleOverlay: true,
          compressImageQuality: 0.4,
        })
          .then((selectedImages) => {
            setNewRegistrationImages(selectedImages);
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
          cropperCircleOverlay: true,
          compressImageQuality: 0.4,
        })
          .then((selectedImages) => {
            setNewRegistrationImages(selectedImages);
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
  const handleTakePicture = () => {
    setPopupOpen(false);
    setTimeout(
      () => {
        ImagePicker.openCamera({
          multiple: false,
          mediaType: "photo",
          compressImageQuality: 0.4,
        })
          .then((selectedImages) => {
            if (licensePressed === true) {
              setNewLicenseImages((prevImages) => [
                ...prevImages,
                selectedImages,
              ]);
              setLicenseImageSelected(true);
              setLicenceImageError(false);
            } else if (carImagePressed === true) {
              setNewCarImages((prevImages) => [...prevImages, selectedImages]);
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

  ////////// For ChoosePicture ////////////
  const handleChooseFromGallery = () => {
    setPopupOpen(false);
    setTimeout(
      () => {
        ImagePicker.openPicker({
          multiple: true,
          mediaType: "photo",
          compressImageQuality: 0.4,
        })
          .then((selectedImages) => {
            if (licensePressed === true) {
              setNewLicenseImages([...newLicenseImages, ...selectedImages]);
              setLicenseImageSelected(true);
              setLicenceImageError(false);
            } else if (carImagePressed === true) {
              setNewCarImages([...newCarImages, ...selectedImages]);
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
    navigation.goBack();
  };

  /////////////// Function for RemoveImage /////////////
  const handleDelete = async (id, index, type) => {
    try {
      if (id) {
        const UserId = await AsyncStorage.getItem("@id");
        if (Utils.isNetworkConnected) {
          const body = {
            media_id: id,
            user_id: UserId,
          };
          await dispatch(
            deleteDriverMedia(body, async (data, isSuccess) => {
              if (isSuccess === true) {
                deleteMedia(id, index, type);
              }
            })
          );
        }
      } else {
        deleteMedia(id, index, type);
      }
    } catch {}
  };

  const deleteMedia = (id, index, type) => {
    if (type === 0) {
      setRegistrationImagePath(null);
      setNewRegistrationImages(null);
      setIsRegistrationSelected(false);
    } else if (type === 1) {
      const newLicenseImage = [...licenseImagePath];
      newLicenseImage.splice(index, 1);
      setLicenseImagePath(newLicenseImage);
    } else if (type === 2) {
      const newLicenseImage = [...newLicenseImages];
      newLicenseImage.splice(index, 1);
      setNewLicenseImages(newLicenseImage);
    } else if (type === 3) {
      const newCarImage = [...carImagePath];
      newCarImage.splice(index, 1);
      setCarImagePath(newCarImage);
    } else if (type === 4) {
      const newCarImage = [...newCarImages];
      newCarImage.splice(index, 1);
      setNewCarImages(newCarImage);
    }
  };

  //////////////// Function for validation /////////////////
  const valid = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      const currentUserId = JSON.parse(UserId);
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

      if (Utils.isNull(licensePlateNumber)) {
        isValid = false;
        setLicenceError(t("blank_field_error"));
      } else if (Utils.isEmojis(licensePlateNumber)) {
        isValid = false;
        setLicenceError(t("emojis_error"));
      } else {
        setLicenceError(null);
      }

      if (newLicenseImages.length === 0) {
        if (licenseImagePath.length === 0) {
          isValid = false;
          setLicenceImageError(t("blank_field_error"));
        } else {
          setLicenceImageError(null);
        }
      }

      if (newCarImages.length === 0) {
        if (carImagePath.length === 0) {
          isValid = false;
          setCarImageError(t("blank_field_error"));
        } else {
          setCarImageError(null);
        }
      }

      if (isValid) {
        let body = new FormData();
        body.append("car_model_name", carModel);
        body.append("car_brand", carBrandId);
        body.append("car_type", carTypeId);
        body.append("car_year", carYear);
        body.append("operation_country", countryId);
        body.append("operation_city", operationCity);
        body.append("operation_city_two", operationCity2);
        body.append("license_plate_number", licensePlateNumber);
        body.append("user_id", currentUserId);
        body.append("car_color", carColor);
        body.append("driver_id", driverData?.driver_id);
        body.append("registration_current_photo", registrationImagePath);
        if (newRegistrationImages) {
          body.append("car_registration_photo", {
            uri: newRegistrationImages.path,
            type: "image/jpg",
            name: newRegistrationImages.path.replace(/^.*[\\/]/, ""),
            filename: newRegistrationImages.path.replace(/^.*[\\/]/, ""),
          });
        }
        if (await Utils.isNetworkConnected()) {
          setLoading(true);
          dispatch(
            updateDriverProfile(body, async (data, isSuccess) => {
              if (isSuccess === true) {
                if (
                  newCarImages.length === 0 &&
                  newLicenseImages.length === 0
                ) {
                  const UserId = await AsyncStorage.getItem("@id");
                  var body = {
                    user_id: UserId,
                  };
                  dispatch(
                    userDetails(body, async (data, isSuccess) => {
                      setLoading(false);
                      if (isSuccess === true) {
                        setSuccessAlert(true);
                        setSuccessMessage("Profile updated successfully.");
                      }
                    })
                  );
                } else {
                  uploadImagesCarAndLicence(0, 0);
                }
              } else {
                setLoading(false);
              }
            })
          );
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
      var body = new FormData();

      const UserId = await AsyncStorage.getItem("@id");
      body.append("user_id", UserId);
      body.append("driver_id", driverData.driver_id);
      body.append("type", type);
      if (type === 1) {
        body.append("car_images", {
          uri: newCarImages[index].path,
          type: "image/jpg",
          name: newCarImages[index].path.replace(/^.*[\\/]/, ""),
          filename: newCarImages[index].path.replace(/^.*[\\/]/, ""),
        });
      } else {
        body.append("licence_images", {
          uri: newLicenseImages[index].path,
          type: "image/jpg",
          name: newLicenseImages[index].path.replace(/^.*[\\/]/, ""),
          filename: newLicenseImages[index].path.replace(/^.*[\\/]/, ""),
        });
      }

      dispatch(
        CarMedia(body, async (data, isSuccess) => {
          if (isSuccess === true) {
            if (type === 0) {
              if (
                newLicenseImages &&
                newLicenseImages.length > 0 &&
                index < newLicenseImages.length - 1
              ) {
                uploadImagesCarAndLicence(type, index + 1);
              } else {
                uploadImagesCarAndLicence(1, 0);
              }
            } else {
              if (type === 1) {
                if (
                  newCarImages &&
                  newCarImages.length > 0 &&
                  index < newCarImages.length - 1
                ) {
                  uploadImagesCarAndLicence(type, index + 1);
                } else {
                  const UserId = await AsyncStorage.getItem("@id");
                  var body = {
                    user_id: UserId,
                  };
                  dispatch(
                    userDetails(body, async (data, isSuccess) => {
                      setLoading(false);
                      if (isSuccess === true) {
                        setSuccessAlert(true);
                        setSuccessMessage("Profile updated successfully.");
                      }
                    })
                  );
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
  };

  const handleOperationCity2Clear = () => {
    setOperationCity2("");
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
      <AutocompleteDropdownContextProvider>
        <View style={{ width: "100%", backgroundColor: "white" }}>
          <Header title={t("update_driver_profile")} goBack={handleBackBtn} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          ref={scrollViewRef}
          persistentScrollbar={true}
          nestedScrollEnabled
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
        >
          <View
            style={styles.container}
            onStartShouldSetResponder={() => {
              operationCityRef?.current?.closeDropDown();
              operationCity2Ref?.current?.closeDropDown();
            }}
          >
            <StatusBar
              backgroundColor={Colors.white}
              barStyle={"dark-content"}
            />

            <ModalProgressLoader visible={isLoading || isLoadingForm} />

            <View style={styles.tabsArea}>
              <Text style={styles.titleText}>{t("select_car_brand")}</Text>
              <PrimaryDropDown
                data={carBrand}
                isForEdit={true}
                value={selectedCarBrand}
                isSelect={isCarBrand}
                error={carBrandError}
                renderItem={(selectedItem) =>
                  selectedItem && selectedItem.brand_name
                }
                onSelect={(selectedItem) => {
                  setSelectedCarBrand(selectedItem);
                  setCarBrandId(selectedItem.id);
                  setIsCarBrand(true);
                  setCarBrandError(false);
                }}
              />

              <Text style={styles.titleText}>{t("car_model")}</Text>
              <Textinput
                refs={carModelRef}
                value={carModel + ""}
                error={carModelError}
                returnKeyType={carYear === "" ? "next" : "done"}
                keyboardType="default"
                onChangeText={(text) => {
                  setCarModel(text);
                  setCarModelError(false);
                }}
              />

              <Text style={styles.titleText}>{t("car_type")}</Text>
              <PrimaryDropDown
                data={carType}
                isForEdit={true}
                value={selectedCarType}
                isSelect={isCarType}
                error={carTypeError}
                renderItem={(selectedItem) =>
                  selectedItem && selectedItem.type_name
                }
                onSelect={(selectedItem) => {
                  setSelectedCarType(selectedItem);
                  setCarTypeId(selectedItem.id);
                  setIsCarType(true);
                  setCarTypeError(false);
                }}
              />

              <Text style={styles.titleText}>{t("car_year")}</Text>
              <Textinput
                refs={carYearRef}
                value={carYear + ""}
                error={carYearError}
                returnKeyType={carYear === "" ? "next" : "done"}
                keyboardType="numeric"
                onChangeText={(text) => {
                  setCarYear(text.trim());
                  setCarYearError(false);
                }}
              />

              <Text style={styles.titleText}>
                {t("placeholder_car_colour")}
              </Text>
              <Textinput
                refs={carColorRef}
                value={carColor + ""}
                error={carColorError}
                returnKeyType={carColor === "" ? "next" : "done"}
                onChangeText={handleColorTextChange}
              />

              <Text style={styles.titleText}>{t("operation_country")}</Text>
              <PrimaryDropDown
                data={countryData}
                isForEdit={true}
                value={selectedCountry}
                isSelect={isCountry}
                error={countryError}
                renderItem={(selectedItem) =>
                  selectedItem && selectedItem.country_name
                }
                onSelect={(selectedItem) => {
                  setSelectedCountry(selectedItem.country_name);
                  setCountryId(selectedItem.id);
                  handleOperationCityClear();
                  setOperationCity("");
                  setOperationCity2("");
                  setIsCountry(true);
                  setCountryError(false);
                }}
              />

              <Text style={styles.titleText}>{t("operation_city")}</Text>
              <GooglePlacesAutoComplete
                onSelected={(selectedItem) => {
                  if (selectedItem) {
                    setOperationCity(selectedItem.city);
                  }
                }}
                value={operationCity}
                ref={operationCityRef}
                country={selectedCountry}
                error={operationCityError}
                placeholderTextColor={Colors.primary}
                editable={true}
                imageShow={false}
                onClear={handleOperationCityClear}
                isOptional={false}
              />

              <Text style={styles.titleText}>
                {t("operation_city2")}{" "}
                <Text style={styles.optionalText}>{t("optional")}</Text>{" "}
              </Text>
              <GooglePlacesAutoComplete
                onSelected={(selectedItem) => {
                  if (selectedItem) {
                    setOperationCity2(selectedItem.city);
                    setOperationCity2Error(false);
                  }
                }}
                value={operationCity2}
                ref={operationCity2Ref}
                error={operationCity2Error}
                placeholderColor={operationCity2 ? Colors.primary : null}
                country={selectedCountry}
                imageShow={false}
                editable={true}
                onClear={handleOperationCity2Clear}
                isOptional={false}
              />

              <Text style={styles.titleText}>{t("lisence_plate_number")}</Text>
              <Textinput
                placeholderTextColor={Colors.black}
                refs={licensePlateNumberRef}
                value={licensePlateNumber + ""}
                error={licenceError}
                returnKeyType={"done"}
                keyboardType="default"
                onChangeText={(text) => {
                  setLicenePlateNumber(text.trim());
                  setLicenceError(false);
                }}
              />
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
                  {newRegistrationImages ? (
                    <Image
                      source={{ uri: newRegistrationImages.path }}
                      style={styles.selectedImage}
                    />
                  ) : (
                    <Image
                      source={{ uri: registrationImagePath }}
                      style={styles.selectedImage}
                    />
                  )}
                  <Text
                    style={styles.selectedImageNameText}
                    numberOfLines={1}
                    ellipsizeMode="middle"
                  >
                    {newRegistrationImages
                      ? newRegistrationImages.path.replace(/^.*[\\/]/, "")
                      : driverData?.car_registration_photo}
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      handleDelete(0, 0);
                    }}
                  >
                    <Image source={null} style={styles.closeIcon} />
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
                      style={styles.selectedImage}
                      source={{ uri: licenseImagePath[index]?.licence_images }}
                    />
                    <Text
                      style={styles.selectedImageNameText}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {image.media_path}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleDelete(licenseImagePath[index].id, index, 1);
                      }}
                    >
                      <Image
                        source={Images.close_icon}
                        style={styles.closeIcon}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                {newLicenseImages.map((image, index) => (
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
                        handleDelete(null, index, 2);
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

            <Text style={styles.imagePickerHeadingText}>{t("car_images")}</Text>
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

            {isCarImageSelected === true ? (
              <View style={styles.selectedImageArea}>
                {carImagePath.map((image, index) => (
                  <View style={styles.selectedImageTab} key={index}>
                    <Image
                      style={styles.selectedImage}
                      source={{ uri: carImagePath[index]?.car_images }}
                    />
                    <Text
                      style={styles.selectedImageNameText}
                      numberOfLines={1}
                      ellipsizeMode="middle"
                    >
                      {image.media_path}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        handleDelete(carImagePath[index].id, index, 3);
                      }}
                    >
                      <Image
                        source={Images.close_icon}
                        style={styles.closeIcon}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                {newCarImages.map((image, index) => (
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
                        handleDelete(null, index, 4);
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

            {carImageError ? (
              <View style={styles.errorTextArea}>
                <Text style={styles.errorText}>{carImageError}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.submitBtn}>
            <PrimaryButton
              string={t("update")}
              onPress={() => {
                valid();
              }}
            />
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
      </AutocompleteDropdownContextProvider>
    </SafeAreaView>
  );
};

export default EditDriverProfile;

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
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    marginTop: ScaleSize.spacing_large,
    marginBottom: ScaleSize.spacing_small,
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
  titleText: {
    color: Colors.black,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    alignSelf: "flex-start",
    marginLeft: ScaleSize.spacing_semi_medium,
  },
});
