import { Platform } from "react-native";
import { getLayoutSize, getSmallLayoutSize } from "./ResponsiveHelper";

export const ScaleSize = {
  spacing_minimum: getLayoutSize(1),
  spacing_very_small: getLayoutSize(5),
  spacing_small: getLayoutSize(8),
  spacing_semi_medium: getLayoutSize(15),
  spacing_medium: getLayoutSize(20),
  spacing_semi_large: getLayoutSize(25),
  spacing_large: getLayoutSize(30),
  spacing_very_large: getLayoutSize(50),
  spacing_extra_large: getLayoutSize(70),
  tab_height: getLayoutSize(80),

  //Icons
  dropdown_arrow_icon: getLayoutSize(10),
  very_small_icon: getLayoutSize(13),
  small_icon: getLayoutSize(20),
  medium_icon: getLayoutSize(22),
  large_icon: getLayoutSize(24),
  tab_profile_icon: getLayoutSize(60),
  flatlist_tab_icon: getLayoutSize(15),
  tab_icon: getLayoutSize(33),
  very_large_icon: getLayoutSize(35),
  extra_large_icon: getLayoutSize(45),
  media_modal_icon: getLayoutSize(75),
  counter_ellipse_icon: getLayoutSize(75),

  //BorderRadius
  primary_border_radius: getLayoutSize(40),
  medium_border_radius: getLayoutSize(30),
  semi_medium_radius: getLayoutSize(25),
  small_border_radius: getLayoutSize(20),
  tab_image: getLayoutSize(70),
  very_small_border_radius: getLayoutSize(10),
  primary_border_width: getLayoutSize(2),
  smallest_border_width: getLayoutSize(1),
  bold_border_width: getLayoutSize(3),
  seprater_line_height: getLayoutSize(2),
  seprater_line_width: getLayoutSize(80),
  dropdown_width: getLayoutSize(70),

  //Images
  very_small_image: getLayoutSize(85),
  small_image: getLayoutSize(100),
  medium_image: getLayoutSize(120),
  semi_medium: getLayoutSize(140),
  large_image: getLayoutSize(200),
  largest_image: getLayoutSize(220),
  profile_icon: getLayoutSize(50),
  profile_icon_padding: getLayoutSize(38),
  seatsAndRideDetailsTab: getLayoutSize(170),
  progress_bar_radius: getLayoutSize(47),
  indicator_active_width: getLayoutSize(58),
  indicator_inactive_width: getLayoutSize(23),
  font_spacing: Platform.OS === "ios" ? 0 : getLayoutSize(2),

  //small layout
  onboading_small_spacing: getSmallLayoutSize(15),
  onboading_large_spacing: getSmallLayoutSize(70),
};
