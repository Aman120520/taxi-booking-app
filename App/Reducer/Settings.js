import Constant from "../Network/Constant";
import DialogHelper from "../Helpers/DilogHelper";

const initialState = {
  isLoading: false,
  isEmailUsLoading: false,
  isChangeLanguageLoading: false,
  subInvoiceData: [],
  role: [],
  subPlan: [],
  getPaidAccData: null,
  intercityPaymentHistory: [],
  intracityPaymentHistory: [],
  withdrawbalanceHistory: [],
  intercityRevenueLoading: false,
  intercityRevenuePage: 1,
  intercityRevenueTotalPage: 100,
  intracityRevenueLoading: false,
  intracityRevenuePage: 1,
  intracityRevenueTotalPage: 100,
  withDrawLoading: false,
  withDrawPage: 1,
  withDrawTotalPage: 100,
  totalRevAmount: 0,
  withDrwAmount: 0,
  interRevAmount: 0,
  intraRevAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    /////////////////CHANGE ROLE ////////////////////
    case Constant.CHANGE_ROLE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.CHANGE_ROLE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.payload.user_type,
        role: action.payload,
        error: undefined,
      };
    case Constant.CHANGE_ROLE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////EMAIL US///////////////////////
    case Constant.EMAIL_US_REQUEST:
      return {
        ...state,
        isEmailUsLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.EMAIL_US_SUCCESS:
      return {
        ...state,
        isEmailUsLoading: false,
        type: action.type,
        role: action.payload,
        error: undefined,
      };
    case Constant.EMAIL_US_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        isEmailUsLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////CHANGE LANGUAGE///////////////////////
    case Constant.CHANGE_LANGUAGE_REQUEST:
      return {
        ...state,
        isChangeLanguageLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.CHANGE_LANGUAGE_SUCCESS:
      return {
        ...state,
        isChangeLanguageLoading: false,
        type: action.type,
        role: action.payload,
        error: undefined,
      };
    case Constant.CHANGE_LANGUAGE_FAILURE:
      return {
        ...state,
        isLoading: false,
        isChangeLanguageLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////REFERRAL CODE///////////////////////
    case Constant.REFERRAL_CODE_REQUEST:
      return {
        ...state,
        isChangeLanguageLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.REFERRAL_CODE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.REFERRAL_CODE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        isChangeLanguageLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////TOTAL REVENUE///////////////////////
    case Constant.TOTAL_REVENUE_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.TOTAL_REVENUE_SUCCESS:
      console.log("REDUCE", action.payload);
      const isIntercityEmpty =
        Object.keys(action.payload.intercityPaymentHistory).length === 0;
      const isIntracityEmpty =
        Object.keys(action.payload.intracityPaymentHistory).length === 0;

      return {
        ...state,
        isLoading: false,
        intercityPaymentHistory: isIntercityEmpty
          ? {}
          : [action.payload.intercityPaymentHistory],

        intracityPaymentHistory: isIntracityEmpty
          ? {}
          : [action.payload.intracityPaymentHistory],
        withdrawbalanceHistory: action.payload.withdrawbalanceHistory,
        totalRevAmount: action.payload.total_revenue,
        withDrwAmount: action.payload.withdraw_balance,
        interRevAmount: action.payload.total_intercity_revenue,
        intraRevAmount: action.payload.total_intracity_revenue,
        type: action.type,
        error: undefined,
      };
    case Constant.TOTAL_REVENUE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////WITHDRAW BALANCE///////////////////////
    case Constant.WITHDRAW_BALANCE_REQUEST:
      return {
        ...state,
        withDrawLoading: true,
        withDrawPage: action.body.page,
        isLoading:
          state.withDrawPage === 1 || state.withDrawPage ? true : false,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.WITHDRAW_BALANCE_SUCCESS:
      const witDrw = action.payload.data;
      return {
        ...state,
        isLoading: false,
        withdrawbalanceHistory:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...witDrw]
            : [...state.withdrawbalanceHistory, ...witDrw],
        withDrawLoading: false,
        withDrawTotalPage: action.payload.total_page,
        type: action.type,
        error: undefined,
      };
    case Constant.WITHDRAW_BALANCE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        withDrawLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////INTERCITY_REVENUE///////////////////////
    case Constant.INTERCITY_REVENUE_REQUEST:
      return {
        ...state,
        intercityRevenueLoading: true,
        intercityRevenuePage: action.body.page,
        isLoading:
          state.intercityRevenuePage === 1 || state.intercityRevenuePage
            ? true
            : false,
        type: action.type,
        error: action.error,
      };
    case Constant.INTERCITY_REVENUE_SUCCESS:
      const revenue = action.payload.data;
      console.log("1", action.payload.data);
      return {
        ...state,
        isLoading: false,
        intercityPaymentHistory:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...revenue]
            : [...state.intercityPaymentHistory, ...revenue],
        intercityRevenueLoading: false,
        intercityRevenueTotalPage: action.payload.total_page,
        type: action.type,
        error: undefined,
      };
    case Constant.INTERCITY_REVENUE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        intercityRevenueLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////INTRACITY_REVENUE///////////////////////
    case Constant.INTRACITY_REVENUE_REQUEST:
      return {
        ...state,
        isLoading: true,
        intracityRevenueLoading: true,
        intracityRevenuePage: action.body.page,
        isLoading:
          state.intracityRevenuePage === 1 || state.intracityRevenuePage
            ? true
            : false,
        type: action.type,
        error: action.error,
      };
    case Constant.INTRACITY_REVENUE_SUCCESS:
      const intraRevenue = action.payload.data;
      return {
        ...state,
        isLoading: false,
        intracityPaymentHistory:
          action.payload.page === 1 || action.payload.page === "1"
            ? [...intraRevenue]
            : [...state.intracityPaymentHistory, ...intraRevenue],
        intracityRevenueLoading: false,
        intracityRevenueTotalPage: action.payload.total_page,
        type: action.type,
        error: undefined,
      };
    case Constant.INTRACITY_REVENUE_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        intracityRevenueLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////GET DRIVER SUBSCRIPTION PLAN///////////////////////
    case Constant.GET_DRIVER_SUB_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.GET_DRIVER_SUB_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        subPlan: action.payload,
        error: undefined,
      };
    case Constant.GET_DRIVER_SUB_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////SUBCRIPTION DETAILS///////////////////////
    case Constant.SUBSCRIPTION_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.SUBSCRIPTION_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        subInvoiceData: action.payload,
        error: undefined,
      };
    case Constant.SUBSCRIPTION_DETAILS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////SUBCRIPTION REQUEST///////////////////////
    case Constant.ADD_SUBSCRIPTION_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.ADD_SUBSCRIPTION_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.ADD_SUBSCRIPTION_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: action.error,
      };

    ///////////////ADD GET PAID ACCOUNT///////////////////////
    case Constant.ADD_GET_PAID_ACC_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.ADD_GET_PAID_ACC_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        getPaidAccData: action.payload,
        error: undefined,
      };
    case Constant.ADD_GET_PAID_ACC_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        type: action.type,
        isLoading: false,
        error: action.error,
      };

    ///////////////GET PAID ACCOUNT DETAILS///////////////////////
    case Constant.GET_PAID_ACC_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.GET_PAID_ACC_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        getPaidAccData: action.payload,
        error: undefined,
      };
    case Constant.GET_PAID_ACC_DETAILS_FAILURE:
      DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        type: action.type,
        isLoading: false,
        error: action.error,
      };

    ///////////////UPDATE GET PAID ACCOUNT DETAILS///////////////////////
    case Constant.UPDATE_GET_PAID_ACC_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.UPDATE_GET_PAID_ACC_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        getPaidAccData: action.payload,
        error: undefined,
      };
    case Constant.UPDATE_GET_PAID_ACC_DETAILS_FAILURE:
      // DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        type: action.type,
        error: action.error,
        isLoading: false,
      };

    ///////////////UPDATE BANK ACCOUNT DETAILS///////////////////////
    case Constant.UPDATE_BANK_ACC_DETAILS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.UPDATE_BANK_ACC_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.UPDATE_BANK_ACC_DETAILS_FAILURE:
      // DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        type: action.type,
        error: action.error,
        isLoading: false,
      };

    /////////////// CHANGE PAYOUT STATUS DETAILS///////////////////////
    case Constant.CHANGE_PAYOUT_STATUS_REQUEST:
      return {
        ...state,
        isLoading: true,
        type: action.type,
        error: action.error,
      };
    case Constant.CHANGE_PAYOUT_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        type: action.type,
        error: undefined,
      };
    case Constant.CHANGE_PAYOUT_STATUS_FAILURE:
      // DialogHelper.showAPIMessage(action.payload);
      return {
        ...state,
        type: action.type,
        error: action.error,
        isLoading: false,
      };

    default:
      return state;
  }
};
