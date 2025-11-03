import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Text,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import { getDirections } from "../../Actions/Intercity";
import Geolocation from "@react-native-community/geolocation";

const DirectionMapView = ({ data }) => {
  const { t, i18n } = useTranslation();
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
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  const mapViewRef = useRef();

  useEffect(() => {
    if (isTracking) {
      const watchId = Geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => console.error("Error in geolocation:", error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );

      return () => {
        Geolocation.clearWatch(watchId);
      };
    }
  }, [isTracking]);

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

  const fetchDirections = async () => {
    if (origin && destination) {
      const body = {
        token: "f7b0e044d0bf9992b1123510ab559f5689ffsewwe23",
        origin_latitude: data.pickup_latitude,
        origin_longitude: data.pickup_longitude,
        destination_latitude: data.dropoff_latitude,
        destination_longitude: data.dropoff_longitude,
      };

      dispatch(
        getDirections(body, (items) => {
          if (items && items.data && items.data.routes) {
            const decode1 = items.data.routes[0].legs.reduce(
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

  const decodePolyline = (encodeData) => {
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

        let dlat = (value & 1) !== 0 ? ~(value >> 1) : value >> 1;
        lat += dlat;

        shift = 0;
        value = 0;
        do {
          i = encodedPoint.charAt(indexPointLength++).charCodeAt(0) - 63;
          value |= (i & 0x1f) << shift;
          shift += 5;
        } while (i >= 0x20);

        let dlng = (value & 1) !== 0 ? ~(value >> 1) : value >> 1;
        lng += dlng;

        pointsCordinate.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
      }
    }
    return pointsCordinate;
  };

  const fitMapViewBetweenMarkers = (coordinates) => {
    if (coordinates.length > 0 && mapViewRef.current) {
      const northeast = coordinates[0];
      const southwest = coordinates[coordinates.length - 1];

      mapViewRef.current.fitToCoordinates([northeast, southwest], {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
      });
    }
  };

  const MapViewContainer = () => {
    return (
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          provider={PROVIDER_GOOGLE}
          ref={mapViewRef}
          initialRegion={{
            latitude: currentLocation?.latitude || origin.latitude,
            longitude: currentLocation?.longitude || origin.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
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

          {currentLocation && (
            <Marker coordinate={currentLocation} title="Current Location">
              <Text>
                Latitude: {currentLocation.latitude}, Longitude:{" "}
                {currentLocation.longitude}
              </Text>
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
          style={styles.liveTrackingButton}
          onPress={() => setIsTracking(!isTracking)}
        >
          <Text style={styles.liveTrackingText}>
            {isTracking ? "Stop " : "Start "}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fullScreenButton}
          onPress={() => setFullScreen(!isFullScreen)}
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
  };

  const AddressContainer = () => {
    return (
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
    );
  };

  return (
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
  );
};

// import {
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Modal,
// } from "react-native";
// import React, { useEffect, useState, useRef } from "react";
// import {
//   Colors,
//   ScaleSize,
//   TextFontSize,
//   Images,
//   AppFonts,
// } from "../../Resources";
// import "../../Resources/Languages/index";
// import { useTranslation } from "react-i18next";
// import { useDispatch } from "react-redux";
// import MapView, { Marker, Polyline } from "react-native-maps";
// import { getDirections } from "../../Actions/Intercity";

// const DirectionMapView = ({ data }) => {
//   const { t, i18n } = useTranslation();
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [isTracking, setIsTracking] = useState(false);

//   const dispatch = useDispatch();
//   const [watchId, setWatchId] = useState(null);

//   useEffect(() => {
//     let id = null;

//     if (isTracking) {
//       id = navigator.geolocation.watchPosition(
//         (position) => {
//           setCurrentLocation({
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude,
//           });
//         },
//         (error) => console.error(error),
//         { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
//       );
//     } else {
//       if (watchId !== null) {
//         navigator.geolocation.clearWatch(watchId);
//         setWatchId(null);
//       }
//     }

//     // Cleanup on component unmount and when tracking is stopped
//     return () => {
//       if (id !== null) {
//         navigator.geolocation.clearWatch(id);
//       }
//     };
//   }, [isTracking]);

//   const [origin, setOrigin] = useState({
//     latitude: data.pickup_latitude,
//     longitude: data.pickup_longitude,
//   });
//   const [destination, setDestination] = useState({
//     latitude: data.dropoff_latitude,
//     longitude: data.dropoff_longitude,
//   });
//   const [coordinates, setCoordinates] = useState([]);

//   const [isFullScreen, setFullScreen] = useState(false);

//   useEffect(() => {
//     if (
//       data.pickup_latitude &&
//       data.pickup_longitude &&
//       data.dropoff_latitude &&
//       data.dropoff_longitude
//     ) {
//       fetchDirections();
//     }
//   }, [
//     data.pickup_latitude,
//     data.pickup_longitude,
//     data.dropoff_latitude,
//     data.dropoff_longitude,
//   ]);

//   function decodePolyline(encodeData) {
//     let pointsCordinate = [];
//     for (let step of encodeData) {
//       let encodedPoint = step.polyline.points;
//       let indexPointLength = 0,
//         len = encodedPoint.length;
//       let lat = 0,
//         lng = 0;
//       while (indexPointLength < len) {
//         let i,
//           shift = 0,
//           value = 0;
//         do {
//           i = encodedPoint.charAt(indexPointLength++).charCodeAt(0) - 63;
//           value |= (i & 0x1f) << shift;
//           shift += 5;
//         } while (i >= 0x20);

//         let dlat = (value & 1) != 0 ? ~(value >> 1) : value >> 1;
//         lat += dlat;

//         shift = 0;
//         value = 0;
//         do {
//           i = encodedPoint.charAt(indexPointLength++).charCodeAt(0) - 63;
//           value |= (i & 0x1f) << shift;
//           shift += 5;
//         } while (i >= 0x20);

//         let dlng = (value & 1) != 0 ? ~(value >> 1) : value >> 1;
//         lng += dlng;

//         pointsCordinate.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
//       }
//     }
//     return pointsCordinate;
//   }

//   const fetchDirections = async () => {
//     if (origin && destination) {
//       var body = {
//         token: "f7b0e044d0bf9992b1123510ab559f5689ffsewwe23",
//         origin_latitude: data.pickup_latitude,
//         origin_longitude: data.pickup_longitude,
//         destination_latitude: data.dropoff_latitude,
//         destination_longitude: data.dropoff_longitude,
//       };
//       dispatch(
//         getDirections(body, async (items) => {
//           if (items && items.data && items.data.routes) {
//             var decode1 = items.data.routes[0].legs.reduce(
//               (current, current1) => {
//                 return [...current, ...decodePolyline(current1.steps)];
//               },
//               []
//             );
//             setCoordinates(decode1);
//           }
//         })
//       );
//     }
//   };

//   useEffect(() => {
//     if (isFullScreen && coordinates && coordinates.length > 1) {
//       setTimeout(() => {
//         fitMapViewBetweenMarkers(coordinates);
//       }, 1000);
//     }
//   }, [isFullScreen]);

//   const mapViewRef = useRef();

//   const fitMapViewBetweenMarkers = (coordinates) => {
//     const northeast = coordinates[0];
//     const southwest = coordinates[coordinates.length - 1];

//     mapViewRef.current.fitToCoordinates([northeast, southwest], {
//       edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
//     });
//   };

//   function MapViewContainer() {
//     return (
//       <View style={{ flex: 1 }}>
//         <MapView
//           style={{ flex: 1 }}
//           ref={mapViewRef}
//           initialRegion={{
//             latitude: currentLocation?.latitude || origin.latitude,
//             longitude: currentLocation?.longitude || origin.longitude,
//             latitudeDelta: 0.0922,
//             longitudeDelta: 0.0421,
//           }}
//           scrollEnabled={isFullScreen}
//           zoomEnabled={isFullScreen}
//         >
//           {origin && (
//             <Marker coordinate={origin} title="Origin">
//               <Image
//                 style={{
//                   width: ScaleSize.spacing_medium * 2,
//                   height: ScaleSize.spacing_medium * 2,
//                 }}
//                 source={Images.map_icon_a}
//               />
//             </Marker>
//           )}

//           {destination && (
//             <Marker coordinate={destination} title="Destination">
//               <Image
//                 style={{
//                   width: ScaleSize.spacing_medium * 2,
//                   height: ScaleSize.spacing_medium * 2,
//                 }}
//                 source={Images.map_icon_b}
//               />
//             </Marker>
//           )}

//           {coordinates.length > 0 && (
//             <Polyline
//               coordinates={coordinates}
//               strokeColor={Colors.primary}
//               strokeWidth={5}
//             />
//           )}
//         </MapView>

//         <TouchableOpacity
//           style={styles.liveTrackingButton}
//           onPress={() => {
//             setIsTracking(!isTracking);
//           }}
//         >
//           <Text style={styles.liveTrackingText}>
//             {isTracking ? "Stop Tracking" : "Start Tracking"}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.fullScreenButton}
//           onPress={() => {
//             setFullScreen(!isFullScreen);
//           }}
//         >
//           <Image
//             style={{
//               width: ScaleSize.spacing_medium * 3,
//               height: ScaleSize.spacing_medium * 3,
//             }}
//             source={Images.full_screen}
//           />
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   function AddressContainer() {
//     return (
//       <>
//         <View style={styles.addressContainer}>
//           <View style={styles.navigationArea}>
//             <Image style={styles.locationIcon} source={Images.location_icon} />
//             <View style={styles.navigatorLine} />
//             <Image style={styles.dropoffIcon} source={Images.drop_off_icon} />
//           </View>

//           <View style={styles.addressTextArea}>
//             <View style={styles.pickupDropAddressArea}>
//               <Text style={styles.titleBarText}>{t("pickup_address")}</Text>

//               <Text style={styles.descriptionText}>{data.pickup_address}</Text>

//               <Text style={styles.titleBarText}>{t("drop_off_address")}</Text>

//               <Text style={styles.descriptionText}>{data.dropoff_address}</Text>
//             </View>
//           </View>
//         </View>
//       </>
//     );
//   }

//   return (
//     <View style={{ flex: 1 }}>
//       {isFullScreen ? (
//         <Modal visible={isFullScreen}>
//           <MapViewContainer />
//           <AddressContainer />
//         </Modal>
//       ) : (
//         <View style={{ width: "100%", height: 270 }}>
//           <MapViewContainer />
//         </View>
//       )}
//     </View>
//   );
// };

export default DirectionMapView;

const styles = StyleSheet.create({
  fullScreenButton: {
    width: ScaleSize.spacing_semi_large * 2,
    height: ScaleSize.spacing_semi_large * 2,
    position: "absolute",
    top: ScaleSize.spacing_small,
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
  pickupAddressTitleBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  liveTrackingButton: {
    position: "absolute",
    backgroundColor: "white",
    width: 45,
    height: 45,
    right: 10,
    top: 70,
    borderWidth: 1,
    borderColor: "black",
  },
  liveTrackingText: {
    color: "black",
  },
});

// // function decodePolyline(encodeData) {

// // 	let pointsCordinate = [];
// // 	for (let step of encodeData) {
// // 		let encodedPoint = step.polyline.points;
// // 		let indexPointLength = 0, len = encodedPoint.length;
// // 		let lat = 0, lng = 0;
// // 		while (indexPointLength < len) {
// // 			let i, shift = 0, value = 0;
// // 			do {
// // 				b = encodedPoint.charAt(indexPointLength++).charCodeAt(0) - 63;
// // 				value |= (i & 0x1f) << shift;
// // 				shift += 5;
// // 			} while (i >= 0x20);

// // 			let dlat = ((value & 1) != 0 ? ~(value >> 1) : (value >> 1));
// // 			lat += dlat;
// // 			shift = 0;
// // 			value = 0;
// // 			do {
// // 				i = encodedPoint.charAt(indexPointLength++).charCodeAt(0) - 63;
// // 				value |= (i & 0x1f) << shift;
// // 				shift += 5;
// // 			} while (i >= 0x20);
// // 			let destinationlng = ((value & 1) != 0 ? ~(value >> 1) : (value >> 1));
// // 			lng += destinationlng;

// // 			pointsCordinate.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
// // 		}
// // 	}
// // 	return points;
// // }
