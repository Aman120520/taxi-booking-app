import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import React from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import { Images } from "../../Resources/Images";
import { useSelector } from "react-redux";

const MenuItem = ({ data, handleNavigation }) => {
  const { userData } = useSelector((state) => state.Authentication);

  return (
    <View style={styles.container}>
      {data &&
        data.map((item) => {
          return (
            <TouchableOpacity
              style={styles.optionTab}
              onPress={() => handleNavigation(item)}
            >
              <View style={{ flexDirection: "row" }}>
                <Image source={item.icon} style={styles.tabIcon} />
                <Text style={styles.optionText}>{item.text}</Text>
              </View>
              {JSON.stringify(item.isHideRightArrow) &&
              userData?.is_driver === 0 ? null : (
                <Image source={Images.backBtn} style={styles.nextIcon} />
              )}
            </TouchableOpacity>
          );
        })}
    </View>
  );
};

export default MenuItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  optionTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_small,
    paddingVertical: ScaleSize.spacing_semi_medium,
    justifyContent: "space-between",
  },
  tabIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    resizeMode: "contain",
    marginRight: ScaleSize.spacing_small,
  },
  optionText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
    bottom: ScaleSize.font_spacing,
    left: ScaleSize.spacing_very_small,
    textAlign: "left",
    fontSize: TextFontSize.very_small_text,
  },
  nextIcon: {
    position: "absolute",
    transform: [{ rotate: "180deg" }],
    right: 0,
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon - 2,
    resizeMode: "contain",
  },
});
