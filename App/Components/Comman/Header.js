import {
  Image,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Colors,
  ScaleSize,
  Images,
  TextFontSize,
  AppFonts,
} from "../../Resources";

const Header = (props) => {
  const { title, goBack } = props;

  return (
    <View style={styles.topBar}>
      <StatusBar backgroundColor={Colors.white} barStyle={"dark-content"} />
      <TouchableOpacity onPress={goBack} style={styles.backBtn}>
        <Image style={styles.backBtnIcon} source={Images.backBtn} />
      </TouchableOpacity>
      <Text style={styles.becomeDriverText}>{title}</Text>
      {props.source ? (
        <TouchableOpacity onPress={props.onPressCall} style={styles.callBtn}>
          <Image style={styles.callBtnIcon} source={props.source} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    backgroundColor: Colors.white,
    paddingHorizontal: ScaleSize.spacing_medium,
    paddingVertical: ScaleSize.spacing_small,
  },
  backBtn: {
    position: "absolute",
    padding: 10,
    alignItems: "flex-start",
    left: ScaleSize.spacing_small,
  },
  backBtnIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    resizeMode: "contain",
  },
  becomeDriverText: {
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.semi_medium_text,
    color: Colors.black,
  },
  callBtn: {
    position: "absolute",
    right: ScaleSize.spacing_medium,
  },
  callBtnIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    resizeMode: "contain",
  },
});
