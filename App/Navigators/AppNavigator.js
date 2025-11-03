import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  SafeAreaView
} from "react-native";
// import messaging from "@react-native-firebase/messaging";
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import PushNotification from "react-native-push-notification";
import SplashScreen from "../Screens/SplashScreen";
import AuthenticationNavigator from "./AuthenticationNavigator";
import BottomTabNavigator from "./BottomTabNavigator";
import IntercityRideDetailsScreen from "../Screens/Comman/Intercity/IntercityRideDetailsScreen";
import IntracityRideDetailsScreen from "../Screens/Comman/Intracity/IntracityRideDetailsScreen";
import RiderBookingDetails from "../Screens/Rider/Intercity/RiderBookingDetailsScreen";
import RiderBookingSummary from "../Screens/Rider/Intercity/RiderBookingSummaryScreen";
import RiderInvoice from "../Screens/Rider/Intercity/RiderInvoiceScreen";
import RiderReviewScreen from "../Screens/Comman/Intercity/RiderReviewScreen";
import ChangePasswordScreen from "../Screens/Authentications/AccountScreen/ChangePasswordScreen";
import EditProfileScreen from "../Screens/Authentications/AccountScreen/EditProfileScreen";
import CommunicationLanguage from "../Screens/Authentications/AccountScreen/CommunicationLanguage";
import DriverPostRideScreen from "../Screens/Driver/DriverPostRideScreen";
import RiderFooterSection from "../Components/RideDetails/Rider/RiderFooterSection";
import EditDriverProfile from "../Screens/Authentications/AccountScreen/EditDriverProfile";
import GetPaidScreen from "../Screens/Authentications/AccountScreen/GetPaidScreen";
import GetPaidDetailsScreen from "../Screens/Authentications/AccountScreen/GetPaidDetailsScreen";
import GetPaidUpdateDetailsScreen from "../Screens/Authentications/AccountScreen/GetPaidUpdateDetailsScreen";
import PaymentHistory from "../Screens/Authentications/AccountScreen/PaymentHistory";
import EmailUsScreen from "../Screens/Authentications/AccountScreen/EmailUsScreen";
import ReferralCodeScreen from "../Screens/Authentications/AccountScreen/ReferralCodeScreen";
import ReferralCodePopup from "../Screens/Comman/ReferralCodePopup";
import SubscriptionPopup from "../Screens/Comman/SubscriptionPopup";
import SubscriptionInvoice from "../Screens/Comman/SubscriptionInvoice";
import LocationDialog from "../Screens/Driver/Intracity/LocationDialog";
import RideRequestScreen from "../Screens/Rider/Intracity/RideRequestScreen";
import VerifyIdentityScreen from "../Screens/Authentications/VerifyIdentityScreen";
import Constant from "../Network/Constant";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Easing } from "react-native";

const Stack = createNativeStackNavigator();

