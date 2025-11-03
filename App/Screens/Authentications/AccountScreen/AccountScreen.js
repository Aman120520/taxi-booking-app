import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import React, { useState, memo } from "react";
import { TextButton, ModalProgressLoader } from "../../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  driverDetails,
  userDetails,
} from "../../../Actions/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import {
  changePayoutStatus,
  changeRole,
  getPaidAccountDetails,
  subscriptionCancel,
} from "../../../Actions/Settings";
import MenuItem from "../../../Components/Account/MenuItem";
import AlertBox from "../../../Components/Comman/AlertBox";
import Utils from "../../../Helpers/Utils";
import SubscriptionPopup from "../../Comman/SubscriptionPopup";

const AccountScreen = memo(({ navigation, route }) => {
  const dispatch = useDispatch();
  const [subModal, setSubModal] = useState(false);
  const { userData, isLoading } = useSelector((state) => state.Authentication);
  const { getPaidAccData } = useSelector((state) => state.Settings);
  const { t, i18n } = useTranslation();
  const [isAlertShow, setIsAlertShow] = useState(false);
  const [isSocialLogin, setSocialLogin] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [subsciptionAlert, setSubscriptionAlert] = useState(false);
  const [suspentionAlert, setSuspentionAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [iseLoadingScreen, setLoading] = useState(false);

  //////////////// useEffect ////////////////

  useFocusEffect(
    React.useCallback(() => {
      roleDetails();
      if (userData.is_driver !== 0 && userData.driver_status !== 0) {
        getDriverData(false);
      }
      if (userData.driver_suspend === 1) {
        getUserData();
      }
    }, [])
  );

  const roleDetails = async () => {
    try {
      const userPlatform = await AsyncStorage.getItem("@isSocialLogin");
      if (userPlatform) {
        setSocialLogin(true);
      } else {
        setSocialLogin(false);
      }
    } catch {}
    fetchData();
  };

  const getDriverData = async (isEditProfile) => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
      };
      dispatch(
        driverDetails(body, (data, isSuccess) => {
          if (isSuccess === true) {
            setIsEnabled(data?.data?.is_payout_fee === 1 ? true : false);
            if (isEditProfile) {
              setTimeout(
                () => {
                  navigation.navigate("EditDriverProfile");
                },
                Platform.OS === "ios" ? 1000 : 500
              );
            }
          }
        })
      );
    } catch {}
  };

  const getUserData = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
      };
      dispatch(
        userDetails(body, async (data, isSuccess) => {
          if (isSuccess === true) {
          }
        })
      );
    } catch {}
  };

  //////////////// Screen Options //////////////////
  const optionsData = [
    { icon: Images.edit_profile, text: t("edit_profile"), key: "1" },
    {
      icon:
        userData.user_type === 0
          ? userData.is_driver === 0
            ? Images.become_driver
            : Images.driver_profile
          : Images.switch_to_rider,
      text:
        userData.user_type === 0
          ? userData.is_driver === 0
            ? t("become_driver")
            : t("switch_to_driver")
          : t("switch_to_rider"),
      key: "2",
    },
    ...(!isSocialLogin
      ? [{ icon: Images.change_password, text: t("change_password"), key: "3" }]
      : []),
    {
      icon: Images.referral_code,
      text: t("placeholder_referral_code_"),
      key: "4",
    },
    { icon: Images.language_tab_icon, text: t("choose_language"), key: "5" },
    // {
    //   icon: Images.account_user_verify,
    //   text:
    //     userData?.persona_verification_status !== 1
    //       ? t("verify_identity")
    //       : t("identity_verified"),
    //   key: "11",
    //   isHideRightArrow:
    //     userData?.persona_verification_status !== 1 ? true : false,
    // },
  ];

  const secondOptionsData = [
    { icon: Images.driver_profile, text: t("driver_profile"), key: "6" },
    { icon: Images.get_paid, text: t("get_paid"), key: "7" },
    { icon: Images.payment_history, text: t("payment_history"), key: "8" },
  ];

  const thirdOptionsData =
    // ? [{ icon: Images.email_us, text: t("email_us"), key: "9", isBack: true }]
    // :
    [
      ...(userData.is_subscription === 1 && userData.user_type === 1
        ? [
            {
              icon: Images.email_us,
              text: t("contact_support"),
              key: "9",
              isBack: true,
            },
            {
              icon: Images.cancel_subscription,
              text: t("cancel_subscription"),
              key: "10",
              isBack: false,
            },
          ]
        : [
            {
              icon: Images.email_us,
              text: t("contact_support"),
              key: "9",
              isBack: true,
            },
          ]),
    ];

  //////////////// Function for Navigation //////////////////
  async function handleNavigation(item) {
    switch (item.key) {
      case "1":
        navigation.navigate("EditProfileScreen", { isRider: false });
        break;
      case "2":
        handleSwitch();
        break;
      case "3":
        navigation.navigate("ChangePasswordScreen", { isRider: false });
        break;
      case "4":
        navigation.navigate("ReferralCodeScreen", { isRider: false });
        break;
      case "5":
        navigation.navigate("CommunicationLanguage", { isRider: false });
        break;
      case "6":
        getDriverData(true);
        break;
      case "7":
        if (userData?.is_subscription === 0) {
          setSubModal(true);
        } else {
          // navigation.navigate("GetPaidScreen");
          console.log("getPaidAccData ==> ", getPaidAccData);
          navigation.navigate(
            getPaidAccData ? "GetPaidDetailsScreen" : "GetPaidScreen"
          );
        }
        break;
      case "8":
        if (userData?.is_subscription === 0) {
          setSubModal(true);
        } else {
          navigation.navigate("PaymentHistory");
        }
        break;
      case "9":
        navigation.navigate("EmailUsScreen");
        break;
      case "10":
        setAlertMsg(t("subscription_cancel_alert"));
        setSubscriptionAlert(true);
        break;
      case "11":
        if (userData?.persona_verification_status === 0) {
          navigation.navigate("VerifyIdentityScreen", {
            isFromAccountScreen: true,
          });
        }
        break;
      default:
        break;
    }
  }

  const fetchData = async () => {
    try {
      if (Utils.isNetworkConnected()) {
        const UserId = await AsyncStorage.getItem("@id");
        var body = {
          user_id: UserId,
        };
        dispatch(
          getPaidAccountDetails(body, (data, isSuccess) => {
            if (isSuccess) {
              console.log(getPaidAccData);
            }
          })
        );
      }
    } catch {}
  };

  const handleSwitch = async () => {
    if (await Utils.isNetworkConnected()) {
      setLoading(true);
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
      };
      dispatch(
        userDetails(body, async (data, isSuccess) => {
          if (isSuccess === true && data && data.data) {
            var isValid = true;
            var userInfo = data?.data;
            if (userInfo.is_driver === 0) {
              setLoading(false);
              setTimeout(
                () => {
                  if (userInfo.persona_verification_status === 0) {
                    navigation.navigate("VerifyIdentityScreen", {
                      isFromGetBecomeDriver: true,
                    });
                  } else {
                    navigation.navigate("AuthenticationNavigator", {
                      screen: "BecomeDriverScreen",
                      params: { isFromAccountScreen: true },
                    });
                  }
                },
                Platform.OS === "ios" ? 1000 : 0
              );
              return;
            } else if (userInfo.driver_suspend === 1) {
              isValid = false;
              setAlertMsg(t("account_suspend_message"));
              setSuspentionAlert(true);
            } else if (
              userInfo.is_driver === 1 &&
              userInfo.driver_status === 0
            ) {
              isValid = false;
              setAlertMsg(t("pending_account_approval"));
              setSuspentionAlert(true);
            }
            if (isValid) {
              const UserId = await AsyncStorage.getItem("@id");
              var body = {
                role: userInfo.user_type === 0 ? 1 : 0,
                user_id: UserId,
              };
              dispatch(
                changeRole(body, navigation, (isSuccess) => {
                  setLoading(false);
                })
              );
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        })
      );
    }
  };

  /////////////// Fuction for Logout ///////////////
  const handleLogout = async () => {
    try {
      const userId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: userId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          logout(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              handleLogoutSuccess(data, isSuccess);
            }
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogoutSuccess = async (data, isSuccess) => {
    await AsyncStorage.clear();
    setTimeout(
      () => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "AuthenticationNavigator",
              state: {
                routes: [
                  {
                    name: "SignInScreen",
                  },
                ],
              },
            },
          ],
        });
      },
      Platform.OS === "ios" ? 1000 : 0
    );
  };

  const cancelSubscription = async () => {
    try {
      if (Utils.isNetworkConnected()) {
        const UserId = await AsyncStorage.getItem("@id");
        var body = {
          user_id: UserId,
        };
        dispatch(
          subscriptionCancel(body, (data, isSuccess) => {
            if (isSuccess) {
              setAlertMsg(data.message);
              var body = {
                user_id: UserId,
              };
              dispatch(
                userDetails(body, async (data, isSuccess) => {
                  if (isSuccess === true) {
                    setSuspentionAlert(true);
                  }
                })
              );
            }
          })
        );
      }
    } catch {}
  };

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    handlePayout();
  };

  const isFocused = useIsFocused();

  const handlePayout = async () => {
    try {
      if (Utils.isNetworkConnected()) {
        const UserId = await AsyncStorage.getItem("@id");
        var body = {
          user_id: UserId,
          is_payout_fee: isEnabled ? 0 : 1,
        };
        await dispatch(
          changePayoutStatus(body, (data, isSuccess) => {
            if (isSuccess) {
              console.log("SuCCESS");
            } else {
              setIsEnabled(!isEnabled);
            }
          })
        );
      }
    } catch {}
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar backgroundColor={Colors.white} barStyle={"dark-content"} />
        <ModalProgressLoader
          visible={(isLoading || iseLoadingScreen) && isFocused}
        />
        <View style={styles.topBar}>
          <Text style={styles.rideDetailsText}>{t("account")}</Text>
          <TextButton
            textStyle={styles.logoutText}
            buttonStyle={styles.logoutBtn}
            strings={t("logout")}
            onPress={() => {
              setIsAlertShow(true);
            }}
          />
        </View>
        <View style={styles.optionsArea}>
          <View style={styles.userNameArea}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {userData?.persona_verification_status === 1 ? (
                <View style={styles.tabIcon} />
              ) : null}
              <Text style={styles.userNameText}>{userData?.full_name}</Text>
              {userData?.persona_verification_status === 1 ? (
                <Image
                  source={Images.account_verified}
                  style={styles.tabIcon}
                />
              ) : null}
            </View>
            <Text style={styles.creditText}>
              {t("credit")}: ${userData?.credit}
            </Text>
          </View>

          <View style={styles.profile}>
            <View style={styles.innerProfileContainer}>
              <Image source={Images.shadow} style={styles.profileShadowImg} />
              <Image
                source={{ uri: userData.profile_picture }}
                style={styles.profileImg}
              />
            </View>
          </View>
          <MenuItem
            data={optionsData}
            handleNavigation={handleNavigation}
            isSocialLogin={isSocialLogin}
          />
        </View>
        {userData.user_type === 0 ? null : (
          <View style={styles.optionsSecondContainer}>
            <MenuItem
              data={secondOptionsData}
              handleNavigation={handleNavigation}
            />
            <TouchableOpacity style={styles.optionTab} onPress={toggleSwitch}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={Images.pay_out} style={styles.tabIcon} />
                <View>
                  <Text style={styles.optionText}>{t("same_day_payout")}</Text>
                  <Text style={styles.payoutDescription}>
                    {t("payout_description")}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
                <View
                  style={[
                    styles.switch,
                    isEnabled
                      ? styles.containerEnabled
                      : styles.containerDisabled,
                  ]}
                >
                  <View
                    style={[
                      styles.circle,
                      isEnabled ? styles.circleEnabled : styles.circleDisabled,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.optionsSecondContainer}>
          <MenuItem
            data={thirdOptionsData}
            handleNavigation={handleNavigation}
          />
        </View>
        <Text style={styles.versionText}>{t("version")}</Text>

        <AlertBox
          visible={isAlertShow}
          title={t("logout")}
          message={t("logout_alert_message")}
          positiveBtnText={t("logout")}
          negativeBtnText={t("cancel")}
          onPress={() => {
            setIsAlertShow(false);
            handleLogout();
          }}
          onPressNegative={() => setIsAlertShow(false)}
        />

        <AlertBox
          visible={subsciptionAlert}
          title={"Alert"}
          message={alertMsg}
          positiveBtnText={"OK"}
          negativeBtnText={t("cancel")}
          onPress={() => {
            cancelSubscription();
            setSubscriptionAlert(false);
          }}
          onPressNegative={() => setSubscriptionAlert(false)}
        />

        <AlertBox
          visible={suspentionAlert}
          message={alertMsg}
          positiveBtnText={"OK"}
          onPress={() => {
            setSuspentionAlert(false);
          }}
        />
      </ScrollView>

      <SubscriptionPopup
        visible={subModal}
        navigation={navigation}
        onClose={() => setSubModal(false)}
      />
    </SafeAreaView>
  );
});

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_large,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: ScaleSize.spacing_medium,
    marginBottom: ScaleSize.spacing_small,
  },
  rideDetailsText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text,
    color: Colors.black,
  },
  logoutText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.black,
    top: Platform.OS === "ios" ? 0 : ScaleSize.font_spacing,
  },
  logoutBtn: {
    flexDirection: "row",
    paddingHorizontal: ScaleSize.spacing_large,
    padding: ScaleSize.spacing_small,
    borderWidth: ScaleSize.smallest_border_width,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsArea: {
    width: "100%",
    marginTop: ScaleSize.spacing_large * 2,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_medium,
    paddingTop: ScaleSize.spacing_medium,
    paddingBottom: ScaleSize.spacing_semi_medium - 2,
    borderWidth: ScaleSize.smallest_border_width,
    borderColor: Colors.light_gray,
    borderRadius: ScaleSize.small_border_radius + 10,
  },
  optionsSecondContainer: {
    width: "100%",
    marginTop: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_medium,
    paddingTop: ScaleSize.spacing_small,
    borderWidth: ScaleSize.smallest_border_width,
    borderColor: Colors.light_gray,
    borderRadius: ScaleSize.small_border_radius + 10,
  },
  profile: {
    position: "absolute",
    top: -55,
    justifyContent: "center",
    alignItems: "center",
    height: ScaleSize.medium_image,
    width: ScaleSize.medium_image,
    borderRadius: ScaleSize.small_border_radius,
  },
  innerProfileContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  profileShadowImg: {
    position: "absolute",
    resizeMode: "contain",
    height: ScaleSize.medium_image,
    width: ScaleSize.medium_image,
    left: -12,
    bottom: -21,
    tintColor: "black",
  },
  profileImg: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    borderRadius: ScaleSize.small_border_radius + 5,
  },
  userNameArea: {
    alignItems: "center",
    marginTop: ScaleSize.spacing_very_large,
  },
  userNameText: {
    fontFamily: AppFonts.bold,
    marginHorizontal: ScaleSize.spacing_small / 2,
    marginTop: ScaleSize.spacing_very_small,
    color: Colors.black,
    fontSize: TextFontSize.medium_text,
  },
  creditText: {
    fontFamily: AppFonts.medium,
    color: Colors.black,
    bottom: Platform.OS === "ios" ? null : ScaleSize.spacing_small,
    fontSize: TextFontSize.very_small_text - 2,
  },
  optionTab: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_small,
    paddingTop: ScaleSize.spacing_small,
    paddingBottom: ScaleSize.spacing_semi_medium,
    justifyContent: "space-between",
  },
  tabIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    resizeMode: "contain",
    marginRight: ScaleSize.spacing_small,
  },
  optionText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
    left: ScaleSize.spacing_very_small,
    textAlign: "left",
    fontSize: TextFontSize.very_small_text,
  },
  payoutDescription: {
    fontFamily: AppFonts.medium,
    color: Colors.gray,
    bottom: Platform.OS === "ios" ? null : ScaleSize.spacing_very_small - 2,
    left: ScaleSize.spacing_very_small,
    textAlign: "left",
    fontSize: TextFontSize.extra_small_text - 3,
  },
  versionText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
    fontSize: TextFontSize.semi_medium_text - 2,
    marginVertical: ScaleSize.spacing_medium,
  },
  switch: {
    width: ScaleSize.large_icon * 2,
    height: ScaleSize.large_icon + 5,
    left: ScaleSize.spacing_small,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    padding: ScaleSize.spacing_very_small - 2,
  },
  containerEnabled: {
    backgroundColor: Colors.textinput_low_opacity,
  },
  containerDisabled: {
    backgroundColor: Colors.light_gray,
  },
  circle: {
    width: ScaleSize.small_icon,
    height: ScaleSize.small_icon,
    borderRadius: ScaleSize.primary_border_radius,
  },
  circleEnabled: {
    backgroundColor: Colors.primary,
    transform: [{ translateX: 20 }],
  },
  circleDisabled: {
    backgroundColor: Colors.white,
    transform: [{ translateX: 2 }],
  },
});
