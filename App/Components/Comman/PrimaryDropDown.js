import { StyleSheet, View, Text, Image, Animated, Easing } from "react-native";
import React, { useState, useEffect } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  AppFonts,
  Images,
} from "../../Resources";
import SelectDropdown from "react-native-select-dropdown";

const PrimaryDropDown = (props) => {
  /////////////// States //////////////
  const {
    data,
    onSelect,
    renderItem,
    error,
    value,
    disabled,
    string,
    source,
    isForEdit,
    isCustom,
  } = props;

  const [shakeAnimation] = useState(new Animated.Value(0));

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

  const renderPickupCityDropDownButton = (selectedItem) => {
    return (
      <View style={styles.dropSelectedItemContainer(source)}>
        {isForEdit ? (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.dropDownSelectedItemText(source),
              { color: selectedItem || value ? Colors.primary : Colors.black },
            ]}
          >
            {isCustom === true ? string : renderItem(selectedItem) || value}
          </Text>
        ) : (
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              styles.dropDownSelectedItemText(source),
              { color: selectedItem || value ? Colors.primary : Colors.black },
            ]}
          >
            {isCustom === true ? string : renderItem(selectedItem) || string}
          </Text>
        )}

        <Image
          source={Images.dropdown_arrow_icon}
          style={[
            styles.dropDownIcon,
            { tintColor: error ? Colors.red : Colors.primary },
          ]}
        />
      </View>
    );
  };

  const renderPickupCityDropDownItem = (item, index) => {
    return (
      <View key={index} style={styles.dropDownMenuStyle}>
        <Text style={styles.dropDownMenuText}>{renderItem(item)}</Text>
      </View>
    );
  };

  return (
    <>
      <Animated.View
        style={[
          styles.dropDownTab,
          {
            backgroundColor: value ? Colors.textinput_low_opacity : null,
            borderColor: error ? Colors.red : Colors.primary,
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
      >
        {source ? (
          <Image
            source={source}
            style={[
              styles.genderTabIcon,
              { tintColor: error ? Colors.red : Colors.primary },
            ]}
          />
        ) : null}

        <SelectDropdown
          style={{ flex: 1, width: "100%" }}
          data={data}
          value={props.selectedId}
          onSelect={onSelect}
          defaultButtonText={value}
          renderButton={(selectedItem) =>
            renderPickupCityDropDownButton(selectedItem)
          }
          renderItem={(item, index) =>
            renderPickupCityDropDownItem(item, index)
          }
          showsVerticalScrollIndicator={true}
          disabled={disabled}
          disableAutoScroll={false}
          dropdownStyle={{
            ...styles.dropDownStyle,
            height: data.length > 3 ? 220 : null,
          }}
        />
      </Animated.View>
      {props.error ? <Text style={styles.errorText}>{props.error}</Text> : null}
    </>
  );
};

export default PrimaryDropDown;

const styles = StyleSheet.create({
  dropDownTab: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    height: ScaleSize.spacing_extra_large - 5,
    margin: ScaleSize.spacing_small,
    padding: ScaleSize.spacing_very_small,
    paddingLeft: ScaleSize.semi_spacing_medium,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  dropSelectedItemContainer: (source) => ({
    flex: 1,
    height: "100%",
    top: ScaleSize.font_spacing - 1,
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_medium,
  }),
  dropDownSelectedItemText: (source) => ({
    width: "80%",
    alignSelf: "flex-start",
    left: source ? ScaleSize.spacing_large + 2 : 0,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    borderRadius: ScaleSize.very_small_border_radius,
    justifyContent: "center",
    alignItems: "center",
  }),
  dropDownMenuStyle: {
    margin: ScaleSize.spacing_small + 2,
    width: "100%",
  },
  dropDownMenuText: {
    color: "black",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
  },
  dropDownStyle: {
    flex: 1,
    justifyContent: "center",
    marginTop: ScaleSize.spacing_medium,
    alignSelf: "center",
    borderWidth: 0,
    borderRadius: ScaleSize.small_border_radius,
    elevation: 10,
    padding: ScaleSize.spacing_small + 2,
  },
  dropDownIcon: {
    height: ScaleSize.spacing_small + 4,
    tintColor: Colors.primary,
    width: ScaleSize.spacing_small + 4,
    position: "absolute",
    right: ScaleSize.spacing_large,
  },
  genderTabIcon: {
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    position: "absolute",
    left: ScaleSize.spacing_medium + 2,
    resizeMode: "contain",
  },
  errorText: {
    fontFamily: AppFonts.medium,
    color: Colors.red,
    marginHorizontal: ScaleSize.spacing_medium,
    alignSelf: "flex-start",
  },
});
