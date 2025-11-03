import { Alert, Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
import "moment-timezone";

export default class Utils {
  static async isNetworkConnected() {
    var isConnected = false;
    try {
      var network = await NetInfo.fetch();
      isConnected = network.isConnected;
    } catch (error) {}

    if (!isConnected) {
      alert("Please check your internet connection.");
    } else {
    }
    return isConnected;
  }

  static DialogBox = (text, text1) => {
    setTimeout(() => {
      Alert.alert(text, text1);
    }, 0);
  };

  static messageDialog = (message) => {
    setTimeout(
      () => {
        Alert.alert(message);
      },
      Platform.OS === "ios" ? 500 : 0
    );
  };

  static isStringNull = (text) => {
    const namev = /^[a-zA-Z\s]+$/;

    if (text === "" || text === null || text === "[]" || text === "null") {
      return true;
    } else if (namev.test(text) === false) {
      return false;
    } else {
      return false;
    }
  };

  static showRatingOptions = (selectedRating, t) => {
    if (selectedRating == 1) {
      return t("not_good");
    } else if (selectedRating == 2) {
      return t("could_be_better");
    } else if (selectedRating == 3) {
      return t("average");
    } else if (selectedRating == 4) {
      return t("pretty_good");
    } else if (selectedRating == 5) {
      return t("excellent");
    }
  };

  static amenitiesData = (t) => [
    {
      label: "medium_size_luggage",
      key: "medium_size_luggage",
      value: false,
    },
    { label: "large_luggage", key: "large_luggage", value: false },
    {
      label: "pet_in_cage_allowed",
      key: "pet_in_cage_allowed",
      value: false,
    },
    {
      label: "winter_tires_installed",
      key: "winter_tires_installed",
      value: false,
    },
  ];

  static getCurrentGreetings = (t) => {
    const currentTime = new Date().getHours();
    if (currentTime < 12) {
      return t("good_morning");
    } else if (currentTime < 18) {
      return t("good_afternoon");
    } else {
      return t("good_evening");
    }
  };

  static getGender = (genderType, t) => {
    if (genderType === 1) {
      return t("male");
    } else if (genderType === 2) {
      return t("female");
    } else {
      return t("other");
    }
  };

  static getCommunicationLanguage = (communication_language, t) => {
    if (communication_language === "1,2") {
      return t("english") + ", " + t("french");
    } else if (communication_language === "1" || communication_language === 1) {
      return t("english");
    } else {
      return t("french");
    }
  };

  static getIntercityStatus = (status, t) => {
    if (status === 1) {
      return t("booked");
    } else if (status === 2) {
      return t("completed");
    } else {
      return t("cancelled");
    }
  };

  static getIntracityStatus = (status, ride_status, t) => {
    if (ride_status === 0 || status === 0) {
      return t("cancelled");
    } else if (status === 1) {
      return t("booked");
    } else if (status === 2) {
      return t("started");
    } else if (status === 3) {
      return t("completed");
    } else if (status === 4) {
      return t("cancelled");
    } else {
      return t("pending");
    }
  };

  static isGreaterThanOneHour = (selectedTime) => {
    const oneHourFromNow = moment().add(1, "hours");
    const selectedTimeMoment = moment(selectedTime);
    return selectedTimeMoment.isSameOrAfter(oneHourFromNow);
  };

  static isGreaterThan30Minutes = (selectedTime, timeZone) => {
    if (timeZone) {
      const oneHourFromNow = moment().tz(timeZone).add(30, "minutes");
      const selectedTimeMoment = moment(selectedTime);
      return selectedTimeMoment.isSameOrAfter(oneHourFromNow);
    } else {
      const oneHourFromNow = moment().add(30, "minutes");
      const selectedTimeMoment = moment(selectedTime);
      return selectedTimeMoment.isSameOrAfter(oneHourFromNow);
    }
  };

  static isGreaterThan15Minutes = (selectedTime) => {
    const oneHourFromNow = moment().add(15, "minutes");
    const selectedTimeMoment = moment(selectedTime);
    return selectedTimeMoment.isSameOrAfter(oneHourFromNow);
  };

  static isValueStringNull = (text) => {
    const namev = /^[a-zA-Z\s]+$/;

    if (
      text === "" ||
      text === null ||
      text === "[]" ||
      text === "null" ||
      text === "undefined"
    ) {
      return true;
    } else if (namev.test(text) === false) {
      return false;
    } else {
      return false;
    }
  };

  static isNull(value) {
    return value === "" || value === undefined;
  }

  static isEmailValid(email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(email);
  }

  static isEmojis(value) {
    const emojiRegex =
      /\p{RI}\p{RI}|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(\u{200D}\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)+|\p{EPres}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})/gu;
    return emojiRegex.test(value);
  }

  static emojiRegex(value) {
    const emojiRegex =
      /\p{RI}\p{RI}|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?(\u{200D}\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?)+|\p{EPres}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})?|\p{Emoji}(\p{EMod}+|\u{FE0F}\u{20E3}?|[\u{E0020}-\u{E007E}]+\u{E007F})/gu;
    return value.replace(emojiRegex, "");
  }

  static isPasswordValid(password) {
    return password.length >= 6;
  }

  static isPhoneNumberValid(phoneNumber) {
    return phoneNumber.length >= 10;
  }

  static isCarYearValid(year, value) {
    const currentYear = new Date().getFullYear();
    return value >= year && value <= currentYear;
  }

  static isDriverAgeValid(value) {
    const currentDate = new Date();
    const dob = new Date(value);
    let age = currentDate.getFullYear() - dob.getFullYear();
    const monthDiff = currentDate.getMonth() - dob.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && currentDate.getDate() < dob.getDate())
    ) {
      age--;
    }

    return age >= 18;
  }
}
