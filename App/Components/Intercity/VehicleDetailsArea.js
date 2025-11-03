import { StyleSheet, Text, View, Image } from "react-native";
import React, { useRef, useState } from "react";
import {
  Colors,
  Strings,
  ScaleSize,
  TextFontSize,
  AppFonts,
} from "../../Resources";
import PagerView from "react-native-pager-view";
import { useTranslation } from "react-i18next";
import { CustomIndicator } from "../Comman";

const VehicleDetailsArea = ({ data }) => {
  //////////// States ////////////
  const ref = useRef();
  const [index, setIndex] = useState(0);
  const { t } = useTranslation();

  /////////// PagerViewData //////////
  function createArray(length) {
    return Array.from({ length }, (_, index) => index);
  }
  const length = data.car_images.length;
  const arrayPage = createArray(length);

  return (
    <View style={styles.vehicleDetailsArea}>
      <Text style={styles.titleBarText}>{Strings.vehicle_details}</Text>

      <PagerView
        style={styles.pagerView}
        initialPage={0}
        ref={ref}
        onPageSelected={(event) => setIndex(event.nativeEvent.position)}
        orientation="horizontal"
      >
        {data.car_images.map((indexPage) => {
          return (
            <View style={styles.vehicleImg}>
              <Image
                key={indexPage.id}
                source={{ uri: indexPage.car_images }}
                style={styles.vehicleImg}
              />
            </View>
          );
        })}
      </PagerView>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          bottom: ScaleSize.spacing_large * 1.58,
        }}
      >
        <CustomIndicator
          ref={ref}
          activeWidth={45}
          inActiveWidth={ScaleSize.spacing_medium}
          height={ScaleSize.spacing_very_small}
          index={index}
          arrayPage={arrayPage}
          setIndex={index}
          indexPage={index}
        />
      </View>

      <View style={styles.carDetailsArea}>
        <View style={[styles.carDetailsTextArea, { width: "33%" }]}>
          <Text style={styles.carDetailCategoryText}>{t("car_brand")}:</Text>
          <Text style={styles.carDetailText}>
            {data?.brand_name ? data.brand_name : "-"}
          </Text>
        </View>

        <View style={[styles.carDetailsTextArea, { width: "33%" }]}>
          <Text style={styles.carDetailCategoryText}>{t("car_model")}:</Text>
          <Text style={styles.carDetailText}>
            {data?.car_model_name ? data.car_model_name : "-"}
          </Text>
        </View>

        <View style={styles.carDetailsTextArea}>
          <Text style={styles.carDetailCategoryText}>{t("car_type")}:</Text>
          <Text style={styles.carDetailText}>
            {data?.type_name ? data.type_name : "-"}
          </Text>
        </View>
      </View>

      <View style={styles.carDetailsArea_2}>
        <View style={[styles.carDetailsTextArea, { width: "33%" }]}>
          <Text style={styles.carDetailCategoryText}>{t("car_year")}:</Text>
          <Text style={styles.carDetailText}>
            {data?.car_year ? data.car_year : "-"}
          </Text>
        </View>

        <View style={[styles.carDetailsTextArea, { width: "33%" }]}>
          <Text style={styles.carDetailCategoryText}>
            {t("license_plate")}:
          </Text>
          <Text style={styles.carDetailText}>
            {data?.license_plate_number ? data.license_plate_number : "-"}
          </Text>
        </View>

        <View style={styles.carDetailsTextArea}>
          <Text style={styles.carDetailCategoryText}>
            {t("placeholder_car_colour")}:
          </Text>
          <Text style={styles.carDetailText}>
            {data?.car_color ? data.car_color : "-"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default VehicleDetailsArea;

const styles = StyleSheet.create({
  vehicleDetailsArea: {
    width: "100%",
    marginVertical: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "center",
  },
  pagerView: {
    width: "100%",
    height: 220,
    marginBottom: -ScaleSize.spacing_very_small,
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleImg: {
    height: ScaleSize.large_image,
    borderRadius: ScaleSize.small_border_radius,
    width: "100%",
    backgroundColor: Colors.light_gray,
    resizeMode: "cover",
  },
  carDetailsArea: {
    flexDirection: "row",
    width: "100%",
    marginTop: -ScaleSize.spacing_semi_medium + 3,
    marginVertical: ScaleSize.spacing_small,
    justifyContent: "space-between",
    alignItems: "center",
  },
  carDetailsArea_2: {
    flexDirection: "row",
    width: "100%",
    marginTop: ScaleSize.spacing_small,
    alignItems: "center",
    justifyContent: "space-between",
  },
  carDetailCategoryText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.black,
  },
  carDetailText: {
    fontFamily: AppFonts.regular,
    fontSize: TextFontSize.very_small_text,
    color: Colors.black,
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
    marginBottom: ScaleSize.spacing_very_small,
  },
  carDetailsTextArea: {
    alignItems: "flex-start",
  },
});
