import {
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ImageBackground,
  Modal,
  View,
  StatusBar,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import SelectDropdown from "react-native-select-dropdown";
import { useTranslation } from "react-i18next";
import { driverMyBookings } from "../../Actions/Intercity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../Resources/Languages/index";
import moment from "moment";
import { checkStatus } from "../../Actions/authentication";
import Utils from "../../Helpers/Utils";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Constant from "../../Network/Constant";
import { cancelRide, intracityDriverMyBookings } from "../../Actions/Intracity";
import AlertBox from "../../Components/Comman/AlertBox";
import SubscriptionPopup from "../Comman/SubscriptionPopup";
import FastImage from "react-native-fast-image";
import { ModalProgressLoader } from "../../Components/Comman";

const RiderMyBookingsScreen = ({ navigation, route }) => {
  ///////////// States /////////////
  const dispatch = useDispatch();
  const { userData, userStatus } = useSelector((state) => state.Authentication);
  const {
    driverMyBookingRideData,
    driverMyBookingPage,
    driverMyBookingRideTotalPage,
    driverMyBookingRideLoading,
  } = useSelector((state) => state.Intercity);
  const {
    intracityDriverRideData,
    intracityDriverRidepage,
    intracityDriverRideTotalPage,
    intracityDriverRideLoading,
  } = useSelector((state) => state.Intracity);
  const [greetingsText, setGreetingsText] = useState("");
  const [refreshingData, setRefreshingData] = useState(false);
  const [isClear, setIsClear] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const { t, i18n } = useTranslation();
  const [selectedAreaType, setSelectedAreaType] = useState("intercity");
  const [driverStatus, setDriverStatus] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [subModal, setSubModal] = useState(false);
  const [cancelData, setCancelData] = useState(null);
  const [areaType, setAreaType] = useState([
    { label: t("intercity"), value: "intercity" },
    //{ label: t("intracity"), value: "intracity" },
  ]);

  //////////////// useEffect ////////////////
  useEffect(() => {
    getCurrentGreetings();
  });

  useFocusEffect(
    React.useCallback(() => {
      fetchData(1);
    }, [selectedAreaType])
  );

  const fetchData = async (pageNumber, searchText) => {
    try {
      // if (userData?.is_subscription === 0) {
      //   setSubModal(true);
      // } else
      {
        const UserId = await AsyncStorage.getItem("@id");
        const body = {
          page: pageNumber,
          user_id: UserId,
          search_text: searchText?.trim(),
        };
        if (await Utils.isNetworkConnected()) {
          {
            setLoading(true);
            selectedAreaType === "intercity"
              ? await dispatch(driverMyBookings(body))
              : await dispatch(intracityDriverMyBookings(body));

            setLoading(false);
          }
          isPagingCalled = true;
          setRefreshingData(false);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRefreshingData(false);
    }
  };

  const handleSearch = () => {
    fetchData(1, searchText);
  };

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
      driverMyBookingRideData.length > 0 &&
      driverMyBookingPage < driverMyBookingRideTotalPage &&
      !isPagingCalled
    ) {
      fetchData(driverMyBookingPage + 1);
    } else {
      null;
    }
  };

  const handleIntracityEndReached = () => {
    if (selectedAreaType === "intracity") {
      if (
        intracityDriverRideData.length > 0 &&
        intracityDriverRidepage < intracityDriverRideTotalPage &&
        !isPagingCalled
      ) {
        fetchData(intracityDriverRidepage + 1);
      } else {
        null;
      }
    }
  };

  /////////// Function for refresh //////////
  const refresh = () => {
    setRefreshingData(true);
    fetchData(1);
  };

  //////////// Search View //////////////
  const searchBar = () => {
    return (
      <View style={styles.searchTabAra}>
        <View style={styles.searchTab}>
          <Image source={Images.search_icon} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t("search")}
            placeholderTextColor={Colors.primary}
            enterKeyHint="search"
            onFocus={() => setIsClear(true)}
            onBlur={() => setIsClear(false)}
            onChangeText={(text) => {
              setSearchText(text);
              if (text.length === 0) {
                fetchData(1);
              }
              setIsClear(true);
            }}
            onSubmitEditing={() => handleSearch()}
            value={searchText}
          />
          {isClear ? (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
              <Image source={Images.close_icon} style={styles.clearIcon} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  const handleClear = () => {
    setSearchText("");
    fetchData(1, "");
    setIsClear(false);
  };

  const renderGenderDropDownItem = (item) => {
    return (
      <View style={styles.dropDownMenuStyle}>
        <Text style={styles.dropDownMenuText}>{item.label}</Text>
      </View>
    );
  };

  /////////// Function for cancel booking ///////////
  const RiderCancelBooking = async (id) => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        ride_id: id,
      };
      var endPoint = "intracity/cancelRideByDriver";
      if (await Utils.isNetworkConnected()) {
        dispatch(
          cancelRide(body, endPoint, async (data, isSuccess) => {
            if (isSuccess === true) {
              setShowCancel(false);
              fetchData(1);
            }
          })
        );
      }
    } catch {}
  };

  //////////// Flatlist renderItem /////////////
  const renderItem = ({ item, index }) => {
    var isCanclled =
      selectedAreaType === "intercity"
        ? item.status === 3
        : item.status === 0 || item.ride_status === 4;

    return (
      <View style={styles.tabArea}>
        <TouchableOpacity
          style={[styles.tab, { paddingBottom: ScaleSize.spacing_medium * 3 }]}
          onPress={async () => {
            selectedAreaType === "intercity"
              ? await AsyncStorage.setItem(
                  "@rideId",
                  JSON.stringify(item.intercity_ride_id)
                )
              : await AsyncStorage.setItem(
                  "@rideId",
                  JSON.stringify(item.intracity_ride_id)
                );

            dispatch({ type: Constant.CLEAR_RIDE_DETAILS_SUCCESS });
            const routeName =
              selectedAreaType === "intercity"
                ? "IntercityRideDetailsScreen"
                : "IntracityRideDetailsScreen";
            const params = {
              isFromMyBookings: false,
              isRider: false,
              callIcon: false,
              booking_id: item.id,
              ride_id: item.id,
              intercity_ride_id:
                selectedAreaType === "intercity"
                  ? item.intercity_ride_id
                  : item.intracity_ride_id,
              is_bold: false,
            };
            navigation.navigate(routeName, params);
          }}
        >
          <View style={styles.tabHeaderArea}>
            <ImageBackground
              source={Images.profilePlaceholder}
              style={styles.profileImageArea}
            >
              <Image
                source={{ uri: item.profile_picture }}
                style={styles.tabProfile}
              />
            </ImageBackground>

            <View style={styles.riderDetailsArea}>
              <Text style={styles.nameText}>{item.first_name}</Text>
              <View style={{ flexDirection: "row" }}>
                <Image style={styles.tabIcon} source={Images.seat} />
                <Text style={styles.seatBookedText}>
                  {selectedAreaType === "intercity"
                    ? item?.booked_seat
                    : item?.required_seats}{" "}
                  {""}
                  {selectedAreaType === "intercity"
                    ? item?.booked_seat > 1
                      ? "Seats Booked"
                      : "Seat Booked"
                    : "Seat Required"}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    style={styles.dateIcon}
                    source={Images.tab_date_icon}
                  />
                  <Text style={styles.dateAndPriceText}>
                    {moment(item.ride_date, "DD MMMM YYYY hh:mm A").format(
                      "ddd, DD MMM [at] hh:mm A"
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.pendingArea,
                {
                  backgroundColor: isCanclled
                    ? Colors.low_opacity_secondary
                    : Colors.textinput_low_opacity,
                  borderColor: isCanclled ? Colors.secondary : Colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.pendingText,
                  {
                    color: isCanclled ? Colors.secondary : Colors.primary,
                  },
                ]}
              >
                {selectedAreaType === "intercity"
                  ? Utils.getIntercityStatus(item.status, t)
                  : Utils.getIntracityStatus(item.status, item.ride_status, t)}
              </Text>
            </View>
          </View>

          <View style={styles.tabFooterArea}>
            <View style={styles.navigationArea}>
              <Image
                style={styles.locationIcon}
                source={Images.location_icon}
              />
              <View style={styles.navigatorLine}></View>
              <Image style={styles.dropOffIcon} source={Images.drop_off_icon} />
            </View>

            <View style={styles.addressArea}>
              <Text style={styles.pickupAddressText}>
                {item.pickup_address}
              </Text>
              <Text style={styles.dropoffAdressText}>
                {item.dropoff_address}
              </Text>
            </View>
          </View>

          <Text style={styles.priceText}>
            $
            {selectedAreaType === "intercity"
              ? item.driver_fee.toFixed(2)
              : item.driver_payout.toFixed(2)}
          </Text>

          {selectedAreaType !== "intercity" &&
          item.status === 1 &&
          moment(item.date).isAfter(
            moment(item.timezon_date).add(10, "minutes")
          ) ? (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setCancelId(item.intracity_ride_id);
                setShowCancel(true);
              }}
            >
              <Text style={styles.cancelBtnText}>Cancel Ride</Text>
            </TouchableOpacity>
          ) : null}
        </TouchableOpacity>
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
              //setIsOnline(isOnline === 0 ? 1 : 0);
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

  var isPagingCalled = true;
  const isFocused = useIsFocused();
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
          <ModalProgressLoader visible={loading && isFocused} />
          <View style={styles.topBar}>
            <View style={styles.userDetailsContainer}>
              <View>
                <View
                  style={[
                    styles.statusIndicator,
                    {
                      backgroundColor:
                        userStatus === 0 ? Colors.gray : "#2ace26",
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
                          style={styles.profileImg}
                        />
                      </ImageBackground>
                    </>
                  )}
                </TouchableOpacity>
              </View>

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

            <View style={styles.intercityIntracityDropdownTab}>
              <SelectDropdown
                style={{ width: "100%" }}
                data={areaType}
                onSelect={(selectedItem) => {
                  setSelectedAreaType(selectedItem.value);
                }}
                renderButton={(selectedItem) => {
                  return (
                    <View style={styles.genderDropSelectedItemContainer}>
                      <Text style={styles.DropDownSelectedItemText}>
                        {(selectedItem && selectedItem.label) || "Intercity"}
                      </Text>
                      <Image
                        source={Images.dropdown_arrow_icon}
                        style={styles.dropDownIcon}
                      />
                    </View>
                  );
                }}
                renderItem={(item) => renderGenderDropDownItem(item)}
                showsVerticalScrollIndicator={false}
                dropdownStyle={styles.genderDropDownStyle}
              />
            </View>
          </View>

          <View style={{ height: ScaleSize.spacing_large * 2 }}>
            {searchBar()}
          </View>

          {selectedAreaType === "intercity" ? (
            driverMyBookingRideData.length === 0 ? (
              <Text style={styles.noDataText}>{t("no_data_found")}</Text>
            ) : (
              <FlatList
                style={{ marginTop: ScaleSize.spacing_semi_medium - 2 }}
                showsVerticalScrollIndicator={false}
                data={driverMyBookingRideData}
                extraData={driverMyBookingRideData}
                renderItem={renderItem}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => {
                  isPagingCalled = false;
                }}
                showVerticalScrollIndicator={false}
                onEndReached={() => handleEndReached()}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshingData}
                    onRefresh={refresh}
                  />
                }
                ListFooterComponent={() =>
                  driverMyBookingPage > 1 &&
                  driverMyBookingRideLoading && (
                    <ActivityIndicator
                      animating
                      size={ScaleSize.spacing_medium * 2}
                      color={Colors.gray}
                    />
                  )
                }
                keyExtractor={(item, index) => index}
              />
            )
          ) : intracityDriverRideData.length === 0 ? (
            <Text style={styles.noDataText}>{t("no_data_found")}</Text>
          ) : (
            <FlatList
              style={{ marginTop: ScaleSize.spacing_semi_medium - 2 }}
              showsVerticalScrollIndicator={false}
              data={intracityDriverRideData}
              extraData={intracityDriverRideData}
              renderItem={renderItem}
              onEndReachedThreshold={0.5}
              onMomentumScrollBegin={() => {
                isPagingCalled = false;
              }}
              showVerticalScrollIndicator={false}
              onEndReached={() => handleIntracityEndReached()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshingData}
                  onRefresh={refresh}
                />
              }
              ListFooterComponent={() =>
                intracityDriverRidepage > 1 &&
                intracityDriverRideLoading && (
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
          <AlertBox
            visible={showCancel}
            title={"Cancel Ride"}
            message={"Are you sure you want to cancel this ride?"}
            positiveBtnText={"Cancel Ride"}
            negativeBtnText={"Go Back"}
            onPress={() => {
              setShowCancel(false);
              RiderCancelBooking(cancelId);
            }}
            onPressNegative={() => setShowCancel(false)}
          />
          {StatusModal()}
        </View>
        <SubscriptionPopup
          visible={subModal}
          navigation={navigation}
          onClose={() => setSubModal(false)}
        />
      </SafeAreaView>
    </>
  );
};

export default RiderMyBookingsScreen;

const styles = StyleSheet.create({
  clearBtn: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: "#0cb0a77a",
    padding: ScaleSize.spacing_very_small - 1,
    right: ScaleSize.spacing_medium,
  },
  clearIcon: {
    height: ScaleSize.very_small_icon - 4,
    width: ScaleSize.very_small_icon - 4,
    tintColor: "#0cb0a77a",
  },
  searchTabAra: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: ScaleSize.spacing_medium,
    paddingHorizontal: ScaleSize.spacing_small + 2,
  },
  searchTab: {
    backgroundColor: Colors.textinput_low_opacity,
    borderRadius: ScaleSize.small_border_radius - 5,
    justifyContent: "flex-start",
    height: ScaleSize.spacing_large * 1.9,
    paddingLeft: ScaleSize.spacing_medium,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  searchIcon: {
    tintColor: Colors.primary,
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
  },
  searchInput: {
    width: "90%",
    top: ScaleSize.font_spacing,
    fontSize: TextFontSize.small_text - 1,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    color: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_small,
  },
  topBar: {
    height: ScaleSize.spacing_very_large,
    marginVertical: ScaleSize.spacing_medium,
    flexDirection: "row",
    paddingHorizontal: ScaleSize.spacing_semi_medium,
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
    width: "90%",
    bottom: ScaleSize.font_spacing,
  },
  greetingsText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
    top: Platform.OS === "ios" ? null : ScaleSize.spacing_very_small,
  },
  flatlist: {
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  tabArea: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_semi_medium + 3,
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
    bottom: Platform.OS === "ios" ? ScaleSize.font_spacing : null,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text,
  },
  tabIcon: {
    height: ScaleSize.flatlist_tab_icon,
    width: ScaleSize.small_icon,
    resizeMode: "contain",
    bottom: ScaleSize.font_spacing,
  },
  dateIcon: {
    height: ScaleSize.small_icon - 1,
    width: ScaleSize.small_icon - 1,
    bottom: Platform.OS === "ios" ? null : ScaleSize.font_spacing,
    marginRight: ScaleSize.spacing_small - 1,
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
  },
  priceText: {
    color: Colors.primary,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text,
    position: "absolute",
    left: ScaleSize.spacing_medium,
    bottom: ScaleSize.spacing_small + 2,
  },
  pendingText: {
    top: Platform.OS === "ios" ? null : ScaleSize.font_spacing - 1,
    fontFamily: AppFonts.medium,
    fontSize: 10,
  },
  pendingArea: {
    position: "absolute",
    borderWidth: ScaleSize.smallest_border_width,
    right: ScaleSize.spacing_small + 5,
    borderRadius: ScaleSize.small_border_radius,
    paddingVertical: Platform.OS === "ios" ? 2 : 1,
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
  dropOffIcon: {
    height: ScaleSize.small_icon - 3,
    width: ScaleSize.small_icon - 3,
    resizeMode: "contain",
    tintColor: Colors.gray,
  },
  locationIcon: {
    height: ScaleSize.small_icon,
    width: ScaleSize.small_icon,
    tintColor: Colors.primary,
    resizeMode: "contain",
  },
  navigatorLine: {
    width: ScaleSize.font_spacing,
    borderRightWidth: 1.5,
    flex: 0.3,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    height: ScaleSize.spacing_large,
  },
  intercityIntracityDropdownTab: {
    flex: 0.7,
    height: ScaleSize.spacing_very_large - 2,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    paddingVertical: ScaleSize.spacing_small + 2,
    borderWidth: ScaleSize.smallest_border_width,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
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
  dropDownMenuStyle: {
    margin: ScaleSize.spacing_small,
    alignItems: "center",
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
    right: ScaleSize.spacing_small + 2,
    resizeMode: "contain",
  },
  genderDropDownStyle: {
    width: "30%",
    flex: 1,
    justifyContent: "center",
    marginTop: ScaleSize.spacing_semi_medium,
    alignSelf: "center",
    borderRadius: ScaleSize.small_border_radius,
    elevation: 10,
    padding: ScaleSize.spacing_small + 2,
  },
  genderDropSelectedItemContainer: {
    flexDirection: "row",
    paddingHorizontal: ScaleSize.spacing_small,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  DropDownSelectedItemText: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: TextFontSize.very_small_text,
    marginRight: ScaleSize.spacing_medium,
    fontFamily: AppFonts.medium,
    color: Colors.black,
  },
  noDataText: {
    color: Colors.gray,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.semi_medium_text - 1,
    top: ScaleSize.spacing_extra_large * 4,
    alignSelf: "center",
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
  cancelBtn: {
    backgroundColor: Colors.light_orange,
    right: -1,
    bottom: -1,
    borderTopLeftRadius: ScaleSize.very_small_border_radius,
    borderBottomRightRadius: ScaleSize.medium_border_radius - 2,
    borderColor: Colors.lightest_gray,
    paddingHorizontal: ScaleSize.spacing_small + 8,
    paddingVertical: ScaleSize.spacing_very_small,
    position: "absolute",
  },
  cancelBtnText: {
    top: ScaleSize.font_spacing,
    color: Colors.secondary,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text - 2,
  },
});
