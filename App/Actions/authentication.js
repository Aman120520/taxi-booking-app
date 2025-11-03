import Constant from "../Network/Constant";
import API from "../Network/Api";

export function SignUp(body, endPoint, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.NEW_SIGNUP_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("authentication/" + endPoint, body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.NEW_SIGNUP_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.NEW_SIGNUP_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.NEW_SIGNUP_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function SignIn(body, callback) {
  return (dispatch) => {
    dispatch({ type: Constant.SIGNIN_REQUEST, body: body, isLoading: true });
    return API.post("authentication/login", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.SIGNIN_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.SIGNIN_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.SIGNIN_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function ForgotPassword(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.FORGOT_PASSWORD_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("authentication/forgotPassword", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.FORGOT_PASSWORD_SUCCESS,
            payload: response.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.FORGOT_PASSWORD_FAILURE,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({ type: Constant.FORGOT_PASSWORD_FAILURE, payload: error });
      });
  };
}

export function searchCityList(body, isAddress, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.CITY_SEARCH_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post(
      !isAddress ? "settings/place_search" : "settings/address_search",
      body
    )
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData);
          dispatch({
            type: Constant.CITY_SEARCH_SUCCESS,
            isLoading: false,
            payload: responseData.data,
          });
        } else {
          callback(null);
          dispatch({
            type: Constant.CITY_SEARCH_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(null);
        dispatch({
          type: Constant.CITY_SEARCH_FAILURE,
          payload: error,
          isLoading: false,
        });
      });
  };
}

export function termsOfSerivce() {
  return (dispatch) => {
    dispatch({ type: Constant.TERMS_OF_SERVICE_REQUEST, isLoading: true });
    return API.get("cms/terms_conditions")
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.TERMS_OF_SERVICE_SUCCESS,
            isLoading: false,
            payload: response.data,
          });
        } else {
          dispatch({
            type: Constant.TERMS_OF_SERVICE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.TERMS_OF_SERVICE_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function OtpVerification(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.MOBILE_VERIFICATION_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("authentication/otp_verification", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.MOBILE_VERIFICATION_SUCCESS,
            payload: response.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.MOBILE_VERIFICATION_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.MOBILE_VERIFICATION_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function resendOtp(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.RESEND_OTP_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("authentication/resendOtp", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.RESEND_OTP_SUCCESS,
            payload: response.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.RESEND_OTP_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.RESEND_OTP_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function CarBrand() {
  return (dispatch) => {
    dispatch({ type: Constant.CAR_BRAND_REQUEST, isLoading: true });
    return API.get("drivers/brandsListing")
      .then((response) => {
        const responseData = response.data;

        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.CAR_BRAND_SUCCESS,
            payload: response.data,
            isLoading: false,
          });
          dispatch(CarType());
        } else {
          dispatch({
            type: Constant.CAR_BRAND_FAILURE,
            payload: responseData,
            isLoading: false,
          });
          dispatch(CarType());
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.CAR_BRAND_FAILURE,
          status: error?.response?.status,
          payload: error,
          isLoading: false,
        });
        dispatch(CarType());
      });
  };
}

export function CarType() {
  return (dispatch) => {
    dispatch({ type: Constant.CAR_TYPE_REQUEST, isLoading: true });
    return API.get("drivers/typesListing")
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.CAR_TYPE_SUCCESS,
            payload: response.data,
            isLoading: false,
          });
          dispatch(getCountries());
        } else {
          dispatch({
            type: Constant.CAR_TYPE_FAILURE,
            payload: responseData,
            isLoading: false,
          });
          dispatch(getCountries());
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.CAR_TYPE_FAILURE,
          status: error?.response?.status,
          payload: error,
          isLoading: false,
        });
        dispatch(getCountries());
      });
  };
}

export function getCountries() {
  return (dispatch) => {
    dispatch({ type: Constant.GET_COUNTRIES_REQUEST, isLoading: true });
    return API.get("authentication/countryList")
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.GET_COUNTRIES_SUCCESS,
            payload: response.data,
            isLoading: false,
          });
          dispatch(generalSettings());
        } else {
          dispatch({
            type: Constant.GET_COUNTRIES_FAILURE,
            payload: responseData,
            isLoading: false,
          });
          dispatch(generalSettings());
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.GET_COUNTRIES_FAILURE,
          payload: error,
          status: error?.response?.status,
          isLoading: false,
        });
        dispatch(generalSettings());
      });
  };
}

export function CarMedia(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.CAR_IMAGES_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("drivers/uploadMedia", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.CAR_IMAGES_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.CAR_IMAGES_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.CAR_IMAGES_FAILURE,
          status: error?.response?.status,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function BecomeDriver(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.BECOME_DRIVER_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("drivers/becomeDriver", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.BECOME_DRIVER_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.BECOME_DRIVER_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.BECOME_DRIVER_FAILURE,
          isLoading: false,
          status: error?.response?.status,
          payload: error,
        });
      });
  };
}

