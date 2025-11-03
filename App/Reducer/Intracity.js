import Constant from "../Network/Constant";
import DialogHelper from "../Helpers/DilogHelper";

const initialState = {
  isLoading: false,
  intracityAllRideData: [],
  intracityDriverData: [],
  intercityRideBookingData: [],
  rideLoading: false,
  riderPage: 1,
  riderRideData: [],
  riderRideLoading: false,
  riderRideTotalPage: 100,
  driverPage: 1,
  driverRideData: [],
  driverRideLoading: false,
  driveRideTotalPage: 100,
  intracityRideData: [],
  intracityRidepage: 1,
  intracityRideLoading: false,
  intracityRideBookingData: [],
  intracityRideTotalPage: 100,
  intracityDriverRideData: [],
  intracityDriverRidepage: 1,
  intracityDriverRideLoading: false,
  intracityDriverRideBookingData: [],
  intracityDriverRideTotalPage: 100,
  saveIntracityRatingData: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    /////////////////RIDER INTRACITY////////////////////
    case Constant.GET_INTRACITY_RIDER_RIDE_REQUEST:
      return {
        ...state,
        rideLoading: true,
        riderPage: action.body.page,
        isLoading:
          state.riderPage === 1 || state.riderPage === "1" ? true : false,
        type: action.type,
        error: action.error,
      };
    case Constant.GET_INTRACITY_RIDER_RIDE_SUCCESS:
      const driverData = action.payload.data;
      return {
        ...state,
        rideLoading: false,
        isLoading: false,
        type: action.type,
        riderRideData:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...driverData]
            : [...state.riderRideData, ...driverData],
        riderRideLoading: false,
        riderRideTotalPage: action.payload.total_page,
        intracityAllRideData: action.payload,
        error: undefined,
      };
    case Constant.CLEAR_RIDE_DETAILS_SUCCESS:
      return {
        ...state,
        rideLoading: false,
        isLoading: false,
        intracityAllRideData: null,
        type: action.type,
        intracityRideBookingData: null,
        intracityAllRideData: null,
        error: undefined,
      };
    case Constant.GET_INTRACITY_RIDER_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        rideLoading: false,
        riderRideLoading: false,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// DRIVER INTRACITY ////////////////////
    case Constant.GET_INTRACITY_DRIVER_RIDE_REQUEST:
      return {
        ...state,
        driverRideLoading: true,
        driverPage: action.body.page,
        isLoading:
          state.driverPage === 1 || state.driverPage === "1" ? true : false,
        type: action.type,
        error: action.error,
      };
    case Constant.GET_INTRACITY_DRIVER_RIDE_SUCCESS:
      const intracityDriverdata = action.payload.data;
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        driverRideData:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...intracityDriverdata]
            : [...state.driverRideData, ...intracityDriverdata],
        driverRideLoading: false,
        driveRideTotalPage: action.payload.total_page,
        intracityAllRideData: action.payload,
      };
    case Constant.CLEAR_INTRACITY_RIDE_DETAILS_SUCCESS:
      return {
        ...state,
        rideLoading: false,
        isLoading: false,
        intracityAllRideData: null,
        type: action.type,
        intracityRideBookingData: null,
        error: undefined,
      };
    case Constant.GET_INTRACITY_DRIVER_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        driverRideLoading: false,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// ADD INTRACITY DRIVER CURRENT LOCATION ////////////////////
    case Constant.DRIVER_INTRACITY_ADD_LOCATION_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.DRIVER_INTRACITY_ADD_LOCATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.DRIVER_INTRACITY_ADD_LOCATION_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////GET INTERCITY DRIVER RIDE DETAILS////////////////////
    case Constant.INTRACITY_RIDE_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.INTRACITY_RIDE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        intracityAllRideData: action.payload.data,
        error: undefined,
      };
    case Constant.INTRACITY_RIDE_DETAILS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// INTERCITY CANCEL RIDE ////////////////////
    case Constant.INTRACITY_CANCEL_RIDE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.INTRACITY_CANCEL_RIDE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.INTRACITY_CANCEL_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// INTERCITY CANCEL RIDE ////////////////////
    case Constant.INTRACITY_ACCEPT_RIDE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.INTRACITY_ACCEPT_RIDE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.INTRACITY_ACCEPT_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// INTERCITY ACCEPT RIDE ////////////////////
    case Constant.INTRACITY_ACCEPT_RIDE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.INTRACITY_ACCEPT_RIDE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.INTRACITY_ACCEPT_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// INTERCITY COMPLETE RIDE ////////////////////
    case Constant.INTRACITY_COMPLETE_RIDE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.INTRACITY_COMPLETE_RIDE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.INTRACITY_COMPLETE_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// RIDER MY BOOKINGS ////////////////////
    case Constant.INTRACITY_RIDER_MY_BOOKINGS_REQUEST:
      return {
        ...state,
        rideLoading: true,
        intracityRidepage: action.body.page,
        isLoading:
          state.intracityRidepage === 1 || state.intracityRidepage === "1"
            ? true
            : false,
        type: action.type,
        error: action.error,
      };
    case Constant.INTRACITY_RIDER_MY_BOOKINGS_SUCCESS:
      const data = action.payload.data;
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        intracityRideData:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...data]
            : [...state.intracityRideData, ...data],
        intracityRideLoading: false,
        intracityRideTotalPage: action.payload.total_page,
        intracityRiderMyBookingData: action.payload,
      };
    case Constant.INTRACITY_RIDER_MY_BOOKINGS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        intracityRideLoading: false,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// DRIVER MY BOOKINGS ////////////////////
    case Constant.INTRACITY_DRIVER_MY_BOOKINGS_REQUEST:
      return {
        ...state,
        rideLoading: true,
        intracityDriverRidepage: action.body.page,
        isLoading:
          state.intracityRidepage === 1 || state.intracityRidepage === "1"
            ? true
            : false,
        type: action.type,
        error: action.error,
      };
    case Constant.INTRACITY_DRIVER_MY_BOOKINGS_SUCCESS:
      const driverMyBookingdata = action.payload.data;
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        intracityDriverRideData:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...driverMyBookingdata]
            : [...state.intracityDriverRideData, ...driverMyBookingdata],
        intracityDriverRideLoading: false,
        intracityDriverRideTotalPage: action.payload.total_page,
        intracityDriverMyBookingData: action.payload,
      };
    case Constant.INTRACITY_DRIVER_MY_BOOKINGS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        intracityDriverRideLoading: false,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// SAVE RATINGS ////////////////////
    case Constant.SAVE_INTRACITY_RATING_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.SAVE_INTRACITY_RATING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        saveIntracityRatingData: action.payload,
      };
    case Constant.SAVE_INTRACITY_RATING_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////ADD INTERCITY RIDE////////////////////
    case Constant.ADD_INTRACITY_RIDE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.ADD_INTRACITY_RIDE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        intracityAllRideData: action.payload,
        error: undefined,
      };
    case Constant.ADD_INTRACITY_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////CHECK AVAILABLE CITY////////////////////
    case Constant.CHECK_AVAILABLE_CITY_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.CHECK_AVAILABLE_CITY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.CHECK_AVAILABLE_CITY_FAILURE:
      // DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };
    default:
      return state;
  }
};
