import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Modal,
  Platform,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import "../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { getDirections } from "../../Actions/Intercity";
import Constant from "../../Network/Constant";

const DirectionMapView = ({ data }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [origin, setOrigin] = useState({
    latitude: data.pickup_latitude,
    longitude: data.pickup_longitude,
  });
  const [destination, setDestination] = useState({
    latitude: data.dropoff_latitude,
    longitude: data.dropoff_longitude,
  });
  const [coordinates, setCoordinates] = useState([]);

  const [isFullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (
      data.pickup_latitude &&
      data.pickup_longitude &&
      data.dropoff_latitude &&
      data.dropoff_longitude
    ) {
      fetchDirections();
    }
  }, [
    data.pickup_latitude,
    data.pickup_longitude,
    data.dropoff_latitude,
    data.dropoff_longitude,
  ]);

  function decodePolyline(encodeData) {
    let pointsCordinate = [];
    for (let step of encodeData) {
      let encodedPoint = step.polyline.points;
      let indexPointLength = 0,
        len = encodedPoint.length;
      let lat = 0,
        lng = 0;
      while (indexPointLength < len) {
        let i,
          shift = 0,
          value = 0;
        do {
          i = encodedPoint.charAt(indexPointLength++).charCodeAt(0) - 63;
          value |= (i & 0x1f) << shift;
          shift += 5;
        } while (i >= 0x20);

        let dlat = (value & 1) != 0 ? ~(value >> 1) : value >> 1;
        lat += dlat;

        shift = 0;
        value = 0;
        do {
          i = encodedPoint.charAt(indexPointLength++).charCodeAt(0) - 63;
          value |= (i & 0x1f) << shift;
          shift += 5;
        } while (i >= 0x20);

        let dlng = (value & 1) != 0 ? ~(value >> 1) : value >> 1;
        lng += dlng;

        pointsCordinate.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
      }
    }
    return pointsCordinate;
  }

  const fetchDirections = async () => {
    if (origin && destination) {
      var body = {
        token: Constant.DIRECTIONS_API_TOKEN || "YOUR_DIRECTIONS_API_TOKEN",
        origin_latitude: data.pickup_latitude,
        origin_longitude: data.pickup_longitude,
        destination_latitude: data.dropoff_latitude,
        destination_longitude: data.dropoff_longitude,
      };
      dispatch(
        getDirections(body, async (items) => {
          if (items && items.data && items.data.routes) {
            var decode1 = items.data.routes[0].legs.reduce(
              (current, current1) => {
                return [...current, ...decodePolyline(current1.steps)];
              },
              []
            );
            setCoordinates(decode1);
          }
        })
      );
    }
  };

  useEffect(() => {
    if (isFullScreen && coordinates && coordinates.length > 1) {
      setTimeout(() => {
        fitMapViewBetweenMarkers(coordinates);
      }, 1000);
    }
  }, [isFullScreen]);

  const mapViewRef = useRef();

  const fitMapViewBetweenMarkers = (coordinates) => {
    const northeast = coordinates[0];
    const southwest = coordinates[coordinates.length - 1];

    mapViewRef.current.fitToCoordinates([northeast, southwest], {
      edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
    });
  };

  function MapViewContainer() {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          ref={mapViewRef}
          initialRegion={{
            latitude: origin?.latitude || 0,
            longitude: origin?.longitude || 0,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
          scrollEnabled={isFullScreen}
          zoomEnabled={isFullScreen}
        >
          {origin && (
            <Marker coordinate={origin} title="Origin">
              <Image
                style={{
                  width: ScaleSize.spacing_medium * 2,
                  height: ScaleSize.spacing_medium * 2,
                }}
                source={Images.map_icon_a}
              />
            </Marker>
          )}

          {destination && (
            <Marker coordinate={destination} title="Destination">
              <Image
                style={{
                  width: ScaleSize.spacing_medium * 2,
                  height: ScaleSize.spacing_medium * 2,
                }}
                source={Images.map_icon_b}
              />
            </Marker>
          )}

          {coordinates.length > 0 && (
            <Polyline
              coordinates={coordinates}
              strokeColor={Colors.primary}
              strokeWidth={5}
            />
          )}
        </MapView>

        <TouchableOpacity
          style={[
            styles.fullScreenButton,
            {
              top:
                Platform.OS === "ios" && isFullScreen
                  ? ScaleSize.spacing_very_large
                  : ScaleSize.spacing_small,
            },
          ]}
          onPress={() => {
            setFullScreen(!isFullScreen);
          }}
        >
          <Image
            style={{
              width: ScaleSize.spacing_medium * 3,
              height: ScaleSize.spacing_medium * 3,
            }}
            source={Images.full_screen}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function AddressContainer() {
    return (
      <>
        <View style={styles.addressContainer}>
          <View style={styles.navigationArea}>
            <Image style={styles.locationIcon} source={Images.location_icon} />
            <View style={styles.navigatorLine} />
            <Image style={styles.dropoffIcon} source={Images.drop_off_icon} />
          </View>

          <View style={styles.addressTextArea}>
            <View style={styles.pickupDropAddressArea}>
              <Text style={styles.titleBarText}>{t("pickup_address")}</Text>

              <Text style={styles.descriptionText}>{data.pickup_address}</Text>

              <Text style={styles.titleBarText}>{t("drop_off_address")}</Text>

              <Text style={styles.descriptionText}>{data.dropoff_address}</Text>
            </View>
          </View>
        </View>
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        {isFullScreen ? (
          <Modal visible={isFullScreen}>
            <MapViewContainer />
            <AddressContainer />
          </Modal>
        ) : (
          <View style={{ width: "100%", height: 270 }}>
            <MapViewContainer />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DirectionMapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  fullScreenButton: {
    width: ScaleSize.spacing_semi_large * 2,
    height: ScaleSize.spacing_semi_large * 2,
    position: "absolute",
    right: ScaleSize.spacing_medium,
  },
  addressContainer: {
    width: "87%",
    flex: 1,
    elevation: 10,
    alignSelf: "center",
    bottom: ScaleSize.spacing_large,
    borderRadius: ScaleSize.small_border_radius,
    position: "absolute",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    padding: ScaleSize.spacing_medium,
    marginBottom: Platform.OS === "ios" ? ScaleSize.spacing_medium : 0,
    justifyContent: "fles-start",
    flexDirection: "row",
  },
  navigationArea: {
    alignItems: "center",
    flex: 0.2,
    marginRight: ScaleSize.spacing_semi_medium,
    left: ScaleSize.spacing_small,
    top: ScaleSize.spacing_very_small,
    alignSelf: "flex-start",
    height: "70%",
    justifyContent: "flex-start",
  },
  pickupDropAddressArea: {
    flex: 1,
    left: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_semi_medium,
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleBarText: {
    top: ScaleSize.font_spacing,
    fontFamily: AppFonts.semi_bold,
    fontSize: TextFontSize.small_text - 1,
    color: Colors.black,
  },
  descriptionText: {
    fontFamily: AppFonts.medium,
    fontSize: TextFontSize.very_small_text - 2,
    color: Colors.gray,
  },
  dropoffIcon: {
    height: ScaleSize.large_icon,
    width: ScaleSize.medium_icon,
    resizeMode: "contain",
    tintColor: Colors.gray,
  },
  locationIcon: {
    height: ScaleSize.large_icon,
    width: ScaleSize.large_icon,
    tintColor: Colors.primary,
    marginBottom: ScaleSize.spacing_very_small,
    resizeMode: "contain",
  },
  navigatorLine: {
    width: ScaleSize.font_spacing,
    borderRightWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    flex: 1,
  },
});
