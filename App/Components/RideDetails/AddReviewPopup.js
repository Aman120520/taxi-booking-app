import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../Resources";
import { AirbnbRating } from "react-native-ratings";

///////////// Function for Review Modal /////////////
const AddReviewPopup = (modalVisible, setModalVisible) => {
  const [selectedRating, setSelectedRating] = useState(1);

  const [swipeEvent, setSwipeEvent] = useState();
  const handleRating = (rating) => {
    setSelectedRating(rating);
  };

  const getCustomReviewText = () => {
    if (selectedRating == 1) {
      return t("not_good");
    } else if (selectedRating == 2) {
      return t("could_be_better");
    } else if (selectedRating == 3) {
      return t("average");
    } else if (selectedRating == 4) {
      return t("pretty_good");
    } else if (selectedRating == 5) {
      return t("excellent");
    }
  };

  return (
    <>
      <View
        style={{ flex: 1 }}
        onTouchEnd={(e) => setSwipeEvent(e.nativeEvent.pageY)}
        onTouchStart={async (e) => {
          if (
            swipeEvent &&
            swipeEvent - e.nativeEvent.pageY > windowHeight / 2
          ) {
          }
        }}
      >
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <ScrollView contentContainerStyle={styles.modalBg}>
            <View style={styles.modal}>
              <AirbnbRating
                count={5}
                selectedColor={Colors.secondary}
                starImage={Images.active_star}
                starContainerStyle={styles.ratingStars}
                showRating={false}
                ratingContainerStyle={styles.ratingStarsArea}
                reviewColor={Colors.black}
                defaultRating={1}
                size={ScaleSize.very_large_icon}
                onFinishRating={handleRating}
              />

              <View style={styles.reviewTextArea}>
                <Text style={styles.reviewText}>
                  asdas{getCustomReviewText}
                </Text>
                <Text style={styles.reviewDescriptionText}>
                  You Rated {intercityAllRideData.first_name} {selectedRating}{" "}
                  star
                </Text>
              </View>

              <TextInput
                placeholder={t("write_your_text")}
                placeholderTextColor={Colors.gray}
                style={styles.reviewTextInput}
                value={reviewMessage}
                enterKeyHint="done"
                onChangeText={(text) => setReviewMessage(text)}
              />

              <View style={styles.submitReviewBtn}>
                <PrimaryButton
                  string={t("submit")}
                  onPress={handleSaveRating}
                />
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
    </>
  );
};

export default AddReviewPopup;

const styles = StyleSheet.create({
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
    fontSize: TextFontSize.small_text,
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
    backgroundColor: Colors.lightest_gray,
    borderColor: Colors.gray,
    marginVertical: ScaleSize.spacing_small,
    borderRadius: ScaleSize.small_border_radius,
  },
  submitReviewBtn: {
    width: "100%",
    height: ScaleSize.spacing_extra_large + 20,
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
  ratingStarsArea: {
    justifyContent: "space-between",
  },
  ratingStars: {
    width: "65%",
    justifyContent: "space-between",
  },
});
