import {
  Image,
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ImageBackground,
  Platform,
  Linking,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  ModalProgressLoader,
  PrimaryButton,
  TextButton,
} from "../../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import Constant from "../../../Network/Constant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  checkAvailableCity,
  getIntracityRiderRideDetails,
} from "../../../Actions/Intracity";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getTimeZone } from "react-native-localize";
import { useTranslation } from "react-i18next";
import SelectDropdown from "react-native-select-dropdown";
import Utils from "../../../Helpers/Utils";
import RiderRenderItem from "../../../Components/Intracity/Rider/RiderRenderItem";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { GooglePlacesAutoComplete } from "../../../Components/Comman/GooglePlacesAutoComplete";

const RiderIntracityScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.Authentication);
  const {
    intracityAllRideData,
    riderRideData,
    riderRideLoading,
    riderPage,
    riderRideTotalPage,
    isLoading,
  } = useSelector((state) => state.Intracity);
  const { t, i18n } = useTranslation();
  const [refreshingData, setRefreshingData] = useState(false);
  const [selectedAreaType, setSelectedAreaType] = useState(t("today"));
  const [greetingsText, setGreetingsText] = useState("");
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const cityRef = useRef(null);
  const filter = [
    { label: t("today"), value: 1 },
    { label: t("upcoming"), value: 2 },
    { label: t("completed"), value: 3 },
    { label: t("cancelled"), value: 4 },
  ];
  const [isDisable, setIsDisable] = useState(true);
  const [areaType, setAreaType] = useState(filter);
  const [selectedItemValue, setSelectedItemValue] = useState(filter[0]);

  //////////////// useEffect ////////////////
  useEffect(() => {
    getCurrentGreetings();
  });

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchRideData(1);
  //   }, [selectedItemValue])
  // );

  // const fetchRideData = async (page) => {
  //   try {
  //     const UserId = await AsyncStorage.getItem("@id");
  //     const timeZone = getTimeZone();
  //     var body = {
  //       page: page,
  //       status: selectedItemValue.value,
  //       time_zone: timeZone,
  //       user_id: UserId,
  //     };
  //     if (await Utils.isNetworkConnected()) {
  //       dispatch(getIntracityRiderRideDetails(body));
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setRefreshingData(false);
  //   }
  // };

  //////////// Function for get greeting text ////////////
  const getCurrentGreetings = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      setGreetingsText(t("good_morning"));
    } else if (currentTime < 18) {
      setGreetingsText(t("good_afternoon"));
    } else {
      setGreetingsText(t("good_evening"));
    }
  };

  const handleEndReached = () => {
    if (
      riderRideData.length > 0 &&
      riderPage < riderRideTotalPage &&
      !isPagingCalled
    ) {
      fetchRideData(riderPage + 1);
    } else {
      null;
    }
  };

  const checkIsVerification = async (item, index, type) => {
    var is_phone_verify = await AsyncStorage.getItem("@is_phone_verify");
    if (is_phone_verify === "1" || userData?.is_phone_verify === 1) {
      navigation.navigate("AuthenticationNavigator", {
        screen: "MobileVerification",
        params: { isFromEditProfile: false, isFromMyBookings: false },
      });
    } else if (type === 1) {
      onItemPress(item);
    } else if (type === 2) {
      navigation.navigate("RideRequestScreen");
    }
  };

  async function onItemPress(item) {
    await AsyncStorage.setItem("@rideId", JSON.stringify(item.id));
    dispatch({ type: Constant.CLEAR_INTRACITY_RIDE_DETAILS_SUCCESS });
    navigation.navigate("IntracityRideDetailsScreen", {
      isFromMyBookings: false,
      isFromNotification: false,
      isRider: true,
      ride_id: item.id,
      is_bold: false,
    });
  }

  /////////// Function for render Dropdown items ////////
  const renderDropDownItem = (item) => {
    return (
      <View style={styles.dropDownMenuStyle}>
        <Text style={styles.dropDownMenuText}>{item.label}</Text>
      </View>
    );
  };

  /////////// Function for refresh //////////
  const refresh = () => {
    setRefreshingData(true);
    fetchRideData(1);
    setRefreshingData(false);
  };

  var isPagingCalled = true;

  const isFocused = useIsFocused();

  const handleClearCity = () => {
    setCity("");
    // setCityError(false);
    setIsDisable(true);
  };

  const checkCity = async (city) => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        city_name: city?.city?.toLowerCase(),
        user_id: UserId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          checkAvailableCity(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setIsDisable(false);
            } else {
              setCityError(data?.data?.message);
              setIsDisable(true);
            }
          })
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
        <View style={styles.container}>
          <StatusBar backgroundColor={Colors.white} barStyle={"dark-content"} />
          <ModalProgressLoader visible={isLoading && isFocused} />
          <View style={styles.topBar}>
            <View style={styles.userDetailsContainer}>
              <ImageBackground
                source={Images.profilePlaceholder}
                style={styles.HeaderProfileImageArea}
              >
                <Image
                  source={{ uri: userData.profile_picture }}
                  style={styles.profileImg}
                />
              </ImageBackground>
              <View style={styles.topBarTextArea}>
                <Text style={styles.greetingsText}>{greetingsText}</Text>
                <Text
                  style={styles.usernameText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userData.full_name}
                </Text>
              </View>
            </View>
            {/* <View style={styles.intercityIntracityDropdownTab}>
              <SelectDropdown
                style={{ width: "100%" }}
                data={areaType}
                onSelect={(selectedItem) => {
                  // refresh();
                  setSelectedItemValue(selectedItem);
                }}
                renderButton={(selectedItem) => {
                  return (
                    <View style={styles.dropSelectedItemContainer}>
                      <Text style={styles.dropDownSelectedItemText}>
                        {(selectedItem && selectedItem.label) ||
                          selectedAreaType}
                      </Text>
                      <Image
                        source={Images.dropdown_arrow_icon}
                        style={styles.dropDownIcon}
                      />
                    </View>
                  );
                }}
                renderItem={(item) => renderDropDownItem(item)}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.dropDownStyle}
              />
            </View> */}
          </View>

          <AutocompleteDropdownContextProvider>
            <View style={styles.tabsArea}>
              <View
                style={{
                  width: "100%",
                  height: ScaleSize.spacing_extra_large,
                }}
              >
                <GooglePlacesAutoComplete
                  onSelected={(selectedItem) => {
                    setCityError(false);
                    setCity(selectedItem, "pickup_address");
                  }}
                  isOptional={false}
                  imageShow={false}
                  ref={cityRef}
                  onSelectItem={(selectedItem) => {
                    console.log("selectedItem", selectedItem);
                    if (selectedItem) {
                      checkCity(selectedItem);
                    }
                  }}
                  multiline={false}
                  onClear={handleClearCity}
                  editable={true}
                  selectTextOnFocus={true}
                  isAddressSearch={false}
                  error={cityError}
                  placeholder={"Please Enter City"}
                />
              </View>

              <View style={{ width: "100%" }}>
                <Text style={styles.noteText}>
                  You will be redirected to our website to continue.
                </Text>
                <View style={styles.reserveBtn}>
                  <PrimaryButton
                    string={"Reserve Now"}
                    disabled={isDisable}
                    onPress={() => Linking.openURL(Constant.RESERVE_URL)}
                  />
                </View>
              </View>
            </View>
          </AutocompleteDropdownContextProvider>
          {/* <View style={styles.titleBar}>
            <Text style={styles.todaysRideText}>
              {selectedItemValue.label} Ride
            </Text>
          </View>

          {riderRideData.length === 0 ? (
            <Text style={styles.noDataText}>{t("no_data_found")}</Text>
          ) : (
            <FlatList
              style={{ marginTop: ScaleSize.spacing_semi_medium - 2 }}
              data={riderRideData}
              renderItem={({ item, index }) => (
                <RiderRenderItem
                  item={item}
                  index={index}
                  onPress={() => checkIsVerification(item, index, 1)}
                />
              )}
              onEndReachedThreshold={0.5}
              onMomentumScrollBegin={() => {
                isPagingCalled = false;
              }}
              onEndReached={() => handleEndReached()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshingData}
                  onRefresh={refresh}
                />
              }
              ListFooterComponent={() =>
                riderPage > 1 &&
                riderRideLoading && (
                  <ActivityIndicator
                    animating
                    size={ScaleSize.spacing_medium * 2}
                    color={Colors.gray}
                  />
                )
              }
              keyExtractor={(item, index) => index}
            />
          )}

          <TextButton
            source={Images.add_ride}
            iconStyle={styles.addRideIcon}
            buttonStyle={styles.addRideButton}
            onPress={() => checkIsVerification("", "", 2)}
          /> */}
        </View>
      </SafeAreaView>
    </>
  );
};

