import {
  StyleSheet,
  Text,
  FlatList,
  RefreshControl,
  StatusBar,
  View,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useState, memo } from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import Utils from "../../Helpers/Utils";
import { useTranslation } from "react-i18next";
import {
  intercityMyBookings,
  riderCancelBooking,
} from "../../Actions/Intercity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../Resources/Languages/index";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import SearchTextInput from "../../Components/MyBookings/SearchTextInput";
import Header from "../../Components/MyBookings/Header";
import RenderItem from "../../Components/MyBookings/RenderItem";
import Constant from "../../Network/Constant";
import { cancelRide, intracityRiderMyBookings } from "../../Actions/Intracity";
import AlertBox from "../../Components/Comman/AlertBox";
import { ModalProgressLoader } from "../../Components/Comman";

const RiderMyBookingsScreen = memo(({ navigation, route }) => {
  ///////////// States /////////////
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.Authentication);
  const { rideData, page, rideTotalPage, rideLoading } = useSelector(
    (state) => state.Intercity
  );
  const { intracityRideData, intracityRidepage, intracityRideTotalPage } =
    useSelector((state) => state.Intracity);
  const [refreshingData, setRefreshingData] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showCancel, setShowCancel] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [cancelMsg, setCancelMsg] = useState(null);
  const { t, i18n } = useTranslation();
  const [selectedAreaType, setSelectedAreaType] = useState("intercity");
  const [loading, setLoading] = useState(false);
  const [areaType, setAreaType] = useState([
    { label: t("intercity"), value: "intercity" },
    //{ label: t("intracity"), value: "intracity" },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData(1);
    }, [selectedAreaType])
  );

  const fetchData = async (pageNumber, searchText) => {
    try {
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
            ? await dispatch(intercityMyBookings(body))
            : await dispatch(intracityRiderMyBookings(body));
          setLoading(false);
        }
        isPagingCalled = true;
        setRefreshingData(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setRefreshingData(false);
    }
  };

  const handleSearch = () => {
    fetchData(1, searchText);
  };

  const handleEndReached = () => {
    if (rideData.length > 0 && page < rideTotalPage && !isPagingCalled) {
      fetchData(page + 1);
    } else {
      null;
    }
  };

  const handleIntracityEndReach = () => {
    if (
      intracityRideData.length > 0 &&
      intracityRidepage < intracityRideTotalPage &&
      !isPagingCalled
    ) {
      fetchData(intracityRidepage + 1);
    } else {
      null;
    }
  };

  /////////// Function for refresh //////////
  const refresh = () => {
    setRefreshingData(true);
    fetchData(1);
  };

  /////////// Function for cancel booking ///////////
  const RiderCancelBooking = async (id) => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        booking_id: id,
        is_cancle: 0,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          riderCancelBooking(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setCancelId(id);
              setCancelMsg(data?.message);
              setShowCancel(true);
            }
          })
        );
      }
    } catch {}
  };

  /////////// Function for cancel booking ///////////
  const IntracityRiderCancelBooking = async (id) => {
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
              fetchData(1);
            }
          })
        );
      }
    } catch {}
  };
  const RiderContinuePressed = async (id) => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        booking_id: id,
        is_cancle: 1,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          riderCancelBooking(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              setShowCancel(false);
              fetchData(1);
            }
          })
        );
      }
    } catch {}
  };

  const handleClear = () => {
    setSearchText("");
    fetchData(1, "");
  };

  async function onItemPress(item) {
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

    const commonParams = {
      isFromMyBookings: true,
      isRider: true,
      price: item.total_amount,
      booking_id: item.id,
      ride_id: item.id,
      booked_seat: item.booked_seat,
      intercity_ride_id: item.intercity_ride_id,
      is_bold: false,
    };

    selectedAreaType === "intercity"
      ? navigation.navigate("IntercityRideDetailsScreen", {
          ...commonParams,
          callIcon: true,
        })
      : navigation.navigate("IntracityRideDetailsScreen", {
          ...commonParams,
          isFromNotification: false,
        });
  }

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

          <Header
            profile_picture={userData.profile_picture}
            full_name={userData.full_name}
            areaType={areaType}
            setSelectedAreaType={setSelectedAreaType}
          />

          <SearchTextInput
            setSearchText={setSearchText}
            searchText={searchText}
            fetchData={fetchData}
            handleClear={handleClear}
            handleSearch={handleSearch}
          />

          {selectedAreaType === "intercity" ? (
            rideData.length === 0 ? (
              <Text style={styles.noDataText}>{t("no_data_found")}</Text>
            ) : (
              <FlatList
                style={{ marginTop: ScaleSize.spacing_semi_medium - 2 }}
                showsVerticalScrollIndicator={false}
                data={
                  selectedAreaType === "intercity"
                    ? rideData
                    : intracityRideData
                }
                renderItem={({ item, index }) => (
                  <RenderItem
                    item={item}
                    index={index}
                    RiderCancelBooking={
                      selectedAreaType === "intercity"
                        ? RiderCancelBooking
                        : IntracityRiderCancelBooking
                    }
                    selectedAreaType={selectedAreaType}
                    onPress={onItemPress}
                  />
                )}
                onEndReachedThreshold={0.5}
                onMomentumScrollBegin={() => {
                  isPagingCalled = false;
                }}
                showVerticalScrollIndicator={false}
                onEndReached={() =>
                  selectedAreaType === "intercity"
                    ? handleEndReached()
                    : handleIntracityEndReach()
                }
                refreshControl={
                  <RefreshControl
                    refreshing={refreshingData}
                    onRefresh={refresh}
                  />
                }
                ListFooterComponent={() =>
                  page > 1 &&
                  rideLoading && (
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
          ) : intracityRideData.length === 0 ? (
            <Text style={styles.noDataText}>{t("no_data_found")}</Text>
          ) : (
            <FlatList
              style={{ marginTop: ScaleSize.spacing_semi_medium - 2 }}
              showsVerticalScrollIndicator={false}
              data={intracityRideData}
              renderItem={({ item, index }) => (
                <RenderItem
                  item={item}
                  index={index}
                  RiderCancelBooking={IntracityRiderCancelBooking}
                  selectedAreaType={selectedAreaType}
                  onPress={onItemPress}
                />
              )}
              onEndReachedThreshold={0.5}
              onMomentumScrollBegin={() => {
                isPagingCalled = false;
              }}
              showVerticalScrollIndicator={false}
              onEndReached={() => handleIntracityEndReach()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshingData}
                  onRefresh={refresh}
                />
              }
              ListFooterComponent={() =>
                page > 1 &&
                rideLoading && (
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
            title={"Warning ⚠️"}
            message={
              cancelMsg
              // ? "Are you sure you want to cancel this trip? You will receive a full refund minus the cancellation fee."
              // : ""
            }
            positiveBtnText={"Cancel Ride"}
            negativeBtnText={"Go Back"}
            onPress={() => {
              setShowCancel(false);
              RiderContinuePressed(cancelId);
            }}
            onPressNegative={() => setShowCancel(false)}
          />
        </View>
      </SafeAreaView>
    </>
  );
});
export default RiderMyBookingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_small,
  },
  topBar: {
    height: ScaleSize.spacing_very_large,
    marginVertical: ScaleSize.spacing_medium,
    flexDirection: "row",
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "space-between",
    alignItems: "center",
  },
  flatlist: {
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_medium,
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
});
