import Constant from "../Network/Constant";
import API from "../Network/Api";

export function intercityPickupCitySearch(endPoint, callback) {
  return (dispatch) => {
    dispatch({ type: Constant.PICKUP_CITY_SEARCH_REQUEST });
    return API.get(endPoint)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.PICKUP_CITY_SEARCH_SUCCESS,
            payload: response.data,
          });
        } else {
          callback(responseData.data, true);
          dispatch({
            type: Constant.PICKUP_CITY_SEARCH_FAILURE,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.PICKUP_CITY_SEARCH_FAILURE,
          status: error?.response?.status,
          payload: error,
        });
      });
  };
}

export function getIntercityAllRideList(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.GET_ALL_INTERCITY_RIDE_REQUEST,
      body: body,
      searchRidePage: body.page,
      isLoading: true,
    });
    return API.post("intercity/intercityAllRide", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.GET_ALL_INTERCITY_RIDE_SUCCESS,
            payload: responseData,
            searchRidePage: body.page,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.GET_ALL_INTERCITY_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.GET_ALL_INTERCITY_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
        });
      });
  };
}

export function addIntercityRide(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.ADD_INTERCITY_RIDE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/addIntercity", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.ADD_INTERCITY_RIDE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.ADD_INTERCITY_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.ADD_INTERCITY_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getIntercityDriverRideDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.GET_INTERCITY_DRIVER_RIDE_REQUEST,
      body: body,
      page: body.page,
      isLoading: true,
    });
    return API.post("intercity/intercityDriverRide", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.GET_INTERCITY_DRIVER_RIDE_SUCCESS,
            payload: responseData,
            page: body.page,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.GET_INTERCITY_DRIVER_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.GET_INTERCITY_DRIVER_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getIntercityRideDetails(body, isRider, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.DRIVER_INTERCITY_RIDE_DETAILS_REQUEST,
      body: body,
      isLoading: true,
    });
    var endPoint = isRider
      ? "intercity/riderIntercityRideDetail"
      : "intercity/driverIntercityRideDetail";
    return API.post(endPoint, body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.DRIVER_INTERCITY_RIDE_DETAILS_SUCCESS,
            payload: responseData,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.DRIVER_INTERCITY_RIDE_DETAILS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.DRIVER_INTERCITY_RIDE_DETAILS_FAILURE,
          status: error?.response?.status,
          isLoading: false,
        });
      });
  };
}

