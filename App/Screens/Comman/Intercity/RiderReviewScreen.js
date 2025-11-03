import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { AirbnbRating } from "react-native-ratings";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getReviewDetails } from "../../../Actions/Intercity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header, ModalProgressLoader } from "../../../Components/Comman";

const RiderReviewScreen = ({ navigation, route }) => {
  //////////// States /////////////
  const {
    intercityAllRideData,
    reviewData,
    reviewPage,
    reviewTotalPage,
    reviewLoading,
    isLoading,
  } = useSelector((state) => state.Intercity);
  const [refreshingData, setRefreshingData] = useState(false);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  //////////////// useEffect ////////////////
  useEffect(() => {
    fetchData(reviewPage);
  }, []);

  const fetchData = async (page) => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        page: page,
        driver_user_id: intercityAllRideData.user_id,
        user_id: UserId,
      };
      dispatch(getReviewDetails(body));
      setRefreshingData(false);
    } catch {}
  };

  const handleEndReached = () => {
    if (
      reviewData.length > 0 &&
      reviewPage < reviewTotalPage &&
      !isPagingCalled
    ) {
      fetchData(reviewPage + 1);
    } else {
      null;
    }
  };

  /////////// Function for refresh //////////
  const refresh = () => {
    setRefreshingData(true);
    fetchData(reviewPage + 1);
  };

  const renderItem = ({ item, index }) => {
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
              <Text
                style={styles.nameText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.first_name}
              </Text>
              <Text style={styles.dateText}>{item.post_date}</Text>
            </View>
            <AirbnbRating
              count={item.rating}
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

  var isPagingCalled = true;

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View
          style={{
            width: "100%",
            backgroundColor: "white",
            paddingHorizontal: ScaleSize.spacing_small,
          }}
        >
          <Header
            title={t("driver_review")}
            goBack={() => navigation.goBack("IntercityRideDetailsScreen")}
          />
        </View>
        <View style={styles.container}>
          <ModalProgressLoader visible={isLoading} />

          <FlatList
            ListHeaderComponent={() => (
              <View style={styles.ratingDisplay}>
                <Text style={styles.titleBarText}>{t("overall_ratings")}</Text>

                <Text style={styles.reviewCountText}>
                  {intercityAllRideData.total_rating}
                </Text>

                <AirbnbRating
                  count={5}
                  selectedColor={Colors.secondary}
                  starImage={Images.active_star}
                  starContainerStyle={styles.ratingStars}
                  showRating={false}
                  ratingContainerStyle={styles.ratingStarsArea}
                  reviewColor={Colors.black}
                  defaultRating={intercityAllRideData.total_rating}
                  size={ScaleSize.very_large_icon}
                  isDisabled={true}
                />

                <Text style={styles.descriptionText}>
                  {t("based_on")} {reviewData.length} {t("reviews")}
                </Text>
              </View>
            )}
            data={reviewData}
            renderItem={renderItem}
            onEndReached={() => handleEndReached()}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
              isPagingCalled = false;
            }}
            ListFooterComponent={() =>
              reviewPage > 1 &&
              reviewLoading && (
                <ActivityIndicator
                  animating
                  size={ScaleSize.spacing_medium * 2}
                  color={Colors.gray}
                />
              )
            }
            refreshControl={
              <RefreshControl refreshing={refreshingData} onRefresh={refresh} />
            }
            keyExtractor={(item, index) => index}
          />
        </View>
      </SafeAreaView>
    </>
  );
};

export default RiderReviewScreen;

const styles = StyleSheet.create({
  reviewTabArea: {
    width: "100%",
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_large,
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
  nameText: {
    color: Colors.black,
    width: "50%",
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text - 1,
    bottom: ScaleSize.font_spacing,
  },
  dateText: {
    color: Colors.gray,
    fontSize: TextFontSize.extra_small_text - 2,
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
    fontSize: TextFontSize.extra_small_text + 1,
    bottom: Platform.OS === "ios" ? ScaleSize.font_spacing : null,
  },
  container: {
    flex: 1,
    alignSelf: "center",
    backgroundColor: Colors.white,
    alignItems: "center",
  },
  driverReviewText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text,
    color: Colors.black,
  },
  ratingDisplay: {
    marginTop: ScaleSize.spacing_medium,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text,
    color: Colors.black,
  },
  reviewCountText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
    fontSize: TextFontSize.largest_text,
  },
  ratingStarsArea: {
    width: "100%",
    bottom: ScaleSize.spacing_small,
    justifyContent: "space-between",
  },
  ratingStars: {
    width: "70%",
    justifyContent: "space-between",
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.semi_medium_text,
    color: Colors.gray,
    top: ScaleSize.spacing_small,
    marginBottom: ScaleSize.spacing_medium,
  },
  profileImage: {
    height: ScaleSize.small_icon * 2,
    width: ScaleSize.small_icon * 2,
    borderRadius: ScaleSize.very_small_border_radius,
  },
});
