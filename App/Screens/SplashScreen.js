import { Image, StatusBar, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { Colors, Images } from "../Resources";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { userDetails } from "../Actions/authentication";
import { useDispatch } from "react-redux";
import Utils from "../Helpers/Utils";

const SplashScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  ///////// UseEffect ///////////
  useEffect(() => {
    dispatch({ type: 'RESET_STATE' });

    setTimeout(() => {
      getUser();
    }, 2000);
  });

  const handleNotificationRedirect = async () => {
    const rideId = await AsyncStorage.getItem("@rideId");
    if (rideId) {
      navigation.reset("IntracityRideDetailsScreen", {
        isFromMyBookings: true,
        isRider: false,
        ride_id: JSON.parse(rideId),
        is_bold: false,
        isFromNotification: true,
      });
    } else {
      handleTabNavigation();
    }
  };

  const handleTabNavigation = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
      };
      if (await Utils.isNetworkConnected()) {
        dispatch(
          userDetails(body, async (data, isSuccess) => {
            if (isSuccess === true) {
              //await AsyncStorage.setItem("@userData", JSON.stringify(data.data));
              navigation.replace("BottomTabNavigator");
            } else {
              navigation.replace("AuthenticationNavigator");
            }
          })
        );
      } else {
        navigation.replace("BottomTabNavigator");
      }
    } catch {}
  };

  const getUser = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      if (UserId === null) {
        navigation.replace("AuthenticationNavigator");
      } else if (UserId !== null && !Utils.isNetworkConnected()) {
        navigation.replace("BottomTabNavigator");
      } else {
        const isNotification = await AsyncStorage.getItem("@isNotification");
        if (isNotification === "true") {
          await AsyncStorage.removeItem("@isNotification");
          handleNotificationRedirect();
        } else {
          handleTabNavigation();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.splash_screen}
        barStyle={"light-content"}
      />
      <Image source={Images.splash_screen_logo} style={styles.splash_logo} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.splash_screen,
    justifyContent: "center",
    alignItems: "center",
  },
  splash_logo: {
    height: "30%",
    width: "50%",
    resizeMode: "contain",
  },
});
