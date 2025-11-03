import {
  Image,
  StyleSheet,
  Text,
  Modal,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
  ImageBackground,
  Platform,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { TextButton, ModalProgressLoader } from "../../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { getIntercityAllRideList } from "../../../Actions/Intercity";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from "react-native-fast-image";
import "../../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { useDispatch, useSelector } from "react-redux";
import Utils from "../../../Helpers/Utils";
import { IntercitySearch } from "../../../Components/Intercity/IntercitySearch";
import { getTimeZone } from "react-native-localize";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import ReferralCodePopup from "../../Comman/ReferralCodePopup";
import Constant from "../../../Network/Constant";
import DateTimePicker from "../../../Components/Comman/DateTimePicker";

const RiderIntercityHomeScreen = ({ navigation, route }) => {
  ///////////// States /////////////
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.Authentication);
  const {
    pickupCitySearchText,
    dropOffCitySearchText,
    searchRideTotalPage,
    searchRideData,
    searchRidePage,
    searchRideLoading,
    isLoading,
  } = useSelector((state) => state.Intercity);
  const { t } = useTranslation();
  const [showReferral, setShowReferral] = useState(false);
  const [refreshingData, setRefreshingData] = useState(false);
  const [timeZone, setTimeZone] = useState(false);
  const [searchActive, setSearchActive] = useState(true);
  const [pickupCity, setPickupCity] = useState("");
  const [dropOffCity, setDropOffCity] = useState("");
  const [dateActive, setDateActive] = useState(false);
  const [date, setDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [blankPageText, setBlankPageText] = useState(t("rides_not_available"));
  const [openDate, setOpenDate] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDateConfirmed, setIsDateConfirmed] = useState(false);
  const [sortByOptionsSelected, setSortByOptionsSelected] = useState([]);
  const [departurOptionsSelected, setDeparturOptionsSelected] = useState([]);
  const [amenitiesOptionsSelected, setAmenitiesOptionsSelected] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [greetingsText, setGreetingsText] = useState("");
  const pickupCityRef = useRef(null);
  const [searchedRideData, setSearchedRideData] = useState(searchRideData);
  const dropOffCityRef = useRef(null);
  const { isFromInvoice } = route.params || {};

  /////////////// Error States //////////////
  const [pickupCityError, setPickupCityError] = useState(false);
  const [dropOffCityError, setDropOffCityError] = useState(false);

  //////////////// useEffect ////////////////
  useEffect(() => {
    getCurrentGreetings();
    get_Time_Zone();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (isFromInvoice) {
        setPickupCity("");
        setDropOffCity("");
        setSearchActive(true);
      }
    }, [])
  );

  const get_Time_Zone = () => {
    const time_zone = getTimeZone();
    setTimeZone(time_zone);
  };

  useEffect(async () => {
    const isReferral = await AsyncStorage.getItem("@isReferralCode");
    if (isReferral === "0") {
      setTimeout(() => {
        setShowReferral(true);
      }, 4000);
    }
  }, []);

  ///////////// Function for pickuptime data //////////////
  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      timeSlots.push({
        label: `${formattedHour}:${formattedMinute}`,
        value: `${formattedHour}:${formattedMinute}`,
      });
    }
  }

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

  ////////// Filter options data //////////
  const sortByFilterData = [
    { option: t("earliest_departure"), key: "0" },
    { option: t("lowest_price"), key: "1" },
  ];

  const departurTimeData = [
    { option: t("before_8_am"), key: "2" },
    { option: t("_8am_to_12pm"), key: "3" },
    { option: t("_12pm_to_7pm"), key: "4" },
    { option: t("after_7pm"), key: "5" },
  ];

  const amenitiesData = [
    { option: t("medium_size_luggage"), key: "6" },
    { option: t("large_luggage"), key: "7" },
    { option: t("pet_in_cage_allowed"), key: "8" },
    { option: t("winter_tires_installed"), key: "b" },
    { option: t("max_2_seats_available"), key: "9" },
    { option: t("min_4_seats_available"), key: "a" },
  ];

  /////////// Function for seprate filter option selection /////////////
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

  /////////// Function for date confirm //////////
  const handleDateConfirm = (date) => {
    setDate(date);
    setSelectedDate(date);
    setDateActive(true);
    setIsDatePickerOpen(true);
    setIsDateConfirmed(true);
    setOpenDate(false);
  };

  const handlePickupClear = () => {
    setPickupCity("");
  };

  const handleDropoffClear = () => {
    setDropOffCity("");
  };

  ////////// For Find Ride Searchview hide and show ///////////
  const SearchView = () => (
    <>
      <AutocompleteDropdownContextProvider>
        <View
          style={[
            styles.SearchContainer,
            { bottom: searchRideData.length === 0 ? null : null },
          ]}
          onStartShouldSetResponder={() => {
            pickupCityRef?.current?.closeDropDown();
            dropOffCity?.current?.closeDropDown();
          }}
        >
          <View style={styles.mainContainer}>
            <View style={styles.navigationArea}>
              <Image
                style={[
                  styles.locationNavigationIcon,
                  { tintColor: pickupCity ? Colors.primary : Colors.gray },
                ]}
                source={Images.location_icon}
              />

              <View
                style={[
                  styles.navigationLine,
                  { borderColor: pickupCity ? Colors.primary : Colors.gray },
                ]}
              />

              <Image
                style={[
                  styles.dropIcon,
                  { tintColor: dropOffCity ? Colors.primary : Colors.gray },
                ]}
                source={Images.drop_off_icon}
              />

              <View
                style={[
                  styles.navigationLine,
                  { borderColor: dropOffCity ? Colors.primary : Colors.gray },
                ]}
              />

              <Image
                style={[
                  styles.dateIcon,
                  {
                    tintColor:
                      dateActive === true ? Colors.primary : Colors.gray,
                  },
                ]}
                source={Images.date_icon}
              />
            </View>

            <View style={styles.textinputArea}>
              <View
                style={[
                  styles.textinputTabArea,
                  {
                    borderColor: pickupCityError ? Colors.red : Colors.gray,
                    borderWidth: pickupCityError
                      ? 2
                      : ScaleSize.smallest_border_width,
                  },
                ]}
              >
                <Text style={styles.textinputTitle}>{t("pickup_city")}</Text>
                <IntercitySearch
                  onSelected={(selectedItem) => {
                    console.log("Selected Item ===> ", selectedItem);
                    if (selectedItem) {
                      setPickupCity(selectedItem);
                      setPickupCityError(null);
                    }
                  }}
                  isOptional={false}
                  ref={pickupCityRef}
                  onClear={handlePickupClear}
                  imageShow={false}
                  placeholder={pickupCity}
                  isCustom={false}
                  pickupCity={true}
                />
              </View>
              {pickupCityError ? (
                <View style={styles.errorTextArea}>
                  <Text style={styles.errorText}>{pickupCityError}</Text>
                </View>
              ) : null}

              <View
                style={[
                  styles.textinputTabArea,
                  {
                    borderColor: dropOffCityError ? Colors.red : Colors.gray,
                    borderWidth: dropOffCityError
                      ? 2
                      : ScaleSize.smallest_border_width,
                  },
                ]}
              >
                <Text style={styles.textinputTitle}>{t("drop_off_city")}</Text>
                <IntercitySearch
                  onSelected={(selectedItem) => {
                    if (selectedItem) {
                      setDropOffCity(selectedItem);
                      setDropOffCityError(null);
                    }
                  }}
                  isOptional={false}
                  ref={dropOffCityRef}
                  placeholder={dropOffCity}
                  imageShow={false}
                  onClear={handleDropoffClear}
                  isCustom={false}
                  pickupCity={false}
                />
              </View>

              {dropOffCityError ? (
                <View style={styles.errorTextArea}>
                  <Text style={styles.errorText}>{dropOffCityError}</Text>
                </View>
              ) : null}

              <View style={styles.datePickerTextinputTabArea}>
                <Text style={styles.textinputTitle}>{t("date")}</Text>
                <DateTimePicker
                  datePickerTabstyles={styles.datePickerTextinputTab}
                  value={date}
                  isCustom={true}
                  placeholderText={""}
                  mode="date"
                  onConfirm={(date) => {
                    handleDateConfirm(date);
                  }}
                />

                {selectedDate && (
                  <View style={styles.searchDateCloseBtn}>
                    <TouchableOpacity
                      style={styles.searchDateCloseBorder}
                      onPress={() => {
                        setSelectedDate("");
                        setDate("");
                        setIsDateConfirmed(false);
                      }}
                    >
                      <Image
                        source={Images.close_icon}
                        style={styles.searchDateCloseIcon}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>

          <TextButton
            buttonStyle={styles.searchRidesButton}
            textStyle={styles.searchRidesButtonText}
            strings={t("search_rides")}
            source={Images.search_icon}
            iconStyle={styles.iconStyle}
            onPress={() => {
              handleFilterClearBtn();
            }}
          />
        </View>
      </AutocompleteDropdownContextProvider>
    </>
  );

  const handleSearchRide = async (
    searchPage,
    sortByOptionsSelected,
    departurOptionsSelected,
    amenitiesOptionsSelected
  ) => {
    try {
      setModalVisible(false);
      const UserId = await AsyncStorage.getItem("@id");
      const currentUserId = JSON.parse(UserId);
      var isValid = true;

      if (Utils.isNull(pickupCity)) {
        isValid = false;
        setPickupCityError(t("select_validation_pickup_city"));
      } else {
        setPickupCityError(null);
      }

      if (Utils.isNull(dropOffCity)) {
        isValid = false;
        setDropOffCityError(t("select_validation_dropoff_city"));
      } else {
        setDropOffCityError(null);
      }

      if (
        userData?.is_phone_verify === 1 &&
        !Utils.isNull(pickupCity) &&
        !Utils.isNull(dropOffCity)
      ) {
        isValid = false;
        navigation.navigate("AuthenticationNavigator", {
          screen: "MobileVerification",
          params: { isFromEditProfile: false, isFromMyBookings: false },
        });
      }

      const filterOptions = [
        ...sortByOptionsSelected,
        ...departurOptionsSelected,
        ...amenitiesOptionsSelected,
      ];
      const filterVal = filterOptions.join(",");

      const body = {
        user_id: currentUserId,
        page: searchPage,
        pickup_city: pickupCity,
        dropoff_city: dropOffCity,
        filter_val: filterVal,
        time_zone: timeZone,
        date: selectedDate ? moment(selectedDate).format("YYYY-MM-DD") : null,
      };
      if (isValid) {
        if (await Utils.isNetworkConnected()) {
          dispatch(
            getIntercityAllRideList(body, async (data, isSuccess) => {
              if (isSuccess === true) {
                setBlankPageText(data.message);
              }
            })
          );
        }
        setModalVisible(false);
        setSearchActive(false);
        setRefreshingData(false);
      }
    } catch {}
  };

  /////////// Function for refresh //////////
  const refresh = () => {
    setRefreshingData(true);
    setPickupCity(pickupCitySearchText);
    setDropOffCity(dropOffCitySearchText);
    handleSearchRide(1, [], [], []);
    setRefreshingData(false);
  };

  ////////// Flatlist RenderItem ///////////
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.tabArea}>
        <TouchableOpacity
          onPress={async () => {
            await AsyncStorage.setItem("@rideId", JSON.stringify(item.id));
            dispatch({ type: Constant.CLEAR_RIDE_DETAILS_SUCCESS });
            navigation.navigate("IntercityRideDetailsScreen", {
              isFromMyBookings: false,
              callIcon: false,
              isRider: true,
              ride_id: item.id,
              is_bold: true,
            });
          }}
          style={styles.tab}
        >
          <View style={styles.tabImageAndTextArea}>
            <ImageBackground
              source={Images.profilePlaceholder}
              style={styles.tabProfileBgImg}
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
                  marginVertical: Platform.OS === "ios" ? 5 : null,
                }}
              >
                <Image style={styles.tabIcon} source={Images.route_icon} />
                <Text style={styles.destinationText}>
                  {pickupCitySearchText} to {dropOffCitySearchText}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Image style={styles.tabIcon} source={Images.rate} />
                <Text style={styles.destinationText}>
                  {item?.total_rating?.toFixed(1)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.dateTextPickupPriceTextArea}>
            <Text style={styles.dateText}>
              {t("date")} {moment(item.date).format("DD, MMM YYYY hh:mm a")}
            </Text>
            <View style={styles.verticalSepratorLine} />
            <Text style={styles.priceText}>
              {t("price")} ${item.mainPrice.toFixed(2)}
            </Text>
          </View>

          <View style={styles.horizontalSeparatorLine} />

          <View style={styles.tabBottomBar}>
            <View style={styles.seatArea}>
              <Image
                style={[
                  styles.tabIcon,
                  {
                    top: Platform.OS === "ios" ? ScaleSize.font_spacing : null,
                    height: ScaleSize.small_icon / 1.6,
                    width: ScaleSize.small_icon / 1.6,
                  },
                ]}
                source={Images.seat}
              />
              <Text style={styles.seatText}>
                {item.available_seat <= 0
                  ? "FULL"
                  : item.available_seat > 1
                  ? item.available_seat + " " + "Seats Available"
                  : item.available_seat + " " + "Seat Available"}
              </Text>
            </View>

            {item.available_seat <= 0 ? null : (
              <TextButton
                onPress={async () => {
                  await AsyncStorage.setItem(
                    "@rideId",
                    JSON.stringify(item.id)
                  );
                  dispatch({ type: Constant.CLEAR_RIDE_DETAILS_SUCCESS });
                  navigation.navigate("IntercityRideDetailsScreen", {
                    isFromMyBookings: false,
                    isRider: true,
                    callIcon: false,
                    ride_id: item.id,
                    is_bold: true,
                  });
                }}
                buttonStyle={styles.bookNowBtn}
                textStyle={styles.bookNowBtnText}
                strings={t("book_now")}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleOnEndReached = () => {
    if (
      searchRideData.length > 0 &&
      searchRidePage < searchRideTotalPage &&
      !isPagingCalled
    ) {
      handleSearchRide(
        searchRidePage + 1,
        sortByOptionsSelected,
        departurOptionsSelected,
        amenitiesOptionsSelected
      );
    } else {
      null;
    }
  };

  const handleFilterClearBtn = () => {
    setSortByOptionsSelected([]);
    setDeparturOptionsSelected([]);
    setAmenitiesOptionsSelected([]);
    handleSearchRide(1, [], [], []);
  };

  const handleFindBtn = () => {
    setPickupCityError(false);
    setDropOffCityError(false);
    setSearchActive(!searchActive);
  };

  /////////// Filter Options Area ///////////
  const FilterModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <ScrollView
            contentContainerStyle={styles.modalBg}
            keyboardShouldPersistTaps={true}
          >
            <View style={styles.scrollModal}>
              <View style={styles.modal}>
                <View style={styles.filterModalNotch} />
                <View style={styles.sortByArea}>
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={styles.filterTitleText}>{t("sort_by")}</Text>
                    <TextButton
                      onPress={handleFilterClearBtn}
                      strings={t("clear_all")}
                      buttonStyle={styles.clearAllBtn}
                      textStyle={styles.clearAllBtnText}
                    />
                  </View>

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
                  <View style={{ width: "100%" }}>
                    <Text style={styles.filterTitleText}>
                      {t("departur_time")}
                    </Text>
                  </View>
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
                  <View style={{ width: "100%" }}>
                    <Text style={styles.filterTitleText}>{t("amenities")}</Text>
                  </View>
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
                      handleSearchRide(
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

  var isPagingCalled = true;
  const isFocused = useIsFocused();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <AutocompleteDropdownContextProvider>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          persistentScrollbar={true}
          nestedScrollEnabled
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          contentInsetAdjustmentBehavior="automatic"
        >
          <ModalProgressLoader visible={isLoading && isFocused} />
          <View style={styles.container}>
            <StatusBar
              backgroundColor={Colors.white}
              barStyle={"dark-content"}
            />
            <View style={styles.topBar}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ImageBackground
                  source={Images.profilePlaceholder}
                  style={styles.HeaderProfileImageArea}
                >
                  {userData && (
                    <FastImage
                      resizeMode={FastImage.resizeMode.cover}
                      source={{ uri: userData.profile_picture }}
                      style={styles.userProfileImg}
                    />
                  )}
                </ImageBackground>
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

              <TextButton
                onPress={handleFindBtn}
                textStyle={styles.findBtnText}
                buttonStyle={styles.findBtn}
                iconStyle={styles.findIcon}
                source={Images.search_icon}
                strings={t("find_ride")}
              />
            </View>

            <View
              style={
                searchActive
                  ? {
                      flex: 1,
                      marginBottom: -ScaleSize.spacing_medium + 5,
                      zIndex: 1,
                    }
                  : { position: "absolute", top: -1000 }
              }
            >
              {SearchView()}
            </View>

            <View style={styles.filterHeader}>
              {searchRideData.length === 0
                ? null
                : !searchActive && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Image
                        source={Images.location_icon}
                        style={styles.locationIcon}
                      />
                      <Text style={styles.locationText}>
                        {pickupCitySearchText} to {dropOffCitySearchText}
                      </Text>
                    </View>
                  )}
              {!searchActive && (
                <TouchableOpacity
                  style={styles.filterBtn}
                  onPress={() => setModalVisible(true)}
                >
                  <Image source={Images.filter} style={styles.filterIcon} />
                </TouchableOpacity>
              )}
            </View>

            {searchRideData.length === 0 ? (
              <Text style={styles.noDataText}>{blankPageText}</Text>
            ) : (
              !searchActive && (
                <FlatList
                  style={styles.flatlist}
                  data={searchRideData}
                  renderItem={renderItem}
                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={0.5}
                  onMomentumScrollBegin={() => {
                    isPagingCalled = false;
                  }}
                  onEndReached={() => handleOnEndReached()}
                  ListFooterComponent={() =>
                    searchRidePage > 1 &&
                    searchRideLoading && (
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
              )
            )}
            {FilterModal()}
            <ReferralCodePopup
              visible={showReferral}
              close={() => setShowReferral(false)}
            />
          </View>
        </ScrollView>
      </AutocompleteDropdownContextProvider>
    </SafeAreaView>
  );
};

export default RiderIntercityHomeScreen;

const styles = StyleSheet.create({
  placeHolder: {
    fontSize: TextFontSize.very_small_text,
    justifyContent: "center",
    color: Colors.primary,
    position: "absolute",
    zIndex: 1,
    top: 20,
    bottom: 0,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  navigationLine: {
    width: ScaleSize.font_spacing,
    borderRightWidth: 2,
    borderStyle: "dashed",
    marginVertical: ScaleSize.spacing_very_small,
    flex: 0.4,
  },
  locationNavigationIcon: {
    height: ScaleSize.large_icon,
    width: ScaleSize.large_icon,
    resizeMode: "contain",
  },
  dropIcon: {
    height: ScaleSize.large_icon,
    width: ScaleSize.medium_icon,
    resizeMode: "contain",
  },
  dateIcon: {
    height: ScaleSize.large_icon,
    width: ScaleSize.medium_icon,
    resizeMode: "contain",
  },
  horizontalSeparatorLine: {
    height: ScaleSize.spacing_minimum,
    marginVertical: ScaleSize.spacing_very_small - 2,
    width: "100%",
    backgroundColor: Colors.light_gray,
  },
  verticalSepratorLine: {
    height: ScaleSize.spacing_medium - 4,
    borderRightWidth: ScaleSize.spacing_minimum + 1,
    marginHorizontal: ScaleSize.spacing_medium / 2,
    borderColor: Colors.light_gray,
  },
  filterModalNotch: {
    height: ScaleSize.spacing_small,
    width: ScaleSize.spacing_large + 2,
    marginBottom: ScaleSize.spacing_medium,
    borderRadius: ScaleSize.small_border_radius,
    backgroundColor: Colors.textinput_low_opacity,
  },
  filterBtnText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.filter_option - 1,
    marginTop: ScaleSize.spacing_very_small / 2,
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
  modalBg: {
    flexGrow: 1,
    paddingTop: 100,
    backgroundColor: Colors.modal_bg,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  modal: {
    width: "100%",
    borderTopLeftRadius: ScaleSize.small_border_radius,
    borderTopRightRadius: ScaleSize.small_border_radius,
    paddingHorizontal: ScaleSize.spacing_medium + ScaleSize.spacing_very_small,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: ScaleSize.spacing_medium,
    backgroundColor: Colors.white,
  },
  scrollModal: {
    width: "100%",
  },
  sortByArea: {
    justifyContent: "center",
    width: "100%",
  },
  filterTitleText: {
    fontFamily: AppFonts.medium,
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
    flexWrap: "wrap",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  checkIcon: {
    height: ScaleSize.very_small_icon,
    width: ScaleSize.very_small_icon,
    right: ScaleSize.spacing_small,
    tintColor: "white",
  },
  departurArea: {
    justifyContent: "center",
    width: "100%",
  },
  departurOptionArea: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenitiesArea: {
    justifyContent: "center",
    width: "100%",
  },
  amenitiesOptionArea: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_small,
    backgroundColor: Colors.white,
  },
  topBar: {
    flex: 0.01,
    flexDirection: "row",
    marginVertical: ScaleSize.spacing_small,
    paddingTop: ScaleSize.spacing_very_small,
    justifyContent: "space-between",
    alignItems: "center",
  },
  findBtnText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.black,
    top: Platform.OS === "ios" ? null : ScaleSize.font_spacing,
  },
  findBtn: {
    flex: 1,
    position: "absolute",
    right: 0,
    paddingVertical: ScaleSize.spacing_small,
    flexDirection: "row",
    paddingHorizontal: ScaleSize.spacing_medium,
    padding: ScaleSize.spacing_small,
    borderWidth: ScaleSize.smallest_border_width,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  findIcon: {
    height: ScaleSize.very_small_icon,
    width: ScaleSize.very_small_icon,
    resizeMode: "contain",
    right: ScaleSize.spacing_small,
  },
  profileImg: {
    height: ScaleSize.profile_icon,
    width: ScaleSize.profile_icon,
    resizeMode: "cover",
    borderRadius: ScaleSize.very_small_border_radius,
  },
  topBarTextArea: {
    flex: 1,
    marginRight: ScaleSize.spacing_large * 5,
    alignItems: "flex-start",
    left: ScaleSize.spacing_semi_medium,
  },
  usernameText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text - 1,
    color: Colors.black,
    width: "90%",
    bottom: Platform.OS === "ios" ? null : ScaleSize.font_spacing,
  },
  greetingsText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
    top: Platform.OS === "ios" ? null : ScaleSize.spacing_very_small,
  },
  SearchContainer: {
    alignItems: "center",
    flex: 0.1,
    top: -ScaleSize.spacing_medium,
    justifyContent: "center",
    paddingVertical: ScaleSize.spacing_medium,
    paddingBottom: -10,
  },
  mainContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    flexDirection: "row",
  },
  textinputArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: ScaleSize.spacing_medium,
  },
  navigationArea: {
    flex: 0.1,
    paddingVertical: ScaleSize.spacing_large,
    marginRight: ScaleSize.spacing_semi_medium - 2,
    bottom: ScaleSize.spacing_semi_medium - 4,
    alignItems: "center",
    justifyContent: "center",
  },
  textinputTitle: {
    color: Colors.black,
    paddingHorizontal: ScaleSize.spacing_small + 2,
    backgroundColor: Colors.white,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    padding: ScaleSize.spacing_very_small,
    alignSelf: "flex-start",
    top: -ScaleSize.spacing_semi_large + 6,
    position: "absolute",
    left: ScaleSize.spacing_medium,
  },
  textinputTab: {
    flex: 1,
    textTransform: "lowercase",
    fontSize: TextFontSize.small_text,
    alignItems: "center",
    justifyContent: "center",
    fontFamily: AppFonts.semi_bold,
    borderRadius: ScaleSize.small_border_radius,
    backgroundColor: Colors.white,
    color: Colors.primary,
    alignSelf: "center",
    paddingVertical: ScaleSize.spacing_small,
  },
  textinputTabArea: {
    width: "100%",
    height: ScaleSize.spacing_extra_large,
    fontSize: 1,
    fontFamily: AppFonts.semi_bold,
    color: Colors.primary,
    marginVertical: ScaleSize.spacing_small + 5,
    borderWidth: ScaleSize.smallest_border_width,
    borderRadius: ScaleSize.very_small_border_radius + 5,
  },
  datePickerTextinputTabArea: {
    width: "100%",
    height: ScaleSize.spacing_extra_large - 5,
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.semi_bold,
    color: Colors.primary,
    marginVertical: ScaleSize.spacing_small + 5,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    paddingVertical: ScaleSize.spacing_semi_medium,
    borderColor: Colors.gray,
    borderWidth: ScaleSize.smallest_border_width,
    borderRadius: ScaleSize.very_small_border_radius + 5,
  },
  datePickerTextinputTab: {
    flex: 1,
    height: "100%",
    top:
      Platform.OS === "ios"
        ? ScaleSize.font_spacing + 4
        : ScaleSize.font_spacing,
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.semi_bold,
    color: Colors.primary,
  },
  searchRidesButton: {
    padding: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.very_small_border_radius,
    width: "100%",
    height: "auto",
    bottom: ScaleSize.spacing_small + 5,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: Colors.primary,
  },
  searchRidesButtonText: {
    color: Colors.white,
    width: "100%",
    top: Platform.OS === "ios" ? null : ScaleSize.font_spacing,
    marginLeft: ScaleSize.spacing_very_small,
    textAlign: "center",
    fontFamily: AppFonts.semi_bold,
    paddingLeft: ScaleSize.spacing_medium / 2,
    fontSize: TextFontSize.small_text,
  },
  iconStyle: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    tintColor: Colors.white,
    position: "absolute",
    left: ScaleSize.spacing_extra_large * 1.5,
  },
  flatlist: {
    flex: 1,
    width: "100%",
  },
  tabArea: {
    justifyContent: "flex-start",
    alignItems: "center",
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
  tabProfileBgImg: {
    justifyContent: "center",
    alignItems: "center",
    height: ScaleSize.tab_profile_icon + 15,
    width: ScaleSize.tab_profile_icon + 15,
    overflow: "hidden",
    backgroundColor: Colors.gray,
    marginRight: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.small_border_radius + 4,
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
    fontSize: TextFontSize.small_text - 1,
  },
  tabIcon: {
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
    width: "100%",
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
    borderRadius: ScaleSize.very_small_border_radius + 5,
  },
  seatText: {
    color: Colors.primary,
    marginHorizontal: ScaleSize.spacing_very_small,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.extra_small_text - 2,
  },
  bookNowBtn: {
    backgroundColor: Colors.secondary,
    padding: ScaleSize.spacing_very_small,
    paddingHorizontal: ScaleSize.spacing_large,
    borderRadius: ScaleSize.small_border_radius,
  },
  bookNowBtnText: {
    color: Colors.white,
    fontFamily: AppFonts.medium,
    top: Platform.OS === "ios" ? null : ScaleSize.font_spacing,
    fontSize: TextFontSize.extra_small_text - 2,
  },
  filterHeader: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    alignSelf: "flex-start",
    justifyContent: "space-between",
    marginBottom: ScaleSize.spacing_small,
  },
  locationIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    resizeMode: "contain",
    marginRight: ScaleSize.spacing_very_small,
    tintColor: Colors.secondary,
  },
  locationText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
  },
  filterBtn: {
    position: "absolute",
    justifyContent: "center",
    right: ScaleSize.spacing_small,
  },
  filterIcon: {
    height: ScaleSize.small_icon,
    width: ScaleSize.small_icon,
    resizeMode: "contain",
    position: "absolute",
    right: 0,
  },
  noDataText: {
    color: Colors.gray,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.semi_medium_text - 1,
    top: ScaleSize.spacing_extra_large * 4,
    alignSelf: "center",
  },
  errorTextArea: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    bottom: ScaleSize.spacing_very_small,
    width: "90%",
    paddingLeft: ScaleSize.spacing_medium + 2,
  },
  errorText: {
    fontFamily: AppFonts.medium,
    color: Colors.red,
    alignSelf: "flex-start",
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
  searchDateCloseBtn: {
    position: "absolute",
    right: ScaleSize.spacing_large - 2,
    top: 10,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  searchDateCloseBorder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 100,
    padding: 3.5,
    borderColor: "#b2b8c8cc",
  },
  searchDateCloseIcon: {
    height: 7,
    width: 7,
    tintColor: Colors.gray,
  },
});
