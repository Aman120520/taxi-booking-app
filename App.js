import React, { useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import AppNavigator from "./App/Navigators/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef, isReadyRef } from "./App/Navigators/NavigationHelper";
import { StripeProvider } from "@stripe/stripe-react-native";
import Constant from "./App/Network/Constant";

const App = () => {
  useEffect(() => {
    return () => {
      isReadyRef.current = false;
    };
  }, []);

  return (
    <StripeProvider
      publishableKey={Constant.PUBLISH_KEY}
      urlScheme={Constant.BASE_URl}
      threeDSecureParams={{
        backgroundColor: "#FFFFFF", // iOS only
        timeout: 5,
        label: {
          headingTextColor: "#000000",
          headingFontSize: 13,
        },
        navigationBar: {
          headerText: "3d secure",
        },
        footer: {
          // iOS only
          backgroundColor: "#FFFFFF",
        },
        submitButton: {
          backgroundColor: "#000000",
          cornerRadius: 12,
          textColor: "#FFFFFF",
          textFontSize: 14,
        },
      }}
    >
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}
      >
        <AppNavigator navigationRef={navigationRef} />
      </NavigationContainer>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default App;
