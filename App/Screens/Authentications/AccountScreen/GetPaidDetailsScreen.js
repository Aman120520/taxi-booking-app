import {
  StyleSheet,
  Text,
  View,
  Switch,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  TextButton,
  Header,
  ModalProgressLoader,
  PrimaryButton,
} from "../../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../../Resources";
import { useDispatch, useSelector } from "react-redux";
import { userDetails, logout } from "../../Actions/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import Utils from "../../../Helpers/Utils";
import { getPaidAccountDetails } from "../../../Actions/Settings";

const GetPaidDetailsScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.Authentication);
  const { isLoading, getPaidAccData } = useSelector((state) => state.Settings);

  const accountInformationData = [
    // {
    //   title: t("business_profile_name"),
    //   detail: getPaidAccData.business_profile_name,
    // },
    { title: t("ssn_last4"), detail: "...." },
    { title: t("your_bio"), detail: getPaidAccData.product_description },
    { title: t("country"), detail: getPaidAccData.country },
    { title: t("state_or_province"), detail: getPaidAccData.state },
    { title: t("city"), detail: getPaidAccData.city },
    { title: t("address"), detail: getPaidAccData.address },
    { title: t("postal_code"), detail: getPaidAccData.postal_code },
  ];
  const bankAccountData = [
    { title: t("acc_holder_name"), detail: getPaidAccData.account_holder_name },
    { title: t("acc_number"), detail: "...." + getPaidAccData.account_number },
    { title: t("routing_number"), detail: getPaidAccData.routing_number },
  ];

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      if (Utils.isNetworkConnected()) {
        const UserId = await AsyncStorage.getItem("@id");
        var body = {
          user_id: UserId,
        };
        dispatch(
          getPaidAccountDetails(body, (data, isSuccess) => {
            if (isSuccess) {
              console.log(getPaidAccData);
            }
          })
        );
      }
    } catch {}
  };
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <ModalProgressLoader visible={isLoading} />
        <View style={{ flexGrow: 1, backgroundColor: Colors.white }}>
          <Header title={t("get_paid")} goBack={() => navigation.goBack()} />
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.topBar}>
              <Text style={styles.mainTitle}>{t("acc_information")}</Text>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  navigation.navigate("GetPaidUpdateDetailsScreen")
                }
              >
                <Image source={Images.edit_icon} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.tabContainers}>
              {accountInformationData.map((item, index) => {
                return (
                  <View style={styles.informationTab} key={index}>
                    <Text style={styles.tabTitleText}>{item.title}</Text>
                    <Text style={styles.detailText}>{item.detail}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.bankAccTopBar}>
              <Text style={styles.mainTitle}>{t("bank_accounts")}</Text>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() =>
                  navigation.navigate("GetPaidUpdateDetailsScreen")
                }
              >
                <Image source={Images.edit_icon} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
            <View style={styles.tabContainers}>
              {bankAccountData.map((item, index) => {
                return (
                  <View style={styles.informationTab} key={index}>
                    <Text style={styles.tabTitleText}>{item.title}</Text>
                    <Text style={styles.detailText}>{item.detail}</Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
};

export default GetPaidDetailsScreen;

const styles = StyleSheet.create({
  container: {
    paddingBottom: ScaleSize.spacing_extra_large + 15,
    flexGrow: 1,
    paddingHorizontal: ScaleSize.spacing_large - 2,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: ScaleSize.spacing_small,
  },
  bankAccTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: ScaleSize.spacing_small,
    marginTop: ScaleSize.spacing_medium,
  },
  editBtn: {
    justifyContent: "center",
    alignItems: "center",
    bottom: ScaleSize.font_spacing,
  },
  editIcon: {
    height: ScaleSize.medium_icon + 4,
    width: ScaleSize.medium_icon + 4,
    resizeMode: "contain",
  },
  mainTitle: {
    fontSize: TextFontSize.small_text + 1,
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
  },
  tabContainers: {
    borderWidth: ScaleSize.smallest_border_width,
    borderColor: Colors.light_gray,
    borderRadius: ScaleSize.small_border_radius,
    paddingHorizontal: ScaleSize.spacing_medium,
    paddingBottom: ScaleSize.spacing_medium - 2,
  },
  informationTab: {
    marginTop: ScaleSize.spacing_semi_medium - 2,
  },
  tabTitleText: {
    color: Colors.black,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text - 2,
  },
  detailText: {
    color: Colors.gray,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text - 2,
  },
  updateBtn: {
    marginVertical: ScaleSize.spacing_medium,
  },
});