const AppNavigator = ({ navigationRef }) => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async (remoteMessage) => {
  //     PushNotification.localNotification({
  //       channelId: "JunnoExpress",
  //       title: remoteMessage.notification.title,
  //       message: remoteMessage.notification.body,
  //       userInfo: remoteMessage.data,
  //     });
  //   });

  //   return unsubscribe;
  // }, []);

  // useEffect(() => {
  //   configurePushNotifications();
  // }, []);

  // const configurePushNotifications = () => {
  //   PushNotification.createChannel(
  //     {
  //       channelId: "JunnoExpress",
  //       channelName: "Junno Express Notifications",
  //       channelDescription: "Notifications for Junno Express app",
  //       soundName: "default",
  //       importance: 4,
  //       vibrate: true,
  //     },
  //     (created) => console.log(`createChannel returned '${created}'`)
  //   );

  //   PushNotification.configure({
  //     onRegister: function (token) {
  //       console.log("TOKEN:", token);
  //     },
  //     onNotification: function (notification) {
  //       console.log("NOTIFICATION RECEIVED:", notification);
  //       handleNotificationNavigation(notification);
  //     },
  //     onNotificationOpened: function (notification) {
  //       console.log("NOTIFICATION OPENED:", notification);
  //     },
  //     onAction: function (notification) {
  //       console.log("ACTION:", notification.action);
  //       console.log("NOTIFICATION:", notification);
  //     },
  //     onRegistrationError: function (err) {
  //       console.error("REGISTRATION ERROR:", err.message, err);
  //     },
  //     permissions: {
  //       alert: true,
  //       badge: true,
  //       sound: true,
  //     },
  //     popInitialNotification: true,
  //     requestPermissions: true,
  //     foreground: true,
  //   });
  // };

  const transitionSpec = {
    animation: "timing",
    config: {
      duration: 400,
      easing: Easing.out(Easing.poly(4)),
    },
  };

  const screenOptions = {
    gestureEnabled: true,
    headerShown: false,
    cardStyleInterpolator: ({ current }) => ({
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [1000, 0],
            }),
          },
        ],
      },
    }),
    transitionSpec: {
      open: transitionSpec,
      close: transitionSpec,
    },
  };

  // const handleNotificationNavigation = async (notification) => {
  //   console.log("NOTIFICATION:", notification);
  //   if (navigationRef.current) {
  //     await AsyncStorage.setItem(
  //       "@rideId",
  //       JSON.stringify(notification.data.ride_id)
  //     );
  //     await AsyncStorage.setItem("@isNotification", "true");
  //     dispatch({ type: Constant.CLEAR_RIDE_DETAILS_SUCCESS });
  //     navigationRef.current.navigate("IntracityRideDetailsScreen", {
  //       isFromMyBookings: true,
  //       isRider: false,
  //       ride_id: notification.ride_id,
  //       is_bold: false,
  //       isFromNotification: true,
  //     });
  //   }
  //   notification.finish(PushNotificationIOS.FetchResult.NoData);
  // };

  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...screenOptions,
        }}
      >
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen
          name="AuthenticationNavigator"
          component={AuthenticationNavigator}
        />
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />

        <Stack.Screen
          name="IntercityRideDetailsScreen"
          component={IntercityRideDetailsScreen}
        />
        <Stack.Screen
          name="IntracityRideDetailsScreen"
          component={IntracityRideDetailsScreen}
        />
        <Stack.Screen
          name="RiderFooterSection"
          component={RiderFooterSection}
        />
        <Stack.Screen
          name="RiderBookingDetails"
          component={RiderBookingDetails}
        />
        <Stack.Screen
          name="RiderBookingSummary"
          component={RiderBookingSummary}
        />
        <Stack.Screen name="RiderInvoice" component={RiderInvoice} />
        <Stack.Screen name="RiderReviewScreen" component={RiderReviewScreen} />
        <Stack.Screen name="RideRequestScreen" component={RideRequestScreen} />

        <Stack.Screen
          name="DriverPostRideScreen"
          component={DriverPostRideScreen}
        />
        <Stack.Screen name="LocationDialog" component={LocationDialog} />

        <Stack.Screen
          name="ChangePasswordScreen"
          component={ChangePasswordScreen}
        />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen
          name="CommunicationLanguage"
          component={CommunicationLanguage}
        />
        <Stack.Screen name="GetPaidScreen" component={GetPaidScreen} />
        <Stack.Screen
          name="GetPaidUpdateDetailsScreen"
          component={GetPaidUpdateDetailsScreen}
        />
        <Stack.Screen
          name="GetPaidDetailsScreen"
          component={GetPaidDetailsScreen}
        />
        <Stack.Screen
          name="VerifyIdentityScreen"
          component={VerifyIdentityScreen}
        />
        <Stack.Screen name="EditDriverProfile" component={EditDriverProfile} />
        <Stack.Screen
          name="ReferralCodeScreen"
          component={ReferralCodeScreen}
        />
        <Stack.Screen name="EmailUsScreen" component={EmailUsScreen} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
        <Stack.Screen name="ReferralCodePopup" component={ReferralCodePopup} />
        <Stack.Screen name="SubscriptionPopup" component={SubscriptionPopup} />
        <Stack.Screen
          name="SubscriptionInvoice"
          component={SubscriptionInvoice}
        />
      </Stack.Navigator>
    </>
  );
};

export default AppNavigator;
