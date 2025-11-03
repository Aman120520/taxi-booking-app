import Constant from "../Network/Constant";
import API from "../Network/Api";
import { userDetails } from "./authentication";

export function changeRole(body, navigation, callBack) {
  return (dispatch) => {
    dispatch({ type: Constant.CHANGE_ROLE_REQUEST, isLoading: true });
    return API.post("settings/changeRole", body)
      .then(async (response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.CHANGE_ROLE_SUCCESS,
            payload: response.data,
          });
          await dispatch(
            userDetails(body, async (data, isSuccess) => {
              setTimeout(() => {
                callBack(true);
              }, 3000);
              navigation.replace("BottomTabNavigator", {
                screen: "Account",
              });
            })
          );
        } else {
          callBack(false);
          dispatch({
            type: Constant.CHANGE_ROLE_FAILURE,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callBack(false);
        dispatch({
          type: Constant.CHANGE_ROLE_FAILURE,
          status: error?.response?.status,
          payload: error,
        });
      });
  };
}

export function emailUs(body, callBack) {
  return (dispatch) => {
    dispatch({ type: Constant.EMAIL_US_REQUEST, isLoading: true });
    return API.post("settings/emailUs", body)
      .then(async (response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.EMAIL_US_SUCCESS,
            payload: response.data,
          });
          callBack(responseData, true);
        } else {
          dispatch({
            type: Constant.EMAIL_US_FAILURE,
            payload: responseData,
          });
          callBack(null, false);
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.EMAIL_US_FAILURE,
          status: error?.response?.status,
          payload: error,
        });
        callBack(null, false);
      });
  };
}

export function changeLanguage(body, callBack) {
  return (dispatch) => {
    dispatch({ type: Constant.CHANGE_LANGUAGE_REQUEST, isLoading: true });
    return API.post("settings/changeLanguage", body)
      .then(async (response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.CHANGE_LANGUAGE_SUCCESS,
            payload: response.data,
          });
          dispatch({
            type: Constant.USER_DETAILS_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
          callBack(responseData, true);
        } else {
          dispatch({
            type: Constant.CHANGE_LANGUAGE_FAILURE,
            payload: responseData,
          });
          callBack(null, false);
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.CHANGE_LANGUAGE_FAILURE,
          status: error?.response?.status,
          payload: error,
        });
        callBack(null, false);
      });
  };
}

export function addReferralCode(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.REFERRAL_CODE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("authentication/addReferralcode", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.REFERRAL_CODE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.REFERRAL_CODE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.REFERRAL_CODE_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function totalRevenue(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.TOTAL_REVENUE_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("payment_history/paymentRevenue", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.TOTAL_REVENUE_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.TOTAL_REVENUE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.TOTAL_REVENUE_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function WithDrawBalance(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.WITHDRAW_BALANCE_REQUEST,
      body: body,
      withDrawPage: body.page,
      isLoading: true,
    });
    return API.post("payment_history/withdrawbalanceHistory", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.WITHDRAW_BALANCE_SUCCESS,
            payload: responseData,
            withDrawPage: body.page,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.WITHDRAW_BALANCE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.WITHDRAW_BALANCE_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function intercityRevenue(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.INTERCITY_REVENUE_REQUEST,
      body: body,
      intercityRevenuePage: body.page,
      isLoading: true,
    });
    return API.post("payment_history/intercityPaymentHistory", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.INTERCITY_REVENUE_SUCCESS,
            payload: responseData,
            intercityRevenuePage: body.page,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.INTERCITY_REVENUE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.INTERCITY_REVENUE_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function intracityRevenue(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.INTRACITY_REVENUE_REQUEST,
      body: body,
      intracityRevPage: body.page,
      isLoading: true,
    });
    return API.post("payment_history/intracityPaymentHistory", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.INTRACITY_REVENUE_SUCCESS,
            payload: responseData,
            intracityRevPage: body.page,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.INTRACITY_REVENUE_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.INTRACITY_REVENUE_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getDriverSubscriptionPlan() {
  return (dispatch) => {
    dispatch({
      type: Constant.GET_DRIVER_SUB_REQUEST,
      isLoading: true,
    });
    return API.get("subscription/get_driver_plan")
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          dispatch({
            type: Constant.GET_DRIVER_SUB_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          dispatch({
            type: Constant.GET_DRIVER_SUB_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        dispatch({
          type: Constant.GET_DRIVER_SUB_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function addSubscription(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.ADD_SUBSCRIPTION_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("subscription/create_customer_subscription", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.ADD_SUBSCRIPTION_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.ADD_SUBSCRIPTION_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.ADD_SUBSCRIPTION_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function subscriptionPayment(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.SUBSCRIPTION_PAYMENT_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("subscription/subscription_payment_insert", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.SUBSCRIPTION_PAYMENT_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.SUBSCRIPTION_PAYMENT_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.SUBSCRIPTION_PAYMENT_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function subscriptionSuccessDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.SUBSCRIPTION_DETAILS_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("subscription/subscription_success_detail", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.SUBSCRIPTION_DETAILS_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.SUBSCRIPTION_DETAILS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.SUBSCRIPTION_DETAILS_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function subscriptionCancel(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.SUBSCRIPTION_CANCEL_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("subscription/subscription_cancel", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.SUBSCRIPTION_CANCEL_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.SUBSCRIPTION_CANCEL_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.SUBSCRIPTION_CANCEL_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function addGetPaidAccount(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.ADD_GET_PAID_ACC_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("get_paid/addEditAccount", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.ADD_GET_PAID_ACC_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.ADD_GET_PAID_ACC_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.ADD_GET_PAID_ACC_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function getPaidAccountDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.GET_PAID_ACC_DETAILS_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("get_paid/accountDetails", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.GET_PAID_ACC_DETAILS_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.GET_PAID_ACC_DETAILS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
      });
  };
}

export function updateGetPaidAccountDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.UPDATE_GET_PAID_ACC_DETAILS_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("get_paid/addEditAccount", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.UPDATE_GET_PAID_ACC_DETAILS_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.UPDATE_GET_PAID_ACC_DETAILS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.UPDATE_GET_PAID_ACC_DETAILS_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function updateBankAccountDetails(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.UPDATE_BANK_ACC_DETAILS_REQUEST,
      body: body,
      isLoading: true,
    });
    return API.post("get_paid/updateBankDetails", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.UPDATE_BANK_ACC_DETAILS_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.UPDATE_BANK_ACC_DETAILS_FAILURE,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.UPDATE_BANK_ACC_DETAILS_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}

export function changePayoutStatus(body, callback) {
  return (dispatch) => {
    dispatch({
      type: Constant.CHANGE_PAYOUT_STATUS_SUCCESS,
      body: body,
      isLoading: true,
    });
    return API.post("settings/changePayoutStatus", body)
      .then((response) => {
        const responseData = response.data;
        if (responseData.success === "yes" && responseData.data) {
          callback(responseData, true);
          dispatch({
            type: Constant.CHANGE_PAYOUT_STATUS_SUCCESS,
            payload: responseData.data,
            isLoading: false,
          });
        } else {
          callback(responseData.data, false);
          dispatch({
            type: Constant.CHANGE_PAYOUT_STATUS_SUCCESS,
            isLoading: false,
            payload: responseData,
          });
        }
      })
      .catch((error) => {
        callback(error.response, false);
        dispatch({
          type: Constant.UPDATE_BANK_ACC_DETAILS_FAILURE,
          isLoading: false,
          payload: error,
        });
      });
  };
}
