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
  Images,
  AppFonts,
} from "../../Resources";
import { useTranslation } from "react-i18next";

const ImagePickerDilouge = (props) => {
  const { popupOpen, handlePopup, handleTakePicture, handleChooseFromGallery } =
    props;
  const { t } = useTranslation();

  return (
    <Modal animationType="slide" transparent={true} visible={popupOpen}>
      <View style={styles.modalBg}>
        <View style={styles.modal}>
          <View style={styles.modalTopBar}>
            <Text style={styles.headerText}>{t("upload_image")}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={handlePopup}>
              <Image source={Images.close_icon} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          <View style={styles.optionArea}>
            <TouchableOpacity
              style={styles.options}
              onPress={handleTakePicture}
            >
              <Image
                source={Images.modal_camera}
                style={styles.modalCameraIcon}
              />
              <Text style={styles.takePictureBtnText}>{t("take_picture")}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.options}
              onPress={handleChooseFromGallery}
            >
              <Image source={Images.modal_icon} style={styles.galleryIcon} />
              <Text style={styles.uploadBtnText}>{t("gallery")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ImagePickerDilouge;

const styles = StyleSheet.create({
  takePictureBtnText: {
    fontSize: TextFontSize.extra_small_text,
    marginTop: ScaleSize.spacing_very_small,
    fontFamily: AppFonts.medium,
    color: Colors.primary,
  },
  uploadBtn: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    borderRadius: 100,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    padding: ScaleSize.spacing_small + 2,
  },
  uploadBtnText: {
    marginTop: ScaleSize.spacing_very_small,
    fontSize: TextFontSize.extra_small_text,
    fontFamily: AppFonts.medium,
    color: Colors.primary,
  },
  modalBg: {
    flex: 1,
    padding: ScaleSize.spacing_small,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modal: {
    backgroundColor: Colors.white,
    width: "100%",
    borderRadius: ScaleSize.small_border_radius,
    padding: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text - 2,
    alignSelf: "flex-start",
    marginBottom: ScaleSize.spacing_small,
    color: Colors.black,
  },
  galleryIcon: {
    tintColor: Colors.primary,
    height: ScaleSize.very_large_icon,
    width: ScaleSize.very_large_icon,
  },
  cameraIcon: {
    tintColor: Colors.primary,
    height: ScaleSize.very_large_icon,
    width: ScaleSize.very_large_icon,
  },
  closeIcon: {
    height: ScaleSize.very_small_icon,
    width: ScaleSize.very_small_icon,
    resizeMode: "contain",
  },
  optionArea: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  options: {
    width: "47%",
    backgroundColor: Colors.textinput_low_opacity,
    paddingVertical: ScaleSize.spacing_large,
    margin: ScaleSize.spacing_minimum + 1,
    borderRadius: ScaleSize.small_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBtn: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    borderRadius: 100,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    padding: ScaleSize.spacing_small + 2,
  },
  modalCameraIcon: {
    tintColor: Colors.primary,
    height: ScaleSize.very_large_icon,
    width: ScaleSize.very_large_icon,
  },
  modalTopBar: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    paddingVertical: ScaleSize.spacing_small,
    borderRadius: ScaleSize.small_border_radius,
  },
  cameraIcon: {
    position: "absolute",
    height: ScaleSize.extra_large_icon + 5,
    width: ScaleSize.extra_large_icon + 5,
    right: -ScaleSize.spacing_semi_medium + 2,
    top: -ScaleSize.spacing_semi_medium + 2,
    zIndex: 1,
  },
  closeBtn: {
    backgroundColor: Colors.textinput_low_opacity,
    padding: ScaleSize.spacing_small,
    borderRadius: ScaleSize.smallest_border_radius,
  },
});