export function intercityBookRide(body, callback) {
  return (dispatch) => {
    dispatch({ type: Constant.BOOK_RIDE_REQUEST, body: body, isLoading: true });
    return API.post("intercity/book_rides", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.BOOK_RIDE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.BOOK_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.BOOK_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function paymentInsert(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.PAYMENT_INSERT_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/payment_insert", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.PAYMENT_INSERT_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.PAYMENT_INSERT_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.PAYMENT_INSERT_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function intercityMyBookings(body) {
  return (dispatch) => {
    dispatch({
      type: Constant.MY_BOOKINGS_REQUEST,
      body: body,
      page: body.page,
      isLoading: true,
    });
    return API.post("intercity/get_intercityMyBooking", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.MY_BOOKINGS_SUCCESS,
            payload: responseData,
            page: body.page,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.MY_BOOKINGS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.MY_BOOKINGS_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function driverMyBookings(body) {
  return (dispatch) => {
    dispatch({
      type: Constant.DRIVER_INTERCITY_MY_BOOKINGS_REQUEST,
      body: body,
      driverMyBookingPage: body.page,
      isLoading: true,
    });
    return API.post("intercity/get_driverIntercityMyBooking", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.DRIVER_INTERCITY_MY_BOOKINGS_SUCCESS,
            payload: responseData,
            driverMyBookingPage: body.page,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.DRIVER_INTERCITY_MY_BOOKINGS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.DRIVER_INTERCITY_MY_BOOKINGS_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function driverCancelBooking(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.DRIVER_CANCEL_BOOKING_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/driverCancelBooking", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.DRIVER_CANCEL_BOOKING_SUCCESS,
            payload: responseData.data,
            booking_id: body.booking_id,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.DRIVER_CANCEL_BOOKING_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.DRIVER_CANCEL_BOOKING_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function driverCancelRide(body, endPoint, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.DRIVER_CANCEL_RIDE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post(endPoint, body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.DRIVER_CANCEL_RIDE_SUCCESS,
            payload: responseData,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.DRIVER_CANCEL_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.DRIVER_CANCEL_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function driverIntercityAllRideCancel(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.DRIVER_INTERCITY_ALL_RIDE_CANCEL_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/driverIntercityAllRideCancel", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.DRIVER_INTERCITY_ALL_RIDE_CANCEL_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.DRIVER_INTERCITY_ALL_RIDE_CANCEL_SUCCESS,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.DRIVER_INTERCITY_ALL_RIDE_CANCEL_SUCCESS,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function driverIntercityCancelRideBeforeDeparture(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.DRIVER_INTERCITY_CANCEL_RIDE_BEFORE_DEPARTURE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/driverIntercityCancelRideBeforeDeparture", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.DRIVER_INTERCITY_CANCEL_RIDE_BEFORE_DEPARTURE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.DRIVER_INTERCITY_CANCEL_RIDE_BEFORE_DEPARTURE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.DRIVER_INTERCITY_CANCEL_RIDE_BEFORE_DEPARTURE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function riderCancelBooking(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.RIDER_CANCEL_BOOKING_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/riderCancelBooking", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.RIDER_CANCEL_BOOKING_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.RIDER_CANCEL_BOOKING_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.RIDER_CANCEL_BOOKING_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function saveRating(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.SAVE_RATING_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/save_rating", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.SAVE_RATING_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.SAVE_RATING_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.SAVE_RATING_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getRideBookingDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.RIDE_BOOKING_DETAILS_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/driverIntercityRideDetail", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.RIDE_BOOKING_DETAILS_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(null);
          dispatch({
            type: Constant.RIDE_BOOKING_DETAILS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(null);
        dispatch({
          type: Constant.RIDE_BOOKING_DETAILS_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getIntercityRideBookingDetails(body) {
  return (dispatch) => {
    dispatch({
      type: Constant.INTERCITY_RIDE_BOOKING_DETAILS_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/get_ride_bookingDetails", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.INTERCITY_RIDE_BOOKING_DETAILS_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.INTERCITY_RIDE_BOOKING_DETAILS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.INTERCITY_RIDE_BOOKING_DETAILS_FAILURE,
          status: error?.response?.status,
          isLoading: false,
        });
      });
  };
}

export function completeRide(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.COMPLETE_RIDE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/driverIntercityCompleteRide", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.COMPLETE_RIDE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.COMPLETE_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.COMPLETE_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function updateSeats(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.UPDATE_SEAT_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/update_seat", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.UPDATE_SEAT_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.UPDATE_SEAT_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.UPDATE_SEAT_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getReviewDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.GET_REVIEWS_DETAIL_REQUEST,
      body: body,
      reviewPage: body.page,
      isLoading: true,
    });
    return API.post("intercity/get_review_details", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.GET_REVIEWS_DETAIL_SUCCESS,
            payload: responseData,
            reviewPage: body.page,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.GET_REVIEWS_DETAIL_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.GET_REVIEWS_DETAIL_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getCityFare(body, callback) {
  return (dispatch) => {
    return API.post("intercity/getCityFare", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
        } else {
          callback(responseData.data, false);
        }
      })
      .catch((error) => {
        callback(error.response, false);
      });
  };
}

export function getDistance(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.GET_POST_RIDE_DISTANCE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/getDistance", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.GET_POST_RIDE_DISTANCE_SUCCESS,
            payload: responseData,
            isLoading: false,
          });
        } else {
          callback(responseData);
          dispatch({
            type: Constant.GET_POST_RIDE_DISTANCE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(null);
        dispatch({
          type: Constant.GET_POST_RIDE_DISTANCE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function updateIntercityRide(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.UPDATE_RIDE_DETAILS_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intercity/editIntercity", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.UPDATE_RIDE_DETAILS_SUCCESS,
            payload: responseData,
            isLoading: false,
          });
        } else {
          callback(responseData);
          dispatch({
            type: Constant.UPDATE_RIDE_DETAILS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error);
        dispatch({
          type: Constant.UPDATE_RIDE_DETAILS_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function placeDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.PLACE_SEARCH_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("settings/place_details", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData);
        } else {
          callback(null);
          dispatch({
            type: Constant.DEFAULT_API_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(null);
        dispatch({
          type: Constant.DEFAULT_API_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getDirections(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.CITY_SEARCH_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("settings/get_directions", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData);
        } else {
          callback(null);
          dispatch({
            type: Constant.DEFAULT_API_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(null);
        dispatch({
          type: Constant.DEFAULT_API_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function intercityPaymentInsert(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.INTERCITY_PAYMENT_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("settings/intercity_payment_intents", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.INTERCITY_PAYMENT_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.INTERCITY_PAYMENT_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.INTERCITY_PAYMENT_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}
