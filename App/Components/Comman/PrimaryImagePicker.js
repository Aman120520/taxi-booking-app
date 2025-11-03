import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import {
  Colors,
  Strings,
  ScaleSize,
  TextFontSize,
  AppFonts,
} from '../../Resources';

const PrimaryImagePicker = (props) => {

  return (
    <>
      <Text style={styles.imagePickerHeadingText}>{props.string}</Text>
      <View style={styles.ImagePickerContainer}>
        <TouchableOpacity onPress={props.onPress} style={styles.imagePickerBtn}>
          <Text style={styles.imagePickerBtnText}>
            {Strings.upload_file_or_take_photo}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  )
}

export default PrimaryImagePicker

const styles = StyleSheet.create({
  imagePickerHeadingText: {
    color: Colors.black,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    marginTop: ScaleSize.spacing_semi_medium,
    alignSelf: 'flex-start',
    marginLeft: ScaleSize.spacing_medium
  },
  ImagePickerContainer: {
    width: '90%',
    backgroundColor: Colors.textinput_low_opacity,
    margin: ScaleSize.spacing_small,
    padding: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.small_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderStyle: 'dashed',
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerBtn: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: ScaleSize.spacing_small,
  },
  imagePickerBtnText: {
    color: Colors.primary,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
  },
})