export default RiderIntracityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_small,
    backgroundColor: Colors.white,
  },
  topBar: {
    height: ScaleSize.spacing_very_large,
    marginVertical: ScaleSize.spacing_medium,
    flexDirection: "row",
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "space-between",
    alignItems: "center",
  },
  userDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1.5,
  },
  profileImg: {
    height: "100%",
    width: "100%",
    margin: ScaleSize.spacing_small,
    resizeMode: "cover",
    borderRadius: ScaleSize.very_small_border_radius,
  },
  topBarTextArea: {
    marginRight: ScaleSize.spacing_large,
    alignItems: "flex-start",
    left: ScaleSize.spacing_semi_medium,
  },
  usernameText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text - 1,
    color: Colors.black,
    width: "85%",
    bottom: ScaleSize.font_spacing,
  },
  greetingsText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
    top: Platform.OS === "ios" ? null : ScaleSize.spacing_very_small,
  },
  HeaderProfileImageArea: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: ScaleSize.tab_profile_icon - 2,
    width: ScaleSize.tab_profile_icon - 2,
    backgroundColor: Colors.gray,
    borderRadius: ScaleSize.small_border_radius - 4,
  },
  profileImageArea: {
    justifyContent: "center",
    alignItems: "center",
    height: ScaleSize.tab_profile_icon + 15,
    width: ScaleSize.tab_profile_icon + 15,
    overflow: "hidden",
    backgroundColor: Colors.gray,
    marginHorizontal: ScaleSize.spacing_small,
    borderRadius: ScaleSize.small_border_radius + 2,
  },
  addRideButton: {
    position: "absolute",
    bottom: 0,
    right: ScaleSize.spacing_medium,
  },
  addRideIcon: {
    height: ScaleSize.very_small_image,
    width: ScaleSize.very_small_image,
    resizeMode: "contain",
  },
  intercityIntracityDropdownTab: {
    flex: 0.8,
    height: ScaleSize.spacing_very_large - 2,
    paddingHorizontal: ScaleSize.spacing_semi_medium + 5,
    paddingVertical: ScaleSize.spacing_small + 2,
    borderWidth: ScaleSize.smallest_border_width,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  dropDownMenuStyle: {
    margin: ScaleSize.spacing_small + 2,
    width: "100%",
    borderBottomWidth: 0,
  },
  dropDownMenuText: {
    color: "black",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
  },
  dropDownIcon: {
    height: ScaleSize.spacing_small,
    width: ScaleSize.spacing_small,
    right: ScaleSize.spacing_very_small,
    // marginLeft: ScaleSize.spacing_small,
    resizeMode: "contain",
  },
  dropDownStyle: {
    width: "30%",
    flex: 1,
    justifyContent: "center",
    marginTop: ScaleSize.spacing_semi_medium,
    alignSelf: "center",
    borderRadius: ScaleSize.small_border_radius,
    elevation: 10,
    padding: ScaleSize.spacing_small + 2,
  },
  dropSelectedItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropDownSelectedItemText: {
    flex: 1,
    textAlign: "center",
    right: ScaleSize.spacing_small,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.medium,
    color: Colors.black,
  },
  tabArea: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  tab: {
    width: "100%",
    flex: 1,
    paddingBottom: ScaleSize.spacing_medium * 3,
    padding: ScaleSize.spacing_semi_medium - 2,
    borderWidth: ScaleSize.smallest_border_width,
    marginVertical: ScaleSize.spacing_small,
    borderRadius: ScaleSize.medium_border_radius,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  tabHeaderArea: {
    flex: 1,
    height: ScaleSize.spacing_large * 3,
    flexDirection: "row",
    paddingVertical: ScaleSize.spacing_small,
    padding: ScaleSize.spacing_minimum,
    paddingRight: ScaleSize.spacing_small,
    alignItems: "center",
    borderRadius: ScaleSize.small_border_radius + 4,
    backgroundColor: Colors.lightest_gray,
    justifyContent: "flex-start",
  },
  tabProfile: {
    height: ScaleSize.tab_profile_icon + 15,
    width: ScaleSize.tab_profile_icon + 15,
    resizeMode: "cover",
    position: "absolute",
    right: 0,
    borderRadius: ScaleSize.small_border_radius + 2,
  },
  riderDetailsArea: {
    paddingHorizontal: ScaleSize.spacing_very_small,
    flex: 1,
  },
  nameText: {
    color: Colors.black,
    width: "60%",
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text,
  },
  tabIcon: {
    height: ScaleSize.flatlist_tab_icon,
    width: ScaleSize.small_icon,
    resizeMode: "contain",
  },
  dateIconArea: {
    borderRadius: 100,
    backgroundColor: Colors.secondary,
    padding: ScaleSize.spacing_very_small - 1,
    justifyContent: "center",
    alignItems: "center",
    bottom: ScaleSize.font_spacing,
  },
  dateIcon: {
    height: ScaleSize.small_icon - 1,
    width: ScaleSize.small_icon - 1,
    bottom: ScaleSize.font_spacing,
    marginRight: ScaleSize.spacing_small - 5,
    resizeMode: "cover",
  },
  seatBookedText: {
    color: Colors.black,
    bottom: ScaleSize.font_spacing,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text - 1.5,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  dateAndPriceText: {
    color: Colors.black,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text - 1.5,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  bottomPriceText: {
    color: Colors.primary,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text,
    position: "absolute",
    left: ScaleSize.spacing_medium,
    bottom: ScaleSize.spacing_small + 2,
  },
  price: {
    color: Colors.primary,
    fontFamily: AppFonts.medium,
    alignSelf: "flex-start",
    fontSize: TextFontSize.medium_text - 2,
    top: ScaleSize.spacing_small,
    left: ScaleSize.spacing_small,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  dateText: {
    color: Colors.black,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
  },
  pickupText: {
    color: Colors.black,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
  },
  priceText: {
    marginTop: ScaleSize.spacing_small,
    color: Colors.primary,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
  },
  pendingAndPriceArea: {
    height: ScaleSize.spacing_extra_large,
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    right: ScaleSize.spacing_small,
  },
  pendingText: {
    top: ScaleSize.font_spacing - 1,
    fontFamily: AppFonts.medium,
    fontSize: 10,
  },
  pendingArea: {
    position: "absolute",
    borderWidth: ScaleSize.smallest_border_width,
    right: ScaleSize.spacing_small + 5,
    borderRadius: ScaleSize.small_border_radius,
    paddingVertical: 1,
    top: ScaleSize.spacing_semi_medium - 1,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
  },
  tabFooterArea: {
    flex: 1,
    flexDirection: "row",
    marginTop: ScaleSize.spacing_semi_medium,
  },
  navigationArea: {
    alignItems: "center",
    top: ScaleSize.font_spacing,
    justifyContent: "center",
    justifyContent: "flex-start",
  },
  addressArea: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: ScaleSize.spacing_small,
    paddingRight: ScaleSize.spacing_medium,
  },
  pickupAddressText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
    color: Colors.black,
  },
  dropoffAdressText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text,
    color: Colors.black,
    top: ScaleSize.spacing_very_small,
  },
  titleBar: {
    alignSelf: "flex-start",
    paddingHorizontal: ScaleSize.spacing_medium,
    width: "100%",
    marginBottom: -10,
  },
  todaysRideText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text - 1,
    color: Colors.black,
    alignSelf: "flex-start",
  },
  dropOffIcon: {
    height: ScaleSize.small_icon,
    width: ScaleSize.small_icon,
    resizeMode: "contain",
    tintColor: Colors.gray,
  },
  locationIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    tintColor: Colors.primary,
    resizeMode: "contain",
  },
  sepraterLine: {
    height: ScaleSize.spacing_medium - 4,
    borderRightWidth: ScaleSize.spacing_minimum + 1,
    marginTop: ScaleSize.spacing_very_small / 2,
    marginHorizontal: ScaleSize.spacing_very_small * 1.5,
    borderColor: Colors.light_gray,
  },
  navigatorLine: {
    width: ScaleSize.font_spacing,
    borderRightWidth: 1.5,
    flex: 0.3,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    height: ScaleSize.spacing_large,
  },
  noDataText: {
    color: Colors.gray,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.semi_medium_text,
    top: ScaleSize.spacing_extra_large * 4,
    alignSelf: "center",
  },

  webButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  titleText: {
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
    alignSelf: "flex-start",
    top: ScaleSize.spacing_very_small,
    left: ScaleSize.spacing_medium,
  },
  noteText: {
    fontSize: TextFontSize.small_text - 3,
    fontFamily: AppFonts.regular,
    color: Colors.gray,
    textAlign: "center",
  },
  reserveBtn: {
    width: "100%",
    height: ScaleSize.spacing_extra_large * 1.3,
  },
  tabsArea: {
    paddingBottom: ScaleSize.spacing_medium,
    paddingHorizontal: ScaleSize.spacing_medium,
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    width: "100%",
  },
});
