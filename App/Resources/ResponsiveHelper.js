import { Dimensions, PixelRatio } from "react-native";
const { height, width } = Dimensions.get("window");

const aspectRatio =
  width / (Platform.OS === "ios" ? 480 : width < 350 ? 580 : 470);

const getLayoutSize = (valueDimen) => {
  var newScale = (aspectRatio * valueDimen - valueDimen) * 0.5 + valueDimen;
  return newScale;
};

const getFontSize = (valueFontSize) => {
  var newScale =
    (aspectRatio * valueFontSize - valueFontSize) * 0.6 + valueFontSize;
  return newScale;
};

const getSmallLayoutSize = (valueDimen) => {
  var newScale = (aspectRatio * valueDimen - valueDimen) * 0.5 + valueDimen;
  return newScale;
};

const getSmallFontSize = (valueFontSize) => {
  var newScale =
    (aspectRatio * valueFontSize - valueFontSize) * 0.98 + valueFontSize;
  return newScale;
};

export { getLayoutSize, getFontSize, getSmallLayoutSize, getSmallFontSize };
