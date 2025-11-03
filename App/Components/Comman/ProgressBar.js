import { StyleSheet, View } from "react-native";
import React from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import CircularProgress from "react-native-circular-progress-indicator";

const ProgressBar = (props) => {
  return (
    <View style={styles.container}>
      <CircularProgress
        value={props.value}
        maxValue={100}
        radius={ScaleSize.progress_bar_radius}
        activeStrokeWidth={8}
        inActiveStrokeWidth={8}
        title={props.string}
        titleStyle={styles.innerText}
        activeStrokeColor={Colors.primary}
        inActiveStrokeColor={Colors.light_gray}
        showProgressValue={false}
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  container: {
    width: ScaleSize.small_image,
    height: ScaleSize.small_image,
    justifyContent: "center",
    alignItems: "center",
  },
  innerText: {
    fontFamily: AppFonts.bold,
    top: ScaleSize.spacing_minimum + 2,
    fontSize: TextFontSize.semi_medium_text,
    color: Colors.black,
  },
});
