import { StyleSheet, Text, TouchableOpacity, View, Image} from "react-native";
import React from "react";
import {
  Colors,
  ScaleSize,  
  AppFonts,
} from "../../Resources";
import { Images } from "../../Resources/Images";

const CheckBox = (props) => {
  return (
    <>
      <TouchableOpacity style={{ alignSelf: "flex-start" }} {...props}>
        <View style={styles.checkboxContainer}>
          <View style={styles.checkedIconContainer(props.isChecked)}>
            {props.isChecked ? (
              <Image source={Images.check} style={styles.checkBoxIcon} />
            ) : null}
          </View>
          <Text style={styles.checkBoxText}>{props.text}</Text>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default CheckBox;

const styles = StyleSheet.create({
  checkedIconContainer: (isNextDay) => ({
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    justifyContent: "center",
    alignItems: "center",
    padding: ScaleSize.spacing_very_small,
    margin: ScaleSize.spacing_small,
    backgroundColor: isNextDay ? Colors.primary : Colors.textinput_low_opacity,
    borderRadius: 5,
  }),
  checkboxContainer: {
    width: "100%",
    alignSelf: "flex-start",
    left: ScaleSize.spacing_large,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  checked: {
    backgroundColor: Colors.primary,
  },
  checkBoxIcon: {
    height: ScaleSize.very_small_icon,
    width: ScaleSize.very_small_icon,    
  },
  checkBoxText: {
    color: Colors.black,
    fontFamily: AppFonts.semi_bold,
    left: ScaleSize.spacing_very_small,
  },
});
