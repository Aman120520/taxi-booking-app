import {
  Image,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  View,
  StatusBar,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  PrimaryButton,
  Textinput,
  Header,
  PrimaryDropDown,
  ModalProgressLoader,
} from "../../Components/Comman";
import {
  Colors,
  ScaleSize,
  TextFontSize,
  Images,
  AppFonts,
} from "../../Resources";
import {
  addIntercityRide,
  getDistance,
  updateIntercityRide,
} from "../../Actions/Intercity";
import Utils from "../../Helpers/Utils";
import moment from "moment";
import { driverDetails } from "../../Actions/authentication";
import "../../Resources/Languages/index";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { debounce } from "lodash";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GooglePlacesAutoComplete } from "../../Components/Comman/GooglePlacesAutoComplete";
import { AutocompleteDropdownContextProvider } from "react-native-autocomplete-dropdown";
import { getTimeZone } from "react-native-localize";
import DateTimePicker from "../../Components/Comman/DateTimePicker";
import CheckBox from "../../Components/Comman/CheckBox";
import AlertBox from "../../Components/Comman/AlertBox";

const generateTimeSlots = () => {
  const timeSlots = [];

  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const formattedMinute = minute < 10 ? `0${minute}` : minute;
      const ampm = hour < 12 ? "AM" : "PM";
      const time = `${formattedHour}:${formattedMinute} ${ampm}`;
      timeSlots.push({ label: time, value: time, hour, minute });
    }
  }
  return timeSlots;
};

