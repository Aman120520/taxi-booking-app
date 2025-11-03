import { StyleSheet, TouchableOpacity, Image, Text, View, SafeAreaView } from "react-native";
import React, { useState, useEffect } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import {
  Header,
  ModalProgressLoader,
  PrimaryButton,
} from "../../../Components/Comman";
import "../../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Utils from "../../../Helpers/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { changeLanguage } from "../../../Actions/Settings";
import AlertBox from "../../../Components/Comman/AlertBox";

const CommunicationLanguage = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.Authentication);
  const { isChangeLanguageLoading } = useSelector((state) => state.Settings);
  const [communicationLanguageList, setCommunicationList] = useState([]);
  const [appLanguageList, setAppLanguageList] = useState([]);
  const { t, i18n } = useTranslation();
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMsg, setSuccessMessage] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    initLanguage();
  }, [userData]);

  function initLanguage() {
    var isAppLanguageIsFrance = userData?.current_language === "fr";

    var communicationLanguage = (
      userData?.communication_language + ""
    )?.includes(",")
      ? userData?.communication_language?.split(",")
      : userData?.communication_language + ""
        ? [userData?.communication_language + ""]
        : null;

    const languageArray = [
      {
        language: "english",
        isSelected: communicationLanguage
          ? communicationLanguage.indexOf("1") > -1
          : true,
        key: 1,
      },
      {
        language: "french",
        isSelected: communicationLanguage
          ? communicationLanguage.indexOf("2") > -1
          : false,
        key: 2,
      },
    ];
    setCommunicationList(languageArray);
    setAppLanguageList([
      {
        language: "English",
        isSelected: !isAppLanguageIsFrance,
        key: "en",
      },
      {
        language: "French",
        isSelected: isAppLanguageIsFrance,
        key: "fr",
      },
    ]);
  }

  function RenderItem({ item, index, onPress }) {
    return (
      <TouchableOpacity
        key={index}
        style={styles.itemContainer(item.isSelected)}
        onPress={onPress}
      >
        <Text style={styles.itemText(item.isSelected)}>{t(item.language)}</Text>
        {item.isSelected ? (
          <Image source={Images.language_select} style={styles.checkIcon} />
        ) : null}
      </TouchableOpacity>
    );
  }

  async function isValid() {
    var isValid = true;
    var communicationLanguage = communicationLanguageList
      .filter((item) => item.isSelected)
      .map(({ key }) => key);

    var appLanguage = appLanguageList.filter((item) => item.isSelected);

    if (!communicationLanguage || communicationLanguage.length === 0) {
      isValid = false;
      setSuccessAlert(true);
      setSuccessMessage(t("select_language_alert"));
    }

    if (isValid && (await Utils.isNetworkConnected())) {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
        current_language: appLanguage[0].key,
        communication_language: communicationLanguage.toString(),
      };
      dispatch(
        changeLanguage(body, (data, isSuccess) => {
          if (isSuccess) {
            i18n.changeLanguage(appLanguage.toString());
            AsyncStorage.setItem("@language", appLanguage[0].key);
            setAlertMessage(data.message);
            setAlertVisible(true);
          }
        })
      );
    }
  }

  return (
    <>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: 'white'
      }}>
        <View
          style={{
            backgroundColor: Colors.white,
            paddingHorizontal: ScaleSize.spacing_small,
          }}
        >
          <Header
            title={t("choose_language")}
            goBack={() => navigation.goBack()}
          />
        </View>
        <ModalProgressLoader visible={isChangeLanguageLoading} />
        <View style={styles.container}>
          <View style={styles.languageArea}>
            <Text style={styles.titleText}>{t("app_language")}</Text>
            {appLanguageList.map((item, index) => (
              <RenderItem
                item={item}
                index={index}
                onPress={() => {
                  var languageList = appLanguageList.map((item, index) => {
                    item.isSelected = false;
                    return item;
                  });
                  languageList[index].isSelected = !item.isSelected;
                  setAppLanguageList(languageList);
                }}
              />
            ))}
          </View>

          <View style={styles.languageArea}>
            <Text style={styles.titleText}>{t("communication_language")}</Text>
            {communicationLanguageList.map((item, index) => (
              <RenderItem
                item={item}
                index={index}
                onPress={() => {
                  var languageList = [...communicationLanguageList];
                  languageList[index].isSelected = !item.isSelected;
                  setCommunicationList(languageList);
                }}
              />
            ))}
          </View>

          <View style={styles.saveBtn}>
            <PrimaryButton string={t("save")} onPress={isValid} />
          </View>

          <AlertBox
            visible={successAlert}
            title={"Alert"}
            message={successMsg}
            positiveBtnText={"OK"}
            onPress={() => {
              setSuccessAlert(false);
            }}
            onPressNegative={() => setSuccessAlert(false)}
          />
        </View>
        <AlertBox
          visible={alertVisible}
          title={"Success"}
          message={alertMessage}
          positiveBtnText="OK"
          onPress={() => {
            setAlertVisible(false);
            navigation.goBack();
          }}
        />
      </SafeAreaView>
    </>
  );
};

export default CommunicationLanguage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_large,
  },
  languageArea: {
    width: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  titleText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text - 2,
    marginTop: ScaleSize.spacing_medium,
    color: Colors.black,
  },
  checkIcon: {
    position: "absolute",
    height: ScaleSize.large_icon,
    width: ScaleSize.large_icon,
    right: ScaleSize.spacing_medium,
  },
  itemContainer: (isCommunicationFrenchLanguageSelected) => ({
    backgroundColor: isCommunicationFrenchLanguageSelected
      ? Colors.primary
      : Colors.white,
    width: "100%",
    height: ScaleSize.spacing_extra_large - 5,
    margin: ScaleSize.spacing_small,
    alignSelf: "center",
    padding: ScaleSize.spacing_semi_medium,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: Colors.primary,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: ScaleSize.spacing_medium,
  }),
  itemText: (isCommunicationFrenchLanguageSelected) => ({
    fontFamily: AppFonts.semi_bold,
    color: isCommunicationFrenchLanguageSelected
      ? Colors.white
      : Colors.primary,
    fontSize: TextFontSize.small_text,
  }),
  saveBtn: {
    width: "100%",
    height: ScaleSize.spacing_large * 3,
    position: "absolute",
    bottom: ScaleSize.spacing_medium,
  },
});
