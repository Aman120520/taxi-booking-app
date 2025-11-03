import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Vibration,
} from "react-native";
import React, { useEffect } from "react";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";

const AlertBox = ({
  visible,
  error,
  title,
  message,
  positiveBtnText,
  negativeBtnText,
  onPress,
  onPressNegative,
}) => {
  useEffect(() => {
    if (visible) {
      const ONE_SECOND_IN_MS = 500;
      Vibration.vibrate(0.5 * ONE_SECOND_IN_MS);
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {title && <Text style={styles.modalTitle}>{title}</Text>}
          {message && <Text style={styles.modalText}>{message}</Text>}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.cancelBtn,
                {
                  borderRadius: negativeBtnText
                    ? ScaleSize.spacing_medium
                    : null,
                  borderColor: negativeBtnText ? Colors.gray : null,
                  borderWidth: negativeBtnText
                    ? ScaleSize.smallest_border_width
                    : null,
                },
              ]}
              onPress={() => onPressNegative()}
            >
              <Text style={styles.cancelText}>{negativeBtnText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.multipleDateBtnContainer,
                {
                  backgroundColor: error ? Colors.red : Colors.primary,
                },
              ]}
              onPress={() => onPress && onPress("positive")}
            >
              <Text style={styles.primaryBtnText}>{positiveBtnText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertBox;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_large,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: ScaleSize.small_border_radius + 5,
    padding: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "flex-start",
    elevation: 5,
  },
  modalTitle: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
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
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: ScaleSize.spacing_small + 2,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cancelText: {
    fontFamily: AppFonts.medium,
    color: Colors.gray,
    top: ScaleSize.font_spacing,
    textAlign: "center",
    width: "50%",
    fontSize: TextFontSize.small_text - 3,
  },
  multipleDateBtnContainer: {
    alignSelf: "center",
    borderRadius: ScaleSize.spacing_semi_medium,
    justifyContent: "center",
    height: ScaleSize.spacing_medium * 2,
    alignItems: "center",
    width: "48%",
    borderRadius: 50,
    alignItems: "center",
  },
  cancelBtn: {
    justifyContent: "center",
    height: ScaleSize.spacing_medium * 2,
    alignItems: "center",
    width: "48%",
    borderRadius: 50,
  },
  primaryBtnText: {
    fontSize: TextFontSize.small_text - 3,
    fontFamily: AppFonts.medium,
    top: ScaleSize.font_spacing,
    color: Colors.white,
  },
});
