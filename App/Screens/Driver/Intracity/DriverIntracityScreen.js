import {
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  ScrollView,
  ImageBackground,
  Modal,
  View,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Linking,
} from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
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
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { checkStatus, userDetails } from "../../../Actions/authentication";
import Utils from "../../../Helpers/Utils";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { driverDetails } from "../../../Actions/authentication";
import {
  checkAvailableCity,
  getIntracityDriverRideDetails,
} from "../../../Actions/Intracity";
import LocationDialog from "./LocationDialog";
import { getTimeZone } from "react-native-localize";
import DateTimePicker from "../../../Components/Comman/DateTimePicker";
import DriverRenderItem from "../../../Components/Intracity/Driver/DriverRenderItem";
import SubscriptionPopup from "../../Comman/SubscriptionPopup";
const windowHeight = Dimensions.get("window").height;
import FastImage from "react-native-fast-image";
import { GooglePlacesAutoComplete } from "../../../Components/Comman/GooglePlacesAutoComplete";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";

const DriverIntracityScreen = ({ navigation, route }) => {
  ///////////// States /////////////
  const dispatch = useDispatch();
  const { userData, driverData, userStatus } = useSelector(
    (state) => state.Authentication
  );
  const {
    intracityAllRideData,
    driverRideData,
    driverRideLoading,
    driverPage,
    driverRideTotalPage,
    isLoading,
  } = useSelector((state) => state.Intracity);
  const [subModal, setSubModal] = useState(false);
  const [greetingsText, setGreetingsText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [date, setDate] = useState(null);
  const { t, i18n } = useTranslation();
  const [refreshingData, setRefreshingData] = useState(false);
  const [locationShow, setLocationShow] = useState(false);
  const [isOnline, setIsOnline] = useState(userData?.is_online);
  const [driverStatus, setDriverStatus] = useState("");
  const [sortByOptionsSelected, setSortByOptionsSelected] = useState([]);
  const [departurOptionsSelected, setDeparturOptionsSelected] = useState([]);
  const [amenitiesOptionsSelected, setAmenitiesOptionsSelected] = useState([]);
  const [city, setCity] = useState("");
  const [cityError, setCityError] = useState("");
  const cityRef = useRef(null);
  const [isDisable, setIsDisable] = useState(true);

  ////////// Filter options data //////////
  const sortByFilterData = [
    { option: t("earliest_departure"), key: 0 },
    { option: t("lowest_price"), key: "1" },
  ];

  const departurTimeData = [
    { option: t("before_8_am"), key: "2" },
    { option: t("_8am_to_12pm"), key: "3" },
    { option: t("_12pm_to_7pm"), key: "4" },
    { option: t("after_7pm"), key: "5" },
  ];

  const amenitiesData = [
    { option: t("max_2_seats_available"), key: "6" },
    { option: t("min_4_seats_available"), key: "7" },
  ];

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getUserData();
  //   }, [])
  // );

  async function getUserData() {
    const UserId = await AsyncStorage.getItem("@id");
    var body = {
      user_id: UserId,
      // user_id: UserId,
    };
    dispatch(
      userDetails(body, async (data, isSuccess) => {
        init();
      })
    );
  }

  const init = async () => {
    // if (userData?.is_subscription === 0) {
    //   setSubModal(true);
    // } else
    if (userData.is_car_registration_photo === 0) {
      handleBlankPageText();
    } else if (userData.is_car_registration_photo === 1) {
      handleBlankPageText();
    } else {
      getDriverData();
      fetchData(
        1,
        sortByOptionsSelected,
        departurOptionsSelected,
        amenitiesOptionsSelected
      );
    }
  };

  const getDriverData = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          driverDetails(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              if (data.data.longitude === "" && data.data.latitude === "") {
                setLocationShow(true);
              }
            }
          })
        );
      }
    } catch {}
  };

  const fetchData = async (
    searchPage,
    sortByOptionsSelected,
    departurOptionsSelected,
    amenitiesOptionsSelected
  ) => {
    try {
      setShowFilter(false);
      const filterOptions = [
        ...sortByOptionsSelected,
        ...departurOptionsSelected,
        ...amenitiesOptionsSelected,
      ];
      const filterVal = filterOptions.join(",");
      const timeZone = getTimeZone();
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        page: searchPage,
        user_id: UserId,
        time_zone: timeZone,
        filter_value: filterVal,
        date_value: date !== null ? moment(date).format("YYYY-MM-DD") : null,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(getIntracityDriverRideDetails(body));
        isPagingCalled = true;
        setRefreshingData(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRefreshingData(false);
    }
  };

  const handleSortByOptionSelected = (key) => {
    setSortByOptionsSelected([key]);
  };

  const handleAmenitiesOptionSelected = (key) => {
    setAmenitiesOptionsSelected((prevamenitiesOptionSelected) => {
      if (prevamenitiesOptionSelected.includes(key)) {
        return prevamenitiesOptionSelected.filter((item) => item !== key);
      } else {
        return [...prevamenitiesOptionSelected, key];
      }
    });
  };

  const handleDeparturOptionSelected = (key) => {
    setDeparturOptionsSelected((prevdeparturOptionSelected) => {
      if (prevdeparturOptionSelected.includes(key)) {
        return prevdeparturOptionSelected.filter((item) => item !== key);
      } else {
        return [...prevdeparturOptionSelected, key];
      }
    });
  };

  const handleFilterClearBtn = useCallback(() => {
    setDate((prevDate) => null);
    setSortByOptionsSelected([]);
    setDeparturOptionsSelected([]);
    setAmenitiesOptionsSelected([]);
    driverRideData?.length === 0 ||
    (userData?.is_car_registration_photo === 0 &&
      userData?.is_car_registration_photo === 1)
      ? null
      : fetchData(1, [], [], []);
  }, []);

  //////////////// useEffect ////////////////
  useEffect(() => {
    getCurrentGreetings();
  });

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

  const isFocused = useIsFocused();

  const changeStatus = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        status: userStatus === 0 ? 1 : 0,
        user_id: UserId,
      };
      if (Utils.isNetworkConnected) {
        dispatch(
          checkStatus(body, (data, isSuccess) => {
            if (isSuccess === true) {
              //setIsOnline(userStatus === 0 ? 1 : 0);
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

  /////////// Function for refresh //////////
  const refresh = () => {
    setRefreshingData(true);
    fetchData(1, [], [], []);
    setRefreshingData(false);
  };

  const handleEndReached = () => {
    if (
      driverRideData.length > 0 &&
      driverPage < driverRideTotalPage &&
      !isPagingCalled
    ) {
      fetchData(
        driverPage + 1,
        sortByOptionsSelected,
        departurOptionsSelected,
        amenitiesOptionsSelected
      );
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
    }
  };

  async function onItemPress(item) {
    await AsyncStorage.setItem("@rideId", JSON.stringify(item.id));
    dispatch({ type: Constant.CLEAR_RIDE_DETAILS_SUCCESS });
    navigation.navigate("IntracityRideDetailsScreen", {
      isFromMyBookings: true,
      isRider: false,
      ride_id: item.id,
      is_bold: false,
      isFromNotification: false,
    });
  }

  /////////// Filter Options Area ///////////
  const FilterModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilter}
        onRequestClose={() => {
          setShowFilter(!showFilter);
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            setShowFilter(false);
          }}
        >
          <ScrollView contentContainerStyle={styles.filterModalBg}>
            <View style={styles.scrollModal}>
              <View style={styles.filterModal}>
                <View style={styles.filterModalNotch} />

                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.filterTitleText}>{t("date_by")}</Text>
                  <TextButton
                    onPress={() => handleFilterClearBtn()}
                    strings={t("clear_all")}
                    buttonStyle={styles.clearAllBtn}
                    textStyle={styles.clearAllBtnText}
                  />
                </View>

                <View style={styles.filterDateContainer}>
                  <DateTimePicker
                    value={date}
                    mode="date"
                    placeholderText={null}
                    disabled={false}
                    onConfirm={(date) => {
                      setDate(date);
                    }}
                  />
                </View>

                <View style={styles.sortByArea}>
                  <Text style={styles.filterTitleText}>{t("sort_by")}</Text>
                  <View style={styles.sortByOptionsArea}>
                    {sortByFilterData.map((item) => (
                      <TextButton
                        source={
                          sortByOptionsSelected.includes(item.key)
                            ? Images.check
                            : null
                        }
                        iconStyle={
                          sortByOptionsSelected.includes(item.key)
                            ? styles.checkIcon
                            : null
                        }
                        onPress={() => {
                          handleSortByOptionSelected(item.key);
                        }}
                        strings={item.option}
                        buttonStyle={[
                          styles.filterOptionBtn,
                          {
                            backgroundColor: sortByOptionsSelected.includes(
                              item.key
                            )
                              ? Colors.primary
                              : Colors.white,
                          },
                        ]}
                        textStyle={[
                          styles.filterBtnText,
                          {
                            color: sortByOptionsSelected.includes(item.key)
                              ? Colors.white
                              : Colors.primary,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.departurArea}>
                  <Text style={styles.filterTitleText}>
                    {t("departur_time")}
                  </Text>
                  <View style={styles.departurOptionArea}>
                    {departurTimeData.map((item) => (
                      <TextButton
                        key={item.key}
                        source={
                          amenitiesOptionsSelected.includes(item.key)
                            ? Images.check
                            : null
                        }
                        iconStyle={
                          amenitiesOptionsSelected.includes(item.key)
                            ? styles.checkIcon
                            : null
                        }
                        onPress={() => {
                          handleAmenitiesOptionSelected(item.key);
                        }}
                        strings={item.option}
                        buttonStyle={[
                          styles.filterOptionBtn,
                          {
                            backgroundColor: amenitiesOptionsSelected.includes(
                              item.key
                            )
                              ? Colors.primary
                              : Colors.white,
                          },
                        ]}
                        textStyle={[
                          styles.filterBtnText,
                          {
                            color: amenitiesOptionsSelected.includes(item.key)
                              ? Colors.white
                              : Colors.primary,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.amenitiesArea}>
                  <Text style={styles.filterTitleText}>{t("amenities")}</Text>
                  <View style={styles.amenitiesOptionArea}>
                    {amenitiesData.map((item) => (
                      <TextButton
                        key={item.key}
                        source={
                          departurOptionsSelected.includes(item.key)
                            ? Images.check
                            : null
                        }
                        iconStyle={
                          departurOptionsSelected.includes(item.key)
                            ? styles.checkIcon
                            : null
                        }
                        onPress={() => {
                          handleDeparturOptionSelected(item.key);
                        }}
                        strings={item.option}
                        buttonStyle={[
                          styles.filterOptionBtn,
                          {
                            backgroundColor: departurOptionsSelected.includes(
                              item.key
                            )
                              ? Colors.primary
                              : Colors.white,
                          },
                        ]}
                        textStyle={[
                          styles.filterBtnText,
                          {
                            color: departurOptionsSelected.includes(item.key)
                              ? Colors.white
                              : Colors.primary,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>

                <View style={{ width: "100%" }}>
                  <TextButton
                    onPress={() => {
                      driverData.length === 0 ||
                      (userData.is_car_registration_photo === 0 &&
                        userData.is_car_registration_photo === 1)
                        ? null
                        : fetchData(
                            1,
                            sortByOptionsSelected,
                            departurOptionsSelected,
                            amenitiesOptionsSelected
                          );
                    }}
                    strings={t("apply")}
                    buttonStyle={styles.applyBtn}
                    textStyle={styles.applyBtnText}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableOpacity>
      </Modal>
    );
  };

  const handleBlankPageText = () => {
    if (
      userData?.is_car_registration_photo !== 0 &&
      userData?.is_car_registration_photo !== 1 &&
      driverRideData.length === 0
    ) {
      return <Text style={styles.noDataText}>{t("rides_not_available")}</Text>;
    } else if (userData?.is_car_registration_photo === 1) {
      return <Text style={styles.noDataText}>{t("image_submit_request")}</Text>;
    } else if (userData?.is_car_registration_photo === 0) {
      return (
        <>
          <Text style={styles.noDataText}>
            {t("upload_car_registration_photo")}
          </Text>
          <PrimaryButton
            customStyle={true}
            buttonStyle={styles.completeButton}
            textStyle={styles.completeButtonText}
            string={"Upload Image"}
            onPress={() => navigation.navigate("EditDriverProfile")}
          />
        </>
      );
    }
  };

  var isPagingCalled = true;

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
                        <Image
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

            {/* <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => setShowFilter(!showFilter)}
            >
              <Image source={Images.filter} style={styles.filterIcon} />
              <Text style={styles.filterText}>{t("filter")}</Text>
            </TouchableOpacity> */}
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
            <Text style={styles.rideRequestTitle}>{t("ride_request")}</Text>
          </View>

          {driverRideData.length === 0 ? (
            handleBlankPageText()
          ) : (
            <FlatList
              style={{ marginTop: ScaleSize.spacing_semi_medium - 2 }}
              data={driverRideData}
              renderItem={({ item, index }) => (
                <DriverRenderItem
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
                driverPage > 1 &&
                driverRideLoading && (
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
          <LocationDialog
            onClose={() => setLocationShow(false)}
            visible={locationShow}
          />
          {FilterModal()}
          {StatusModal()} */}
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

export default DriverIntracityScreen;

const styles = StyleSheet.create({
  completeButton: {
    width: "60%",
    margin: ScaleSize.spacing_small,
    top: ScaleSize.spacing_large * 9.3,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    padding: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  completeButtonText: {
    fontFamily: AppFonts.medium,
    color: Colors.white,
    fontSize: TextFontSize.small_text - 2,
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
    alignItems: "flex-start",
    flex: 1,
    marginRight: 10,
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
  nameText: {
    color: Colors.black,
    width: "60%",
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.very_small_text,
  },
  dateIcon: {
    height: ScaleSize.small_icon - 1,
    width: ScaleSize.small_icon - 1,
    bottom: ScaleSize.font_spacing,
    marginRight: ScaleSize.spacing_small - 1,
    resizeMode: "cover",
  },
  priceText: {
    color: Colors.primary,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.extra_small_text - 1.5,
  },
  filterBtn: {
    flex: 0.7,
    flexDirection: "row",
    height: ScaleSize.spacing_very_large - 2,
    paddingHorizontal: ScaleSize.spacing_small,
    paddingVertical: ScaleSize.spacing_small + 2,
    borderWidth: ScaleSize.smallest_border_width,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    height: ScaleSize.small_icon - 2,
    width: ScaleSize.small_icon - 2,
    margin: ScaleSize.spacing_small - 2,
  },
  filterText: {
    marginHorizontal: ScaleSize.spacing_small - 2,
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.medium,
    color: Colors.black,
  },
  noDataText: {
    color: Colors.gray,
    fontFamily: AppFonts.medium,
    marginHorizontal: ScaleSize.spacing_small,
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
  filterModalBg: {
    flexGrow: 1,
    paddingTop: 100,
    backgroundColor: Colors.modal_bg,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  filterModal: {
    flex: 1,
    borderTopLeftRadius: ScaleSize.small_border_radius,
    borderTopRightRadius: ScaleSize.small_border_radius,
    justifyContent: "center",
    alignItems: "center",
    padding: ScaleSize.spacing_medium,
    backgroundColor: Colors.white,
  },
  scrollModal: {
    flex: 0.1,
  },
  filterTitleText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
  },
  clearAllBtn: {
    justifyContent: "center",
  },
  clearAllBtnText: {
    fontFamily: AppFonts.medium,
    textAlignVertical: "center",
    fontSize: TextFontSize.small_text,
    color: Colors.secondary,
  },
  sortByOptionsArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    right: ScaleSize.spacing_small - 3,
  },
  sortByArea: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
  },
  checkIcon: {
    height: ScaleSize.very_small_icon,
    width: ScaleSize.very_small_icon,
    right: ScaleSize.spacing_very_small,
    tintColor: "white",
  },
  departurArea: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  departurOptionArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    right: ScaleSize.spacing_small - 3,
  },
  amenitiesArea: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  amenitiesOptionArea: {
    flexDirection: "row",
    flexWrap: "wrap",
    right: ScaleSize.spacing_small - 3,
  },
  applyBtn: {
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
    marginVertical: ScaleSize.spacing_semi_medium,
    paddingVertical: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
  },
  applyBtnText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.white,
  },
  filterModalNotch: {
    height: ScaleSize.spacing_small,
    width: ScaleSize.spacing_large + 2,
    marginVertical: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.small_border_radius,
    backgroundColor: Colors.textinput_low_opacity,
  },
  filterBtnText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.filter_option,
  },
  filterOptionBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    justifyContent: "center",
    paddingVertical: ScaleSize.spacing_very_small,
    margin: ScaleSize.spacing_very_small - 1,
    marginVertical: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_medium,
    borderRadius: ScaleSize.small_border_radius,
  },
  filterDateContainer: {
    flex: 1,
    height: ScaleSize.spacing_large * 2.6,
    justifyContent: "center",
    alignItems: "center",
  },
  titleBar: {
    alignSelf: "flex-start",
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    marginBottom: -10,
  },
  rideRequestTitle: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text - 1,
    color: Colors.black,
    alignSelf: "flex-start",
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
