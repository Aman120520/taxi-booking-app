import {
  StyleSheet,
  Text,
  Image,
  View,
  ImageBackground,
  Platform,
} from "react-native";
import React from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import { useTranslation } from "react-i18next";
import { Images } from "../../Resources/Images";
import Utils from "../../Helpers/Utils";
import SelectDropdown from "react-native-select-dropdown";
import FastImage from "react-native-fast-image";

const Header = ({
  profile_picture,
  full_name,
  areaType,
  setSelectedAreaType,
}) => {
  const { t } = useTranslation();
  const renderButton = (selectedItem) => {
    return (
      <View style={styles.btnContainer}>
        <Text style={styles.selectedItemText}>
          {selectedItem?.label ? selectedItem?.label : t("intercity")}
        </Text>
        <Image
          source={Images.dropdown_arrow_icon}
          style={styles.dropDownIcon}
        />
      </View>
    );
  };

  const renderGenderDropDownItem = (item) => {
    return (
      <View style={styles.dropDownMenuStyle}>
        <Text style={styles.dropDownMenuText}>{item?.label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.rootContainer}>
      <View style={styles.headerContainer}>
        <ImageBackground
          source={Images.profilePlaceholder}
          style={styles.profileContainer}
        >
          <FastImage
            resizeMode={FastImage.resizeMode.cover}
            source={{ uri: profile_picture }}
            style={styles.profileImage}
          />
        </ImageBackground>
        <View style={styles.titleContainer}>
          <Text style={styles.greetingsText}>
            {Utils.getCurrentGreetings(t)}
          </Text>
          <Text
            style={styles.usernameText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {full_name}
          </Text>
        </View>
      </View>

      <View style={styles.dropdownContainer}>
        <SelectDropdown
          style={{ width: "100%" }}
          data={areaType}
          onSelect={(selectedItem) => {
            setSelectedAreaType(selectedItem.value);
          }}
          renderButton={renderButton}
          renderItem={renderGenderDropDownItem}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropDownItemStyle}
        />
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  rootContainer: {
    height: ScaleSize.spacing_very_large,
    marginVertical: ScaleSize.spacing_medium,
    flexDirection: "row",
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    height: ScaleSize.tab_profile_icon - 2,
    width: ScaleSize.tab_profile_icon - 2,
    backgroundColor: Colors.gray,
    borderRadius: ScaleSize.small_border_radius - 4,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    height: "100%",
    width: "100%",
    margin: ScaleSize.spacing_small,
    resizeMode: "cover",
    borderRadius: ScaleSize.very_small_border_radius,
  },
  titleContainer: {
    marginRight: ScaleSize.spacing_large * 1.8,
    alignItems: "flex-start",
    left: ScaleSize.spacing_semi_medium,
  },
  usernameText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text - 1,
    color: Colors.black,
    width: "90%",
    bottom: ScaleSize.font_spacing,
  },
  greetingsText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
    top: Platform.OS === "ios" ? null : ScaleSize.spacing_very_small,
  },
  dropdownContainer: {
    height: ScaleSize.spacing_very_large - 2,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    paddingVertical: ScaleSize.spacing_small + 2,
    borderWidth: ScaleSize.smallest_border_width,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  dropSelectedItemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedItemText: {
    flex: 1,
    textAlign: "center",
    right: ScaleSize.spacing_small,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.medium,
    color: Colors.black,
  },
  dropDownMenuStyle: {
    margin: ScaleSize.spacing_small,
    alignItems: "center",
    borderBottomWidth: 0,
  },
  dropDownMenuText: {
    color: "black",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
  },
  dropDownIcon: {
    height: ScaleSize.spacing_small,
    width: ScaleSize.spacing_small,
    right: ScaleSize.spacing_small + 2,
    resizeMode: "contain",
  },
  dropDownItemStyle: {
    width: "30%",
    flex: 1,
    justifyContent: "center",
    marginTop: ScaleSize.spacing_semi_medium,
    alignSelf: "center",
    borderRadius: ScaleSize.small_border_radius,
    elevation: 10,
    padding: ScaleSize.spacing_small + 2,
  },
  btnContainer: {
    flexDirection: "row",
    paddingHorizontal: ScaleSize.spacing_small,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  selectedItemText: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    fontSize: TextFontSize.very_small_text,
    marginRight: ScaleSize.spacing_medium,
    fontFamily: AppFonts.medium,
    color: Colors.black,
  },
});
