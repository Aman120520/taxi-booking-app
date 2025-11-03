import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
} from "react-native";
import React from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  AppFonts,
  Images,
} from "../../Resources";

const BioBox = ({ visible, bio, onPressNegative }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Bio</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onPressNegative}>
              <Image source={Images.close_icon} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>
          {bio && <Text style={styles.modalText}>{bio}</Text>}
        </View>
      </View>
    </Modal>
  );
};

export default BioBox;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_large,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  header: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  modalView: {
    backgroundColor: "white",
    width: "100%",
    borderRadius: ScaleSize.small_border_radius + 5,
    padding: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "flex-start",
    elevation: 5,
  },
  modalTitle: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.primary,
    alignSelf: "flex-start",
    marginBottom: ScaleSize.spacing_very_small - 2,
    fontSize: TextFontSize.small_text + 2,
    textAlign: "center",
  },
  modalText: {
    fontFamily: AppFonts.medium,
    color: Colors.black,
    fontSize: TextFontSize.small_text,
    textAlign: "left",
  },
  closeBtn: {
    backgroundColor: Colors.textinput_low_opacity,
    width: ScaleSize.spacing_medium * 1.5,
    height: ScaleSize.spacing_medium * 1.5,
    bottom: ScaleSize.spacing_very_small - 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: ScaleSize.smallest_border_radius,
  },
  closeIcon: {
    height: ScaleSize.very_small_icon,
    width: ScaleSize.very_small_icon,
    resizeMode: "contain",
  },
});
