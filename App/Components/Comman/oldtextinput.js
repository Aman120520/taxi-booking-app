import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  Colors,
  ScaleSize,
  Images,
  TextFontSize,
  AppFonts,
} from "../../Resources";
import Utils from "../../Helpers/Utils";
import { useTranslation } from "react-i18next";

const Textinput = (props) => {
  ////////////// States ////////////
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureEntry, setIsSecuredEntry] = useState(props.secureTextEntry);

  //////////////Function for Focus-Blur Tabs //////////////
  const onFocus = () => {
    setIsFocused(true);
  };
  const onBlur = () => {
    if (props.value === "") {
      setIsFocused(false);
    }
  };

  const onChangeText = (text) => {
    if (Utils.isEmojis(text)) {
      const filteredText = Utils.emojiRegex(text);
      props.onChangeText(filteredText);
    } else {
      props.onChangeText(text);
    }
  };

  return (
    <>
      <View
        style={
          props.textInputTabStyle
            ? props.textInputTabStyle
            : [
                styles.container,
                {
                  backgroundColor:
                    isFocused || props.value
                      ? Colors.textinput_low_opacity
                      : Colors.white,
                  paddingLeft: props.source
                    ? ScaleSize.spacing_large * 1.3
                    : ScaleSize.spacing_small,
                  justifyContent: props.source ? "flex-start" : "center",
                },
              ]
        }
      >
        {props.source ? (
          <Image style={styles.iconContainerStyle} source={props.source} />
        ) : null}

        <TextInput
          {...props}
          style={[
            props.textInputStyle ? props.textInputStyle : styles.textInput,
            {
              color:
                isFocused || props.value
                  ? props.isSecondary
                    ? Colors.black
                    : Colors.primary
                  : Colors.black,
              paddingRight: props.secureTextEntry
                ? ScaleSize.large_icon + ScaleSize.spacing_large
                : ScaleSize.spacing_medium,
              textAlignVertical: props.multiline ? "top" : "center",
            },
          ]}
          ref={props.refs}
          secureTextEntry={isSecureEntry}
          onFocus={onFocus}
          onBlur={onBlur}
          onChangeText={onChangeText}
        />

        {props.isOptional && !props.value ? (
          <Text
            style={[
              styles.optionalInputPlaceholder,
              { left: props.source ? 55 : 25 },
            ]}
            onPress={() => props.refs.current.focus()}
          >
            {props.placeholderText}{" "}
            <Text style={styles.optionalTextInline}>{t("optional")}</Text>
          </Text>
        ) : null}

        {props.secureTextEntry ? (
          <TouchableOpacity
            {...props}
            onPress={() => {
              setIsSecuredEntry(!isSecureEntry);
            }}
            style={styles.hideBtn}
          >
            <Image
              style={styles.hideIcon}
              source={isSecureEntry ? Images.hide_icon : Images.unhide_icon}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {props.error ? <Text style={styles.errorText}>{props.error}</Text> : null}
    </>
  );
};

export default Textinput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    height: ScaleSize.spacing_extra_large,
    marginVertical: ScaleSize.spacing_small,
    paddingVertical: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    alignItems: "center",
  },
  iconContainerStyle: {
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    left: ScaleSize.spacing_medium + 2,
    resizeMode: "contain",
    position: "absolute",
    tintColor: Colors.primary,
  },
  textInput: {
    flex: 1,
    zIndex: -1,
    top: ScaleSize.font_spacing,
    justifyContent: "center",
    alignItems: "center",
    textAlignVertical: "center",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  hideBtn: {
    height: ScaleSize.large_icon,
    width: ScaleSize.large_icon,
    position: "absolute",
    right: ScaleSize.spacing_large + 1,
    justifyContent: "center",
    alignItems: "center",
  },
  hideIcon: {
    position: "absolute",
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    top: ScaleSize.font_spacing - 1,
    resizeMode: "contain",
    tintColor: Colors.primary,
  },
  errorText: {
    fontFamily: AppFonts.medium,
    color: Colors.red,
    marginHorizontal: ScaleSize.spacing_medium,
    alignSelf: "flex-start",
  },
  optionalInputPlaceholder: {
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    position: "absolute",
    color: Colors.black,
  },
  optionalTextInline: {
    fontFamily: AppFonts.medium_italic,
    color: Colors.gray,
    fontSize: TextFontSize.extra_small_text,
  },
});
