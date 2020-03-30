import { action, thunk } from "easy-peasy";
import {
  fetchAllPasswordData,
  getByPasswordAndEmail,
  signInPasswordAndEmail,
  registerPasswordData,
  logoutUser
} from "../../../utils/api/password-data";

const User = {
  profiles: null,
  loading: {
    is_loading: false,
    setLoading: action((state, payload) => {
      if (state.is_loading === payload) {
        state.is_loading = payload;
        return state.is_loading;
      }
      state.is_loading = payload;
      return state.is_loading;
    })
  },
  token: null,
  data: {
    _id: "",
    email: "",
    password: "",
    account_name: ""
  },
  signIn: action(async (state, payload) => {
    state.data = payload;
    return state.data;
  }),
  logout: action(async (state, payload) => {
    state.token = null;
    state.data = payload;
    return state.data;
  }),
  addToken: action(async (state, payload) => {
    state.token = payload;
    return state.token;
  }),
  addProfile: action((state, payload) => {
    state.data = payload;
    return state.data;
  }),
  fetchProfiles: action(state => {
    return state.profiles;
  }),
  getByPasswordAndEmail: action((state, payload) => {
    state.data = payload;
    return state.data;
  }),
  signInApi: thunk(async (actions, payload) => {
    actions.loading.setLoading(true);
    const data = await signInPasswordAndEmail(payload);
    if (data) {
      await actions.signIn(data);
    }

    actions.loading.setLoading(false);
  }),
  logoutApi: thunk(async (actions, token) => {
    await logoutUser(token);
    await actions.logout({
      _id: "",
      email: "",
      password: "",
      account_name: ""
    });
  }),
  addProfileApi: thunk(async (actions, payload) => {
    await actions.loading.setLoading(true);
    const res = await registerPasswordData(payload);
    await actions.addProfile(res)
    await actions.loading.setLoading(false);
  }),
  fetchProfilesApi: thunk(async (actions, payload) => {
    const res = await actions.fetchProfiles(payload);
    return res;
  }),
  getByPasswordAndEmailApi: thunk(async (actions, payload) => {
    await actions.loading.setLoading(true);
    const user = await User.fetch("get_by_password_email", payload);
    actions.getByPasswordAndEmail(user);
    await actions.loading.setLoading(false);
    return payload;
  }),
  fetch: async (query, payload) => {
    if (query) {
      switch (query) {
        case "get_all":
          return await fetchAllPasswordData();
        case "get_by_password_email":
          return await getByPasswordAndEmail(payload.password, payload.email);
        default:
          return;
      }
    }
  }
};

export default User;
