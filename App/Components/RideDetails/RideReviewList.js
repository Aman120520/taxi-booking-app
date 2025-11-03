import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../Resources";
import { useTranslation } from "react-i18next";
import { AirbnbRating } from "react-native-ratings";
import { useSelector } from "react-redux";

const ReviewsRenderItem = ({ item, index, data }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.reviewTabArea}>
      <View style={styles.reviewTab}>
        <View style={styles.tabImageArea}>
          <Image
            source={{ uri: item.profile_picture }}
            style={styles.profileImage}
          />
        </View>
        <View style={styles.tabTextArea}>
          <View style={styles.nameAndDateTextArea}>
            <Text style={styles.reviewerNameText}>{item.first_name}</Text>
            <Text style={styles.dateText}>{item.post_date}</Text>
          </View>
          <AirbnbRating
            count={data.rating}
            selectedColor={Colors.secondary}
            starImage={Images.active_star}
            starContainerStyle={styles.tabRatingStars}
            showRating={false}
            ratingContainerStyle={styles.tabRatingStarsArea}
            defaultRating={item.rating}
            size={ScaleSize.small_icon - 2}
            isDisabled={true}
          />
          <Text style={styles.commentText}>{item.review}</Text>
        </View>
      </View>
    </View>
  );
};

const RideReviewList = (data) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { intercityAllRideData } = useSelector((state) => state.Intercity);

  return (
    <View style={styles.reviewArea}>
      <Text style={styles.titleBarText}>{t("ride_review")}</Text>
      <FlatList
        style={styles.reviewFlatList}
        data={
          showAllReviews
            ? intercityAllRideData.reviews_rating
            : intercityAllRideData.reviews_rating.slice(0, 2)
        }
        renderItem={({ item, index }) => (
          <ReviewsRenderItem
            item={item}
            index={index}
            data={intercityAllRideData}
          />
        )}
      />
      {!showAllReviews && (
        <TouchableOpacity onPress={() => setShowAllReviews(true)}>
          <Text style={styles.seeAllReviewBtnText}>{t("see_all_review")}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default RideReviewList;

const styles = StyleSheet.create({
  seeAllReviewBtnText: {
    color: Colors.primary,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.small_text,
  },
  reviewFlatList: {
    flex: 1,
    width: "100%",
    paddingBottom: ScaleSize.spacing_small,
  },
  reviewArea: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: ScaleSize.spacing_medium,
  },
  profileImage: {
    height: ScaleSize.small_icon * 2,
    width: ScaleSize.small_icon * 2,
    borderRadius: ScaleSize.very_small_border_radius,
  },
  reviewTabArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewTab: {
    width: "100%",
    flexDirection: "row",
    margin: ScaleSize.spacing_small,
    borderColor: Colors.gray,
    borderWidth: ScaleSize.smallest_border_width,
    padding: ScaleSize.spacing_small + 2,
    borderRadius: ScaleSize.small_border_radius,
  },
  reviewTabArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  reviewTab: {
    width: "100%",
    flexDirection: "row",
    margin: ScaleSize.spacing_small,
    borderColor: Colors.gray,
    borderWidth: ScaleSize.smallest_border_width,
    padding: ScaleSize.spacing_small + 2,
    borderRadius: ScaleSize.small_border_radius,
  },
  tabImageArea: {
    height: "100%",
    marginHorizontal: ScaleSize.spacing_small - 2,
  },
  tabTextArea: {
    paddingHorizontal: ScaleSize.spacing_small,
    height: "100%",
    width: "85%",
  },
  nameAndDateTextArea: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  reviewerNameText: {
    color: Colors.black,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text,
  },
  dateText: {
    color: Colors.gray,
    fontSize: TextFontSize.extra_small_text,
    fontFamily: AppFonts.medium_italic,
  },
  tabRatingStarsArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
    bottom: ScaleSize.spacing_very_small,
  },
  tabRatingStars: {
    alignSelf: "flex-start",
  },
  commentText: {
    color: Colors.gray,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
  },
  completeButton: {
    width: "90%",
    margin: ScaleSize.spacing_small,
    top: ScaleSize.spacing_small,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    padding: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
});
