import { getFontSize, getSmallFontSize } from "./ResponsiveHelper";

export const TextFontSize = {
  extra_small_text: getFontSize(14),
  very_small_text: getFontSize(16),
  small_text: getFontSize(18),
  semi_medium_text: getFontSize(21),
  medium_text: getFontSize(23),
  large_text: getFontSize(27),
  very_large_text: getFontSize(31),
  extra_large_text: getFontSize(41),
  largest_text: getFontSize(71),
  tabLabelText: getFontSize(11),
  filter_option: getFontSize(15),

  //smallFontSize
  onboarding_small_text: getSmallFontSize(20),
  onboarding_medium_text: getSmallFontSize(26),
  onboarding_large_text: getSmallFontSize(23),
};
