import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  TextInput,
  SectionList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  TextButton,
  Header,
  ModalProgressLoader,
  PrimaryButton,
} from "../../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  WithDrawBalance,
  intercityRevenue,
  intracityRevenue,
  totalRevenue,
} from "../../../Actions/Settings";
import Utils from "../../../Helpers/Utils";

const PaymentHistory = ({ navigation, route }) => {
  const { userData } = useSelector((state) => state.Authentication);
  const {
    intercityPaymentHistory,
    intracityPaymentHistory,
    withdrawbalanceHistory,
    intercityRevenuePage,
    intercityRevenueLoading,
    intercityRevenueTotalPage,
    isLoading,
    intracityRevenuePage,
    intracityRevenueLoading,
    intracityRevenueTotalPage,
    withDrawLoading,
    withDrawPage,
    withDrawTotalPage,
    totalRevAmount,
    withDrwAmount,
    interRevAmount,
    intraRevAmount,
  } = useSelector((state) => state.Settings);
  const [refreshingData, setRefreshingData] = useState(false);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [viewAll, setViewAll] = useState(false);
  const filter = [
    { label: t("total_revenue"), value: 1 },
    { label: t("withdraw_balance"), value: 2 },
    { label: t("intercity_revenue"), value: 3 },
    { label: t("intracity_revenue"), value: 4 },
  ];
  const [category, setCategory] = useState(filter);
  const dropDownTypeRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(t("total_revenue"));
  const [selectedCategoryType, setSelectedCategoryType] = useState(1);
  const [mainCardPrice, setMainCardPrice] = useState("");
  const [searchText, setSearchText] = useState("");
  const [withDrawBalance, setWithDrawBalance] = useState([]);

  const [intercityRevenueData, setIntercityRevenueData] = useState([]);

  /////////// Function for render Dropdown items ////////
  const renderDropDownItem = (item) => {
    return (
      <View style={styles.dropDownMenuStyle}>
        <Text style={styles.dropDownMenuText}>{item.label}</Text>
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData(selectedCategoryType);
    }, [])
  );

  const fetchData = async (type) => {
    try {
      if (type === 1) {
        fetchTotalRevenue();
      } else if (type === 2) {
        fetchWithdrawBalance(1);
      } else if (type === 3) {
        fetchIntercityRevenue(1);
      } else if (type === 4) {
        fetchIntracityRevenue(1);
      }
    } catch {}
  };

  const fetchTotalRevenue = async () => {
    try {
      var body = {
        user_id: userData.id,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          totalRevenue(body, (data, isSuccess) => {
            setMainCardPrice(data.data.total_revenue);
            console.log("LENGTH", intracityPaymentHistory?.length);
          })
        );
      }
    } catch {}
  };

  const fetchWithdrawBalance = async (page) => {
    try {
      var body = {
        user_id: userData.id,
        page: page,
        search_text: searchText,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(WithDrawBalance(body, (data, isSuccess) => {}));
      }
    } catch {}
  };

  const handleWithDrawEndReached = () => {
    if (
      withdrawbalanceHistory.length > 0 &&
      withDrawPage < withDrawTotalPage &&
      !isPagingCalled
    ) {
      fetchWithdrawBalance(withDrawPage + 1);
    } else {
      null;
    }
  };

  const fetchIntercityRevenue = async (page) => {
    try {
      var body = {
        user_id: userData.id,
        page: page,
        search_text: searchText,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(intercityRevenue(body, (data, isSuccess) => {}));
        setRefreshingData(false);
      }
    } catch {}
  };

  const handleIntercityEndReached = () => {
    if (
      intercityPaymentHistory.length > 0 &&
      intercityRevenuePage < intercityRevenueTotalPage &&
      !isPagingCalled
    ) {
      fetchIntercityRevenue(intercityRevenuePage + 1);
    } else {
      null;
    }
  };

  const fetchIntracityRevenue = async (page) => {
    try {
      var body = {
        user_id: userData.id,
        page: page,
        search_text: searchText,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(intracityRevenue(body, (data, isSuccess) => {}));
      }
    } catch {}
  };

  const handleIntracityEndReached = () => {
    if (
      intracityPaymentHistory.length > 0 &&
      intracityRevenuePage < intracityRevenueTotalPage &&
      !isPagingCalled
    ) {
      fetchIntracityRevenue(intracityRevenuePage + 1);
    } else {
      null;
    }
  };
  const renderTotalRevenue = ({ item, index }) => {
    return (
      <View style={styles.withDrawTabArea}>
        <View style={styles.withDrawTab}>
          <View style={styles.iconContainer}>
            <Image style={styles.tabIcon} source={Images.payment_history} />
          </View>
          <View style={styles.withDrawTabAmountContainer}>
            <Text style={styles.transferAmountTitle}>
              {t("transfer_amount")}:
            </Text>
            <Text style={styles.detailTitleText}>
              {t("total_amount")}:{" "}
              <Text style={styles.detailText}>${item.amount}</Text>
            </Text>
            <Text style={styles.detailTitleText}>
              {t("same_day_payout")}:{" "}
              <Text style={styles.detailText}>{item.fees}</Text>
            </Text>
          </View>
          <View style={styles.mainAmountContainer}>
            <Text style={styles.mainPrice}>-</Text>
            <Text style={styles.withDrawTabDate}></Text>
          </View>
        </View>
      </View>
    );
  };

  const amount = () => {
    var rev = 0;
    if (selectedCategoryType === 1) {
      rev = totalRevAmount;
    } else if (selectedCategoryType === 2) {
      rev = withDrwAmount;
    } else if (selectedCategoryType === 3) {
      rev = interRevAmount;
    } else if (selectedCategoryType === 4) {
      rev = intraRevAmount;
    }
    return rev;
  };

  const renderIntercityRevenue = ({ item, index }) => {
    return (
      <View style={styles.intercityRevenueTabArea}>
        <View style={styles.intercityRevenueTab}>
          <View style={styles.tabHeaderArea}>
            <View style={styles.iconContainer}>
              <Image source={Images.route_icon} style={styles.tabIcon} />
            </View>

            <View style={styles.intercityRevHeaderTextContainer}>
              <Text style={styles.driverFeesTitle}>
                {t("driver_fees")}:{item.total_driver_fee}
              </Text>
              <Text style={styles.detailTitleText}>
                {t("date")}:{" "}
                <Text style={styles.intercityRevDateText}>{item.date}</Text>
              </Text>
            </View>

            <View style={styles.intercityMainAmountContainer}>
              <Text style={styles.mainPrice}>${item.total_driver_fee}</Text>
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
        </View>
      </View>
    );
  };

  const renderIntracityRevenue = ({ item, index }) => {
    return (
      <View style={styles.intercityRevenueTabArea}>
        <View style={styles.intercityRevenueTab}>
          <View style={styles.tabHeaderArea}>
            <View style={styles.iconContainer}>
              <Image source={Images.route_icon} style={styles.tabIcon} />
            </View>

            <View style={styles.intercityRevHeaderTextContainer}>
              <Text style={styles.driverFeesTitle}>
                {t("driver_fees")}:{item.total_driver_fee}
              </Text>
              <Text style={styles.detailTitleText}>
                {t("ride_date")}:{" "}
                <Text style={styles.intercityRevDateText}>{item.date}</Text>
              </Text>
            </View>

            <View style={styles.intercityMainAmountContainer}>
              <Text style={styles.mainPrice}>${item.total_driver_fee}</Text>
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
        <ModalProgressLoader visible={isLoading} />
        <View style={{ flexGrow: 1, backgroundColor: Colors.white }}>
          <Header
            title={t("payment_history")}
            goBack={() => navigation.goBack()}
          />

          <ScrollView contentContainerStyle={styles.container}>
            <ImageBackground
              source={Images.payment_history_bg}
              style={styles.headerImageContainer(selectedCategoryType)}
            >
              <View style={styles.dropdownTab}>
                <SelectDropdown
                  ref={dropDownTypeRef}
                  style={{ width: "100%" }}
                  data={category}
                  // defaultValue={category}
                  onSelect={(selectedItem) => {
                    setSearchText("")
                    setSelectedCategoryType(selectedItem.value);
                    setSelectedCategory(selectedItem);
                    fetchData(selectedItem.value);
                  }}
                  renderButton={(selectedItem) => {
                    return (
                      <View style={styles.dropSelectedItemContainer}>
                        <Text style={styles.dropDownSelectedItemText}>
                          {(selectedItem && selectedItem.label) ||
                            selectedCategory}
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

              <View style={styles.priceTextContainer}>
                <Text style={styles.dollar}>$</Text>
                <Text style={styles.headerAmountText}>{amount()}</Text>
              </View>
            </ImageBackground>

            {selectedCategoryType !== 1 && (
              <View style={styles.searchContainer}>
                <View style={styles.searchInputArea}>
                  <Image source={Images.search_icon} style={styles.seachIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder={t("search")}
                    placeholderTextColor={Colors.primary}
                    onChangeText={(text) => setSearchText(text)}
                    onSubmitEditing={() => fetchData(selectedCategoryType)}
                  />
                </View>
              </View>
            )}

            {(selectedCategoryType === 1 &&
              withdrawbalanceHistory &&
              withdrawbalanceHistory?.length > 0) ||
            selectedCategoryType === 2 ? (
              <>
                <View style={styles.titleTabContainer}>
                  <Text style={styles.categoryTitle}>
                    {t("withdraw_balance")}
                  </Text>
                  {selectedCategoryType === 1 ? (
                    <Text
                      style={styles.viewAllBtn}
                      onPress={() => {
                        setSelectedCategory(t("withdraw_balance"));
                        setSelectedCategoryType(2);
                        dropDownTypeRef.current.selectIndex(1)
                        fetchData(2);
                      }}
                    >
                      {withdrawbalanceHistory?.length === 0
                        ? ""
                        : t("view_all")}
                    </Text>
                  ) : null}
                </View>

                {withdrawbalanceHistory?.length === 0 ? (
                  <Text style={styles.blankDataText}>{t("no_data_found")}</Text>
                ) : (
                  <FlatList
                    style={{ width: "100%" }}
                    data={withdrawbalanceHistory}
                    onMomentumScrollBegin={() => {
                      if (selectedCategoryType === 2) {
                        isPagingCalled = false;
                      }
                    }}
                    onEndReached={() => {
                      if (selectedCategoryType === 2) {
                        handleWithDrawEndReached();
                      }
                    }}
                    onEndReachedThreshold={0.5}
                    renderItem={renderTotalRevenue}
                    ListFooterComponent={() => {
                      if (selectedCategoryType === 2) {
                        withDrawPage > 1 && withDrawLoading && (
                          <ActivityIndicator
                            animating
                            size={ScaleSize.spacing_medium * 2}
                            color={Colors.gray}
                          />
                        );
                      }
                    }}
                    keyExtractor={(item, index) => index}
                  />
                )}
              </>
            ) : null}

            {(selectedCategoryType === 1 &&
              intercityPaymentHistory &&
              intercityPaymentHistory?.length !== 0) ||
              selectedCategoryType === 3 ? 
                <>
                  <View style={styles.titleTabContainer}>
                    <Text style={styles.categoryTitle}>
                      {t("intercity_revenue")}
                    </Text>
                    {selectedCategoryType === 1 ? (
                      <Text
                        style={styles.viewAllBtn}
                        onPress={() => {
                          setSelectedCategory(t("intercity_revenue"));
                          setSelectedCategoryType(3);
                          fetchData(3);
                          dropDownTypeRef.current.selectIndex(2)
                        }}
                      >
                        {intercityPaymentHistory?.length === 0 ||
                        intercityPaymentHistory?.length === undefined
                          ? ""
                          : t("view_all")}
                      </Text>
                    ) : null}
                  </View>

                  {intercityPaymentHistory?.length === 0 ||
                  intercityPaymentHistory?.length === undefined ? (
                    <Text style={styles.blankDataText}>
                      {t("no_data_found")}
                    </Text>
                  ) : (
                    <View
                      style={{
                        paddingTop: ScaleSize.spacing_minimum * 3,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <FlatList
                        style={{ width: "100%" }}
                        data={intercityPaymentHistory}
                        onMomentumScrollBegin={() => {
                          if (selectedCategoryType === 3) {
                            isPagingCalled = false;
                          }
                        }}
                        onEndReached={() => {
                          if (selectedCategoryType === 3) {
                            handleIntercityEndReached();
                          }
                        }}
                        onEndReachedThreshold={0.5}
                        renderItem={renderIntercityRevenue}
                        ListFooterComponent={() =>
                          selectedCategoryType === 3 && intercityRevenuePage > 1 &&
                          intercityRevenueLoading && (
                            <ActivityIndicator
                              animating
                              size={ScaleSize.spacing_medium * 2}
                              color={Colors.gray}
                            />
                          )
                        }
                        keyExtractor={(item, index) => index}
                      />
                    </View>
                  )}
                </> : null
              }

            {(selectedCategoryType === 1 &&
              intracityPaymentHistory &&
              intracityPaymentHistory?.length > 0) ||
            selectedCategoryType === 4 ? (
              <>
                <View style={styles.titleTabContainer}>
                  <Text style={styles.categoryTitle}>
                    {t("intracity_revenue")}
                  </Text>
                  {selectedCategoryType === 1 ? (
                    <Text
                      style={styles.viewAllBtn}
                      onPress={() => {
                        setSelectedCategory(t("intracity_revenue"));
                        setSelectedCategoryType(4);
                        fetchData(4);
                        dropDownTypeRef.current.selectIndex(3)
                      }}
                    >
                      {intracityPaymentHistory?.length === 0 ||
                      intracityPaymentHistory?.length === undefined
                        ? ""
                        : t("view_all")}
                    </Text>
                  ) : null}
                </View>

                {intracityPaymentHistory?.length === 0 ||
                intracityPaymentHistory?.length === undefined ? (
                  <Text style={styles.blankDataText}>{t("no_data_found")}</Text>
                ) : (
                  <View
                    style={{
                      paddingTop: ScaleSize.spacing_minimum * 3,
                      width: "100%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <FlatList
                      style={{ width: "100%" }}
                      data={intracityPaymentHistory}
                      onMomentumScrollBegin={() => {
                        if (selectedCategoryType === 4) {
                          isPagingCalled = false;
                        }
                      }}
                      onEndReached={() => {
                        if (selectedCategoryType === 4) {
                          handleIntracityEndReached();
                        }
                      }}
                      onEndReachedThreshold={0.5}
                      renderItem={renderIntracityRevenue}
                      ListFooterComponent={() =>
                        intracityRevenuePage > 1 &&
                        intracityRevenueLoading && (
                          <ActivityIndicator
                            animating
                            size={ScaleSize.spacing_medium * 2}
                            color={Colors.gray}
                          />
                        )
                      }
                      keyExtractor={(item, index) => index}
                    />
                  </View>
                )}
              </>
            ) : null}

            {/* {selectedCategoryType === 2 && (
              <>
                <View style={styles.titleTabContainer}>
                  <Text style={styles.categoryTitle}>
                    {t("withdraw_balance")}
                  </Text>
                </View>
                {withdrawbalanceHistory?.length === 0 ? (
                  <Text style={styles.noDataText}>{t("no_data_found")}</Text>
                ) : (
                  <FlatList
                    style={{ width: "100%" }}
                    data={withdrawbalanceHistory}
                    onMomentumScrollBegin={() => {
                      isPagingCalled = false;
                    }}
                    onEndReached={() => handleWithDrawEndReached()}
                    onEndReachedThreshold={0.5}
                    renderItem={renderTotalRevenue}
                    ListFooterComponent={() =>
                      withDrawPage > 1 &&
                      withDrawLoading && (
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
              </>
            )} */}

            {/* {selectedCategoryType === 3 && (
              <>
                <View style={styles.titleTabContainer}>
                  <Text style={styles.categoryTitle}>
                    {t("intercity_revenue")}
                  </Text>
                </View>
                {intercityPaymentHistory?.length === 0 ||
                intercityPaymentHistory?.length === undefined ? (
                  <Text style={styles.noDataText}>{t("no_data_found")}</Text>
                ) : (
                  <FlatList
                    style={{ width: "100%" }}
                    data={intercityPaymentHistory}
                    onMomentumScrollBegin={() => {
                      isPagingCalled = false;
                    }}
                    onEndReached={() => handleIntercityEndReached()}
                    onEndReachedThreshold={0.5}
                    renderItem={renderIntercityRevenue}
                    ListFooterComponent={() =>
                      intercityRevenuePage > 1 &&
                      intercityRevenueLoading && (
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
              </>
            )} */}

            {/* {selectedCategoryType === 4 && (
              <>
                <View style={styles.titleTabContainer}>
                  <Text style={styles.categoryTitle}>
                    {t("intracity_revenue")}
                  </Text>
                </View>

                {intracityPaymentHistory?.length === 0 ||
                intracityPaymentHistory?.length === undefined ? (
                  <Text style={styles.noDataText}>{t("no_data_found")}</Text>
                ) : (
                  <FlatList
                    style={{ width: "100%" }}
                    data={intracityPaymentHistory}
                    onMomentumScrollBegin={() => {
                      isPagingCalled = false;
                    }}
                    onEndReached={() => handleIntracityEndReached()}
                    onEndReachedThreshold={0.5}
                    renderItem={renderIntracityRevenue}
                    ListFooterComponent={() =>
                      intracityRevenuePage > 1 &&
                      intracityRevenueLoading && (
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
              </>
            )} */}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: ScaleSize.spacing_large,
    alignItems: "center",
    paddingBottom: ScaleSize.spacing_extra_large,
    backgroundColor: Colors.white,
  },
  headerImageContainer: (selectedCategoryType) => ({
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    height: ScaleSize.spacing_extra_large * 3,
    resizeMode: "contain",
    width: "100%",
    borderRadius: ScaleSize.primary_border_radius - 4,
    marginBottom:
      selectedCategoryType === 1
        ? ScaleSize.spacing_medium
        : ScaleSize.spacing_extra_large + 5,
  }),
  noDataText: {
    color: Colors.gray,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.semi_medium_text - 1,
    top: ScaleSize.spacing_extra_large * 2.5,
    alignSelf: "center",
  },
  blankDataText: {
    color: Colors.gray,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.semi_medium_text - 3,
    marginVertical: 5,
    alignSelf: "center",
  },
  searchContainer: {
    justifyContent: "flex-end",
    backgroundColor: "#d0eeed",
    alignItems: "center",
    overflow: "hidden",
    position: "absolute",
    top: ScaleSize.spacing_large * 1.8,
    height: ScaleSize.spacing_extra_large * 3,
    resizeMode: "contain",
    width: "100%",
    borderRadius: ScaleSize.primary_border_radius - 4,
  },
  searchInputArea: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  seachIcon: {
    tintColor: Colors.primary,
    height: ScaleSize.small_icon,
    width: ScaleSize.small_icon,
  },
  searchInput: {
    fontFamily: AppFonts.semi_bold,
    top: ScaleSize.font_spacing,
    flex: 0.3,
    left: ScaleSize.spacing_very_small,
    fontSize: TextFontSize.small_text,
    color: Colors.primary,
    alignSelf: "center",
    alignItems: "center",
  },
  priceTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_large,
  },
  dollar: {
    color: Colors.white,
    fontSize: TextFontSize.medium_text,
    marginHorizontal: ScaleSize.spacing_small,
  },
  headerAmountText: {
    color: Colors.white,
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.large_text * 1.6,
  },
  dropdownTab: {
    paddingHorizontal: ScaleSize.spacing_large,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "100%",
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
    height: ScaleSize.spacing_semi_medium,
    width: ScaleSize.spacing_semi_medium,
    resizeMode: "contain",
    tintColor: Colors.white,
  },
  dropDownStyle: {
    width: "50%",
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
    textAlign: "center",
    alignSelf: "flex-start",
    justifyContent: "center",
    alignItems: "center",
    top: ScaleSize.font_spacing,
    fontSize: TextFontSize.medium_text,
    fontFamily: AppFonts.regular,
    color: Colors.white,
    margin: ScaleSize.spacing_very_small,
  },
  titleTabContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  categoryTitle: {
    color: Colors.black,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text + 1,
  },
  viewAllBtn: {
    color: Colors.primary,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
  },
  withDrawTabArea: {
    flex: 1,
  },
  withDrawTab: {
    flex: 1,
    flexDirection: "row",
    padding: ScaleSize.spacing_small + 2,
    borderWidth: ScaleSize.smallest_border_width,
    borderRadius: ScaleSize.small_border_radius,
    borderColor: Colors.light_gray,
    alignItems: "center",
    marginVertical: ScaleSize.spacing_very_small,
  },
  withDrawTabAmountContainer: {
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: ScaleSize.spacing_small,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: ScaleSize.tab_profile_icon - 2,
    width: ScaleSize.tab_profile_icon - 2,
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize.small_border_radius - 2,
  },
  tabIcon: {
    height: ScaleSize.large_icon * 1.5,
    width: ScaleSize.large_icon * 1.5,
    tintColor: "white",
  },
  transferAmountTitle: {
    color: Colors.black,
    marginVertical: -1,
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.very_small_text - 2,
  },
  detailText: {
    color: Colors.black,
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.very_small_text - 4,
  },
  detailTitleText: {
    marginVertical: -1,
    color: Colors.black,
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text - 4,
  },
  mainAmountContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    position: "absolute",
    right: ScaleSize.spacing_small + 2,
  },
  mainPrice: {
    color: Colors.primary,
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.large_text,
    bottom: ScaleSize.spacing_very_small - 1,
  },
  withDrawTabDate: {
    fontFamily: AppFonts.medium_italic,
    color: Colors.gray,
    fontSize: TextFontSize.very_small_text - 5,
    bottom: ScaleSize.spacing_very_small - 1,
  },
  intercityRevenueTabArea: {
    justifyContent: "center",
    alignItems: "center",
  },
  intercityRevenueTab: {
    width: "100%",
    padding: ScaleSize.spacing_semi_medium - 2,
    borderWidth: ScaleSize.smallest_border_width,
    marginVertical: ScaleSize.spacing_small,
    borderRadius: ScaleSize.medium_border_radius,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  tabHeaderArea: {
    flexDirection: "row",
    width: "100%",
  },
  driverFeesTitle: {
    color: Colors.black,
    marginVertical: -1,
    fontFamily: AppFonts.bold,
    fontSize: TextFontSize.very_small_text - 1,
  },
  intercityRevDateText: {
    fontFamily: AppFonts.medium_italic,
    color: Colors.gray,
    fontSize: TextFontSize.very_small_text - 3,
  },
  intercityRevHeaderTextContainer: {
    justifyContent: "center",
    paddingHorizontal: ScaleSize.spacing_small,
  },
  intercityMainAmountContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    position: "absolute",
    top: ScaleSize.spacing_small,
    right: 0,
  },
  tabFooterArea: {
    flex: 1,
    flexDirection: "row",
    marginTop: ScaleSize.spacing_small,
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
  sepraterLine: {
    height: ScaleSize.spacing_medium - 4,
    borderRightWidth: ScaleSize.spacing_minimum + 1,
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
});
