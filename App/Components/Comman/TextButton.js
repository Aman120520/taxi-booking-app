import { StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const TextButton = (props) => {
  return (
    <TouchableOpacity {...props} style={props.buttonStyle}>
      <Image source={props.source} style={props.iconStyle} />
      <Text style={props.textStyle}>{props.strings}</Text>
    </TouchableOpacity>
  );
};

export default TextButton;

const styles = StyleSheet.create({});
