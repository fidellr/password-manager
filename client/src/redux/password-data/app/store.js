import { action } from "easy-peasy";
import { mobileCheck } from "../../../utils/helpers/browser";
const AppStore = {
  screen_height: 0,
  screen_width: 0,
  current_path: "/",
  is_mobile: false,
  addScreenHeight: action((state, payload) => {
    if (window && window.innerHeight) state.screen_height = window.innerHeight;

    state.screen_height = payload;
    return state.screen_height;
  }),
  addScreenWidth: action((state, payload) => {
    if (window && window.innerWidth) state.screen_width = window.innerWidth;
    state.screen_width = payload;
    return state.screen_width;
  }),
  addCurrentPath: action((state, payload) => {
    if (window && window.location.pathname)
      state.current_path = window.location.pathname;
    state.current_path = payload;
    return state.current_path;
  }),
  getCurrentBrowserDevice: action(state => {
    state.is_mobile = mobileCheck();
    return state.is_mobile;
  })
};

export default AppStore;
