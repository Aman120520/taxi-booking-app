import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  View,
  Image,
} from "react-native";
import React from "react";
import {
  Colors,
  Strings,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";

const SocialButton = ({
  onGoogleSignInPress,
  onFacebookSignInPress,
  onAppleSignInPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.socialBtn} onPress={onGoogleSignInPress}>
        <Image style={styles.socialMediaIcon} source={Images.google_icon} />
        <Text style={styles.connectText}>{Strings.sigin_with_google}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.socialBtn}
        onPress={onFacebookSignInPress}
      >
        <Image style={styles.socialMediaIcon} source={Images.facebook_icon} />
        <Text style={styles.connectText}>{Strings.sigin_with_facebook}</Text>
      </TouchableOpacity>

      {Platform.OS === "ios" && (
        <TouchableOpacity style={styles.socialBtn} onPress={onAppleSignInPress}>
          <Image style={styles.socialMediaIcon} source={Images.apple_icon} />
          <Text style={styles.connectText}>{Strings.signin_with_apple}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SocialButton;

const styles = StyleSheet.create({
  container: {
    width: "105%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: ScaleSize.spacing_large,
  },
  socialBtn: {
    width: "100%",
    margin: ScaleSize.spacing_very_small,
    alignSelf: "center",
    flexDirection: "row",
    padding: ScaleSize.spacing_semi_medium,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: 1,
    borderColor: Colors.light_gray,
    justifyContent: "center",
    alignItems: "center",
  },
  socialMediaIcon: {
    height: ScaleSize.large_icon,
    width: ScaleSize.large_icon,
    resizeMode: "contain",
    marginHorizontal: ScaleSize.spacing_small + 4,
  },
  connectText: {
    fontFamily: AppFonts.medium,
    color: Colors.black,
    top: ScaleSize.font_spacing,
    fontSize: TextFontSize.small_text,
  },
});