const DriverPostRideScreen = ({ navigation, route }) => {
  const { t, i18n } = useTranslation();
  const { isLoading, userData } = useSelector((state) => state.Authentication);
  const rideDetails = route?.params?.rideDetails;
  const [refreshingData, setRefreshingData] = useState(false);
  const [pickupTwoId, setPickupTwoId] = useState();
  const [pickupThreeId, setPickupThreeId] = useState();
  const [dropoffTwoId, setDropoffTwoId] = useState();
  const [dropoffThreeId, setDropoffThreeId] = useState();

  const initRoutePickupAddress = rideDetails?.pickup_address
    ? retriveAutoSearchItem(
        rideDetails.pickup_address,
        rideDetails.pickup_city,
        rideDetails.pickup_latitude,
        rideDetails.pickup_longitude
      )
    : undefined;

  const intRouteDropoffAddress = rideDetails?.dropoff_address
    ? retriveAutoSearchItem(
        rideDetails.dropoff_address,
        rideDetails.dropoff_city,
        rideDetails.dropoff_latitude,
        rideDetails.dropoff_longitude
      )
    : undefined;

  ///////////// States /////////////
  const dispatch = useDispatch();
  const [pickupAddress, setPickupAddress] = useState(initRoutePickupAddress);
  const [dropOffAddress, setDropOffAddress] = useState(intRouteDropoffAddress);
  const [isAdditionalContainerShow, setIsAdditionalContainerShow] =
    useState(false);
  const [minDate, setMinDate] = useState(new Date());
  const [pickupTime, setPickupTime] = useState(rideDetails?.pickupTime);
  const [dropOffTime, setDropOffTime] = useState(rideDetails?.dropOffTime);
  const [dropOffTimeError, setDropOffTimeError] = useState(null);
  const [availableSeat, setAvailableSeat] = useState(rideDetails?.total_seat);
  const [isNextDay, setIsNextDay] = useState(false);
  const [isCheckedOnlyFemalePassengers, setCheckedOnlyFemalePassengers] =
    useState(rideDetails?.female_passenger === 1 ? true : false);
  const [isCheckedOnlyVerifiedPassengers, setCheckedOnlyVerifiedPassengers] =
    useState(rideDetails?.verified_passenger === 1 ? true : false);
  const [tripDetails, setTripDetails] = useState(rideDetails?.trip_details);
  const [date, setDate] = useState(rideDetails?.date);
  const [pickupDate, setPickupDate] = useState(rideDetails?.pickupDate);
  const [approxDropoffTimeError, setApproxDropoffTimeError] = useState();
  const [seatData, setSeatData] = useState([]);
  const [successAlert, setSuccessAlert] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoadingDialog, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [isFemale, setFemale] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");
  const [intercityMinimumFare, setIntercityMinimumFare] = useState("");
  const [intercityPerKm, setIntercityPerKm] = useState(
    rideDetails?.intercity_per_km
  );
  const [isCheckValidation, setIsCheckValidation] = useState(true);
  const [pickupDistance, setPickupDistance] = useState(
    rideDetails?.intercity_per_km
  );
  const [timeZone, setTimeZone] = useState(rideDetails?.time_zone);
  const [approxDropoffTime, setApproxDropoffTime] = useState(
    rideDetails?.approx_dropoff_time
      ? rideDetails?.approx_dropoff_time === "0000-00-00 00:00:00"
        ? null
        : rideDetails?.approx_dropoff_time
      : null
  );
  const [pricePerSeat, setPricePerSeat] = useState(
    rideDetails?.price_per_seat ? rideDetails?.price_per_seat + "" : ""
  );
  const [isOneTimeSelected, setIsOneTimeSelected] = useState(
    rideDetails?.pickupDate ? true : true
  );

  ///////////// Refs /////////////
  const pickupAddressRef = useRef(null);
  const dropOffAddressRef = useRef(null);
  const scrollViewRef = useRef(null);
  const tripDetailsRef = useRef(null);
  const availableSeatRef = useRef(null);
  const pricePerSeatRef = useRef(null);
  const pickupDateRef = useRef(null);
  const pickupTimeRef = useRef(null);
  const pickupDropOffDateRef = useRef(null);
  const dateRef = useRef(null);
  const dropOffTimeRef = useRef(null);

  /////////// errors //////////////
  const [pickupAddressError, setPickupAddressError] = useState(null);
  const [pickupCityError, setPickupCityError] = useState(null);
  const [dropoffAddressError, setDropoffAddressError] = useState(null);
  const [tripDetailsError, setTripDetailsError] = useState(null);
  const [dropoffCityError, setDropoffCityError] = useState(null);
  const [availableSeatError, setAvailableSeatError] = useState(null);
  const [pricePerSeatError, setPricePerSeatError] = useState(null);
  const [dateError, setDateError] = useState(null);
  const [pickupDateError, setPickupDateError] = useState(null);
  const [pickupTimeError, setPickupTimeError] = useState(null);
  const [amenitiesData, setAmenitiesData] = useState([
    {
      label: t("medium_size_luggage"),
      key: "medium_size_luggage",
      value: false,
    },
    { label: t("large_luggage"), key: "large_luggage", value: false },
    {
      label: t("pet_in_cage_allowed"),
      key: "pet_in_cage_allowed",
      value: false,
    },
    {
      label: t("winter_tires_installed"),
      key: "winter_tires_installed",
      value: false,
    },
  ]);

  useFocusEffect(
    React.useCallback(() => {
      updatesItem();
      setTimeout(() => getSeatData(), 500);
    }, [rideDetails])
  );

  useEffect(() => {
    setGender();
  }, []);

  async function setGender() {
    var userData = await AsyncStorage.getItem("@userData");
    userData = JSON.parse(userData);
    if (userData && userData) {
      setFemale(userData?.gender === 2);
    }
  }

  const getSeatData = async () => {
    try {
      const UserId = await AsyncStorage.getItem("@id");
      var body = {
        user_id: UserId,
      };
      if (await Utils.isNetworkConnected()) {
        setLoading(true);
        dispatch(driverDetails(body, handleSeatData));
      }
    } catch {}
  };

  function handleSeatData(data, isSuccess) {
    if (isSuccess) {
      const dropdownData = [];
      for (let i = 1; i <= data.data.number_of_passengers; i++) {
        dropdownData.push({ label: i.toString(), value: i });
      }
      setSeatData(dropdownData);
      setRefreshingData(false);
    }
  }

  async function updatesItem() {
    if (!rideDetails) return;

    var additionalArray = [
      { pickupValue: null, dropOffValue: null, price: "", time: "" },
      {
        /*For Pickup Address 3 */
      },

      // { pickupValue: null, dropOffValue: null, price: "", time: "" },
    ];

    if (
      (rideDetails.dropoffAddress && rideDetails.dropoffAddress.length > 0) ||
      (rideDetails.pickupAddress && rideDetails.pickupAddress.length > 0)
    ) {
      var insertAtIndex = 0;

      {
        /*For Pickup Address 3 */
      }

      // Check if pickup city is different from the first pickup address city
      // if (rideDetails.pickup_city !== rideDetails.pickupAddress[0]?.city) {
      //   setIsCheckValidation(false);
      //   insertAtIndex = 1;
      // }

      for (var i = 0; i < 1; i++) {
        var data = {
          pickupValue: null,
          dropOffValue: null,
          price: "",
          time: "",
        };

        if (rideDetails.dropoffAddress) {
          {
            /*For Pickup Address 3 */
          }

          // if (
          //   rideDetails.dropoffAddress.length === 1 &&
          //   rideDetails.dropoff_city !== rideDetails.dropoffAddress[0].city &&
          //   i === 0
          // ) {
          // } else {
          var index = i;
          if (
            rideDetails.dropoffAddress.length === 1 &&
            rideDetails.dropoff_city !== rideDetails.dropoffAddress[0].city &&
            i === 1
          ) {
            index = 0;
          }
          if (index < rideDetails.dropoffAddress.length) {
            var address = rideDetails.dropoffAddress[index];
            var dropOffData = retriveAutoSearchItem(
              address.address,
              address.city,
              address.latitude,
              address.longitude
            );
            data.dropOffValue = dropOffData;
            dropOffData.address_id = rideDetails.dropoffAddress[index]?.id;
            data.dropoffAddressError = null;
            data.price = address.price;
          }
          // }
        }

        if (i < rideDetails.pickupAddress.length) {
          var pickupAdd = rideDetails.pickupAddress[i];
          var pickUpData = retriveAutoSearchItem(
            pickupAdd.address,
            pickupAdd.city,
            pickupAdd.latitude,
            pickupAdd.longitude
          );
          pickUpData.address_id = rideDetails.pickupAddress[i]?.id;
          data.pickupValue = pickUpData;
          data.time = moment(pickupAdd.date, "YYYY-MM-DD HH:mm:ss");
        }

        additionalArray[insertAtIndex] = data;
        insertAtIndex++;
      }
      {
        /*For Pickup Address 3 */
      }

      // if (additionalArray[1].dropOffValue) {
      //   var id = await AsyncStorage.getItem("@id");
      //   var body = {
      //     pickup_latitude: initRoutePickupAddress?.latitude,
      //     pickup_longitude: initRoutePickupAddress?.longitude,
      //     dropoff_latitude: additionalArray[1]?.dropOffValue.latitude,
      //     dropoff_longitude: additionalArray[1]?.dropOffValue.longitude,
      //     user_id: id,
      //   };

      //   dispatch(
      //     getDistance(body, async (data, isSuccess) => {
      //       if (isSuccess) {
      //         additionalArray[1].distance = data.data.distance;

      //         setAdditionalPickup([...additionalArray]);

      //         getDistanceBetweenTwoAddress(
      //           initRoutePickupAddress,
      //           intRouteDropoffAddress,
      //           1
      //         );
      //       }
      //     })
      //   );
      // } else {
      setAdditionalPickup([...additionalArray]);
      getDistanceBetweenTwoAddress(
        initRoutePickupAddress,
        intRouteDropoffAddress,
        1
      );
      // }
    } else {
      getDistanceBetweenTwoAddress(
        initRoutePickupAddress,
        intRouteDropoffAddress,
        1
      );
    }
    var finalCompletedList = amenitiesData.map((item) => ({
      ...item,
      value: Boolean(rideDetails[item.key]),
    }));
    setAmenitiesData(finalCompletedList);
  }

  function retriveAutoSearchItem(address, city, latitude, longitude) {
    return {
      title: address,
      description: address,
      city: city,
      latitude: latitude,
      longitude: longitude,
    };
  }

  const [additionalPickup, setAdditionalPickup] = useState([]);

  const additionalPickupData = {
    pickupValue: null,
    dropOffValue: null,
    price: "",
    time: "",
    isButtonShow: true,
  };

  //////////// Function for expand textinputs container ///////////
  const addMore = () => {
    if (additionalPickup.length <= 2) {
      setAdditionalPickup([...additionalPickup, additionalPickupData]);
    }
  };

  const addtionalAddressPress = () => {
    if (additionalPickup && additionalPickup.length === 0) {
      setAdditionalPickup([...additionalPickup, additionalPickupData]);
    } else {
      const updatedPickup = additionalPickup.slice(0, -1);
      setAdditionalPickup(updatedPickup);
    }
  };

  ///////////// Function for permission checkBox //////////////
  const handleCheckBox = (item, index) => {
    var amenities = [...amenitiesData];
    amenities[index].value = !amenities[index].value;
    setAmenitiesData(amenities);
  };

  ////////////// Function for validation //////////////
  const valid = async () => {
    setIsDisabled(true);
    var isValid = true;

    if (Utils.isNull(pickupAddress)) {
      scrollViewRef.current?.scrollTo({ y: pickupAddressRef.current?.y || 0 });
      isValid = false;
      setPickupAddressError(t("blank_field_error"));
    }

    if (Utils.isNull(pickupAddress?.city)) {
      isValid = false;
      setPickupCityError(t("blank_field_error"));
    }

    if (Utils.isNull(tripDetails)) {
      isValid = false;
      setTripDetailsError(t("blank_field_error"));
    }

    if (!dropOffAddress) {
      scrollViewRef.current?.scrollTo({ y: dropOffAddressRef.current?.y || 0 });
      isValid = false;
      setDropoffAddressError(t("blank_field_error"));
    }

    if (!dropOffAddress?.city) {
      isValid = false;
      setDropoffCityError(t("blank_field_error"));
    }

    if (!isValidPrice()) {
      isValid = false;
    }

    if (!rideDetails && !availableSeat) {
      scrollViewRef.current?.scrollTo({ y: availableSeatRef.current?.y || 0 });
      isValid = false;
      setAvailableSeatError(t("blank_field_error"));
    }

    if (!isOneTimeSelected) {
      if (!isValidRecurringDate()) {
        isValid = false;
      }
    } else {
      /****** ONE TIME DATE VALIDATION ******/
      if (isOneTimeSelected && !date) {
        isValid = false;
        setDateError(t("blank_field_error"));
      }
      if (!date || !isValidOneTimeDate(date)) {
        isValid = false;
      }
      if (approxDropoffTime && !isValidOneTimeDropOffTime(approxDropoffTime)) {
        isValid = false;
      }
    }

    if (isValid) {
      if (!isValidSeats()) {
        isValid = false;
        scrollViewRef.current?.scrollTo({
          y: availableSeatRef.current?.y || 0,
        });
      }
    }

    if (!isValidAditionAddress()) {
      isValid = false;
    }

    if ((await Utils.isNetworkConnected()) && isValid) {
      var id = await AsyncStorage.getItem("@id");
      var body = {
        pickup_address: pickupAddress.title,
        pickup_city: pickupAddress.city,
        pickup_latitude: pickupAddress.latitude,
        pickup_longitude: pickupAddress.longitude,
        dropoff_address: dropOffAddress.title,
        dropoff_city: dropOffAddress.city,
        dropoff_latitude: dropOffAddress.latitude,
        dropoff_longitude: dropOffAddress.longitude,
        female_passenger: isCheckedOnlyFemalePassengers ? 1 : 0,
        verified_passenger: 0,
        available_seat: availableSeat,
        price_per_seat: pricePerSeat,
        date: moment(date).format("YYYY/MM/DD HH:mm"),
        approx_dropoff_time: approxDropoffTime
          ? moment(approxDropoffTime).format("YYYY/MM/DD HH:mm")
          : null,
        distance: pickupDistance,
        maxPrice: intercityPerKm * pickupDistance,
        trip_details: tripDetails,
        ...amenitiesData.reduce((accumulatedObject, item) => {
          return { ...accumulatedObject, [item.key]: item.value ? 1 : 0 };
        }, {}),
        is_trip: isOneTimeSelected ? 1 : 2,
        user_id: id,
        timezone: timeZone ? timeZone : getTimeZone(),
      };

      ////// Function for check valid additonal address details /////
      if (additionalPickup && additionalPickup.length > 0) {
        additionalPickup.map((address, index) => {
          if (address && address.pickupValue && address.pickupValue.title) {
            body.pickup_address_two = address.pickupValue.title;
            body.pickup_city_two = address.pickupValue.city;
          }
          if (address && address.time) {
            body.pickup_address_two_date = moment(address.time).format("HH:mm");
          }
          if (address && address.dropOffValue && address.dropOffValue.title) {
            body.dropoff_address_two = address.dropOffValue.title;
            body.dropoff_city_two = address.dropOffValue.city;
          }
          if (address && address.price) {
            body.dropoff_address_two_price = address.price;
          }
          if (rideDetails) {
            // body.pickup_two_id =
            //   address?.pickupValue?.address_id;
            // body.dropoff_two_id =
            //   address?.dropOffValue?.address_id;
            body.pickup_two_id = rideDetails?.pickupAddress[0]?.id;
            body.dropoff_two_id = rideDetails?.dropoffAddress[0]?.id;
          }
          if (address && address.pickupValue && address.pickupValue.title) {
            body.pickup_address_three = "";
            body.pickup_city_three = "";
            body.pickup_city_one = address.pickupValue.city;
          }
          if (address && address.time) {
            body.pickup_address_three_date = "";
          }
          if (rideDetails) {
            // body.pickup_three_id =
            //   address?.pickupValue?.address_id;
            // body.dropoff_three_id =
            //   address?.dropOffValue?.address_id;
            body.pickup_three_id = "";
            body.dropoff_three_id = "";
          }
          if (address && address.dropOffValue && address.dropOffValue.title) {
            body.dropoff_address_three = "";
            body.dropoff_city_three = "";
            body.dropoff_city_one = address.dropOffValue.city;
            body.dropoff_latitude_three = "";
            body.dropoff_longitude_three = "";
            body.dropoff_maxPrice = intercityPerKm * address.distance;
            body.dropoff_distance = address.distance;
          }
          if (address && address.price) {
            body.dropoff_address_three_price = "";
          }
        });
      }
      if (!isOneTimeSelected) {
        const dataArray = Object.keys(pickupDate);
        dataArray.sort((a, b) => new Date(a) - new Date(b));
        body.recurring_date = dataArray.join(", ").replaceAll("-", "/");
        body.recurring_time = moment(pickupTime).format("HH:mm");
        if (dropOffTime) {
          body.recurring_approx_dropoff_time =
            moment(dropOffTime).format("HH:mm");
        }
        body.next_day = isNextDay ? 1 : 0;
      }
      if (rideDetails) {
        body.ride_id = rideDetails.id;
        body.status = rideDetails.booked_seat >= 1 ? 1 : 0;
        body.booked_seat = rideDetails.booked_seat;
        body.number_of_passengers = seatData[seatData.length - 1].value;
        await dispatch(updateIntercityRide(body, UpdateRideAlert));
        setIsDisabled(false);
      } else {
        dispatch(
          addIntercityRide(body, async (data, isSuccess) => {
            setIsDisabled(false);
            if (isSuccess === true) {
              setSuccessMsg(data.message);
              setSuccessAlert(true);
            }
          })
        );
      }
    } else {
      setIsDisabled(false);
    }
  };

  function UpdateRideAlert(data, isSuccess) {
    if (isSuccess) {
      setSuccessMsg(data.message);
      setSuccessAlert(true);
    }
  }

  //// Function for check valid seat ////
  function isValidSeats() {
    var isValid = true;
    if (!rideDetails || !rideDetails.total_seat) {
      isValid = true;
    } else {
      if (rideDetails.rideBookCount > 0) {
        if (rideDetails.booked_seat <= availableSeat) {
          isValid = true;
        } else {
          isValid = false;
        }
      } else {
        isValid = true;
      }
    }
    if (!isValid) {
      if (rideDetails.booked_seat == rideDetails.total_seat) {
        setAvailableSeatError(t("full_ride_alert"));
      } else {
        setAvailableSeatError(
          t("greater_value_alert") + rideDetails.booked_seat
        );
      }
    }
    return isValid;
  }

  //// Function for check valid recurring date if selected ///
  function isValidRecurringDate() {
    var isValid = true;
    if (!pickupDate) {
      isValid = false;
      setPickupDateError(t("blank_field_error"));
    }
    if (!pickupTime) {
      isValid = false;
      setPickupTimeError(t("blank_field_error"));
    }
    const dataArray = Object.keys(pickupDate);
    dataArray.sort((a, b) => new Date(a) - new Date(b));
    const currentDate = moment().format("YYYY-MM-DD");
    const smallestPickupDate = moment(dataArray[0]).format("YYYY-MM-DD");

    if (smallestPickupDate === currentDate) {
      var time = moment(pickupTime).format("HH:mm");
      var dateTime = moment(
        smallestPickupDate + " " + time,
        "YYYY-MM-DD HH:mm"
      );
      if (!isGreaterThan30Minutes(dateTime, timeZone)) {
        isValid = false;
        setPickupTimeError(t("earliest_time_alert"));
      }
      if (!isNextDay && dropOffTime) {
        if (!moment(dropOffTime).isAfter(moment(dateTime))) {
          isValid = false;
          setDropOffTimeError(t("drop_off_time_alert"));
        }
      }
    }
    if (!isValid) {
      scrollViewRef.current?.scrollTo({ y: pickupDateRef.current?.y || 0 });
    }
    return isValid;
  }

  ////// Function for check valid price according to distance //////
  function isValidPrice() {
    var isValid = true;
    if (Utils.isStringNull(pricePerSeat)) {
      isValid = false;
      setPricePerSeatError(t("blank_field_error"));
    } else if (parseFloat(pricePerSeat) > intercityPerKm * pickupDistance) {
      isValid = false;
      setPricePerSeatError(
        t("less_value_pickup_alert") +
          Math.round(intercityPerKm * pickupDistance)
      );
    } else if (parseFloat(pricePerSeat) < intercityMinimumFare) {
      isValid = false;
      setPricePerSeatError(
        t("greater_value_pickup_alert") + Math.round(intercityMinimumFare)
      );
    }
    if (!isValid) {
      scrollViewRef.current?.scrollTo({ y: pricePerSeatRef.current?.y || 0 });
    }
    return isValid;
  }

  ///// Function for check valid addtional address details /////
  function isValidAditionAddress() {
    var isValid = true;
    if (additionalPickup && additionalPickup.length > 0 && isCheckValidation) {
      let newArr = [...additionalPickup];
      var smallestPickupDate = date;
      var time = date;
      var smallDate = moment(date).format("YYYY-MM-DD");
      if (!isOneTimeSelected) {
        const dataArray = Object.keys(pickupDate);
        dataArray.sort((a, b) => new Date(a) - new Date(b));
        smallDate = moment(dataArray[0]).format("YYYY-MM-DD");
        var time = moment(pickupTime).format("HH:mm");
        var smallestPickupDate = moment(
          smallDate + " " + time,
          "YYYY-MM-DD HH:mm"
        );
      }
      newArr.map((address, index) => {
        if (newArr[index].pickupValue || newArr[index].time) {
          var timeSelected = moment(newArr[index].time).format("HH:mm");
          var dateTimeSelected = moment(
            smallDate + " " + timeSelected,
            "YYYY-MM-DD HH:mm"
          );
          if (!newArr[index].pickupValue) {
            newArr[index].pickupError = t("blank_field_error");
            isValid = false;
          }
          if (!newArr[index].time) {
            newArr[index].timeError = t("blank_field_error");
            isValid = false;
          } else if (
            index === 0 &&
            !moment(dateTimeSelected).isAfter(moment(smallestPickupDate))
          ) {
            newArr[index].timeError = t("greater_then_pickup1_alert");
            isValid = false;
          } else if (index === 1) {
            if (!moment(dateTimeSelected).isAfter(moment(newArr[0].time))) {
              isValid = false;
              newArr[index].timeError = t("greater_then_pickup2_alert");
            } else if (
              !moment(dateTimeSelected).isAfter(moment(smallestPickupDate))
            ) {
              isValid = false;
              newArr[index].timeError = t("greater_then_pickup1_alert");
            }
          }
        }
        if (newArr[index].dropOffValue || newArr[index].price) {
          if (!newArr[index].dropOffValue) {
            newArr[index].dropoffAddressError = t("blank_field_error");
            isValid = false;
          } else if (!newArr[index].price) {
            newArr[index].priceError = t("blank_field_error");
            isValid = false;
          } else if (
            parseFloat(newArr[index].price) >
            intercityPerKm * newArr[index].distance
          ) {
            isValid = false;
            if (index === 0) {
              newArr[index].priceError =
                t("less_value_pickup_alert") +
                Math.round(intercityPerKm * pickupDistance);
            } else {
              newArr[index].priceError =
                t("less_value_pickup_alert") +
                Math.round(intercityPerKm * newArr[index].distance);
            }
          } else if (parseFloat(newArr[index].price) < intercityMinimumFare) {
            isValid = false;
            newArr[index].priceError =
              t("greater_value_pickup_alert") + intercityMinimumFare;
          }
        }
      });
      setAdditionalPickup(newArr);
    }
    return isValid;
  }

  ////// Function for get distance between two selected cities ///////
  async function getDistanceBetweenTwoAddress(
    pickupAddress,
    dropOffAddress,
    type
  ) {
    var id = await AsyncStorage.getItem("@id");
    var body = {
      pickup_latitude: pickupAddress?.latitude,
      pickup_longitude: pickupAddress?.longitude,
      dropoff_latitude: dropOffAddress?.latitude,
      dropoff_longitude: dropOffAddress?.longitude,
      type: 0,
      user_id: id,
    };
    if (await Utils.isNetworkConnected()) {
      await dispatch(
        getDistance(body, async (data, isSuccess) => {
          if (isSuccess) {
            switch (type) {
              case 1:
                setPickupDistance(data.data.distance);
                break;
              case 2:
                setPickupDistance(data.data.distance);
                break;
              // case 3: // Address 2 Distance
              //   setAdditionalPickup((additionalPickup) => {
              //     // var newArray = [...additionalPickup];
              //     additionalPickup[0].distance = data.data.distance;
              //     return additionalPickup;
              //   });
              //   break;
              // case 4: // Address 3 Distance
              //   setAdditionalPickup((additionalPickup) => {
              //     additionalPickup[1].distance = data.data.distance;
              //     return additionalPickup;
              //   });
              //   break;
              default:
                break;
            }
          } else {
            if (data?.data?.message) {
              setAlertMsg(data.data.message);
              setErrorAlert(true);
            }
            switch (type) {
              case 1:
                setPickupAddress(null);
                setPickupAddressError(null);
                setPickupCityError(null);
                pickupAddressRef.current.onClearPress();
                break;
              case 2:
                setDropOffAddress(null);
                setDropoffAddressError(null);
                setDropoffCityError(null);
                dropOffAddressRef.current.onClearPress();
                break;
              // case 3: // Address 2 Distance
              //   if (additionalPickup.length > 0) {
              //     setAdditionalPickup((additionalPickup) => {
              //       additionalPickup[0].dropOffValue = null;
              //       searchRef.current[`dropoff${0}`].onClearPress();
              //       return additionalPickup;
              //     });
              //   }
              //   break;
              // case 4: // Address 3 Distance
              //   if (additionalPickup.length > 0) {
              //     setAdditionalPickup((additionalPickup) => {
              //       additionalPickup[1].dropOffValue = null;
              //       searchRef.current[`dropoff${1}`].onClearPress();
              //       return additionalPickup;
              //     });
              //   }
              //   break;
              default:
                break;
            }
          }
        })
      );
    }
  }

  /////////// functions for Add additional Addresses ////////////
  const handleAdditionalAddressToggle = () => {
    if (additionalPickup.length === 2) {
      var data = [...additionalPickup];
      data.splice(1);
      setAdditionalPickup(data);
    } else {
      addMore();
    }
  };

  /////////// For Autocomplete select place ///////////
  function setAddress(selectedItem, type) {
    if (selectedItem) {
      switch (type) {
        case "pickup_address":
          setPickupAddress(selectedItem);
          setPickupAddressError(null);
          setPickupCityError(null);
          setIntercityPerKm(selectedItem.intercity_per_km);
          setIntercityMinimumFare(selectedItem.intercity_minimum_fare);
          setTimeZone(selectedItem.timezone);
          setPricePerSeat("");
          if (dropOffAddress) {
            getDistanceBetweenTwoAddress(dropOffAddress, selectedItem, 1);
          }
          break;
        case "dropoff_address":
          setDropOffAddress(selectedItem);
          setDropoffAddressError(null);
          setDropoffCityError(null);
          setPricePerSeat("");
          if (pickupAddress) {
            getDistanceBetweenTwoAddress(pickupAddress, selectedItem, 2);
          }
          break;
        default:
          break;
      }
    }
  }

  function switchTripTypes(isOneTimeTrip) {
    setPickupDate(null);
    setPickupTime(null);
    setDropOffTime(null);
    setIsNextDay(false);
    setIsOneTimeSelected(false);
    setDate(null);
    setApproxDropoffTime(null);
    setIsOneTimeSelected(isOneTimeTrip);
  }

  //// Function for confirm pickup time ///
  // function HandlePickupTime(date) {
  //   if (pickupDate) {
  //     const dataArray = Object.keys(pickupDate);
  //     dataArray.sort((a, b) => new Date(a) - new Date(b));
  //     const smallestPickupDate = moment(dataArray[0]).format("YYYY-MM-DD");
  //     var time = moment(date).format("HH:mm");
  //     var dateTime = moment(
  //       smallestPickupDate + " " + time,
  //       "YYYY-MM-DD HH:mm"
  //     );
  //     if (!isGreaterThan30Minutes(dateTime, timeZone)) {
  //       setPickupTime(null);
  //       setPickupTimeError(t("earliest_time_alert"));
  //       return;
  //     }
  //   }
  //   setPickupTime(date);
  //   setPickupTimeError(null);
  // }

  // function HandlePickupTime(date) {
  //   if (pickupDate) {
  //     const dataArray = Object.keys(pickupDate);
  //     dataArray.sort((a, b) => new Date(a) - new Date(b));
  //     const smallestPickupDate = moment(dataArray[0]).format("YYYY-MM-DD");
  //     var time = moment(date).format("HH:mm");
  //     var dateTime = moment(
  //       smallestPickupDate + " " + time,
  //       "YYYY-MM-DD HH:mm"
  //     );

  //     // Get the current time
  //     const currentTime = moment().tz(timeZone); // Adjust the timezone as needed

  //     // Check if the selected time is less than the current time
  //     if (dateTime.isBefore(currentTime)) {
  //       setPickupTime(null);
  //       setPickupTimeError(t("earliest_time_alert"));
  //       return;
  //     }

  //     // Check if the selected time is within 30 minutes of the current time
  //     if (!isGreaterThan30Minutes(dateTime, timeZone)) {
  //       setPickupTime(null);
  //       setPickupTimeError(t("earliest_time_alert"));
  //       return;
  //     }
  //   }
  //   setPickupTime(date);
  //   setPickupTimeError(null);
  // }

  function HandlePickupTime(date) {
    if (pickupDate) {
      const dataArray = Object.keys(pickupDate);
      dataArray.sort((a, b) => new Date(a) - new Date(b));
      const smallestPickupDate = moment(dataArray[0]).format("YYYY-MM-DD");
      const time = moment(date).format("HH:mm");
      const dateTime = moment(
        smallestPickupDate + " " + time,
        "YYYY-MM-DD HH:mm"
      );

      // Get the current time
      const currentTime = moment().tz(timeZone);

      // Check if there is more than one pickup date
      if (dataArray.length > 1) {
        setPickupTime(date);
        setPickupTimeError(null);
        return;
      }

      // If there is only one pickup date, enforce the rules
      // Check if the selected time is less than the current time
      if (dateTime.isBefore(currentTime)) {
        setPickupTime(null);
        setPickupTimeError(t("earliest_time_alert"));
        return;
      }

      // Check if the selected time is within 30 minutes of the current time
      if (!isGreaterThan30Minutes(dateTime, timeZone)) {
        setPickupTime(null);
        setPickupTimeError(t("earliest_time_alert"));
        return;
      }
    }
    setPickupTime(date);
    setPickupTimeError(null);
  }

  //// Function for confirm dropoff time for RECURRING TRIP ///
  // function handleDropOffTime(date) {
  //   if (!isNextDay && pickupDate) {
  //     const dataArray = Object.keys(pickupDate);
  //     dataArray.sort((a, b) => new Date(a) - new Date(b));
  //     const smallestPickupDate = moment(dataArray[0]).format("YYYY-MM-DD");
  //     var time = moment(pickupTime).format("HH:mm");
  //     var dateTime = moment(
  //       smallestPickupDate + " " + time,
  //       "YYYY-MM-DD HH:mm"
  //     );

  //     var timeSelected = moment(date).format("HH:mm");
  //     var dateTimeSelected = moment(
  //       smallestPickupDate + " " + timeSelected,
  //       "YYYY-MM-DD HH:mm"
  //     );
  //     if (!moment(dateTimeSelected).isAfter(moment(dateTime))) {
  //       setDropOffTime(null);
  //       setDropOffTimeError(t("drop_off_time_alert"));
  //       return;
  //     }
  //   }
  //   setDropOffTime(date);
  //   setDropOffTimeError(null);
  // }
  function handleDropOffTime(date) {
    if (!isNextDay && pickupDate) {
      const dataArray = Object.keys(pickupDate);
      dataArray.sort((a, b) => new Date(a) - new Date(b));
      const smallestPickupDate = moment(dataArray[0]).format("YYYY-MM-DD");
      const time = moment(pickupTime).format("HH:mm");
      const dateTime = moment(
        smallestPickupDate + " " + time,
        "YYYY-MM-DD HH:mm"
      );

      const timeSelected = moment(date).format("HH:mm");
      const dateTimeSelected = moment(
        smallestPickupDate + " " + timeSelected,
        "YYYY-MM-DD HH:mm"
      );

      // Check if the drop-off time is before the pickup time
      if (!moment(dateTimeSelected).isAfter(moment(dateTime))) {
        setDropOffTime(null);
        setDropOffTimeError(t("drop_off_time_alert"));
        return;
      }

      // Check if the selected time is less than the current time
      const currentTime = moment(); // Adjust timezone if necessary
      if (dateTimeSelected.isBefore(currentTime)) {
        setDropOffTime(null);
        setDropOffTimeError(t("drop_off_time_alert"));

        return;
      }
    }
    setDropOffTime(date);
    setDropOffTimeError(null);
  }

  ///// Function for confirm Approx Dropoff time for ONE TIME TRIP /////
  function isValidOneTimeDropOffTime(value) {
    if (value && date && !moment(value).isAfter(moment(date))) {
      setApproxDropoffTime(null);
      setApproxDropoffTimeError(t("drop_off_time_alert"));
      return false;
    }
    setApproxDropoffTime(value);
    setApproxDropoffTimeError(null);
    return true;
  }

  //// Function for select additional Pickup Address ////
  async function OnSelectAdditionalPickup(selectedItem, index) {
    setIsCheckValidation(true);
    if (selectedItem) {
      {
        /*For Pickup Address 3 */
      }

      // if (index === 0 && selectedItem.city !== pickupAddress?.city) {
      //   searchRef.current[`address${index}`].onClearPress();
      //   setAlertMsg(t("choose_additional_pickup_from_same_city_alert"));
      //   setErrorAlert(true);
      // } else if (index === 1 && selectedItem.city === pickupAddress?.city) {
      //   searchRef.current[`address${index}`].onClearPress();
      //   setAlertMsg(t("must_be_diff_pickup_alert"));
      //   setErrorAlert(true);
      // } else {
      let newArr = [...additionalPickup];
      newArr[index].pickupValue = selectedItem;
      newArr[index].pickupError = null;
      setAdditionalPickup(newArr);
      // }
    }
  }

  //// Function for select additional Dropoff Address ////
  async function OnSelectAdditionalDropOff(selectedItem, index) {
    setIsCheckValidation(true);
    if (selectedItem) {
      {
        /*For Pickup Address 3 */
      }

      // if (index === 0 && selectedItem.city !== dropOffAddress?.city) {
      //   searchRef.current[`dropoff${index}`].onClearPress();
      //   setAlertMsg(t("same_dropOff_alert"));
      //   setErrorAlert(true);
      //   return;
      // } else if (index === 1 && selectedItem.city === dropOffAddress?.city) {
      //   searchRef.current[`dropoff${index}`].onClearPress();
      //   setAlertMsg(t("diff_from_first_dropOff_alert"));
      //   setErrorAlert(true);
      //   return;
      // } else {
      let newArr = [...additionalPickup];
      newArr[index].dropOffValue = selectedItem;
      newArr[index].dropoffAddressError = null;
      setAdditionalPickup(newArr);
      // if (pickupAddress) {
      //   getDistanceBetweenTwoAddress(
      //     pickupAddress,
      //     selectedItem,
      //     index === 0 ? 3 : 4
      //   );
      // }
      // }
    }
  }

  ///// FUNCTION OF ONE TIME DATE VALIDATION /////
  const isValidOneTimeDate = (value) => {
    if (!value) {
      setDateError(t("blank_field_error"));
    } else if (isGreaterThan30Minutes(value, timeZone)) {
      setDate(value);
      setDateError(null);
      return true;
    } else {
      setDate(null);
      setDateError(t("earliest_time_alert"));
    }
    scrollViewRef.current?.scrollTo({ y: dateRef.current?.y || 0 });
    return false;
  };

  const searchRef = useRef({});

  const handleClear = async (index, type) => {
    let dataPickup = [...additionalPickup];
    switch (type) {
      case "pickup":
        if (rideDetails && additionalPickup.length > 1) {
          setIsCheckValidation(false);
        }
        dataPickup[0].pickupValue = null;
        dataPickup[0].dropOffValue = null;
        dataPickup[0].time = null;
        dataPickup[0].price = null;
        searchRef.current[`dropoff${index}`]?.onClearPress();
        break;
      case "dropoff":
        dataPickup[0].dropOffValue = null;
        dataPickup[0].price = null;
        // searchRef.current[`dropoff${index}`]?.onClearPress();
        break;
      default:
        break;
    }
    setAdditionalPickup(dataPickup);
  };

  const isGreaterThan30Minutes = (selectedTime, timeZone) => {
    if (rideDetails?.booked_seat > 0) {
      // skip update date if already booked
      return true;
    } else {
      if (timeZone) {
        const oneHourFromNow = moment().tz(timeZone).add(30, "minutes");
        const selectedTimeMoment = moment(selectedTime);
        return moment(
          new Date(selectedTimeMoment.format("YYYY-MM-DDTHH:mm:ss"))
        ).isSameOrAfter(
          moment(new Date(oneHourFromNow.format("YYYY-MM-DDTHH:mm:ss")))
        );
      } else {
        const oneHourFromNow = moment().add(30, "minutes");
        const selectedTimeMoment = moment(selectedTime);
        return selectedTimeMoment.isSameOrAfter(oneHourFromNow);
      }
    }
  };

  const timeSlots = generateTimeSlots();
  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <View style={{ width: "100%", backgroundColor: "white" }}>
          <Header
            title={t("post_ride")}
            goBack={() => navigation.goBack("BottomTabNavigator")}
          />
        </View>
        <AutocompleteDropdownContextProvider>
          <View
            style={{ flex: 1 }}
            onStartShouldSetResponder={() => {
              pickupAddressRef?.current?.closeDropDown();
              dropOffAddressRef?.current?.closeDropDown();
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ flex: 1 }}
            >
              <ScrollView
                ref={scrollViewRef}
                persistentScrollbar={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.container}
                nestedScrollEnabled
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="handled"
                contentInsetAdjustmentBehavior="automatic"
              >
                <StatusBar
                  backgroundColor={Colors.white}
                  barStyle={"dark-content"}
                />

                <ModalProgressLoader visible={isLoading} />

                <View style={styles.tabsArea}>
                  <GooglePlacesAutoComplete
                    onSelected={(selectedItem) => {
                      setAddress(selectedItem, "pickup_address");
                      setDate(null);
                      setDateError(null);
                      setPickupTime(null);
                      setPickupTimeError(null);
                    }}
                    isOptional={false}
                    imageShow={false}
                    ref={pickupAddressRef}
                    multiline={true}
                    onClear={() => {
                      setPickupAddress("");
                    }}
                    editable={rideDetails?.booked_seat > 0 ? false : true}
                    type={1}
                    selectTextOnFocus={
                      rideDetails?.booked_seat > 0 ? false : true
                    }
                    isAddressSearch={true}
                    value={pickupAddress?.description}
                    error={pickupAddressError}
                    placeholder={t("post_pickup_address")}
                  />

                  <Textinput
                    isIcon={false}
                    error={pickupCityError}
                    value={pickupAddress?.city}
                    placeholder={t("pickup_city")}
                    editable={false}
                    selectTextOnFocus={false}
                    placeholderTextColor={Colors.black}
                  />
                  <GooglePlacesAutoComplete
                    onSelected={(selectedItem) => {
                      setAddress(selectedItem, "dropoff_address");
                    }}
                    isOptional={false}
                    imageShow={false}
                    ref={dropOffAddressRef}
                    isAddressSearch={true}
                    onClear={() => {
                      setDropOffAddress("");
                    }}
                    multiline={true}
                    type={1}
                    value={dropOffAddress?.description}
                    editable={rideDetails?.booked_seat > 0 ? false : true}
                    selectTextOnFocus={
                      rideDetails?.booked_seat > 0 ? false : true
                    }
                    error={dropoffAddressError}
                    placeholder={t("post_drop_off_address")}
                  />

                  <Textinput
                    placeholder={t("post_drop_off_city")}
                    placeholderTextColor={Colors.black}
                    value={dropOffAddress?.city}
                    error={dropoffCityError}
                    editable={false}
                    selectTextOnFocus={false}
                  />

                  <View style={{ flex: 1 }}>
                    <PrimaryDropDown
                      data={seatData}
                      isSelect={
                        rideDetails ? rideDetails.available_seat : availableSeat
                      }
                      renderItem={(selectedItem) =>
                        selectedItem && selectedItem.label
                      }
                      string={rideDetails ? availableSeat : t("available_seat")}
                      error={availableSeatError}
                      value={availableSeat}
                      onSelect={(selectedItem) => {
                        setAvailableSeat(selectedItem.value);
                        setAvailableSeatError(null);
                      }}
                    />
                  </View>
                  {/* 
                  {availableSeatError ? (
                    <Text style={styles.errorText}>{availableSeatError}</Text>
                  ) : null} */}

                  <Textinput
                    placeholder={t("price_per_seat")}
                    placeholderTextColor={Colors.black}
                    onChangeText={(text) => {
                      setPricePerSeat(text.replace(/[^0-9]/g, ""));
                      setPricePerSeatError(null);
                    }}
                    error={pricePerSeatError}
                    ref={pricePerSeatRef}
                    keyboardType="decimal-pad"
                    editable={rideDetails?.booked_seat > 0 ? false : true}
                    selectTextOnFocus={
                      rideDetails?.booked_seat > 0 ? false : true
                    }
                    value={pricePerSeat}
                  />

                  {!rideDetails ? (
                    <View style={styles.radioButtonContainer}>
                      <TouchableOpacity onPress={() => switchTripTypes(true)}>
                        <View style={{ flexDirection: "row" }}>
                          <View
                            style={styles.radioBtn(isOneTimeSelected)}
                          ></View>
                          <Text style={styles.radioBtnText}>
                            {t("one_time_trip")}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          switchTripTypes(false);
                        }}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <View
                            style={styles.radioBtn(!isOneTimeSelected)}
                          ></View>
                          <Text style={styles.radioBtnText}>
                            {t("recurring_trip")}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  {/* RECURING && ONE TIME*/}
                  {!isOneTimeSelected ? (
                    <>
                      <DateTimePicker
                        value={pickupDate}
                        isMultiple={true}
                        mode="date"
                        placeholderText={t("pickup_date")}
                        error={pickupDateError}
                        ref={pickupDateRef}
                        disabled={rideDetails?.booked_seat > 0 ? true : false}
                        onConfirm={(date) => {
                          setPickupDateError(null);
                          setPickupDate(date);
                          setPickupTime(null);
                          setPickupTimeError(null);
                        }}
                      />

                      <View style={{ flex: 1 }}>
                        <PrimaryDropDown
                          data={timeSlots}
                          // isSelect={
                          //   rideDetails
                          //     ? rideDetails.available_seat
                          //     : availableSeat
                          // }
                          renderItem={(selectedItem) =>
                            selectedItem && selectedItem.label
                          }
                          string={rideDetails ? pickupTime : t("pickup_time")}
                          error={pickupTimeError}
                          value={pickupTime}
                          // onSelect={(selectedItem) => {
                          //   setAvailableSeat(selectedItem.value);
                          //   setAvailableSeatError(null);
                          // }}
                          onSelect={HandlePickupTime}
                        />
                      </View>

                      {/* <DateTimePicker
                        value={pickupTime}
                        mode="time"
                        placeholderText={t("pickup_time")}
                        ref={pickupTimeRef}
                        minimumDate={
                          timeZone
                            ? new Date(
                                moment()
                                  .tz(timeZone)
                                  .format("YYYY-MM-DDTHH:mm:ss")
                              )
                            : new Date(minDate)
                        }
                        disabled={rideDetails?.booked_seat > 0 ? true : false}
                        error={pickupTimeError}
                        onConfirm={HandlePickupTime}
                      /> */}

                      <View style={{ flex: 1 }}>
                        <PrimaryDropDown
                          data={timeSlots}
                          // isSelect={
                          //   rideDetails
                          //     ? rideDetails.available_seat
                          //     : availableSeat
                          // }
                          renderItem={(selectedItem) =>
                            selectedItem && selectedItem.label
                          }
                          string={
                            rideDetails
                              ? rideDetails?.dropOffTime
                              : t("approx_dropoff_time")
                          }
                          error={dropOffTimeError}
                          value={dropOffTime}
                          // onSelect={(selectedItem) => {
                          //   setAvailableSeat(selectedItem.value);
                          //   setAvailableSeatError(null);
                          // }}
                          onSelect={handleDropOffTime}
                        />
                      </View>

                      {/* <DateTimePicker
                        value={dropOffTime}
                        mode="time"
                        placeholderText={t("approx_dropoff_time")}
                        ref={pickupDropOffDateRef}
                        disabled={rideDetails?.booked_seat > 0 ? true : false}
                        error={dropOffTimeError}
                        onConfirm={handleDropOffTime}
                      /> */}

                      <CheckBox
                        disabled={rideDetails?.booked_seat > 0 ? true : false}
                        onPress={() => {
                          setIsNextDay(!isNextDay);
                        }}
                        isChecked={isNextDay}
                        text={t("next_day")}
                      />
                    </>
                  ) : (
                    <View style={{ flex: 1 }}>
                      <DateTimePicker
                        value={date}
                        mode="datetime"
                        ref={dateRef}
                        minimumDate={
                          timeZone
                            ? new Date(
                                moment()
                                  .tz(timeZone)
                                  .format("YYYY-MM-DDTHH:mm:ss")
                              )
                            : new Date()
                        }
                        placeholderText={t("date")}
                        timeZone={timeZone}
                        disabled={rideDetails?.booked_seat > 0 ? true : false}
                        error={dateError}
                        onConfirm={isValidOneTimeDate}
                      />

                      <DateTimePicker
                        value={approxDropoffTime}
                        mode="datetime"
                        ref={dropOffTimeRef}
                        placeholderText={t("approx_dropoff_time")}
                        disabled={rideDetails?.booked_seat > 0 ? true : false}
                        error={approxDropoffTimeError}
                        onConfirm={isValidOneTimeDropOffTime}
                      />
                    </View>
                  )}

                  <Textinput
                    textInputTabStyle={styles.tripDetailsInput(
                      tripDetails,
                      tripDetailsError
                    )}
                    textInputStyle={styles.bigTextInput}
                    keyboardType="default"
                    returnKeyType={"done"}
                    refs={tripDetailsRef}
                    value={tripDetails}
                    error={tripDetailsError}
                    multiline={true}
                    editable={rideDetails?.booked_seat > 0 ? false : true}
                    selectTextOnFocus={
                      rideDetails?.booked_seat > 0 ? false : true
                    }
                    placeholder={t("trip_details_placeholder")}
                    placeholderTextColor={Colors.black}
                    onChangeText={(text) => {
                      setTripDetails(text);
                      setTripDetailsError(false);
                    }}
                  />

                  <View style={styles.permissionContainer}>
                    {amenitiesData.map((item, index) => (
                      <CheckBox
                        disabled={rideDetails?.booked_seat > 0 ? true : false}
                        onPress={() => handleCheckBox(item, index)}
                        isChecked={item.value}
                        text={item.label}
                      />
                    ))}
                    {/* <CheckBox
                      disabled={rideDetails?.booked_seat > 0 ? true : false}
                      onPress={() =>
                        setCheckedOnlyVerifiedPassengers(
                          !isCheckedOnlyVerifiedPassengers
                        )
                      }
                      isChecked={isCheckedOnlyVerifiedPassengers}
                      text={t("verified_only_passenger")}
                    /> */}
                    {isFemale ? (
                      <CheckBox
                        disabled={rideDetails?.booked_seat > 0 ? true : false}
                        onPress={() =>
                          setCheckedOnlyFemalePassengers(
                            !isCheckedOnlyFemalePassengers
                          )
                        }
                        isChecked={isCheckedOnlyFemalePassengers}
                        text={t("female_only_passenger")}
                      />
                    ) : null}
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.expandButton}
                  disabled={rideDetails?.booked_seat > 0 ? true : false}
                  onPress={() => {
                    setIsAdditionalContainerShow(!isAdditionalContainerShow);
                    addtionalAddressPress();
                  }}
                >
                  <Image
                    style={styles.addRemoveIcon}
                    source={
                      additionalPickup.length > 0
                        ? Images.remove_icon
                        : Images.add_icon
                    }
                  />
                  <Text style={styles.additionalTitleText}>
                    {t("additional_pickup_dropoff_point")}{" "}
                    <Text style={styles.optionalText}>{t("optional")}</Text>
                  </Text>
                </TouchableOpacity>

                {additionalPickup && additionalPickup.length > 0 ? (
                  <>
                    {additionalPickup.slice(0, 1).map((address, index) => (
                      <View key={index} style={styles.tabsArea}>
                        <GooglePlacesAutoComplete
                          onSelected={(selectedItem) =>
                            OnSelectAdditionalPickup(selectedItem, index)
                          }
                          isOptional={false}
                          imageShow={false}
                          onClear={() => {
                            handleClear(0, "pickup");
                          }}
                          editable={rideDetails?.booked_seat > 0 ? false : true}
                          selectTextOnFocus={
                            rideDetails?.booked_seat > 0 ? false : true
                          }
                          ref={(ref) =>
                            (searchRef.current[`address${index}`] = ref)
                          }
                          error={address.pickupError}
                          type={1}
                          multiline={true}
                          initialValue={
                            address.pickupValue
                              ? address.pickupValue
                              : { id: "" }
                          }
                          isAddressSearch={true}
                          placeholder={t("pickup_address") + " " + (index + 2)}
                          value={address?.pickupValue?.description}
                        />

                        {/* <DateTimePicker
                          value={address.time}
                          mode="time"
                          placeholderText={t("pickup_time")}
                          error={address.timeError}
                          disabled={rideDetails?.booked_seat > 0 ? true : false}
                          onConfirm={(date) => {
                            let newArr = [...additionalPickup];
                            newArr[index].time = date;
                            newArr[index].timeError = null;
                            setAdditionalPickup(newArr);
                          }}
                        /> */}

                        <View style={{ flex: 1 }}>
                          <PrimaryDropDown
                            data={timeSlots}
                            renderItem={(selectedItem) =>
                              selectedItem && selectedItem.label
                            }
                            string={
                              address.time
                                ? moment(address.time).format(
                                    "DD-MM-YYYY hh:ss a"
                                  )
                                : t("pickup_time")
                            }
                            error={address.timeError}
                            value={address.time}
                            disabled={
                              rideDetails?.booked_seat > 0 ? true : false
                            }
                            onSelect={(date) => {
                              let newArr = [...additionalPickup];
                              newArr[index].time = date;
                              newArr[index].timeError = null;
                              setAdditionalPickup(newArr);
                            }}
                          />
                        </View>

                        <GooglePlacesAutoComplete
                          onSelected={(selectedItem) =>
                            OnSelectAdditionalDropOff(selectedItem, index)
                          }
                          isOptional={false}
                          imageShow={false}
                          editable={rideDetails?.booked_seat > 0 ? false : true}
                          type={1}
                          onClear={() => handleClear(0, "dropoff")}
                          selectTextOnFocus={
                            rideDetails?.booked_seat > 0 ? false : true
                          }
                          ref={(ref) =>
                            (searchRef.current[`dropoff${index}`] = ref)
                          }
                          error={address.dropoffAddressError}
                          multiline={true}
                          isAddressSearch={true}
                          placeholder={
                            t("drop_off_address") + " " + (index + 2)
                          }
                          value={address?.dropOffValue?.description}
                        />

                        <Textinput
                          placeholder={t("price")}
                          placeholderTextColor={Colors.black}
                          editable={rideDetails?.booked_seat > 0 ? false : true}
                          keyboardType={"decimal-pad"}
                          selectTextOnFocus={
                            rideDetails?.booked_seat > 0 ? false : true
                          }
                          value={address.price ? address.price + "" : ""}
                          onChangeText={(text) => {
                            let newArr = [...additionalPickup];
                            newArr[index].price = text.replace(/[^0-9]/g, "");
                            newArr[index].priceError = null;
                            setAdditionalPickup(newArr);
                          }}
                          error={address.priceError}
                        />
                      </View>
                    ))}
                    {/* 
                      {rideDetails &&
                      rideDetails?.booked_seat >
                        0 ? null : additionalPickup.length <= 0 ? null : (
                        <PrimaryButton
                          customStyle={true}
                          isIcon={true}
                          source={Images.counter_plus}
                          onPress={handleAdditionalAddressToggle}
                          disabled={rideDetails?.booked_seat > 0 ? true : false}
                          iconStyle={styles.addMoreBtnIcon}
                          buttonStyle={styles.addMoreBtn}
                          textStyle={styles.addMoreBtnText}
                          string={
                            additionalPickup.length === 2
                              ? t("remove")
                              : t("add_more")
                          }
                        />
                      )} */}
                  </>
                ) : null}

                <PrimaryButton
                  disabled={isDisabled}
                  string={t("submit")}
                  onPress={valid}
                />

                <AlertBox
                  visible={successAlert}
                  title={"Success"}
                  message={successMsg}
                  positiveBtnText={"OK"}
                  onPress={() => {
                    setSuccessAlert(false);
                    navigation.goBack();
                  }}
                  onPressNegative={() => setSuccessAlert(false)}
                />

                <AlertBox
                  visible={errorAlert}
                  title={"Alert!"}
                  message={alertMsg}
                  error={true}
                  positiveBtnText={"OK"}
                  onPress={() => {
                    setErrorAlert(false);
                  }}
                  onPressNegative={() => setErrorAlert(false)}
                />
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </AutocompleteDropdownContextProvider>
      </SafeAreaView>
    </>
  );
};

