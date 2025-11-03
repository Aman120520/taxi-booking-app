import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "../Comman";

const BookNowButton = (props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.btnArea}>
      <View style={styles.seatsCountArea}>
        <Text style={styles.seatsCountText}>
          {props.Count} {props.Count === 1 ? "Seat" : t("seats")}
        </Text>
      </View>

      <View style={styles.bookNowBtn}>
        <PrimaryButton string={t("book_now")} onPress={props.onPress} />
      </View>
    </View>
  );
};

export default BookNowButton;

const styles = StyleSheet.create({
  btnArea: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    flex: 1,
    height: ScaleSize.spacing_extra_large - 5,
    top: ScaleSize.spacing_very_small,
    marginVertical: ScaleSize.spacing_small,
    justifyContent: "space-between",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  bookNowBtn: {
    height: ScaleSize.spacing_large * 3,
  },
  seatsCountArea: {
    flex: 1,
    left: ScaleSize.spacing_small,
  },
  seatsCountText: {
    fontFamily: AppFonts.medium,
    color: Colors.black,
    fontSize: TextFontSize.semi_medium_text,
  },
});