export function generalSettings() {
  return (dispatch) => {
    dispatch({ type: Constant.GENERAL_SETTINGS_REQUEST, isLoading: true });
    return API.get("settings/generalSettings")
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.GENERAL_SETTINGS_SUCCESS,
            payload: response.data,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.GENERAL_SETTINGS_FAILURE,
            payload: responseData,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.GENERAL_SETTINGS_FAILURE,
          payload: error,
          status: error?.response?.status,
          isLoading: false,
        });
      });
  };
}

export function changePassword(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.CHANGE_PASSWORD_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("authentication/change_password", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.CHANGE_PASSWORD_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.CHANGE_PASSWORD_FAILURE,
            isLoading: false,
            payload: error,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.CHANGE_PASSWORD_FAILURE,
          isLoading: false,
          status: error?.response?.status,
          payload: error,
        });
      });
  };
}

export function AddProfilePicture(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.ADD_PROFILE_PICTURE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("authentication/upload_image", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.ADD_PROFILE_PICTURE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.ADD_PROFILE_PICTURE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.ADD_PROFILE_PICTURE_FAILURE,
          isLoading: false,
          status: error?.response?.status,
          payload: error,
        });
      });
  };
}

export function editProfile(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.EDIT_PROFILE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("authentication/updateProfile", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.EDIT_PROFILE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.EDIT_PROFILE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.EDIT_PROFILE_FAILURE,
          isLoading: false,
          status: error?.response?.status,
          payload: error,
        });
      });
  };
}

export function userDetails(body, callback) {
  return (dispatch) => {
    dispatch({ type: Constant.USER_DETAILS_REQUEST, isLoading: true });
    return API.post("authentication/userDetails", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.USER_DETAILS_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.USER_DETAILS_FAILURE,
            payload: responseData,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.USER_DETAILS_FAILURE,
          payload: error,
          status: error?.response?.status,
          isLoading: false,
        });
      });
  };
}

export function driverDetails(body, callback) {
  return (dispatch) => {
    dispatch({ type: Constant.GET_DRIVER_DETAILS_REQUEST, isLoading: true });
    return API.post("drivers/driverDetail", body)
      .then(async (response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          await dispatch({
            type: Constant.GET_DRIVER_DETAILS_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
          callback(responseData, true);
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.GET_DRIVER_DETAILS_FAILURE,
            payload: responseData,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.GET_DRIVER_DETAILS_FAILURE,
          payload: error,
          status: error?.response?.status,
          isLoading: false,
        });
      });
  };
}

export function updatePersonaStatus(body, navigation, callback) {
  return (dispatch) => {
    return API.post("authentication/updatePersonaStatus", body)
      .then(async (response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
        } else {
          callback(false);
          dispatch({
            type: Constant.DEFAULT_API_FAILURE,
            payload: responseData,
            isLoading: false,
          });
        }
      })
      .catch((error) => {
        callback(false);
        dispatch({
          type: Constant.DEFAULT_API_FAILURE,
          payload: error,
          status: error?.response?.status,
          isLoading: false,
        });
      });
  };
}

export function deleteDriverMedia(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.DELETE_DRIVER_MEDIA_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("drivers/deleteDriverMedia", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.DELETE_DRIVER_MEDIA_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.DELETE_DRIVER_MEDIA_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.DELETE_DRIVER_MEDIA_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function logout(body, callback) {
  return (dispatch) => {
    dispatch({ type: Constant.LOGOUT_REQUEST, body: body, isLoading: true });
    return API.post("authentication/logout", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.LOGOUT_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.LOGOUT_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.LOGOUT_FAILURE,
          isLoading: false,
          status: error?.response?.status,
          payload: error,
        });
      });
  };
}

export function checkSocialId(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.CHECK_SOCIAL_ID_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("authentication/checkSocialId", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.CHECK_SOCIAL_ID_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.CHECK_SOCIAL_ID_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.CHECK_SOCIAL_ID_FAILURE,
          isLoading: false,
          status: error?.response?.status,
          payload: error,
        });
      });
  };
}

export function checkStatus(body, callback) {
  return (dispatch) => {
    dispatch({ type: Constant.IS_ONLINE_REQUEST, body: body, isLoading: true });
    return API.post("settings/driverOnlineOffline", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.IS_ONLINE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.DEFAULT_API_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.DEFAULT_API_FAILURE,
          isLoading: false,
          status: error?.response?.status,
          payload: error,
        });
      });
  };
}

export function getDriverDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.DRIVER_DETAILS_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("drivers/driverDetail", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.DRIVER_DETAILS_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.DRIVER_DETAILS_FAILURE,
            status: error?.response?.status,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.DRIVER_DETAILS_FAILURE,
          isLoading: false,
          status: error?.response?.status,
          payload: error,
        });
      });
  };
}

export function updateDriverProfile(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.UPDATE_DRIVER_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("drivers/updateDriverProfile", body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.UPDATE_DRIVER_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.UPDATE_DRIVER_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.UPDATE_DRIVER_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}
