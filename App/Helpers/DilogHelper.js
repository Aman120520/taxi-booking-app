import { Alert, Platform } from "react-native";
import Utils from "./Utils";
import { Strings } from "../Resources/Strings";
import AlertBox from "../Components/Comman/AlertBox";

export default class DialogHelper {
  static showMessage = (header, message) => {
    if (Platform.OS === "ios") {
      setTimeout(() => {
        Alert.alert(
          header,
          message,
          [
            {
              text: "OK",
              style: "default",
            },
          ],
          { cancelable: false }
        );
      }, 500);
    } else {
      Alert.alert(
        header,
        message,
        [
          {
            text: "OK",
            style: "default",
          },
        ],
        { cancelable: false }
      );
    }
  };

  static showAlertDialog = ({
    title,
    message,
    positiveBtnText,
    negativeBtnText,
    onPress,
  }) => {
    Alert.alert(title, message, [
      {
        text: negativeBtnText,
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: positiveBtnText,
        onPress: onPress,
      },
    ]);
  };

  static showAlertOkDialog = (title, message, positiveBtnText, onPress) => {
    Alert.alert(title, message, [
      {
        text: positiveBtnText,
        onPress: onPress,
      },
    ]);
  };

  static showAlert = (
    title,
    message,
    onPositivePress,
    positiveBtnText = "OK",
    negativeBtnText = "Cancel",
    onNegativePress
  ) => {
    AlertBox({
      visible: true,
      title: title,
      message: message,
      positiveBtnText: positiveBtnText,
      negativeBtnText: negativeBtnText,
      onPress: onPositivePress,
      onPressNegative: onNegativePress,
    });
  };

  static showAPIMessage = (response, action) => {
    var message = "";
    if (
      response &&
      response.hasOwnProperty("response") &&
      response.response &&
      response.response.hasOwnProperty("data") &&
      response.response.data &&
      response.response.data.hasOwnProperty("message") &&
      response.response.data.message
    ) {
      message = response.response.data.message;
    } else if (
      response &&
      response !== null &&
      response.hasOwnProperty("data") &&
      response.data &&
      response.data !== null &&
      response.data.hasOwnProperty("error_description") &&
      !Utils.isStringNull(response.data.error_description)
    ) {
      message = response.data.error_description;
    } else if (
      response &&
      response !== null &&
      response.hasOwnProperty("data") &&
      response.data &&
      response.data !== null &&
      response.data.hasOwnProperty("message") &&
      !Utils.isStringNull(response.data.message)
    ) {
      message = response.data.message;
    } else if (
      response &&
      response !== null &&
      response.hasOwnProperty("message") &&
      !Utils.isStringNull(response.message)
    ) {
      message = response.message;
    } else {
      message = Strings.some_thing_went_wrong_please_try_again_later;
    }
    if (
      message !== "Request failed with status code 401" &&
      message !== "Network Error" &&
      message !== "Invalid authorization token." && 
      message !== "Authorization token is required."
    ) {
      if (message !== "Request failed with status code 400") {
        if (Platform.OS === "ios") {
          setTimeout(() => {
            Alert.alert("", message);
          }, 500);
        } else {
          Alert.alert("", message);
        }
      }
    }
  };
}
