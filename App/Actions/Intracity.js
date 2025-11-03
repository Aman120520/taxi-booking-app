import Constant from "../Network/Constant";
import API from "../Network/Api";

export function getIntracityRiderRideDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.GET_INTRACITY_RIDER_RIDE_REQUEST,
      body: body,
      riderPage: body.page,
      isLoading: true,
    });
    return API.post("intracity/riderIntracityListing", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.GET_INTRACITY_RIDER_RIDE_SUCCESS,
            payload: responseData,
            riderPage: body.page,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.GET_INTRACITY_RIDER_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.GET_INTRACITY_RIDER_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getIntracityDriverRideDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.GET_INTRACITY_DRIVER_RIDE_REQUEST,
      body: body,
      page: body.page,
      isLoading: true,
    });
    return API.post("intracity/driverIntracityListing", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.GET_INTRACITY_DRIVER_RIDE_SUCCESS,
            payload: responseData,
            page: body.page,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.GET_INTRACITY_DRIVER_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.GET_INTRACITY_DRIVER_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function addIntracityDriverLocation(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.DRIVER_INTRACITY_ADD_LOCATION_REQUEST,
      body: body,
      page: body.page,
      isLoading: true,
    });
    return API.post("intracity/saveCurrentLatLong", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.DRIVER_INTRACITY_ADD_LOCATION_SUCCESS,
            payload: responseData,
            page: body.page,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.DRIVER_INTRACITY_ADD_LOCATION_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.DRIVER_INTRACITY_ADD_LOCATION_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getIntracityRideDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.INTRACITY_RIDE_DETAILS_REQUEST,
      body: body,
      isLoading: true,
    });
    var endPoint = "intracity/intracityViewDetail";
    return API.post(endPoint, body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.INTRACITY_RIDE_DETAILS_SUCCESS,
            payload: responseData,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.INTRACITY_RIDE_DETAILS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.INTRACITY_RIDE_DETAILS_FAILURE,
          status: error?.response?.status,
          isLoading: false,
        });
      });
  };
}

export function cancelRide(body, endPoint, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.INTRACITY_CANCEL_RIDE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post(endPoint, body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.INTRACITY_CANCEL_RIDE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.INTRACITY_CANCEL_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.INTRACITY_CANCEL_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function acceptRide(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.INTRACITY_ACCEPT_RIDE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intracity/acceptRideByDriver", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.INTRACITY_ACCEPT_RIDE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.INTRACITY_ACCEPT_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.INTRACITY_ACCEPT_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function startRide(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.INTRACITY_START_RIDE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intracity/startRideByDriver", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.INTRACITY_START_RIDE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.INTRACITY_START_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.INTRACITY_START_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function completeRide(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.INTRACITY_COMPLETE_RIDE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intracity/completeRideByDriver", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.INTRACITY_COMPLETE_RIDE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.INTRACITY_COMPLETE_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.INTRACITY_COMPLETE_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function intracityRiderMyBookings(body) {
  return (dispatch) => {
    dispatch({
      type: Constant.INTRACITY_RIDER_MY_BOOKINGS_REQUEST,
      body: body,
      page: body.page,
      isLoading: true,
    });
    return API.post("intracity/riderIntracityMyBooking", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.INTRACITY_RIDER_MY_BOOKINGS_SUCCESS,
            payload: responseData,
            page: body.page,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.INTRACITY_RIDER_MY_BOOKINGS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.INTRACITY_RIDER_MY_BOOKINGS_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function intracityDriverMyBookings(body) {
  return (dispatch) => {
    dispatch({
      type: Constant.INTRACITY_DRIVER_MY_BOOKINGS_REQUEST,
      body: body,
      page: body.page,
      isLoading: true,
    });
    return API.post("intracity/driverIntracityMyBooking", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.INTRACITY_DRIVER_MY_BOOKINGS_SUCCESS,
            payload: responseData,
            page: body.page,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.INTRACITY_DRIVER_MY_BOOKINGS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.INTRACITY_RIDER_MY_BOOKINGS_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function saveIntracityRating(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.SAVE_INTRACITY_RATING_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intracity/saveRating", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.SAVE_INTRACITY_RATING_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.SAVE_INTRACITY_RATING_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.SAVE_INTRACITY_RATING_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function addIntracityRide(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.ADD_INTRACITY_RIDE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intracity/addIntracityRide", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.ADD_INTRACITY_RIDE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.ADD_INTRACITY_RIDE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.ADD_INTRACITY_RIDE_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getIntracityCityFare(body, callback) {
  return (dispatch) => {
    return API.post("intracity/getCityFare", body)
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

export function getIntracityDistance(body, callback) {
  return (dispatch) => {
    return API.post("intracity/getDistance", body)
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

export function checkAvailableCity(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.CHECK_AVAILABLE_CITY_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("intracity/availableServers", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.CHECK_AVAILABLE_CITY_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.CHECK_AVAILABLE_CITY_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.CHECK_AVAILABLE_CITY_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}
