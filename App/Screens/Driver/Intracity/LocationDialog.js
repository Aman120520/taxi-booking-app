import {
  StyleSheet,
  Text,
  Modal,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "../../../Components/Comman";
import { useWindowDimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addIntracityDriverLocation } from "../../../Actions/Intracity";
import { GooglePlacesAutoComplete } from "../../../Components/Comman/GooglePlacesAutoComplete";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import Utils from "../../../Helpers/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LocationDialog = ({ visible, onClose }) => {
  //////////// useStates //////////
  const { t, i18n } = useTranslation();
  const { width, height } = useWindowDimensions();
  const [location, setLocation] = useState("");

  //////////// useStates //////////
  const dispatch = useDispatch();
  const { userData, driverData } = useSelector((state) => state.Authentication);
  const [locationError, setLocationError] = useState("");

  const valid = async () => {
    var isValid = true;
    try {
      if (Utils.isNull(location)) {
        isValid = false;
        setLocationError(t("blank_field_error"));
      } else {
        setLocation(null);
      }
      if (isValid) {
        if (await Utils.isNetworkConnected()) {
          const UserId = await AsyncStorage.getItem("@id");
          var body = {
            latitude: location.latitude,
            longitude: location.longitude,
            user_id: UserId,
          };
          dispatch(
            addIntracityDriverLocation(body, async (data, isSuccess) => {
              if (isSuccess === true) {
                onClose();
              }
            })
          );
        }
      }
    } catch {}
  };

  const handleClearLocation = () => {
    setLocation("");
    setLocationError("");
  };

  return (
    <Modal visible={visible} transparent={true}>
      <AutocompleteDropdownContextProvider>
        <View style={styles.modalBg}>
          <View style={[styles.modal, { height: height / 1.8 }]}>
            <View style={styles.headerImageContainer}>
              <View style={styles.outerEllips}>
                <View style={styles.middleEllips}>
                  <View style={styles.innerEllips}>
                    <Image source={Images.gps_icon} style={styles.gpsIcon} />
                  </View>
                </View>
              </View>
              <Text style={styles.headerContainerText}>
                Choose Your Current Location
              </Text>
              <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Image style={styles.closeIcon} source={Images.close_icon} />
              </TouchableOpacity>
            </View>

            <View style={styles.locationTabContainer}>
              <View style={styles.locationTab}>
                <Text style={styles.locationHeadingText}>
                  {t("Add Location")}
                </Text>
                <GooglePlacesAutoComplete
                  onSelected={(selectedItem) => {
                    setLocation(selectedItem);
                    setLocationError(false);
                  }}
                  isOptional={false}
                  imageShow={false}
                  multiline={false}
                  onClear={handleClearLocation}
                  editable={true}
                  isAddressSearch={true}
                />
              </View>
              {locationError ? (
                <View style={styles.errorTextArea}>
                  <Text style={styles.errorText}>{locationError}</Text>
                </View>
              ) : null}
            </View>

            <PrimaryButton
              customStyle={true}
              buttonStyle={styles.countinueBtn}
              textStyle={styles.countinueBtnText}
              string={t("Add")}
              onPress={valid}
            />
          </View>
        </View>
      </AutocompleteDropdownContextProvider>
    </Modal>
  );
};

export default LocationDialog;

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  modal: {
    width: "100%",
    alignItems: "center",
    padding: ScaleSize.spacing_very_small + 2,
    borderRadius: ScaleSize.primary_border_radius,
    backgroundColor: Colors.white,
    elevation: 10,
  },
  headerImageContainer: {
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    flex: 1.5,
    overflow: "hidden",
    resizeMode: "contain",
    width: "100%",
    borderRadius: ScaleSize.primary_border_radius - 4,
  },
  headerContainerText: {
    color: Colors.white,
    top: ScaleSize.spacing_small + 2,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
  },
  closeBtn: {
    position: "absolute",
    borderRadius: ScaleSize.very_small_border_radius,
    backgroundColor: Colors.white,
    padding: ScaleSize.spacing_small,
    right: ScaleSize.spacing_semi_medium + 2,
    top: ScaleSize.spacing_semi_medium + 2,
  },
  closeIcon: {
    height: ScaleSize.small_icon - 2,
    width: ScaleSize.small_icon - 2,
  },
  gpsIcon: {
    height: ScaleSize.large_icon * 2,
    width: ScaleSize.large_icon * 2,
  },
  outerEllips: {
    padding: ScaleSize.spacing_semi_medium - 2,
    backgroundColor: "#ffffff1c",
    borderRadius: 100,
  },
  middleEllips: {
    backgroundColor: "#ffffff38",
    padding: ScaleSize.spacing_semi_medium - 2,
    borderRadius: 100,
  },
  innerEllips: {
    backgroundColor: "#ffffff38",
    padding: ScaleSize.spacing_large - 2,
    borderRadius: 100,
  },
  locationTabContainer: {
    flex: 0.8,
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: ScaleSize.primary_border_radius - 5,
    alignItems: "center",
    paddingTop: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
  },
  locationTab: {
    justifyContent: "center",
    alignItems: "center",
  },
  locationHeadingText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.black,
    alignSelf: "flex-start",
    left: ScaleSize.spacing_semi_medium,
    marginVertical: ScaleSize.font_spacing + 2,
    marginTop: ScaleSize.spacing_very_small,
  },
  countinueBtn: {
    width: "90%",
    margin: ScaleSize.spacing_small,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    padding: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  countinueBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.white,
    fontSize: TextFontSize.small_text,
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
});
