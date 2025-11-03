import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors, ScaleSize } from "../../Resources";

const ProgressLoader = (props) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const colors = [Colors.primary, Colors.secondary];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Modal
      visible={props.visible}
      onRequestClose={props.onRequestClose}
      animationType="fade"
      transparent={true}
    >
      <StatusBar backgroundColor={Colors.modal_bg} barStyle={"light-content"} />
      <View style={styles.modalBg}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size={ScaleSize.spacing_very_large}
            color={colors[currentColorIndex]}
            animating={props.animating}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ProgressLoader;

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  loaderContainer: {
    backgroundColor: Colors.white,
    padding: ScaleSize.spacing_large,
    borderRadius: ScaleSize.spacing_medium,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
