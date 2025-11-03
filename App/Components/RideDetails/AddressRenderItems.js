import { StyleSheet, Text, View } from "react-native";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";
import moment from "moment";
import { useTranslation } from "react-i18next";

const AddressRenderItems = ({
  title,
  value,
  price,
  pickupCitySearchText,
  date,
  dropOffCitySearchText,
}) => {
  const { t } = useTranslation();

  const isBold =
    dropOffCitySearchText && pickupCitySearchText
      ? [
          pickupCitySearchText?.toLowerCase(),
          dropOffCitySearchText?.toLowerCase(),
        ]?.some((boldWord) => {
          return value?.toLowerCase().includes(boldWord.toLowerCase());
        })
      : false;

  return (
    <View style={styles.flatlistPickupDropAddressArea}>
      <View style={styles.pickupAddressTitleBar}>
        <Text style={styles.titleBarText}>{title}</Text>
        {price ? (
          <Text style={styles.titleBarText}>
            {t("price") + ": "}
            <Text style={{ color: Colors.primary }}>${price.toFixed(2)}</Text>
          </Text>
        ) : null}
      </View>
      <Text
        style={[
          styles.descriptionText,
          { fontFamily: isBold ? AppFonts.bold : AppFonts.medium },
        ]}
      >
        {value}
      </Text>
      {date && date !== "0000-00-00 00:00:00" && (
        <Text style={styles.dateAndTimeText}>
          {moment(date).format("ddd, DD MMMM [at] h:mm a")}
        </Text>
      )}
    </View>
  );
};

export default AddressRenderItems;

const styles = StyleSheet.create({
  flatlistPickupDropAddressArea: {
    width: "100%",
    marginVertical: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  pickupAddressTitleBar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleBarText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
  },
  dateAndTimeText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.secondary,
  },
});
