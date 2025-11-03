import Constant from "../Network/Constant";
import DialogHelper from "../Helpers/DilogHelper";

const initialState = {
  isLoading: false,
  paymentDetails: [],
  pickupcitySearchData: [],
  intercityAllRideData: [],
  intercityRideBookingData: [],
  isFromRoot: true,
  saveRatingData: [],
  riderMyBookingData: [],
  driverMyBookingData: [],
  dropoffAddresses: [],
  getReviewData: [],
  updateSeatsData: [],
  invoiceData: [],
  intercityPaymentData: [],
  rideDetails: [],
  pickupCitySearchText: "",
  dropOffCitySearchText: "",
  rideBookingsTotalPage: 100,
  page: 1,
  rideData: [],
  rideLoading: false,
  rideTotalPage: 100,
  driverPage: 1,
  driverRideData: [],
  driverRideLoading: false,
  driverRideTotalPage: 100,
  searchRideData: [],
  availableSeat: [],
  searchRideLoading: false,
  searchRideTotalPage: 100,
  searchRidePage: 1,
  reviewData: [],
  reviewPage: 1,
  reviewLoading: false,
  reviewTotalPage: 100,
  driverMyBookingPage: 1,
  driverMyBookingRideData: [],
  myBookingsList: [],
  driverMyBookingRideLoading: false,
  driverMyBookingRideTotalPage: 100,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Constant.IS_FROM_ROOT:
      return {
        ...state,
        isFromRoot: false,
      };

    ///////////////// PICKUP CITY SEARCHs ////////////////////
    case Constant.PICKUP_CITY_SEARCH_REQUEST:
      return {
        ...state,
        type: action.type,
        error: action.error,
      };
    case Constant.PICKUP_CITY_SEARCH_SUCCESS:
      return {
        ...state,
        type: action.type,
        error: undefined,
        pickupcitySearchData: action.payload.data,
      };
    case Constant.PICKUP_CITY_SEARCH_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        type: action.type,
        error: action.error,
      };

    /////////////////GET ALL INTERCITY RIDE////////////////////
    case Constant.GET_ALL_INTERCITY_RIDE_REQUEST:
      return {
        ...state,
        rideLoading: true,
        searchRidePage: action.body.page,
        isLoading:
          state.searchRidePage === 1 || state.searchRidePage === "1"
            ? true
            : false,
        pickupCitySearchText: action.body.pickup_city,
        dropOffCitySearchText: action.body.dropoff_city,
        type: action.type,
        error: action.error,
      };
    case Constant.GET_ALL_INTERCITY_RIDE_SUCCESS:
      const AllRideData = action.payload.data;
      console.log("AllRideData", AllRideData);
      return {
        ...state,
        rideLoading: false,
        isLoading: false,
        type: action.type,
        searchRideData:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...AllRideData]
            : [...state.rideData, ...AllRideData],
        availableSeat: AllRideData?.available_seat,
        rideLoading: false,
        searhcRideTotalPage: action.payload.total_page,
        intercityAllRideData: action.payload,
        error: undefined,
      };
    case Constant.GET_ALL_INTERCITY_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        rideLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////ADD INTERCITY RIDE////////////////////
    case Constant.ADD_INTERCITY_RIDE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.ADD_INTERCITY_RIDE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        intercityAllRideData: action.payload,
        error: undefined,
      };
    case Constant.ADD_INTERCITY_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////GET INTERCITY DRIVER RIDE DETAILS////////////////////
    case Constant.GET_INTERCITY_DRIVER_RIDE_REQUEST:
      return {
        ...state,
        rideLoading: true,
        driverPage: action.body.page,
        isLoading:
          state.driverPage === 1 || state.driverPage === "1" ? true : false,
        type: action.type,
        error: action.error,
      };
    case Constant.GET_INTERCITY_DRIVER_RIDE_SUCCESS:
      const driverData = action.payload.data;
      return {
        ...state,
        rideLoading: false,
        isLoading: false,
        type: action.type,
        driverRideData:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...driverData]
            : [...state.driverRideData, ...driverData],
        driverRideLoading: false,
        driverRideTotalPage: action.payload.total_page,
        intercityAllRideData: action.payload,
        error: undefined,
      };
    case Constant.CLEAR_RIDE_DETAILS_SUCCESS:
      return {
        ...state,
        rideLoading: false,
        isLoading: false,
        intercityAllRideData: null,
        type: action.type,
        intercityRideBookingData: null,
        intercityAllRideData: null,
        error: undefined,
      };
    case Constant.CLEAR_SEARCH_RIDE_DETAILS_SUCCESS:
      return {
        ...state,
        searchRideData: null,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.GET_INTERCITY_DRIVER_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        rideLoading: false,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////GET INTERCITY DRIVER RIDE DETAILS////////////////////
    case Constant.DRIVER_INTERCITY_RIDE_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.DRIVER_INTERCITY_RIDE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        intercityAllRideData: action.payload.data,
        error: undefined,
      };
    case Constant.DRIVER_INTERCITY_RIDE_DETAILS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////RIDE BOOK////////////////////
    case Constant.BOOK_RIDE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.BOOK_RIDE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        intercityAllRideData: action.payload,
        error: undefined,
      };
    case Constant.BOOK_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// PAYMENT INSERT ////////////////////
    case Constant.PAYMENT_INSERT_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.PAYMENT_INSERT_SUCCESS:
      console.log("updateSeatsData", action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        invoiceData: action.payload,
        error: undefined,
      };
    case Constant.PAYMENT_INSERT_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// MY BOOKINGS ////////////////////
    case Constant.MY_BOOKINGS_REQUEST:
      return {
        ...state,
        rideLoading: true,
        page: action.body.page,
        isLoading: state.page === 1 || state.page === "1" ? true : false,
        type: action.type,
        error: action.error,
      };
    case Constant.MY_BOOKINGS_SUCCESS:
      const data = action.payload.data;
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        rideData:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...data]
            : [...state.rideData, ...data],
        rideLoading: false,
        rideTotalPage: action.payload.total_page,
        riderMyBookingData: action.payload,
      };
    case Constant.MY_BOOKINGS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        rideLoading: false,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    //////////////// DRIVER INTERCITY MY BOOKINGS ////////////////////
    case Constant.DRIVER_INTERCITY_MY_BOOKINGS_REQUEST:
      return {
        ...state,
        driverMyBookingRideLoading: true,
        driverMyBookingPage: action.body.page,
        isLoading:
          state.driverMyBookingPage === 1 || state.driverMyBookingPage === "1"
            ? true
            : false,
        type: action.type,
        error: action.error,
      };
    case Constant.DRIVER_INTERCITY_MY_BOOKINGS_SUCCESS:
      const driverIntercityMyBookingdata = action.payload.data;
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        driverMyBookingRideData:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...driverIntercityMyBookingdata]
            : [
                ...state.driverMyBookingRideData,
                ...driverIntercityMyBookingdata,
              ],
        myBookingsList: action.payload.data,
        driverMyBookingRideLoading: false,
        driverMyBookingRideTotalPage: action.payload.total_page,
        driverMyBookingData: action.payload,
      };
    case Constant.DRIVER_INTERCITY_MY_BOOKINGS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        driverMyBookingRideLoading: false,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// DRIVER CANCEL BOOKINGS ////////////////////
    case Constant.DRIVER_CANCEL_BOOKING_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.DRIVER_CANCEL_BOOKING_SUCCESS:
      var dataList = state.intercityAllRideData;
      dataList?.riderList?.filter((item) => item.id !== action.booking_id);
      return {
        ...state,
        isLoading: false,
        intercityAllRideData: dataList,
        type: action.type,
        error: undefined,
      };
    case Constant.DRIVER_CANCEL_BOOKING_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// DRIVER CANCEL BOOKINGS ////////////////////
    case Constant.DRIVER_CANCEL_RIDE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.DRIVER_CANCEL_RIDE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.DRIVER_CANCEL_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// DRIVER INTERCITY ALL RIDE CANCEL BOOKINGS ////////////////////
    case Constant.DRIVER_INTERCITY_ALL_RIDE_CANCEL_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.DRIVER_INTERCITY_ALL_RIDE_CANCEL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.DRIVER_INTERCITY_ALL_RIDE_CANCEL_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// DRIVER INTERCITY CANCEL RIDE BEFORE DEPARTURE////////////////////
    case Constant.DRIVER_INTERCITY_CANCEL_RIDE_BEFORE_DEPARTURE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.DRIVER_INTERCITY_CANCEL_RIDE_BEFORE_DEPARTURE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.DRIVER_INTERCITY_CANCEL_RIDE_BEFORE_DEPARTURE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// DRIVER CANCEL BOOKINGS ////////////////////
    case Constant.RIDER_CANCEL_BOOKING_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.RIDER_CANCEL_BOOKING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.RIDER_CANCEL_BOOKING_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// SAVE RATINGS ////////////////////
    case Constant.SAVE_RATING_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.SAVE_RATING_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        saveRatingData: action.payload,
      };
    case Constant.SAVE_RATING_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////UPDATE DRIVER RIDE DETAILS ////////////////////
    case Constant.UPDATE_RIDE_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.UPDATE_RIDE_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        rideDetails: action.payload,
        intercityRideBookingData: action.payload,
      };
    case Constant.UPDATE_RIDE_DETAILS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////GET RIDE DISTANCE ////////////////////
    case Constant.GET_POST_RIDE_DISTANCE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.GET_POST_RIDE_DISTANCE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.GET_POST_RIDE_DISTANCE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////INTERCITY RIDE BOOKING DETAILS ////////////////////
    case Constant.INTERCITY_RIDE_BOOKING_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.INTERCITY_RIDE_BOOKING_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        intercityRideBookingData: action.payload,
      };
    case Constant.INTERCITY_RIDE_BOOKING_DETAILS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    //////////////////////////////////////////////
    case Constant.RIDE_BOOKING_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.RIDE_BOOKING_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        intercityRideBookingData: action.payload.data,
      };
    case Constant.RIDE_BOOKING_DETAILS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// COMPLETE RIDE ////////////////////
    case Constant.COMPLETE_RIDE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.COMPLETE_RIDE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        intercityRideBookingData: action.payload,
      };
    case Constant.COMPLETE_RIDE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// COMPLETE RIDE ////////////////////
    case Constant.UPDATE_SEAT_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.UPDATE_SEAT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        updateSeatsData: action.payload,
      };
    case Constant.UPDATE_SEAT_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// GET REVIEWS DETAILS ////////////////////
    case Constant.GET_REVIEWS_DETAIL_REQUEST:
      return {
        ...state,
        reviewLoading: true,
        reviewPage: action.body.page,
        isLoading: state.reviewPage === 1 || state.reviewPage ? true : false,
        type: action.type,
        error: action.error,
      };
    case Constant.GET_REVIEWS_DETAIL_SUCCESS:
      const reviews = action.payload.data;
      return {
        ...state,
        reviewLoading: false,
        isLoading: false,
        type: action.type,
        error: undefined,
        getReviewData: action.payload,
        reviewData:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...reviews]
            : [...state.reviewData, ...reviews],
        reviewLoading: false,
        reviewTotalPage: action.payload.total_page,
      };
    case Constant.GET_REVIEWS_DETAIL_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        reviewLoading: false,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    case Constant.DEFAULT_API_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// INTERCITY PAYMENT INSERT ////////////////////
    case Constant.INTERCITY_PAYMENT_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.INTERCITY_PAYMENT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        intercityPaymentData: action.payload,
        invoiceData: action.payload,
        error: undefined,
      };
    case Constant.INTERCITY_PAYMENT_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
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
