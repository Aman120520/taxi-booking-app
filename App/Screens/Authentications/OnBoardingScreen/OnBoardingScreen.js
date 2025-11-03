import {
  StyleSheet,
  Image,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState, useRef } from "react";
import PagerView from "react-native-pager-view";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import PrimaryButton from "../../../Components/Comman/PrimaryButton";
import Indicator from "../../../Components/Comman/Indicator";
import "../../../Resources/Languages/index";
import { useTranslation } from "react-i18next";

const OnBoardingScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();

  ///////////////Refs///////////////////
  const ref = useRef();

  ///////////////States/////////////////
  const [index, setIndex] = useState(0);

  ///////////Pagerview Data///////////
  var arrayPage = [0, 1, 2];
  var arrayItems = [
    {
      image: Images.onboarding_screen_page1_bg,
      text1: t("onboarding_screen_1_header"),
      text2: t("onboarding_screen_1_description"),
      key: "1",
    },
    {
      image: Images.onboarding_screen_page2_bg,
      text1: t("onboarding_screen_2_header"),
      text2: t("onboarding_screen_2_description"),
      key: "2",
    },
    {
      image: Images.onboarding_screen_page3_bg,
      text1: t("onboarding_screen_3_header"),
      text2: t("onboarding_screen_3_description"),
      key: "3",
    },
  ];

  /////////////Function for Skip and Next Buttons/////////////
  function handleNext() {
    if (index < 2) {
      setIndex(index + 1);
      ref.current?.setPage(index + 1);
    }
  }

  function handleBack() {
    setIndex(index - 1);
    ref.current?.setPage(index - 1);
  }

  return (
    <View style={styles.container}>
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        ref={ref}
        onPageSelected={(event) => setIndex(event.nativeEvent.position)}
        orientation="horizontal"
      >
        {arrayItems.map((indexPage) => (
          <View key={indexPage.key} style={styles.rootContainer}>
            <Image source={indexPage.image} style={styles.bgImg} />
            <View style={styles.textContainer}>
              <Text style={styles.headerText}>{indexPage.text1}</Text>
              <Text style={styles.descriptionText}>{indexPage.text2}</Text>
            </View>
          </View>
        ))}
      </PagerView>

      <View style={styles.pageIndicator}>
        <Indicator
          ref={ref}
          height={ScaleSize.spacing_small}
          activeWidth={ScaleSize.indicator_active_width}
          inActiveWidth={ScaleSize.indicator_inactive_width}
          index={index}
          arrayPage={arrayPage}
          setIndex={index}
          indexPage={index}
        />
      </View>

      {index < 2 ? (
        <View style={styles.btnArea}>
          {index === 0 ? (
            <View style={styles.skipBackBtn}>
              {index <= 0 && (
                <TouchableOpacity
                  style={styles.skipBackBtn}
                  onPress={() =>
                    index <= 0 && navigation.navigate("SignInScreen")
                  }
                >
                  <Text style={styles.skipText}>{t("skip")}</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.skipBackBtn}>
              {index === 1 && (
                <TouchableOpacity
                  style={styles.skipBackBtn}
                  onPress={handleBack}
                >
                  <Text style={styles.skipText}>{t("back")}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View style={{ flex: 1 }} />
          {index < 2 && (
            <View style={styles.nextBtn}>
              <PrimaryButton string={t("next")} onPress={handleNext} />
            </View>
          )}
        </View>
      ) : (
        <View style={styles.getStatedBtn}>
          <PrimaryButton
            string={t("get_started")}
            onPress={() => navigation.navigate("SignInScreen")}
          />
        </View>
      )}
    </View>
  );
};

export default OnBoardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingBottom: ScaleSize.spacing_small,
  },
  pagerView: {
    height: "100%",
    width: "100%",
    flex: 1,
    alignItems: "center",
  },
  headerText: {
    fontSize: TextFontSize.onboarding_medium_text + 2,
    margin: ScaleSize.spacing_medium + 5,
    bottom: Platform.OS === "ios" ? ScaleSize.font_spacing + 4 : null,
    color: Colors.white,
    fontFamily: AppFonts.semi_bold,
  },
  descriptionText: {
    fontSize: TextFontSize.onboarding_small_text,
    textAlign: "center",
    color: Colors.white,
    bottom: ScaleSize.spacing_large,
    paddingHorizontal: ScaleSize.spacing_large,
    fontFamily: AppFonts.medium,
  },
  pageIndicator: {
    flexDirection: "row",
    top: ScaleSize.spacing_medium,
  },
  textContainer: {
    alignItems: "center",
    justifyContent: "center",
    bottom: -ScaleSize.spacing_medium,
    position: "absolute",
  },
  btnArea: {
    flexDirection: "row",
    alignItems: "center",
    top: ScaleSize.spacing_medium,
    flex: 0.2,
    justifyContent: "space-between",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  getStatedBtn: {
    flexDirection: "row",
    alignItems: "center",
    top: ScaleSize.spacing_medium,
    flex: 0.2,
    justifyContent: "space-between",
    paddingHorizontal: ScaleSize.spacing_semi_medium - 3,
  },
  skipText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.white,
    fontSize: TextFontSize.semi_medium_text,
  },
  skipBackBtn: {
    paddingHorizontal: ScaleSize.spacing_small,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: "pink",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  bgImg: {
    width: "100%",
    bottom: 110,
    resizeMode: "contain",
  },
  nextBtn: {
    flex: 1,
    paddingHorizontal: ScaleSize.spacing_small,
    height: ScaleSize.spacing_extra_large * 1.3,
  },
});
