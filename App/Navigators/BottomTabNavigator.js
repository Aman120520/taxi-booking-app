import {
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RiderIntercityHomeScreen from "../Screens/Rider/Intercity/RiderIntercityHomeScreen";
import DriverIntercityHomeScreen from "../Screens/Driver/Intercity/DriverIntercityHomeScreen";
import RiderMyBookingsScreen from "../Screens/Rider/RiderMyBookingsScreen";
import DriverMyBookingScreen from "../Screens/Driver/DriverMyBookingScreen";
import RiderIntracityScreen from "../Screens/Rider/Intracity/RiderIntracityScreen";
import DriverIntracityScreen from "../Screens/Driver/Intracity/DriverIntracityScreen";
import AccountScreen from "../Screens/Authentications/AccountScreen/AccountScreen";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../Resources";
import { userDetails } from "../Actions/authentication";
import NetInfo from "@react-native-community/netinfo";
import SubscriptionPopup from "../Screens/Comman/SubscriptionPopup";

const { width, height } = Dimensions.get("window");
const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { userData } = useSelector((state) => state.Authentication);
  const [subModal, setSubModal] = useState(false);

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      setIsConnected(state.isConnected);
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
      };
      dispatch(userDetails(body, async (data, isSuccess) => {}));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleTabPress = async (screen) => {
    if (!isConnected) {
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection."
      );
      return;
    }

    if (
      userData.user_type !== 0 &&
      userData?.is_subscription === 0 &&
      screen === "Intracity"
    ) {
      setSubModal(true);
    } else if (screen !== "My Bookings") {
      navigation.navigate(screen);
    }
    setTimeout(async () => {
      var is_phone_verify = await AsyncStorage.getItem("@is_phone_verify");
      if (is_phone_verify === "1" || userData?.is_phone_verify === 1) {
        navigation.navigate("AuthenticationNavigator", {
          screen: "MobileVerification",
          params: { isFromEditProfile: false, isFromMyBookings: false },
        });
      } else {
        if (
          userData.user_type !== 0 &&
          userData?.is_subscription === 0 &&
          (screen === "Intracity" || screen === "My Bookings")
        ) {
          setSubModal(true);
        } else {
          navigation.navigate(screen);
        }
      }
    }, 500);
  };
  return (
    <>
      <StatusBar backgroundColor={Colors.white} barStyle={"dark-content"} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
          tabBarStyle: {
            backgroundColor: Colors.white,
            // top: Platform.OS === 'ios' ? ScaleSize.spacing_large + 5 : null,
            width,
            height:
              Platform.OS === "ios"
                ? ScaleSize.spacing_very_large * 2.1
                : ScaleSize.tab_height,
            borderTopRightRadius: ScaleSize.semi_medium_radius,
            borderTopLeftRadius: ScaleSize.semi_medium_radius,
            justifyContent: "center",
            alignItems: "center",
            borderTopWidth: 0,
          },
        }}
      >
        <Tab.Screen
          listeners={{
            tabPress: (e) => {
              handleTabPress("Intercity");
              e.preventDefault();
            },
          }}
          options={{
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.black,
            tabBarShowLabel: true,
            tabBarLabelStyle: {
              fontFamily: AppFonts.medium,
              fontSize: TextFontSize.tabLabelText,
              bottom: ScaleSize.spacing_very_small,
            },
            tabBarIcon: ({ focused, color, size }) => (
              <>
                {focused ? (
                  <Image
                    source={Images.tab_navigator}
                    style={styles.navigatorIcon}
                  />
                ) : null}
                <Image
                  source={Images.intercity}
                  style={[
                    styles.tabIcon,
                    { tintColor: focused ? Colors.primary : Colors.black },
                  ]}
                />
              </>
            ),
          }}
          name={"Intercity"}
          component={
            userData.user_type === 0
              ? RiderIntercityHomeScreen
              : DriverIntercityHomeScreen
          }
        />

        <Tab.Screen
          listeners={{
            tabPress: (e) => {
              handleTabPress("Reserve");
              // alert("Coming soon");
              e.preventDefault();
            },
          }}
          options={{
            tabBarShowLabel: true,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.black,
            tabBarLabelStyle: {
              fontFamily: AppFonts.medium,
              fontSize: TextFontSize.tabLabelText,
              bottom: ScaleSize.spacing_very_small,
            },
            tabBarIcon: ({ focused, color, size }) => (
              <>
                {focused ? (
                  <Image
                    source={Images.tab_navigator}
                    style={styles.navigatorIcon}
                  />
                ) : null}
                <Image
                  source={Images.intracity}
                  style={[
                    styles.tabIcon,
                    { tintColor: focused ? Colors.primary : Colors.black },
                  ]}
                />
              </>
            ),
          }}
          name={"Reserve"}
          component={
            userData.user_type === 0
              ? RiderIntracityScreen
              : DriverIntracityScreen
          }
        />

        <Tab.Screen
          listeners={{
            tabPress: (e) => {
              handleTabPress("My Bookings");
              e.preventDefault();
            },
          }}
          options={{
            tabBarShowLabel: true,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.black,
            tabBarLabelStyle: {
              fontFamily: AppFonts.medium,
              fontSize: TextFontSize.tabLabelText,
              bottom: ScaleSize.spacing_very_small,
            },
            tabBarIcon: ({ focused, color, size }) => (
              <>
                {focused ? (
                  <Image
                    source={Images.tab_navigator}
                    style={styles.navigatorIcon}
                  />
                ) : null}
                <Image
                  source={Images.my_booking}
                  style={[
                    styles.tabIcon,
                    { tintColor: focused ? Colors.primary : Colors.black },
                  ]}
                />
              </>
            ),
          }}
          name={"My Bookings"}
          component={
            userData.user_type === 0
              ? RiderMyBookingsScreen
              : DriverMyBookingScreen
          }
        />

        <Tab.Screen
          options={{
            tabBarShowLabel: true,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.black,
            tabBarLabelStyle: {
              fontFamily: AppFonts.medium,
              fontSize: TextFontSize.tabLabelText,
              bottom: ScaleSize.spacing_very_small,
            },
            tabBarIcon: ({ focused }) => (
              <>
                {focused ? (
                  <Image
                    source={Images.tab_navigator}
                    style={styles.navigatorIcon}
                  />
                ) : null}
                <Image
                  source={Images.account}
                  style={[
                    styles.tabIcon,
                    { tintColor: focused ? Colors.primary : Colors.black },
                  ]}
                />
              </>
            ),
          }}
          name={"Account"}
          component={AccountScreen}
        />
      </Tab.Navigator>

      <SubscriptionPopup
        visible={subModal}
        navigation={navigation}
        onClose={() => setSubModal(false)}
      />
    </>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  tabIcon: {
    height: ScaleSize.tab_icon,
    width: ScaleSize.tab_icon,
    resizeMode: "contain",
  },
  navigatorIcon: {
    height: ScaleSize.extra_large_icon,
    width: ScaleSize.extra_large_icon * 2,
    resizeMode: "contain",
    position: "absolute",
    top: -3,
  },
});
