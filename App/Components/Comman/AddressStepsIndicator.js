import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { ScaleSize } from "../../Resources/ScaleSize";
import { Colors } from "../../Resources/Colors";
import { Images } from "../../Resources/Images";
import AddressRenderItems from "../RideDetails/AddressRenderItems";
import { useTranslation } from "react-i18next";
import moment from "moment";

const AddressStepsIndicator = ({
  pickupAddress,
  pickupAddressDate,
  dropOffAddress,
  dropOffAddressDate,
}) => {
  const { t } = useTranslation();
  var pickupDate = moment(pickupAddressDate, "DD MMM yyyy, hh:mm a");
  var dropDate = moment(dropOffAddressDate, "DD MMM yyyy, hh:mm a");
  return (
    <View style={{ width: "100%" }}>
      <View style={{ flexDirection: "row" }}>
        <Image style={styles.locationIcon} source={Images.location_icon} />

        <AddressRenderItems
          title={t("pickup_address")}
          value={pickupAddress}
          date={pickupDate.isValid() ? pickupDate : null}
        />
        <View style={styles.navigatorLine} />
      </View>

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Image style={styles.dropoffIcon} source={Images.drop_off_icon} />
        <AddressRenderItems
          title={t("drop_off_address")}
          value={dropOffAddress}
          date={dropDate.isValid() ? dropDate : null}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navigatorLine: {
    width: ScaleSize.font_spacing,
    height: "90%",
    borderRightWidth: 1.5,
    borderColor: Colors.primary,
    top: ScaleSize.large_icon,
    borderStyle: "dashed",
    left: ScaleSize.large_icon / 2 - ScaleSize.font_spacing / 2,
    position: "absolute",
  },
  dropoffIcon: {
    height: ScaleSize.large_icon,
    width: ScaleSize.large_icon,
    tintColor: Colors.gray,
    marginTop: ScaleSize.spacing_small + 2,
    marginVertical: ScaleSize.spacing_very_small,
    resizeMode: "contain",
  },
  locationIcon: {
    height: ScaleSize.large_icon,
    width: ScaleSize.large_icon,
    tintColor: Colors.primary,
    marginTop: ScaleSize.spacing_small + 2,
    marginVertical: ScaleSize.spacing_very_small,
    resizeMode: "contain",
  },
});

export default AddressStepsIndicator;
