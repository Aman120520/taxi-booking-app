import store from "../Store/Store";
import axios from "axios";
import Utils from "../Helpers/Utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constant from "./Constant";

store.subscribe(listener);

function listener() {}

const BASE_URl = Constant.BASE_URl + "app/";

const fetchClient = () => {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const instance = axios.create(defaultOptions);
  instance.defaults.timeout = 45000;
  instance.interceptors.request.use(async (config) => {
    config.url = BASE_URl + config.url;

    var token = await AsyncStorage.getItem("@authorization_token");
    if (!Utils.isStringNull(token)) {
      config.headers["Authorization-Token"] = token;
    }
    return config;
  });
  return instance;
};
export default fetchClient();
