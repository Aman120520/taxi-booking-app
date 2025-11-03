import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  Dimensions,
  Text,
  View,
  Animated,
  Easing,
  StyleSheet,
  Platform,
  Image,
  ActivityIndicator,
} from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { ScaleSize } from "../../Resources/ScaleSize";
import { TextFontSize } from "../../Resources/TextFontSize";
import { AppFonts } from "../../Resources/AppFonts";
import { Colors } from "../../Resources/Colors";
import { Images } from "../../Resources/Images";
import { searchCityList } from "../../Actions/authentication";
import { placeDetails } from "../../Actions/Intercity";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import AlertBox from "./AlertBox";
import Utils from "../../Helpers/Utils";
import Constant from "../../Network/Constant";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const GooglePlacesAutoComplete = forwardRef((props, ref) => {
  const {
    imageShow,
    placeholder,
    isOptional,
    editable,
    isCustom,
    textinputStyle,
    onSelectItem,
    style,
  } = props;
  const [errorAlert, setErrorAlert] = useState(false);

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

  ////////////// States //////////////
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownController = useRef(null);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [text, setText] = useState(props.value);
  var initValue = { id: "1", title: props.value };
  const country = props.country;

  ////////////// Refs //////////////
  const searchRef = useRef(null);
  const [suggestionsList, setSuggestionsList] = useState(
    props.value ? [initValue] : null
  );
  const [shakeAnimation] = useState(new Animated.Value(0));

  const [initialize, setInitialize] = useState(props.value ? initValue : null);

  const getSuggestions = useCallback(async (q, country) => {
    const filterToken = q.toLowerCase();
    setText(filterToken);
    if (typeof q !== "string" || q.length < 3) {
      setSuggestionsList(null);
      return;
    }
    setLoading(true);
    var body = {
      token: Constant.PLACES_API_TOKEN || "YOUR_PLACES_API_TOKEN",
      search_text: filterToken,
      country_code:
        country && country?.country_code ? country?.country_code : "",
    };
    if (await Utils.isNetworkConnected()) {
      dispatch(
        searchCityList(body, props.isAddressSearch, async (items) => {
          setLoading(false);
          if (items && items.data && items.data.predictions) {
            let suggestions = items.data.predictions.map((item) => ({
              title: !props.isAddressSearch
                ? item.structured_formatting.main_text
                : item.description,
              description: item.description,
              id: item.place_id,
              data: item,
              city: item.structured_formatting.main_text,
            }));
            //////// Filter suggestions based on the country ///////
            if (country) {
              // suggestions = suggestions.filter((suggestion) =>
              //   suggestion.description
              //     .toLowerCase()
              //     .includes(country.toLowerCase())
              // );
            }
            setSuggestionsList(suggestions);
            if (suggestions.length > 0) {
              if (Platform.OS !== "ios") {
                dropdownController.current.open();
              }
            }
          }
        })
      );
    }
  }, []);

  //////////// Function for clear ///////////
  const onClearPress = useCallback(() => {
    setText(null);
    setIsFocused(false);
    setSuggestionsList(null);
    props.onClear && props.onClear();
  }, []);

  const onOpenSuggestionsList = useCallback((isOpened) => {}, []);

  const handleOnChangeText = useCallback(
    (text) => {
      if (isFocused || suggestionsList?.length > 0) {
        setText(text);
      }
      handleSearch(text);
      setSelectedItem(null);
      props.onSelected(null);
    },
    [isFocused, suggestionsList]
  );

  const handleSearch = debounce(async (text) => {
    if (text.length >= 3) {
      getSuggestions(text, country, props.isBaseOnCountry);
    } else if (text.length === 0) {
      dropdownController.current.clear();
    }
  }, 300);

  useImperativeHandle(ref, () => ({
    onClearPress: () => {
      setText(null);
      setIsFocused(false);
      setSuggestionsList(null);
      props.onClear && props.onClear();
      searchRef.current.clear();
    },
    closeDropDown: () => {
      dropdownController.current.close();
    },
  }));

  function retrivePlaceDetails(selectedItem) {
    setLoading(true);
    var body = {
      token: Constant.PLACES_API_TOKEN || "YOUR_PLACES_API_TOKEN",
      place_id: selectedItem.id,
    };
    if (props.type) {
      body.type = props.type;
    }
    if (Utils.isNetworkConnected()) {
      dispatch(
        placeDetails(body, async (items) => {
          if (items && items.data) {
            if (items.data.city_name) {
              selectedItem.city = items.data.city_name;
              selectedItem.latitude = items.data.latitude;
              selectedItem.state = items.data.state_name;
              selectedItem.longitude = items.data.longitude;
              selectedItem.timezone = items.data.timezone;
              if (items.data.intracity_per_km) {
                selectedItem.intracity_per_km = items.data.intracity_per_km;
                selectedItem.intracity_minimum_fare =
                  items.data.intracity_minimum_fare;
              } else if (items.data.intercity_per_km) {
                selectedItem.intercity_minimum_fare =
                  items.data.intercity_minimum_fare;
                selectedItem.intercity_per_km = items.data.intercity_per_km;
              }
              setLoading(false);
              setSelectedItem(selectedItem);
              props.onSelected(selectedItem);
            } else {
              setErrorAlert(true);
              setSelectedItem(null);
              onClearPress();
              searchRef.current.clear();
              setLoading(false);
            }
          }
        })
      );
    }
  }

  const onBlur = (value) => {
    if (value === "") {
      setIsFocused(false);
    }
  };

  ///////////// Function for renderItem ///////////
  const renderItem = (item, text) => {
    return (
      <View style={styles.dropDownMenuItem}>
        <Image source={Images.location_icon} style={styles.locationIcon} />
        <Text style={styles.suggestionText}>{item.description}</Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={
        isCustom
          ? style
          : [
              styles.container,
              {
                borderColor: props.error ? Colors.red : Colors.primary,
                height: props.multiline ? "auto" : null,
                marginBottom:
                  props.error && props.isFromSignUp
                    ? ScaleSize.spacing_large
                    : 0,
                flexDirection: props.imageShow ? "row" : null,
                transform: [
                  {
                    translateX: shakeAnimation.interpolate({
                      inputRange: [-10, 10],
                      outputRange: [-5, 5],
                    }),
                  },
                ],
              },
              Platform.select({ ios: { zIndex: 1 } }),
            ]
      }
    >
      <AutocompleteDropdown
        ref={searchRef}
        controller={(controller) => {
          dropdownController.current = controller;
        }}
        direction={Platform.select({ ios: "down" })}
        dataSet={suggestionsList}
        clearOnFocus={false}
        closeOnBlur={false}
        closeOnSubmit={false}
        onChangeText={(text) => {
          if (props.isBaseOnCountry && !country && !country?.country_code) {
            setSuggestionsList(null);
            return;
          }
          handleOnChangeText(text);
        }}
        onSelectItem={(item) => {
          if (item && item.id !== "1") {
            item && retrivePlaceDetails(item);
          }
          if (props.onSelectItem) {
            props.onSelectItem(item);
          }
        }}
        debounce={isOptional ? 0 : 600}
        suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
        onClear={onClearPress}
        onFocus={() => {
          setIsFocused(true);
        }}
        autoComplete="off"
        importantForAutofill="yes"
        autoCapitalize="none"
        onBlur={(value) => {
          onBlur(value);
        }}
        onOpenSuggestionsList={onOpenSuggestionsList}
        useFilter={false}
        textInputProps={{
          autoCorrect: false,
          autoComplete: "off",
          importantForAutofill: "yes",
          placeholder: isOptional === true ? "" : placeholder,
          placeholderTextColor: Colors.black,
          color: Colors.primary,
          editable: editable,
          fontFamily: AppFonts.semi_bold,
          paddingBottom:
            Platform.OS === "ios" && props.multiline
              ? ScaleSize.spacing_large
              : 0,
          paddingTop:
            Platform.OS === "ios" && !props.multiline
              ? ScaleSize.spacing_very_small
              : 5,
          fontSize: TextFontSize.small_text,
          multiline: props.multiline,
          textAlignVertical: props.multiline ? "top" : "center",
          style: isCustom
            ? textinputStyle
            : {
                fontSize: TextFontSize.very_small_text,
                left: imageShow
                  ? ScaleSize.spacing_medium + 2
                  : -ScaleSize.spacing_very_small - 2,
                bottom: 5,
              },
          right: imageShow ? 0 : ScaleSize.spacing_semi_medium,
        }}
        rightButtonsContainerStyle={styles.rightButtonsContainerStyle}
        inputContainerStyle={[
          props.style
            ? props.style
            : styles.inputContainerStyle(props.value ? true : isFocused),
          {
            height: props.multiline
              ? ScaleSize.spacing_extra_large * 1.5
              : ScaleSize.spacing_extra_large - 5,
            textAlignVertical: props.multiline ? "top" : "center",
            paddingTop: props.multiline ? ScaleSize.spacing_semi_medium : 0,
            borderColor: props.error ? Colors.red : Colors.primary,
          },
        ]}
        suggestionsListContainerStyle={styles.suggestionsListContainerStyle(
          suggestionsList
        )}
        containerStyle={{ flexGrow: 1 }}
        renderItem={(item, text) => renderItem(item, text)}
        inputHeight={
          props.multiline
            ? ScaleSize.spacing_extra_large * 1.5
            : ScaleSize.spacing_extra_large - 5
        }
        initialValue={{ id: "1" }}
        showChevron={false}
        showClear={editable && text ? (loading ? false : true) : false}
      />

      {loading ? (
        <ActivityIndicator
          style={{
            position: "absolute",
            right: ScaleSize.spacing_large + 2,
            top: props.multiline
              ? ScaleSize.spacing_extra_large -
                ScaleSize.spacing_semi_medium -
                1
              : ScaleSize.spacing_large + 2,
            alignSelf: "center",
          }}
        />
      ) : null}

      {imageShow ? (
        <Image
          style={[
            styles.tabIcon,
            { tintColor: props.error ? Colors.red : Colors.primary },
          ]}
          source={Images.location_icon}
        />
      ) : null}

      {props.error ? (
        <Text
          style={[
            styles.errorText,
            {
              position: imageShow ? "absolute" : null,
              bottom: imageShow ? -20 : 0,
            },
          ]}
        >
          {props.error}
        </Text>
      ) : null}

      {isOptional === true && !text ? (
        <Text
          onPress={() => {
            searchRef.current.focus();
          }}
          style={styles.placeholderText}
        >
          {props.placeholder}{" "}
          <Text style={styles.optionalText}>{t("optional")}</Text>
        </Text>
      ) : null}

      <AlertBox
        visible={errorAlert}
        title={"Alert!"}
        error={true}
        message={"We are not yet serving in this city."}
        positiveBtnText={"OK"}
        onPress={() => {
          setErrorAlert(false);
        }}
        onPressNegative={() => setErrorAlert(false)}
      />
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  tabIcon: {
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    resizeMode: "contain",
    position: "absolute",
    left: ScaleSize.spacing_medium + 2,
  },
  inputContainerStyle: (isFocused) => ({
    flexDirection: "row",
    height: ScaleSize.spacing_extra_large - 5,
    alignSelf: "center",
    paddingVertical: ScaleSize.spacing_small / 1.5,
    color: "black",
    textAlignVertical: "center",
    fontFamily: AppFonts.semi_bold,
    marginVertical: ScaleSize.spacing_small,
    paddingVertical: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    backgroundColor:
      isFocused === true ? Colors.textinput_low_opacity : Colors.white,
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "flex-start",
    fontSize: TextFontSize.very_small_text,
  }),
  rightButtonsContainerStyle: {
    right: ScaleSize.spacing_small,
    height: ScaleSize.spacing_large,
    alignSelf: "center",
  },
  textinputStyle: {
    fontSize: TextFontSize.very_small_text,
    justifyContent: "center",
    textAlignVertical: "center",
    color: Colors.primary,
    alignSelf: "center",
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_medium / 2,
  },
  placeholderText: {
    position: "absolute",
    alignSelf: "center",
    right: 0,
    zIndex: 2,
    left: ScaleSize.spacing_large,
    top: ScaleSize.spacing_medium * 1.4,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
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
    fontSize: TextFontSize.extra_small_text,
    fontFamily: AppFonts.medium_italic,
  },
  errorTextArea: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: ScaleSize.spacing_medium + 2,
  },
  locationIcon: {
    left: ScaleSize.spacing_small,
    width: ScaleSize.large_icon - 2,
    height: ScaleSize.large_icon - 2,
  },
  dropDownMenuItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  suggestionsListContainerStyle: (suggestionsList) => ({
    top: ScaleSize.spacing_small,
    height: suggestionsList?.length > 3 ? 220 : null,
    borderRadius: ScaleSize.small_border_radius,
    paddingHorizontal: ScaleSize.spacing_small + 2,
  }),
  suggestionText: {
    color: "black",
    fontFamily: AppFonts.medium,
    top: ScaleSize.font_spacing,
    padding: ScaleSize.spacing_semi_medium + 2,
  },
});
