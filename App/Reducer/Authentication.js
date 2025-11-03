import Constant from "../Network/Constant";
import DialogHelper from "../Helpers/DilogHelper";

const initialState = {
  isLoading: false,
  userData: {},
  driverData: [],
  profileImage: [],
  countryData: [],
  carBrand: [],
  carType: [],
  carMedia: [],
  paymentDetails: [],
  loginData: [],
  userStatus: 0,
  driverLoader: false,
  referralCode: [],
  driverDetails: [],
  generalSettingsData: [],
  intercityAllRideData: [],
  intercityRideBookingData: [],
  isFromRoot: true,
  BecomeDriverData: [],
  tosData: [],
  riderMyBookingData: [],
  dropoffAddresses: [],
  pickupAddresses: [],
  credit: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case Constant.IS_FROM_ROOT:
      return {
        ...state,
        isFromRoot: false,
      };

    /////////////////SIGN UP////////////////////
    case Constant.NEW_SIGNUP_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.NEW_SIGNUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        userData: action.payload,
        userStatus: action?.payload?.is_online ? action?.payload?.is_online: state.userStatus,
        referralCode: action.payload.my_referral_code,
        error: undefined,
      };
    case Constant.NEW_SIGNUP_FAILURE:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////SIGN IN ///////////////////
    case Constant.SIGNIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.SIGNIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        loginData: action.payload,
        userData: action.payload,
        userStatus: action?.payload?.is_online ? action?.payload?.is_online: state.userStatus,
        referralCode: action.payload.my_referral_code,
        error: undefined,
      };
    case Constant.SIGNIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ////////////////FORGOT PASSWORD///////////////////
    case Constant.FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.FORGOT_PASSWORD_SUCCESS:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.FORGOT_PASSWORD_FAILURE:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////OTP VERIFICATION///////////////////
    case Constant.MOBILE_VERIFICATION_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
      };
    case Constant.MOBILE_VERIFICATION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
      };
    case Constant.MOBILE_VERIFICATION_FAILURE:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        type: action.error,
      };

    /////////////// RESEND OTP ///////////////////
    case Constant.RESEND_OTP_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
      };
    case Constant.RESEND_OTP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
      };
    case Constant.RESEND_OTP_FAILURE:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        type: action.error,
      };

    ///////////////CAR BRAND LISTING///////////////////
    case Constant.CAR_BRAND_REQUEST:
      return {
        ...state,
        isLoading: true,
        driverLoader: true,
        type: action.type,
      };
    case Constant.CAR_BRAND_SUCCESS:
      return {
        ...state,
        type: action.type,
        carBrand: action.payload.data,
      };
    case Constant.CAR_BRAND_FAILURE:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        type: action.error,
      };

    ///////////////CAR TYPE LISTING///////////////////
    case Constant.CAR_TYPE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
      };
    case Constant.CAR_TYPE_SUCCESS:
      return {
        ...state,
        type: action.type,
        carType: action.payload.data,
      };
    case Constant.CAR_TYPE_FAILURE:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        type: action.error,
      };

    ///////////////GET COUNTRIES///////////////////
    case Constant.GET_COUNTRIES_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
      };
    case Constant.GET_COUNTRIES_SUCCESS:
      return {
        ...state,
        type: action.type,
        countryData: action.payload.data,
      };
    case Constant.GET_COUNTRIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        type: action.error,
      };

    /////////////////CAR MEDIA///////////////////
    case Constant.CAR_IMAGES_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.CAR_IMAGES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        carMedia: action.payload.data,
        error: undefined,
      };
    case Constant.CAR_IMAGES_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////BECOME DRIVER///////////////////
    case Constant.BECOME_DRIVER_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.BECOME_DRIVER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        BecomeDriverData: action.payload,
      };
    case Constant.BECOME_DRIVER_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////GENERAL SETTINGS///////////////////
    case Constant.GENERAL_SETTINGS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.GENERAL_SETTINGS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        generalSettingsData: action.payload.data,
      };
    case Constant.GENERAL_SETTINGS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////CHANGE PASSWORD////////////////////
    case Constant.CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.CHANGE_PASSWORD_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////ADD PROFILE PICTURE////////////////////
    case Constant.ADD_PROFILE_PICTURE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.ADD_PROFILE_PICTURE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        profileImage: action.payload,
      };
    case Constant.ADD_PROFILE_PICTURE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// EDIT PROFILE ////////////////////
    case Constant.EDIT_PROFILE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.EDIT_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.EDIT_PROFILE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// USER DETAILS ////////////////////
    case Constant.USER_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.USER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        userData: action.payload,
        userStatus: action?.payload?.is_online ? action?.payload?.is_online: state.userStatus,
        credit: action.payload.credit,
      };
    case Constant.USER_DETAILS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// DRIVER DETAILS ////////////////////
    case Constant.GET_DRIVER_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.GET_DRIVER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        driverLoader: false,
        driverData: action.payload,
      };
    case Constant.GET_DRIVER_DETAILS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// DELETE DRIVER MEDIA ////////////////////
    case Constant.DELETE_DRIVER_MEDIA_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.DELETE_DRIVER_MEDIA_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.DELETE_DRIVER_MEDIA_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// LOGOUT ////////////////////
    case Constant.LOGOUT_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        userData: action.payload,
      };
    case Constant.LOGOUT_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// TERMS OF SERVICE ////////////////////
    case Constant.TERMS_OF_SERVICE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.TERMS_OF_SERVICE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        tosData: action.payload.data,
      };
    case Constant.TERMS_OF_SERVICE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// CHECK SOCIAL ID ////////////////////
    case Constant.CHECK_SOCIAL_ID_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.CHECK_SOCIAL_ID_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        userData: action.payload,
        userStatus: action?.payload?.is_online ? action?.payload?.is_online: state.userStatus,
      };
    case Constant.CHECK_SOCIAL_ID_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// CHECK STATUS ////////////////////
    case Constant.IS_ONLINE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.IS_ONLINE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        userStatus: action.payload.status,
      };
    case Constant.IS_ONLINE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////// DRIVER DETAILS ////////////////////
    case Constant.DRIVER_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.DRIVER_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        driverDetails: action.payload.data,
      };
    case Constant.DRIVER_DETAILS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    /////////////////UPDATE DRIVER///////////////////
    case Constant.UPDATE_DRIVER_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.UPDATE_DRIVER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
        BecomeDriverData: action.payload,
      };
    case Constant.UPDATE_DRIVER_FAILURE:
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
