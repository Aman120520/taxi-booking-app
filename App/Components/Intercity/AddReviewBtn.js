import { StyleSheet, View } from "react-native";
import React from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "../Comman";

const AddReviewBtn = (props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.btnArea}>
      <View style={styles.bookNowBtn}>
        <PrimaryButton
          customStyle={true}
          buttonStyle={styles.addReviewBtn}
          textStyle={styles.addReviewBtnText}
          string={t("add_review")}
          onPress={props.onPress}
        />
      </View>
    </View>
  );
};

export default AddReviewBtn;

const styles = StyleSheet.create({
  btnArea: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    top: ScaleSize.spacing_very_small,
    marginVertical: ScaleSize.spacing_small,
    justifyContent: "space-between",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  bookNowBtn: {
    width: "100%",
  },
  addReviewBtn: {
    width: "100%",
    margin: ScaleSize.spacing_small,
    alignSelf: "center",
    backgroundColor: Colors.primary,
    padding: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  addReviewBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.white,
    fontSize: TextFontSize.small_text,
  },
});
