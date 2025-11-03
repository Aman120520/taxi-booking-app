import {
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryButton } from "../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import { saveRating } from "../../Actions/Intercity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AirbnbRating } from "react-native-ratings";
import Utils from "../../Helpers/Utils";
import { saveIntracityRating } from "../../Actions/Intracity";

const RideRatingPopup = ({
  visible,
  onClose,
  isRider,
  booking_id,
  getRideData,
  isIntracity,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [selectedRating, setSelectedRating] = useState(1);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewMessageError, setReviewMessageError] = useState(false);
  const { intercityAllRideData } = useSelector((state) => state.Intercity);
  const { intracityAllRideData } = useSelector((state) => state.Intracity);
  const { userData } = useSelector((state) => state.Authentication);

  //////////// Function to handle rating selection /////////////
  const handleRating = (rating) => {
    setSelectedRating(rating);
  };

  /////////// Function for Save Ratings ///////////
  const handleSaveRating = async () => {
    var isValid = true;
    if (Utils.isNull(reviewMessage)) {
      isValid = false;
      setReviewMessageError(t("blank_field_error"));
    }
    if (isValid) {
      onClose();
      try {
        const UserId = await AsyncStorage.getItem("@id");
        const RideId = await AsyncStorage.getItem("@rideId");
        const userRideId = JSON.parse(RideId);
        var body = {
          intercity_ride_id: userRideId,
          driver_user_id: intercityAllRideData.user_id,
          user_id: UserId,
          booking_id: isRider ? booking_id : userRideId,
          review: reviewMessage,
          rating: selectedRating,
        };
        if (await Utils.isNetworkConnected()) {
          dispatch(
            saveRating(body, async (data, isSuccess) => {
              if (isSuccess === true) {
                getRideData();
              }
            })
          );
        }
      } catch {}
    }
  };

  /////////// Function for Save Ratings ///////////
  const handleIntracitySaveRating = async () => {
    var isValid = true;
    if (Utils.isNull(reviewMessage)) {
      isValid = false;
      setReviewMessageError(t("blank_field_error"));
    }
    if (isValid) {
      onClose();
      try {
        const RideId = await AsyncStorage.getItem("@rideId");
        const userRideId = JSON.parse(RideId);
        var body = {
          intracity_ride_id: userRideId,
          user_id: userData.id,
          review: reviewMessage,
          rating: selectedRating,
        };
        if (await Utils.isNetworkConnected()) {
          dispatch(
            saveIntracityRating(body, async (data, isSuccess) => {
              if (isSuccess === true) {
                getRideData();
              }
            })
          );
        }
      } catch {}
    }
  };

  return (
    <>
      <Modal visible={visible} transparent={true} onRequestClose={onClose}>
        <TouchableWithoutFeedback style={{ flex: 1 }} onPress={onClose}>
          <View style={styles.modalBg}>
            <View style={styles.modal}>
              <View style={styles.filterModalNotch} />
              <AirbnbRating
                count={5}
                selectedColor={Colors.secondary}
                starImage={Images.active_star}
                starContainerStyle={styles.ratingStars}
                showRating={false}
                ratingContainerStyle={styles.ratingStarsArea}
                reviewColor={Colors.black}
                defaultRating={selectedRating}
                size={ScaleSize.very_large_icon}
                onFinishRating={(rating) => handleRating(rating)}
              />

              <View style={styles.reviewTextArea}>
                <Text style={styles.reviewText}>
                  {Utils.showRatingOptions(selectedRating, t)}
                </Text>
                <Text style={styles.reviewDescriptionText}>
                  {t("you_rated")} {intercityAllRideData?.first_name}{" "}
                  {selectedRating} {t("star")}
                </Text>
              </View>

              <TextInput
                placeholder={t("write_your_text")}
                placeholderTextColor={Colors.gray}
                style={styles.reviewTextInput}
                value={reviewMessage}
                enterKeyHint="done"
                onChangeText={(text) => {
                  setReviewMessageError(null);
                  setReviewMessage(text);
                }}
              />

              {reviewMessageError ? (
                <View style={styles.errorTextArea}>
                  <Text style={styles.errorText}>{reviewMessageError}</Text>
                </View>
              ) : null}

              <View style={styles.submitReviewBtn}>
                <PrimaryButton
                  string={t("submit")}
                  onPress={
                    isIntracity ? handleIntracitySaveRating : handleSaveRating
                  }
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default RideRatingPopup;

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: Colors.modal_bg,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  modal: {
    width: "100%",
    borderTopLeftRadius: ScaleSize.small_border_radius,
    borderTopRightRadius: ScaleSize.small_border_radius,
    justifyContent: "center",
    alignItems: "center",
    padding: ScaleSize.spacing_medium,
    backgroundColor: Colors.white,
  },
  filterModalNotch: {
    height: ScaleSize.spacing_small,
    width: ScaleSize.spacing_large + 2,
    marginBottom: ScaleSize.spacing_medium,
    borderRadius: ScaleSize.small_border_radius,
    backgroundColor: Colors.textinput_low_opacity,
  },
  ratingStarsArea: {
    justifyContent: "space-between",
  },
  ratingStars: {
    width: "65%",
    justifyContent: "space-between",
  },
  reviewTextArea: {
    marginVertical: ScaleSize.spacing_small,
    justifyContent: "center",
    alignItems: "center",
  },
  reviewText: {
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.large_text,
    color: Colors.black,
    top: ScaleSize.spacing_small,
  },
  reviewDescriptionText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.small_text - 1,
    color: Colors.gray,
  },
  reviewTextInput: {
    width: "100%",
    height: 150,
    justifyContent: "flex-start",
    textAlignVertical: "top",
    padding: ScaleSize.spacing_medium,
    borderWidth: 1,
    color: Colors.black,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.small_text,
    backgroundColor: Colors.lightest_gray,
    borderColor: Colors.gray,
    marginVertical: ScaleSize.spacing_small,
    borderRadius: ScaleSize.small_border_radius,
  },
  submitReviewBtn: {
    width: "100%",
    height: ScaleSize.spacing_extra_large + 20,
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
});