export default DriverPostRideScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexGrow: 1,
    paddingHorizontal: ScaleSize.spacing_medium,
    backgroundColor: Colors.white,
  },
  tabsArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dateArea: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  textinputTab: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.low_opacity_white,
    margin: ScaleSize.spacing_small,
    paddingHorizontal: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderColor: Colors.white,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  textinput: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: ScaleSize.spacing_semi_medium,
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    paddingHorizontal: ScaleSize.spacing_small,
    color: Colors.white,
  },
  dateArea: {
    width: "100%",
    paddingHorizontal: ScaleSize.spacing_medium,
  },
  permissionContainer: {
    flex: 1,
    alignSelf: "flex-start",
    marginTop: ScaleSize.spacing_semi_medium,
    marginBottom: ScaleSize.spacing_medium,
  },
  checkBox: {
    width: ScaleSize.large_icon,
    height: ScaleSize.large_icon,
    justifyContent: "center",
    alignItems: "center",
    padding: ScaleSize.spacing_very_small,
    margin: ScaleSize.spacing_small,
    backgroundColor: Colors.textinput_low_opacity,
    borderRadius: 5,
  },
  radioBtn: (isOneTimeSelected) => ({
    height: ScaleSize.spacing_semi_large,
    width: ScaleSize.spacing_semi_large,
    borderWidth: isOneTimeSelected ? 5 : 2,
    borderColor: Colors.primary,
    marginHorizontal: ScaleSize.spacing_small,
    borderRadius: ScaleSize.small_border_radius,
  }),
  radioButtonContainer: {
    width: "100%",
    right: ScaleSize.spacing_medium,
    flexDirection: "row",
    margin: ScaleSize.spacing_small,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  radioBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.black,
  },
  optionalText: {
    textAlign: "center",
    textAlignVertical: "center",
    color: Colors.gray,
    fontSize: TextFontSize.extra_small_text,
    fontFamily: AppFonts.medium_italic,
  },
  errorText: {
    fontFamily: AppFonts.medium,
    color: Colors.red,
    marginHorizontal: ScaleSize.spacing_medium,
    alignSelf: "flex-start",
  },
  addMoreBtn: {
    width: "100%",
    margin: ScaleSize.spacing_small,
    alignSelf: "center",
    padding: ScaleSize.spacing_semi_medium,
    borderColor: Colors.primary,
    borderWidth: 2,
    borderRadius: ScaleSize.primary_border_radius,
    justifyContent: "center",
    alignItems: "center",
  },
  addMoreBtnText: {
    fontFamily: AppFonts.semi_bold,
    color: Colors.primary,
    fontSize: TextFontSize.small_text,
  },
  addMoreBtnIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    tintColor: Colors.primary,
  },
  expandButton: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  addRemoveIcon: {
    height: ScaleSize.medium_icon,
    width: ScaleSize.medium_icon,
    marginHorizontal: ScaleSize.spacing_small,
  },
  additionalTitleText: {
    color: Colors.black,
    fontFamily: AppFonts.semi_bold,
  },
  tripDetailsInput: (tripDetails, tripDetailsError) => ({
    flexDirection: "row",
    width: "100%",
    height: ScaleSize.spacing_extra_large * 2.5,
    backgroundColor: tripDetails ? Colors.textinput_low_opacity : Colors.white,
    margin: ScaleSize.spacing_small,
    padding: ScaleSize.spacing_very_small,
    borderRadius: ScaleSize.primary_border_radius,
    borderWidth: ScaleSize.primary_border_width,
    borderColor: tripDetailsError ? Colors.red : Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  }),
  bigTextInput: {
    position: "relative",
    flex: 1,
    height: ScaleSize.tab_height * 1.3,
    justifyContent: "flex-start",
    paddingHorizontal: ScaleSize.spacing_medium,
    alignItems: "flex-start",
    fontSize: TextFontSize.very_small_text,
    fontFamily: AppFonts.semi_bold,
    color: Colors.primary,
  },
});

