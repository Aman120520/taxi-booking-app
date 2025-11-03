import {
  Image,
  StyleSheet,
  Text,
  FlatList,
  ImageBackground,
  RefreshControl,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { ModalProgressLoader, TextButton } from "../../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import moment from "moment";
import SelectDropdown from "react-native-select-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getIntercityDriverRideDetails } from "../../../Actions/Intercity";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getTimeZone } from "react-native-localize";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import Utils from "../../../Helpers/Utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { checkStatus } from "../../../Actions/authentication";
import { getRideBookingDetails } from "../../../Actions/Intercity";
import Constant from "../../../Network/Constant";
import SubscriptionPopup from "../../Comman/SubscriptionPopup";
import FastImage from "react-native-fast-image";

const DriverIntercityHomeScreen = ({ navigation, route }) => {
  /////////// States ///////////
  const dispatch = useDispatch();
  const { userData, userStatus } = useSelector((state) => state.Authentication);
  const {
    driverRideData,
    rideLoading,
    driverPage,
    driverRideTotalPage,
    isLoading,
  } = useSelector((state) => state.Intercity);
  const [greetingsText, setGreetingsText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { t } = useTranslation();
  const [driverStatus, setDriverStatus] = useState("");
  const [refreshingData, setRefreshingData] = useState(false);
  const [selectedAreaType, setSelectedAreaType] = useState(t("today"));
  const [subModal, setSubModal] = useState(false);
  const filter = [
    { label: t("today"), value: 1 },
    { label: t("upcoming"), value: 2 },
    { label: t("completed"), value: 3 },
    { label: t("cancelled"), value: 4 },
    // { label: t("incomplete"), value: 5 },
  ];
  const [areaType, setAreaType] = useState(filter);
  const [selectedItemValue, setSelectedItemValue] = useState(filter[0]);

  //////////// Function for get greeting text ////////////
  const getCurrentGreetings = () => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      setGreetingsText("Good Morning");
    } else if (currentTime < 18) {
      setGreetingsText("Good Afternoon");
    } else {
      setGreetingsText("Good Evening");
    }
  };

  //////////////// useEffect ////////////////
  useFocusEffect(
    React.useCallback(() => {
      getCurrentGreetings();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        fetchRideData(driverPage);
      }, 100);
    }, [selectedItemValue])
  );

  const fetchRideData = async (page) => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        page: page,
        status: selectedItemValue.value,
        user_id: UserId,
        time_zone: "Asia/kolkata",
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(getIntercityDriverRideDetails(body));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRefreshingData(false);
    }
  };

  const handleEndReached = () => {
    if (
      driverRideData.length > 0 &&
      driverPage < driverRideTotalPage &&
      !isPagingCalled
    ) {
      fetchRideData(driverPage + 1);
    } else {
      null;
    }
  };

  /////////// Function for render Dropdown items ////////
  const renderDropDownItem = (item) => {
    return (
      <View style={styles.dropDownMenuStyle}>
        <Text style={styles.dropDownMenuText}>{item.label}</Text>
      </View>
    );
  };

  const changeStatus = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        status: userStatus === 0 ? 1 : 0,
        user_id: UserId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          checkStatus(body, (data, isSuccess) => {
            if (isSuccess === true) {
              setDriverStatus(
                userStatus === 0 ? t("online_message") : t("offline_message")
              );
              showModal();
            }
          })
        );
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function StatusModal() {
    return (
      <>
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modalBg}>
            <View style={styles.modal}>
              <Text style={styles.statusText}>{driverStatus}</Text>
            </View>
          </View>
        </Modal>
      </>
    );
  }

  const showModal = () => {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 2000);
  };

  const checkIsVerification = async (item, index, type) => {
    var is_phone_verify = await AsyncStorage.getItem("@is_phone_verify");
    if (is_phone_verify === "1" || userData?.is_phone_verify === 1) {
      navigation.navigate("AuthenticationNavigator", {
        screen: "MobileVerification",
        params: { isFromEditProfile: false, isFromMyBookings: false },
      });
    } else if (type === 1) {
      await AsyncStorage.setItem("@rideId", JSON.stringify(item.id));
      dispatch({ type: Constant.CLEAR_RIDE_DETAILS_SUCCESS });
      navigation.navigate("IntercityRideDetailsScreen", {
        isFromMyBookings: true,
        callIcon: false,
        isRider: false,
        ride_id: item.id,
        is_bold: false,
      });
    } else if (type === 2) {
      if (userData?.is_subscription === 0) {
        setSubModal(true);
      } else {
        var body = {
          ride_id: item.id,
          user_id: item.user_id,
        };
        dispatch(
          getRideBookingDetails(body, (data) => {
            if (data) {
              navigation.navigate("DriverPostRideScreen", {
                rideDetails: data.data,
                isCalled: true,
              });
            }
          })
        );
      }
    } else if (type === 3) {
      navigation.navigate("DriverPostRideScreen", { isCalled: false });
    }
  };

  //////////// Flatlist RenderItem /////////////
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.tabArea}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => checkIsVerification(item, index, 1)}
        >
          <View style={styles.tabImageAndTextArea}>
            <ImageBackground
              source={Images.profilePlaceholder}
              style={styles.profileImageArea}
            >
              <Image
                source={{ uri: item.profile_picture }}
                style={styles.tabProfileImg}
              />
            </ImageBackground>
            <View style={styles.textArea}>
              <Text style={styles.nameText}>{item.first_name}</Text>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical:
                    Platform.OS === "ios" ? ScaleSize.font_spacing : null,
                }}
              >
                <Image
                  style={styles.tabLocationIcon}
                  source={Images.route_icon}
                />
                <Text style={styles.destinationText}>
                  {item.pickup_city} to {item.dropoff_city}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Image style={styles.tabRateIcon} source={Images.rate} />
                <Text style={styles.ratingText}>{item.total_rating}</Text>
              </View>
            </View>
            {selectedItemValue.value === 1 || selectedItemValue.value === 2 ? (
              <TouchableOpacity
                onPress={() => checkIsVerification(item, index, 2)}
                style={styles.editBtn}
              >
                <Image source={Images.edit_icon} style={styles.editIcon} />
              </TouchableOpacity>
            ) : null}
          </View>

          <View style={styles.dateTextPickupPriceTextArea}>
            <Text style={styles.dateText}>
              {t("date")} {moment(item.date).format("DD, MMM YYYY hh:mm a")}
            </Text>
            <View style={styles.verticalSepratorLine} />
            <Text style={styles.priceText}>
              {t("price")} ${item.price_per_seat}
            </Text>
          </View>

          <View style={styles.horizontalSeparetorLine} />

          <View style={styles.tabBottomBar}>
            <View style={styles.seatArea}>
              <Image style={styles.tabIcon} source={Images.seat} />
              <Text style={styles.seatText}>
                {item.available_seat <= 0
                  ? "FULL"
                  : item.available_seat > 1
                  ? item.available_seat + " " + "Seats Available"
                  : item.available_seat + " " + "Seat Available"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  /////////// Function for refresh //////////
  const refresh = () => {
    setRefreshingData(true);
    fetchRideData(1);
    setRefreshingData(false);
  };

  const isFocused = useIsFocused();

  var isPagingCalled = true;

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View style={styles.container}>
          <ModalProgressLoader visible={isLoading && isFocused} />

          <View style={styles.topBar}>
            <View style={styles.userDetailsContainer}>
              <View>
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor:
                        userStatus === 0 || userStatus === "0"
                          ? Colors.gray
                          : "#2ace26",
                    },
                  ]}
                />
                <TouchableOpacity
                  onPress={changeStatus}
                  style={styles.HeaderProfileImageArea}
                >
                  {userData && (
                    <>
                      <ImageBackground
                        source={Images.profilePlaceholder}
                        style={styles.HeaderProfileImageArea}
                      >
                        <FastImage
                          resizeMode={FastImage.resizeMode.cover}
                          source={{ uri: userData.profile_picture }}
                          style={styles.userProfileImg}
                        />
                      </ImageBackground>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.topBarTextArea}>
                <Text style={styles.greetingsText}>{greetingsText}</Text>
                {userData && (
                  <Text
                    style={styles.usernameText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {userData.full_name}
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.intercityIntracityDropdownTab}>
              <SelectDropdown
                style={{ width: "100%" }}
                data={areaType}
                onSelect={(selectedItem) => {
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
            </View>
          </View>

          <View style={styles.titleBar}>
            <Text style={styles.pastRidesText}>
              {selectedItemValue.label} Ride
            </Text>
          </View>

          {driverRideData.length === 0 ? (
            <Text style={styles.noDataText}>{t("rides_not_available")}</Text>
          ) : (
            <FlatList
              style={{
                width: "100%",
                paddingHorizontal: ScaleSize.spacing_semi_medium,
              }}
              data={driverRideData}
              showsVerticalScrollIndicator={false}
              renderItem={renderItem}
              onEndReached={() => handleEndReached()}
              onEndReachedThreshold={0.5}
              onMomentumScrollBegin={() => {
                isPagingCalled = false;
              }}
              ListFooterComponent={() =>
                driverPage > 1 &&
                rideLoading && (
                  <ActivityIndicator
                    animating
                    size={ScaleSize.spacing_medium * 2}
                    color={Colors.gray}
                  />
                )
              }
              refreshControl={
                <RefreshControl
                  refreshing={refreshingData}
                  onRefresh={refresh}
                />
              }
              keyExtractor={(item, index) => index}
            />
          )}

          {StatusModal()}
        </View>

        <TextButton
          source={Images.add_ride}
          iconStyle={styles.addRideIcon}
          buttonStyle={styles.addRideButton}
          onPress={() => {
            if (userData?.is_subscription === 0) {
              setSubModal(true);
            } else {
              checkIsVerification("", "", 3);
            }
          }}
        />

        <SubscriptionPopup
          visible={subModal}
          navigation={navigation}
          onClose={() => setSubModal(false)}
        />
      </SafeAreaView>
    </>
  );
};

export default DriverIntercityHomeScreen;

const styles = StyleSheet.create({
  modalBg: {
    position: "absolute",
    right: 0,
    left: 0,
    bottom: ScaleSize.spacing_medium,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modal: {
    backgroundColor: Colors.black,
    paddingHorizontal: ScaleSize.spacing_medium,
    paddingVertical: ScaleSize.spacing_small,
    marginBottom: ScaleSize.spacing_extra_large * 1.5,
  },
  statusText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.white,
    top: ScaleSize.font_spacing,
  },
  statusIndicator: {
    borderColor: Colors.white,
    elevation: 10,
    top: -ScaleSize.spacing_very_small,
    right: -ScaleSize.spacing_very_small,
    borderWidth: ScaleSize.primary_border_width + 1.5,
    borderRadius: ScaleSize.primary_border_radius,
    height: ScaleSize.spacing_semi_medium,
    width: ScaleSize.spacing_semi_medium,
    position: "absolute",
    zIndex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_small,
    backgroundColor: Colors.white,
  },
  userDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1.5,
  },
  topBar: {
    height: ScaleSize.spacing_very_large,
    marginVertical: ScaleSize.spacing_medium,
    flexDirection: "row",
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileImg: {
    flex: 1,
    resizeMode: "cover",
    borderRadius: ScaleSize.very_small_border_radius,
  },
  topBarTextArea: {
    alignItems: "flex-start",
    flex: 1,
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
  titleBar: {
    alignSelf: "flex-start",
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    width: "100%",
  },
  tabArea: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    width: "100%",
  },
  tab: {
    width: "100%",
    flex: 1,
    padding: ScaleSize.spacing_semi_medium - 2,
    borderWidth: ScaleSize.smallest_border_width,
    marginVertical: ScaleSize.spacing_small,
    borderRadius: ScaleSize.medium_border_radius,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  tabImageAndTextArea: {
    flexDirection: "row",
    flex: 1,
    bottom: ScaleSize.spacing_very_small - 2,
    alignItems: "center",
  },
  userProfileImg: {
    height: "100%",
    width: "100%",
    margin: ScaleSize.spacing_small,
    resizeMode: "cover",
    borderRadius: ScaleSize.very_small_border_radius,
  },
  tabProfileImg: {
    height: ScaleSize.tab_profile_icon + 15,
    width: ScaleSize.tab_profile_icon + 15,
    resizeMode: "cover",
    position: "absolute",
    right: 0,
    borderRadius: ScaleSize.small_border_radius,
  },
  textArea: {
    flex: 1,
    alignItems: "flex-start",
  },
  nameText: {
    color: Colors.black,
    fontFamily: AppFonts.bold,
    bottom: Platform.OS === "ios" ? ScaleSize.font_spacing : null,
    fontSize: TextFontSize.small_text - 1,
  },
  tabIcon: {
    height: ScaleSize.small_icon - 4,
    width: ScaleSize.small_icon - 4,
  },
  tabRateIcon: {
    height: ScaleSize.small_icon - 1,
    width: ScaleSize.small_icon - 1,
    bottom: ScaleSize.font_spacing,
    resizeMode: "cover",
  },
  tabLocationIcon: {
    height: ScaleSize.small_icon - 2,
    width: ScaleSize.small_icon - 2,
    bottom: ScaleSize.font_spacing,
  },
  destinationText: {
    color: Colors.black,
    fontFamily: AppFonts.semi_bold,
    bottom: ScaleSize.font_spacing + 1.5,
    fontSize: TextFontSize.extra_small_text,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  ratingText: {
    color: Colors.black,
    fontFamily: AppFonts.semi_bold,
    bottom: ScaleSize.font_spacing + 0.5,
    fontSize: TextFontSize.extra_small_text,
    marginHorizontal: ScaleSize.spacing_very_small,
  },
  dateTextPickupPriceTextArea: {
    flexDirection: "row",
    width: "100%",
    marginVertical: ScaleSize.spacing_very_small - 3,
    alignItems: "center",
  },
  dateText: {
    color: Colors.black,
    top: ScaleSize.font_spacing,
    fontFamily: AppFonts.medium,
    bottom: ScaleSize.font_spacing,
    fontSize: TextFontSize.extra_small_text - 1,
  },
  priceText: {
    color: Colors.primary,
    top: ScaleSize.font_spacing,
    fontFamily: AppFonts.medium,
    bottom: ScaleSize.font_spacing,
    fontSize: TextFontSize.extra_small_text - 1,
  },
  tabBottomBar: {
    flex: 1,
    alignSelf: "flex-start",
    paddingTop: ScaleSize.spacing_small,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  seatArea: {
    backgroundColor: Colors.textinput_low_opacity,
    paddingVertical: ScaleSize.spacing_very_small,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: ScaleSize.very_small_border_radius,
  },
  seatText: {
    color: Colors.primary,
    marginHorizontal: ScaleSize.spacing_very_small,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.extra_small_text - 2,
  },
  pastRidesText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text - 1,
    color: Colors.black,
    alignSelf: "flex-start",
  },
  locationIcon: {
    height: ScaleSize.small_icon,
    width: ScaleSize.small_icon,
    resizeMode: "contain",
    marginHorizontal: ScaleSize.spacing_very_small,
    tintColor: Colors.secondary,
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
  editBtn: {
    padding: ScaleSize.spacing_small,
    bottom: ScaleSize.spacing_medium + 2,
    left: ScaleSize.spacing_small + 2,
  },
  editIcon: {
    height: ScaleSize.large_icon,
    width: ScaleSize.large_icon,
  },
  verticalSepratorLine: {
    height: ScaleSize.spacing_medium - 4,
    borderRightWidth: ScaleSize.spacing_minimum + 1,
    marginHorizontal: ScaleSize.spacing_medium / 2,
    borderColor: Colors.light_gray,
  },
  horizontalSeparetorLine: {
    height: ScaleSize.spacing_minimum,
    marginVertical: ScaleSize.spacing_very_small - 2,
    width: "100%",
    backgroundColor: Colors.light_gray,
  },
  noDataText: {
    color: Colors.gray,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.semi_medium_text - 1,
    top: ScaleSize.spacing_extra_large * 4,
    alignSelf: "center",
  },
  profileImageArea: {
    justifyContent: "center",
    alignItems: "center",
    height: ScaleSize.tab_profile_icon + 15,
    width: ScaleSize.tab_profile_icon + 15,
    overflow: "hidden",
    backgroundColor: Colors.gray,
    marginRight: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.small_border_radius + 4,
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
});
