import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import { Image } from "react-native-svg";

const PrimaryButton = (props) => {
  return (
    <TouchableOpacity
      style={
        props.customStyle
          ? props.buttonStyle
          : [
              styles.PrimaryBtn,
              {
                backgroundColor: props.disabled
                  ? Colors.light_gray
                  : Colors.secondary,
              },
            ]
      }
      {...props}
    >
      {props.isIcon === true ? (
        <Image source={props.source} style={props.iconStyle} />
      ) : null}
      <Text
        style={
          props.customStyle
            ? props.textStyle
            : [
                styles.PrimaryBtnText,
                {
                  color: props.disabled ? Colors.gray : Colors.white,
                },
              ]
        }
      >
        {props.string}
      </Text>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  PrimaryBtn: {
    height: ScaleSize.spacing_extra_large - 5,
    flex: 1,
    width: "100%",
    margin: ScaleSize.spacing_semi_medium,
    alignSelf: "center",
    padding: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  PrimaryBtnText: {
    fontFamily: AppFonts.semi_bold,
    top: Platform.OS === "ios" ? null : ScaleSize.font_spacing,
    fontSize: TextFontSize.small_text,
  },
});