// async function updatesItem() {
//   if (rideDetails) {
//     console.log("RIDE DETAILS", rideDetails);
//     var additionalArray = [];
//     if (
//       (rideDetails.dropoffAddress && rideDetails.dropoffAddress.length > 0) ||
//       (rideDetails.pickupAddress && rideDetails.pickupAddress.length > 0)
//     ) {
//       if (rideDetails.pickup_city === rideDetails.pickupAddress[0]?.city) {
//         for (var i = 0; i < 2; i++) {
//           var data = {
//             pickupValue: null,
//             dropOffValue: null,
//             price: "",
//             time: "",
//           };
//           if (i < rideDetails.dropoffAddress.length) {
//             var address = rideDetails.dropoffAddress[i];
//             var dropOffData = retriveAutoSearchItem(
//               address.address,
//               address.city,
//               address.latitude,
//               address.longitude
//             );
//             data.dropOffValue = dropOffData;
//             dropOffData.address_id = rideDetails.dropoffAddress[i]?.id;
//             data.dropoffAddressError = null;
//             data.price = address.price;
//           }
//           if (i < rideDetails.pickupAddress.length) {
//             var pickupAdd = rideDetails.pickupAddress[i];
//             var pickUpData = retriveAutoSearchItem(
//               pickupAdd.address,
//               pickupAdd.city,
//               pickupAdd.latitude,
//               pickupAdd.longitude
//             );
//             pickUpData.address_id = rideDetails.pickupAddress[i]?.id;
//             data.pickupValue = pickUpData;
//             data.time = moment(pickupAdd.date, "YYYY-MM-DD HH:mm:ss");
//           }
//           additionalArray.push(data);
//         }
//       } else {
//         var i = 1;
//         var data = {
//           pickupValue: null,
//           dropOffValue: null,
//           price: "",
//           time: "",
//         };
//         if (rideDetails.dropoffAddress.length === 1) {
//           var address = rideDetails.dropoffAddress[0];

