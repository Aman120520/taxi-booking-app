import { StyleSheet, View } from "react-native";
import React from "react";
import { Colors, ScaleSize } from "../../Resources";

const CustomIndicator = (props) => {
  //////////// Props /////////////
  const { index, arrayPage } = props;

  const visiblePages = arrayPage.length <= 3 ? arrayPage.length : 3;

  const adjustedIndex = index % visiblePages;

  return (
    <>
      <View style={styles.pageIndicator}>
        {arrayPage.slice(0, visiblePages).map((indexPage, idx) => {
          const isActive = idx === adjustedIndex;
          const width = isActive ? props.activeWidth : props.inActiveWidth;

          return (
            <View
              key={idx}
              style={[
                styles.indicatorTab,
                {
                  backgroundColor: isActive
                    ? Colors.white
                    : "rgba(255,255,255,0.5)",
                  width: width,
                  height: props.height,
                },
              ]}
            />
          );
        })}
      </View>
    </>
  );
};

export default CustomIndicator;

const styles = StyleSheet.create({
  pageIndicator: {
    flexDirection: "row",
  },
  indicatorTab: {
    marginHorizontal: ScaleSize.spacing_very_small,
    bottom: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
  },
});
