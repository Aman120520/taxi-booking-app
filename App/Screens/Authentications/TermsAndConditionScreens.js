import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import React, { useEffect } from "react";
import {
  ScaleSize,
  AppFonts,
  TextFontSize,
  Colors,
  Images,
  Strings,
} from "../../Resources";
import { useWindowDimensions } from "react-native";
import RenderHtml, {
  HTMLElementModel,
  HTMLContentModel,
} from "react-native-render-html";
import { useDispatch, useSelector } from "react-redux";
import { termsOfSerivce } from "../../Actions/authentication";
import { Header, ModalProgressLoader } from "../../Components/Comman";
import { useTranslation } from "react-i18next";

const Webview = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const { tosData, isLoading } = useSelector((state) => state.Authentication);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(termsOfSerivce());
  }, []);

  const { width, height } = useWindowDimensions();

  const customHTMLElementModels = {
    "blue-circle": HTMLElementModel.fromCustomModel({
      tagName: "blue-circle",
      mixedUAStyles: {
        width: ScaleSize.spacing_very_large,
        height: ScaleSize.spacing_very_large,
        borderRadius: ScaleSize.semi_medium_radius,
        alignSelf: "center",
        backgroundColor: "blue",
      },
      contentModel: HTMLContentModel.block,
    }),
  };

  return (
    <>
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: 'white'
      }}>
        <View style={{ width: "100%", backgroundColor: "white" }}>
          <Header
            title={t("terms_of_service_btn")}
            goBack={() => navigation.goBack()}
          />
        </View>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

          <ModalProgressLoader visible={isLoading} />

          {/* <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
            >
              <Image style={styles.backBtnIcon} source={Images.backBtn} />
            </TouchableOpacity>
            <Text style={styles.becomeDriverText}>
              {Strings.terms_of_service_btn}
            </Text>
          </View> */}

          <RenderHtml
            contentWidth={width}
            contentHeight={height}
            customHTMLElementModels={customHTMLElementModels}
            source={{ html: tosData.content }}
          />

        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Webview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_medium + 5,
  },
  topBar: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: ScaleSize.spacing_large,
    marginBottom: ScaleSize.spacing_small,
  },
  backBtn: {
    position: "absolute",
    left: 0,
  },
  backBtnIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    resizeMode: "contain",
  },
  becomeDriverText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text,
    color: Colors.black,
  },
});
