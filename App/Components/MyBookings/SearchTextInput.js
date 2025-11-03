import {
  StyleSheet,
  TouchableOpacity,
  Image,
  View,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import { useTranslation } from "react-i18next";
import { Images } from "../../Resources/Images";

const SearchTextInput = ({
  setSearchText,
  searchText,
  handleClear,
  handleSearch,
  fetchData,
}) => {
  const { t } = useTranslation();
  const [isClear, setIsClear] = useState(false);

  return (
    <View style={styles.searchTabAra}>
      <View style={styles.searchTab}>
        <Image source={Images.search_icon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={t("search")}
          placeholderTextColor={Colors.primary}
          enterKeyHint="search"
          onFocus={() => setIsClear(true)}
          onBlur={() => setIsClear(false)}
          onChangeText={(text) => {
            setSearchText(text);
            if (text.length === 0) {
              fetchData(1);
            }
          }}
          onSubmitEditing={() => handleSearch()}
          value={searchText}
        />
        {isClear && searchText ? (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => {
              setIsClear(false);
              handleClear();
            }}
          >
            <Image source={Images.close_icon} style={styles.clearIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

export default SearchTextInput;

const styles = StyleSheet.create({
  clearBtn: {
    position: "absolute",
    borderWidth: 2,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: "#0cb0a77a",
    padding: ScaleSize.spacing_very_small - 1,
    right: ScaleSize.spacing_medium,
  },
  clearIcon: {
    height: ScaleSize.very_small_icon - 4,
    width: ScaleSize.very_small_icon - 4,
    tintColor: "#0cb0a77a",
  },
  searchTabAra: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_small + 2,
  },
  searchTab: {
    backgroundColor: Colors.textinput_low_opacity,
    borderRadius: ScaleSize.small_border_radius - 5,
    justifyContent: "flex-start",
    height: ScaleSize.spacing_large * 1.9,
    paddingLeft: ScaleSize.spacing_medium,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  searchIcon: {
    tintColor: Colors.primary,
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
  },
  searchInput: {
    width: "90%",
    top: ScaleSize.font_spacing,
    fontSize: TextFontSize.small_text - 1,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    color: Colors.primary,
  },
});
