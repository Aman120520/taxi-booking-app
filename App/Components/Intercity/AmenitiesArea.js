import { StyleSheet, Text, View, Image, Platform } from "react-native";
import {
  Colors,
  Strings,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import { useTranslation } from "react-i18next";

const AmenitiesArea = ({ data }) => {
  const { t } = useTranslation();
  const amenitiesData = [
    {
      option: t("medium_size_luggage"),
      selected: data?.medium_size_luggage,
      allowed: Images.medium_lagguage_allowed,
      notAllowed: Images.medium_lagguage_not_allowed,
      key: "1",
    },
    {
      option: t("large_luggage"),
      selected: data?.large_luggage,
      allowed: Images.large_lagguage_allowed,
      notAllowed: Images.large_lagguage_not_allowed,
      key: "2",
    },
    {
      option: t("winter_tires"),
      selected: data?.winter_tires_installed,
      allowed: Images.winter_tires_allowed,
      notAllowed: Images.winter_tires_not_allowed,
      key: "3",
    },
    {
      option: t("pet_in_cage_allowed"),
      selected: data?.pet_in_cage_allowed,
      allowed: Images.pet_in_cage_allowed,
      notAllowed: Images.pet_in_cage_not_allowed,
      key: "4",
    },
  ];

  return (
    <View style={styles.amenitiesArea}>
      <Text style={styles.titleBarText}>{Strings.amenities}</Text>
      <View style={styles.amenitiesOptionsArea}>
        {amenitiesData.map((item) => (
          <View
            key={item.key}
            style={{
              backgroundColor:
                item.selected === 1
                  ? Colors.textinput_low_opacity
                  : Colors.lightest_gray,
              flexDirection: "row",
              paddingVertical: ScaleSize.spacing_very_small,
              paddingHorizontal: ScaleSize.spacing_small + 3,
              borderRadius: ScaleSize.very_small_border_radius,
              justifyContent: "center",
              alignItems: "center",
              marginVertical: ScaleSize.spacing_very_small,
              marginRight: ScaleSize.spacing_semi_medium - 2,
            }}
          >
            <Image
              source={item.selected === 1 ? item.allowed : item.notAllowed}
              style={styles.amenitiesIcon}
            />
            <Text
              style={{
                fontFamily: AppFonts.medium,
                top: Platform.OS === "ios" ? null : ScaleSize.font_spacing,
                fontSize: TextFontSize.extra_small_text,
                color: item.selected === 1 ? Colors.primary : Colors.gray,
              }}
            >
              {item.option}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default AmenitiesArea;

const styles = StyleSheet.create({
  amenitiesArea: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    marginVertical: ScaleSize.spacing_small,
  },
  amenitiesOptionsArea: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenitiesIcon: {
    height: ScaleSize.small_icon - 2,
    width: ScaleSize.small_icon - 2,
    resizeMode: "contain",
    marginRight: ScaleSize.spacing_very_small,
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
  },
});
