import { StyleSheet, TextInput } from "react-native";
import { Colors, ScaleSize, TextFontSize, AppFonts } from "../../Resources";

const VerificationCodeTextinput = (props) => {
  return <TextInput {...props} style={styles.textInput} ref={props.refs} />;
};

export default VerificationCodeTextinput;

const styles = StyleSheet.create({
  textInput: {
    flexGrow: 3,
    paddingVertical: 0,
    margin: ScaleSize.spacing_small,
    alignItems: "center",
    textAlign: "center",
    fontSize: TextFontSize.very_large_text + 2,
    textAlignVertical: "center",
    justifyContent: "flex-end",
    fontFamily: AppFonts.bold,
    color: Colors.black,
    borderBottomWidth: ScaleSize.bold_border_width,
    borderColor: Colors.primary,
  },
});
