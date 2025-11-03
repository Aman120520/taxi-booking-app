import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { Calendar } from "react-native-calendars";
import { useTranslation } from "react-i18next";

const DateTimePicker = (props) => {
  const [openDate, setOpenDate] = useState(false);
  const [shakeAnimation] = useState(new Animated.Value(0));
  const [selectedDates, setSelectedDate] = useState(
    props.value instanceof Date ? props.value : new Date()
  );
  const [previousDate, setPreviousDate] = useState(
    props.value instanceof Date ? props.value : new Date()
  );

  const handleDateSelect = (day) => {
    const dateString = day.dateString;
    const newSelectedDates = { ...selectedDates };
    if (newSelectedDates[dateString]) {
      delete newSelectedDates[dateString];
    } else {
      newSelectedDates[dateString] = { selected: true };
    }
    setSelectedDate(newSelectedDates);
  };

  useEffect(() => {
    if (props.value instanceof Date) {
      setSelectedDate(props.value);
      setPreviousDate(props.value);
    }
  }, [props.value]);

  const handleDateChange = (date) => {
    const newDate = new Date(date);
    newDate.setHours(previousDate.getHours());
    newDate.setMinutes(previousDate.getMinutes());
    setSelectedDate(date);
  };

  const handleCancel = () => {
    setSelectedDate(previousDate);
    setOpenDate(false);
  };

  useEffect(() => {
    if (props.error) {
      shake();
    }
  }, [props.error]);

  const shake = () => {
    shakeAnimation.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const { t } = useTranslation();

  return (
    <>
      <TouchableOpacity
        style={[
          props.isCustom
            ? props.datePickerTabstyles
            : styles.datePickerAreaStyles(props.value),
          !props.isCustom && {
            backgroundColor:
              props.value && !props.error
                ? Colors.textinput_low_opacity
                : props.error
                ? Colors.white
                : null,
            borderColor: props.error ? Colors.red : Colors.primary,
            paddingLeft: props.IconSource
              ? ScaleSize.spacing_large
              : ScaleSize.spacing_small,
            transform: [
              {
                translateX: shakeAnimation.interpolate({
                  inputRange: [-10, 10],
                  outputRange: [-2, 2],
                }),
              },
            ],
          },
        ]}
        disabled={props.disabled}
        onPress={() => setOpenDate(true)}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          {props.IconSource ? (
            <Image
              style={[
                styles.dateIcon,
                { tintColor: props.error ? Colors.red : Colors.primary },
              ]}
              source={props.IconSource}
            />
          ) : null}
          {props.isOptional && !props.value ? (
            <Text
              style={[styles.textStyle, { color: Colors.black }]}
              onPress={() => setOpenDate(true)}
            >
              {props.placeholderText}{" "}
              <Text style={styles.optionalTextInline}>{t("(optional)")}</Text>
            </Text>
          ) : (
            <Text
              numberOfLines={1}
              style={[
                styles.textStyle,
                {
                  color:
                    props.value && !props.error ? Colors.primary : Colors.black,
                  left: props.IconSource
                    ? ScaleSize.spacing_very_small
                    : ScaleSize.spacing_semi_medium - 2,
                },
              ]}
            >
              {props.value
                ? props.isMultiple
                  ? Object.keys(props.value).length > 0 &&
                    Object.keys(props.value).join(", ")
                  : moment(props.value).format(
                      props.mode === "datetime"
                        ? "DD-MM-YYYY HH:mm"
                        : props.mode === "time"
                        ? "HH:mm"
                        : "DD-MM-YYYY"
                    )
                : props.placeholderText}
            </Text>
          )}
          {props.isMultiple ? (
            <Modal animationType="slide" transparent={true} visible={openDate}>
              <View style={styles.multipleDateSelectContainer}>
                <View style={styles.multipleDateSelectContainerModal}>
                  <Calendar
                    onDayPress={handleDateSelect}
                    markedDates={selectedDates}
                    minDate={new Date().toISOString().slice(0, 10)}
                    theme={{
                      backgroundColor: Colors.white,
                      calendarBackground: Colors.white,
                      textSectionTitleColor: Colors.primary,
                      selectedDayBackgroundColor: Colors.secondary,
                      selectedDayTextColor: Colors.white,
                      todayTextColor: Colors.primary,
                      textDayFontFamily: AppFonts.medium,
                      textDayFontSize: TextFontSize.small_text,
                      textDayHeaderFontFamily: AppFonts.semi_bold,
                      textDayHeaderFontSize: TextFontSize.very_small_text,
                      arrowColor: Colors.primary,
                      textMonthFontFamily: AppFonts.semi_bold,
                    }}
                    style={{
                      fontFamily: AppFonts.medium,
                    }}
                  />
                  <View style={styles.buttonContainer}>
                    <Text
                      onPress={() => setOpenDate(false)}
                      style={styles.cancelText}
                    >
                      Cancel
                    </Text>
                    <TouchableOpacity
                      style={styles.multipleDateBtnContainer}
                      onPress={() => {
                        setOpenDate(false);
                        props.onConfirm(selectedDates);
                      }}
                    >
                      <Text style={styles.primaryBtnText}>Select</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          ) : (
            <Modal
              animationType="slide"
              transparent={true}
              visible={openDate}
              onRequestClose={() => setOpenDate(false)}
            >
              <View style={styles.dateTimeSelectContainer}>
                <View style={styles.dateTimeSelectContainerModal}>
                  <Text style={styles.titleText}>Select Date</Text>
                  <DatePicker
                    date={previousDate}
                    mode={props.mode}
                    onDateChange={handleDateChange}
                    androidVariant="nativeAndroid"
                    theme="auto"
                    textColor={Colors.primary}
                    dividerColor={Colors.gray}
                    minuteInterval={15}
                    minimumDate={props.minimumDate}
                    maximumDate={props.maximumDate}
                  />
                  <View style={styles.dateTimeButtonContainer}>
                    <Text onPress={handleCancel} style={styles.cancelText}>
                      Cancel
                    </Text>
                    <TouchableOpacity
                      style={styles.multipleDateBtnContainer}
                      onPress={() => {
                        props.onConfirm(selectedDates);
                        setOpenDate(false);
                      }}
                    >
                      <Text style={styles.primaryBtnText}>Select</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          )}
        </View>
      </TouchableOpacity>
      {props.error ? <Text style={styles.errorText}>{props.error}</Text> : null}
    </>
  );
};

export default DateTimePicker;

const styles = StyleSheet.create({
  datePicker: {
    backgroundColor: "pink",
  },
  textStyle: {
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    textAlignVertical: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: ScaleSize.spacing_medium,
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateTimeButtonContainer: {
    flexDirection: "row",
    marginTop: ScaleSize.spacing_medium,
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  cancelText: {
    fontFamily: AppFonts.semi_bold,
    left: ScaleSize.spacing_small,
    color: Colors.gray,
    fontSize: TextFontSize.small_text,
    textAlign: "center",
  },
  multipleDateSelectContainer: {
    flex: 1,
    backgroundColor: Colors.modal_bg,
    borderRadius: ScaleSize.spacing_semi_medium,
    padding: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "center",
  },
  multipleDateSelectContainerModal: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    paddingVertical: 20,
    width: ScaleSize.spacing_extra_large * 5.2,
    borderRadius: ScaleSize.primary_border_radius,
  },
  dateTimeSelectContainer: {
    flex: 1,
    backgroundColor: Colors.modal_bg,
    borderRadius: ScaleSize.spacing_semi_medium,
    padding: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "center",
  },
  dateTimeSelectContainerModal: {
    backgroundColor: "white",
    paddingHorizontal: 30,
    flex: 0.45,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: ScaleSize.spacing_extra_large * 5.2,
    borderRadius: ScaleSize.primary_border_radius,
  },
  multipleDateBtnContainer: {
    alignSelf: "center",
    backgroundColor: Colors.primary,
    borderRadius: ScaleSize.spacing_semi_medium,
    padding: ScaleSize.spacing_medium + 2,
    justifyContent: "center",
    height: ScaleSize.spacing_medium * 2,
    alignItems: "center",
    width: "50%",
    borderRadius: 50,
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    marginBottom: 10,
  },
  selectedDates: {
    marginTop: 10,
  },
  datePickerAreaStyles: (isDateConfirmed) => ({
    flex: 1,
    height: ScaleSize.spacing_extra_large - 5,
    flexDirection: "row",
    backgroundColor: isDateConfirmed
      ? Colors.textinput_low_opacity
      : Colors.white,
    marginVertical: ScaleSize.spacing_small,
    alignSelf: "center",
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    paddingVertical: ScaleSize.spacing_semi_medium + 3,
    paddingHorizontal: ScaleSize.spacing_medium / 2,
    justifyContent: "flex-start",
    alignItems: "center",
  }),
  titleText: {
    fontSize: TextFontSize.small_text + 2,
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
    alignSelf: "flex-start",
    left: ScaleSize.spacing_small,
  },
  primaryBtnText: {
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.semi_bold,
    position: "absolute",
    color: Colors.white,
  },
  dateIcon: {
    width: ScaleSize.large_icon,
    height: ScaleSize.medium_icon,
    right: ScaleSize.spacing_small,
    resizeMode: "contain",
    tintColor: Colors.primary,
  },
  errorText: {
    fontFamily: AppFonts.medium,
    color: Colors.red,
    marginHorizontal: ScaleSize.spacing_medium,
    alignSelf: "flex-start",
  },
  optionalText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: Colors.gray,
    fontSize: ScaleSize.extra_small_text,
    fontFamily: AppFonts.medium_italic,
  },
  optionalTextInline: {
    fontFamily: AppFonts.medium_italic,
    color: Colors.gray,
    fontSize: TextFontSize.extra_small_text,
  },
});