//           var dropOffData = retriveAutoSearchItem(
//             address.address,
//             address.city,
//             address.latitude,
//             address.longitude
//           );
//           data.dropOffValue = dropOffData;
//           dropOffData.address_id = rideDetails.dropoffAddress[0]?.id;
//           data.dropoffAddressError = null;
//           data.price = address.price;
//         }
//         if (rideDetails.pickupAddress.length === 1) {
//           var pickupAdd = rideDetails.pickupAddress[0];
//           var pickUpData = retriveAutoSearchItem(
//             pickupAdd.address,
//             pickupAdd.city,
//             pickupAdd.latitude,
//             pickupAdd.longitude
//           );
//           pickUpData.address_id = rideDetails.pickupAddress[0]?.id;
//           data.pickupValue = pickUpData;
//           data.time = moment(pickupAdd.date, "YYYY-MM-DD HH:mm:ss");
//         }

//         // Assuming additionalArray already exists and you want to insert `data` at index 1
//         additionalArray.splice(1, 0, data);
//       }

//       if (additionalArray.length > 1 && additionalArray[1].dropOffValue) {
//         var id = await AsyncStorage.getItem("@id");
//         var body = {
//           pickup_latitude: initRoutePickupAddress?.latitude,
//           pickup_longitude: initRoutePickupAddress?.longitude,
//           dropoff_latitude: additionalArray[1]?.dropOffValue.latitude,
//           dropoff_longitude: additionalArray[1]?.dropOffValue.longitude,
//           user_id: id,
//         };
//         dispatch(
//           getDistance(body, async (data, isSuccess) => {
//             if (isSuccess) {
//               console.log("CALL FROM UPDATE ITEM");
//               additionalArray[1].distance = data.data.distance;
//             }
//             setAdditionalPickup(additionalArray);
//             getDistanceBetweenTwoAddress(
//               initRoutePickupAddress,
//               intRouteDropoffAddress,
//               1
//             );
//           })
//         );
//       } else {
//         setAdditionalPickup(
//           (prevState) => {
//             return additionalArray;
//           },
//           () => {}
//         );
//         getDistanceBetweenTwoAddress(
//           initRoutePickupAddress,
//           intRouteDropoffAddress,
//           1
//         );
//       }
//     }
//     var finalCompletedList = amenitiesData.map((item) => ({
//       ...item,
//       value: Boolean(rideDetails[item.key]),
//     }));
//     setAmenitiesData(finalCompletedList);
//   }
// }
