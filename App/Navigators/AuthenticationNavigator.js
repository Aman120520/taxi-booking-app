import React from "react";
import WelcomeScreen from "../Screens/Authentications/OnBoardingScreen/WelcomeScreen";
import OnBoardingScreen from "../Screens/Authentications/OnBoardingScreen/OnBoardingScreen";
import SignInScreen from "../Screens/Authentications/SignInScreen";
import ForgotPasswordScreen from "../Screens/Authentications/ForgotPasswordScreen";
import SignUpScreen from "../Screens/Authentications/SignUpScreen";
import Webview from "../Screens/Authentications/TermsAndConditionScreens";
import MobileVerification from "../Screens/Authentications/MobileVerification";
import RoleSelection from "../Screens/Authentications/RoleSelection";
import BecomeDriverScreen from "../Screens/Authentications/Driver/BecomeDriverScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const AuthenticationNavigator = () => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="Webview" component={Webview} />
        <Stack.Screen
          name="MobileVerification"
          component={MobileVerification}
        />
        <Stack.Screen name="RoleSelection" component={RoleSelection} />
        <Stack.Screen
          name="BecomeDriverScreen"
          component={BecomeDriverScreen}
        />
        <Stack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
        />
      </Stack.Navigator>
    </>
  );
};

export default AuthenticationNavigator;
