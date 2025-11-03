import React, {
  forwardRef,
  useImperativeHandle,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { ScaleSize } from "../../Resources/ScaleSize";
import { TextFontSize } from "../../Resources/TextFontSize";
import { AppFonts } from "../../Resources/AppFonts";
import { Colors } from "../../Resources/Colors";
import { Images } from "../../Resources/Images";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { intercityPickupCitySearch } from "../../Actions/Intercity";
import Utils from "../../Helpers/Utils";
import { useIsFocused } from "@react-navigation/native";

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const IntercitySearch = forwardRef((props, ref) => {
  const { imageShow, isOptional } = props;

  ////////////// States //////////////
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownController = useRef(null);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  ////////////// Refs //////////////
  const searchRef = useRef(null);
  var initValue = { id: "1", title: props.placeholder };
  const [suggestionsList, setSuggestionsList] = useState(
    props.placeholder ? [{ id: "1", title: props.placeholder }] : null
  );
  const [suggestionsPickupCityListMain, setSuggestionsPickupCityListMain] =
    useState([]);
  const [suggestionsDropOffCityListMain, setSuggestionsDropOffCityListMain] =
    useState([]);
  const [initialize, setInitialize] = useState(props.value ? initValue : null);

  ///////////// Function for getSuggestions /////////////
  const getSuggestions = useCallback(
    async (q) => {
      const filterToken = q.toLowerCase();
      setText(filterToken);
      if (typeof q !== "string" || q.length < 1) {
        setSuggestionsList(null);
        dropdownController.current.close();
        return;
      }
      var suggestionsListMain = props.pickupCity
        ? [...suggestionsPickupCityListMain]
        : [...suggestionsDropOffCityListMain];
      if (suggestionsListMain && suggestionsListMain.length > 0) {
        var listSuggest = suggestionsListMain.filter((item) =>
          item.description.toLowerCase().includes(filterToken)
        );
        setSuggestionsList(listSuggest);
        if (listSuggest.length > 0) {
          if (Platform.OS !== "ios") {
            dropdownController.current.open();
          }
        } else {
          dropdownController.current.close();
        }
      } else {
        init(true, props.pickupCity, filterToken);
      }
    },
    [
      suggestionsPickupCityListMain,
      suggestionsDropOffCityListMain,
      props.pickupCity,
    ]
  );

  async function init(isFromTyping, isPickupCity, filterToken) {
    if (isFromTyping) {
      setLoading(true);
    }
    var endPoint = isPickupCity
      ? "intercity/pickupCityList"
      : "intercity/dropoffCityList";
    if (await Utils.isNetworkConnected()) {
      dispatch(
        intercityPickupCitySearch(endPoint, async (items) => {
          setLoading(false);
          if (items && items.data && items.data) {
            const predictions = items.data;
            const suggestions = predictions.map((item, index) => ({
              title: item,
              description: item,
              id: item,
              city: item,
            }));
            if (!isFromTyping && isPickupCity) {
              init(false, false, "");
            }
            if (isPickupCity) {
              setSuggestionsPickupCityListMain(suggestions);
            } else {
              setSuggestionsDropOffCityListMain(suggestions);
            }
            if (isFromTyping) {
              var listSuggest = suggestions.filter((item) =>
                item.description.toLowerCase().includes(filterToken)
              );
              setSuggestionsList(listSuggest);
              if (listSuggest && listSuggest.length > 0) {
                setTimeout(() => {
                  dropdownController.current.open();
                }, 5000);
              } else {
                dropdownController.current.close();
              }
            }
          }
        })
      );
    }
  }

  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      init(false, true, "");
    }
  }, [isFocus]);

  useEffect(() => {
    if (text === "") {
      onClearPress();
    }
  }, [text]);

  useEffect(() => {
    getSuggestions("");
  }, []);

  //////////// Function for clear ///////////
  const onClearPress = useCallback(() => {
    setText("");
    setSelectedItem(null);
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
      getSuggestions(text);
    } else if (text.length === 0) {
      dropdownController.current.clear();
    }
  }, 300);

  useImperativeHandle(ref, () => ({
    onClearPress: () => {
      setText(null);
      setIsFocused(false);
      setSuggestionsList(null);
      searchRef.current.clear();
    },
    closeDropDown: () => {
      dropdownController.current.close();
    },
  }));

  ///////////// Function for renderItem ///////////
  const renderItem = (item, text) => {
    return (
      <View style={styles.dropDownMenuItem}>
        <Image source={Images.location_icon} style={styles.locationIcon} />
        <Text style={styles.suggestionsText}>{item.description}</Text>
      </View>
    );
  };

  const onSelectItem = (item) => {
    setSelectedItem(item);
    setText(item?.description);
    props.onSelected(item?.city);
  };

  return (
    <View style={[styles.container, Platform.select({ ios: { zIndex: 1 } })]}>
      <AutocompleteDropdown
        ref={searchRef}
        controller={(controller) => {
          dropdownController.current = controller;
        }}
        direction={Platform.select({ ios: "down" })}
        dataSet={suggestionsList}
        onChangeText={(text) => {
          handleOnChangeText(text);
        }}
        onSelectItem={onSelectItem}
        closeOnBlur={false}
        closeOnSubmit={false}
        flatListProps={{
          keyboardDismissMode: "none",
        }}
        clearOnFocus={false}
        debounce={isOptional ? 0 : 600}
        suggestionsListMaxHeight={Dimensions.get("window").height * 0.4}
        onClear={onClearPress}
        onFocus={() => {
          setIsFocused(true);
        }}
        autoComplete="off"
        importantForAutofill="no"
        autoCapitalize="none"
        onBlur={() => {
          setSuggestionsList(null);
          setIsFocused(false);
        }}
        loading={loading}
        onOpenSuggestionsList={onOpenSuggestionsList}
        useFilter={false}
        textInputProps={{
          ...props,
          autoCorrect: false,
          placeholder: isOptional === true ? "" : "",
          autoCorrect: false,
          placeholderTextColor: Colors.primary,
          autoCapitalize: "none",
          style: props.isCustom ? props.textinputStyle : styles.textinputStyle,
          right: imageShow ? 0 : ScaleSize.spacing_semi_medium,
        }}
        rightButtonsContainerStyle={styles.rightButtonsContainerStyle}
        inputContainerStyle={
          props.isCustom ? props.style : styles.inputContainerStyle(isFocused)
        }
        suggestionsListContainerStyle={styles.suggestionsListContainerStyle}
        containerStyle={{ flexGrow: 1 }}
        renderItem={(item, text) => renderItem(item, text)}
        inputHeight={50}
        initialValue={{ id: "1" }}
        showChevron={false}
        showClear={text ? (loading ? false : true) : false}
      >
        <Text style={{ color: "red" }}>{isOptional + "  " + text}</Text>
      </AutocompleteDropdown>
      {/* {loading ? (
          <ActivityIndicator
            style={{
              position: "absolute",
              right: ScaleSize.spacing_large/2,
              top: props.multiline
                ? ScaleSize.spacing_extra_large -
                  ScaleSize.spacing_semi_medium -
                  1
                : ScaleSize.spacing_large/2,
              alignSelf: "center",
            }}
          />
        ) : null} */}
      {imageShow ? (
        <Image style={styles.tabIcon} source={Images.location_icon} />
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
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    textTransform: "lowercase",
    fontSize: TextFontSize.small_text,
    fontFamily: AppFonts.semi_bold,
    color: Colors.primary,
  },
  tabIcon: {
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    right: ScaleSize.spacing_very_small,
    resizeMode: "contain",
    position: "absolute",
    left: ScaleSize.spacing_large + 15,
    tintColor: Colors.primary,
  },
  inputContainerStyle: (isFocused) => ({
    textTransform: "lowercase",
    height: ScaleSize.spacing_extra_large - 5,
    fontSize: TextFontSize.small_text,
    alignItems: "center",
    justifyContent: "center",
    bottom: Platform.OS === "ios" ? ScaleSize.font_spacing + 3 : null,
    fontFamily: AppFonts.semi_bold,
    borderRadius: ScaleSize.small_border_radius,
    backgroundColor: "#00000000",
    color: Colors.primary,
    alignSelf: "center",
    paddingLeft: ScaleSize.spacing_semi_medium,
    marginTop: 2,
    paddingVertical: ScaleSize.spacing_small,
  }),
  rightButtonsContainerStyle: {
    right: ScaleSize.spacing_medium,
    position: "absolute",
    height: ScaleSize.spacing_large,
    alignSelf: "center",
  },
  textinputStyle: {
    fontSize: TextFontSize.very_small_text,
    justifyContent: "center",
    textAlignVertical: "center",
    color: Colors.primary,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  placeholderText: {
    position: "absolute",
    alignSelf: "center",
    right: 0,
    zIndex: 2,
    left: ScaleSize.spacing_extra_large,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
  },
  optionalText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: Colors.gray,
    fontSize: ScaleSize.very_small_text,
    fontFamily: AppFonts.medium_italic,
  },
  errorTextArea: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-start",
    bottom: ScaleSize.spacing_very_small,
    width: "90%",
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
  suggestionsText: {
    color: "black",
    fontFamily: AppFonts.medium,
    padding: ScaleSize.spacing_semi_medium + 2,
  },
  suggestionsListContainerStyle: {
    bottom: Platform.OS === "ios" ? 60 : 10,
    position: "absolute",
    right: 30,
    borderRadius: ScaleSize.small_border_radius,
    paddingHorizontal: ScaleSize.spacing_small + 2,
  },
});
