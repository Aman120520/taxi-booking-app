import {
  Image,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import {
  PrimaryButton,
  ProgressBar,
  Header,
  ModalProgressLoader,
} from "../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import Utils from "../../Helpers/Utils";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ImagePicker from "react-native-image-crop-picker";
import { AddProfilePicture } from "../../Actions/authentication";
import { userDetails } from "../../Actions/authentication";
import "../../Resources/Languages/index";
import { useTranslation } from "react-i18next";

const AddProfilePictureScreen = ({ navigation, route }) => {
  //////////// States /////////////
  const [imagePath, setImagePath] = useState("");
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isImageConfirmed, setIsImageConfirmed] = useState(false);
  const { driverSelected } = route.params || {};
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { userData } = useSelector((state) => state.Authentication);

  /////////////// Functions for ImagePicker ////////////////

  //////// For TakePicture ////////
  const handleTakePicture = async () => {
    try {
      const image = await ImagePicker.openCamera({
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.4,
      });
      if (!image.didCancel) {
        setImagePath(image.path);
        setIsImageSelected(true);
      }
    } catch (error) {
      console.log("Error selecting image:", error);
    }
  };

  //////// For ImagePicker ////////
  const handleChooseFromGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        cropping: true,
        cropperCircleOverlay: true,
        compressImageQuality: 0.4,
      });
      if (!image.didCancel) {
        setImagePath(image.path);
        setIsImageSelected(true);
      }
    } catch (error) {
      console.log("Error selecting image:", error);
    }
  };

  ////////////// Function for confirm profile picture /////////////
  const handleComplete = async () => {
    var body = new FormData();

    body.append("user_id", userData.user_id);
    body.append("profile_picture", {
      uri: imagePath,
      type: "image/jpg",
      name: imagePath.replace(/^.*[\\/]/, ""),
      filename: imagePath.replace(/^.*[\\/]/, ""),
    });

    if (await Utils.isNetworkConnected()) {
      setLoaderVisible(true);
      dispatch(
        AddProfilePicture(body, async (data, isSuccess) => {
          setLoaderVisible(false);
          if (isSuccess === true) {
            await AsyncStorage.setItem("@userData", JSON.stringify(data.data));
            await AsyncStorage.setItem(
              "@userProfile",
              JSON.stringify(data.data.profile_picture)
            );
            var body = {
              user_id: userData.user_id,
            };
            dispatch(
              userDetails(body, async (data, isSuccess) => {
                if (isSuccess === true) {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: "BottomTabNavigator",
                      },
                    ],
                  });
                }
              })
            );
          }
        })
      );
    }
  };

  const handleArrowBackBtn = () => {
    setIsImageSelected(false);
    setIsImageConfirmed(false);
    navigation.navigate("AddProfilePictureScreen");
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      persistentScrollbar={true}
      keyboardShouldPersistTaps={true}
    >
      <ModalProgressLoader visible={loaderVisible} />

      <StatusBar backgroundColor={Colors.white} barStyle={"dark-content"} />

      {isImageSelected ? (
        <>
          <View style={styles.confirmImageScreen}>
            <Header title={t("profile_picture")} goBack={handleArrowBackBtn} />

            <View style={styles.footerArea}>
              <View style={styles.selectedProfileImageArea}>
                <Image
                  style={styles.profileImage}
                  source={{ uri: imagePath }}
                />
              </View>

              <View style={styles.imgaeConfirmOptions}>
                <TouchableOpacity
                  onPress={handleChooseFromGallery}
                  style={styles.chooseAnotherBtn}
                >
                  <Text style={styles.chooseAnotherBtnText}>
                    {t("choose_another")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsImageSelected(false);
                    setIsImageConfirmed(true);
                    navigation.navigate("AddProfilePictureScreen");
                  }}
                  style={styles.confirmBtn}
                >
                  <Text style={styles.confirmBtnText}>{t("confirm")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </>
      ) : (
        <>
          <View style={styles.topBar}>
            <ProgressBar string={t("two_of_two")} value={100} />
            <View style={styles.topBarTextArea}>
              <Text style={styles.cityOfResidenceText}>
                {t("profile_picture")}
              </Text>
              <Text style={styles.nextStepText}>{t("almost_complete")}</Text>
            </View>
          </View>

          <View style={styles.headerTextArea}>
            <Text style={styles.gender_question_text}>
              {t("add_profile_picture_screen_header_text")}
            </Text>
            <Text style={styles.descriptionText}>
              {t("add_profile_picture_screen_description_text")}
            </Text>
          </View>

          <View style={styles.selectPictureArea}>
            <Text style={styles.selectPictureText}>{t("select_picture")}</Text>

            {isImageConfirmed ? (
              <View style={styles.confirmedProfileImageArea}>
                <Image
                  style={styles.confirmedProfileImage}
                  source={{ uri: imagePath }}
                />
              </View>
            ) : (
              <View style={styles.profileIconArea}>
                <Image
                  source={Images.profile_picture}
                  style={styles.profileIcon}
                />
              </View>
            )}
          </View>

          <View style={styles.imgaeSelectOptions}>
            <TouchableOpacity
              onPress={handleTakePicture}
              style={styles.takePhotoBtn}
            >
              <Text style={styles.takePhotoBtnText}>{t("take_photo")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleChooseFromGallery}
              style={styles.chooseFromGalleryBtn}
            >
              <Text style={styles.chooseFromGalleryBtnText}>
                {t("choose_from_gallery")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.btnArea}>
            <View style={styles.backBtn}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => {
                  if (driverSelected === true) {
                    navigation.navigate("BecomeDriverScreen");
                  } else navigation.push("RoleSelection");
                }}
              >
                <Text style={styles.backText}>{t("back")}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.completeBtn}>
              <PrimaryButton
                string={t("complete")}
                onPress={() => {
                  handleComplete();
                }}
              />
            </View>
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default AddProfilePictureScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "space-around",
    backgroundColor: Colors.white,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
    marginVertical: ScaleSize.spacing_large,
  },
  topBarTextArea: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  cityOfResidenceText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.large_text,
    color: Colors.black,
  },
  nextStepText: {
    fontFamily: AppFonts.semi_bold,
    bottom: ScaleSize.spacing_very_small,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
  },
  headerTextArea: {
    width: "100%",
    bottom: ScaleSize.spacing_medium,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  gender_question_text: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.large_text,
    color: Colors.black,
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text,
    color: Colors.gray,
  },
  selectPictureArea: {
    width: "100%",
    bottom: ScaleSize.spacing_medium,
    alignItems: "flex-start",
    justifyContent: "center",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  selectPictureText: {
    fontFamily: AppFonts.medium,
    color: Colors.primary,
    bottom: ScaleSize.spacing_small,
    marginVertical: ScaleSize.spacing_small,
    fontSize: TextFontSize.small_text,
  },
  profileIconArea: {
    marginVertical: ScaleSize.spacing_medium,
    bottom: ScaleSize.spacing_small,
    backgroundColor: Colors.primary,
    padding: ScaleSize.profile_icon_padding,
    borderRadius: ScaleSize.primary_border_radius,
  },
  confirmedProfile: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  profileIcon: {
    height: ScaleSize.profile_icon,
    width: ScaleSize.profile_icon,
    resizeMode: "contain",
  },
  imgaeSelectOptions: {
    padding: ScaleSize.spacing_medium,
    bottom: ScaleSize.spacing_very_large,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  takePhotoBtn: {
    width: "100%",
    margin: ScaleSize.spacing_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    alignSelf: "center",
    padding: ScaleSize.spacing_semi_medium,
    justifyContent: "center",
    alignItems: "center",
  },
  chooseFromGalleryBtn: {
    width: "100%",
    backgroundColor: Colors.primary,
    margin: ScaleSize.spacing_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    alignSelf: "center",
    padding: ScaleSize.spacing_semi_medium,
    justifyContent: "center",
    alignItems: "center",
  },
  chooseFromGalleryBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.white,
    fontSize: TextFontSize.small_text,
  },
  takePhotoBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.primary,
    fontSize: TextFontSize.small_text,
  },
  btnArea: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  completeBtn: {
    width: "50%",
  },
  backText: {
    fontFamily: AppFonts.medium,
    color: Colors.black,
    fontSize: TextFontSize.semi_medium_text,
  },
  backBtn: {
    width: "50%",
    alignItems: "center",
    right: ScaleSize.spacing_medium,
  },
  confirmImageScreen: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  topArea: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: ScaleSize.spacing_large,
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  imgaeConfirmOptions: {
    padding: ScaleSize.spacing_medium,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  chooseAnotherBtn: {
    width: "100%",
    margin: ScaleSize.spacing_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    alignSelf: "center",
    padding: ScaleSize.spacing_semi_medium,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtn: {
    width: "100%",
    backgroundColor: Colors.primary,
    margin: ScaleSize.spacing_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    alignSelf: "center",
    padding: ScaleSize.spacing_semi_medium,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.white,
    fontSize: TextFontSize.small_text,
  },
  chooseAnotherBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.primary,
    fontSize: TextFontSize.small_text,
  },
  profileImageArea: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  profileImage: {
    height: ScaleSize.semi_medium,
    top: ScaleSize.spacing_large,
    width: ScaleSize.semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
  },
  selectedProfileImageArea: {
    marginBottom: ScaleSize.spacing_large,
    alignSelf: "flex-start",
    marginLeft: ScaleSize.spacing_medium,
  },
  confirmedProfileImageArea: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  confirmedProfileImage: {
    height: ScaleSize.semi_medium,
    width: ScaleSize.semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    right: ScaleSize.spacing_medium,
  },
  footerArea: {
    width: "100%",
    marginTop: ScaleSize.spacing_large,
  },
});
