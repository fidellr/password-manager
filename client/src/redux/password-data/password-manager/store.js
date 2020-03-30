import { action, thunk } from "easy-peasy";
import { notification } from "antd";
import {
  addPasswordData,
  updatePasswordData,
  deletePasswordData
} from "../../../utils/api/password-manager";
import { fetchAllPasswordData } from "../../../utils/api/password-manager";

const PasswordManager = {
  passwords: null,
  loading: {
    is_loading: false,
    setLoading: action((state, payload) => {
      if (state.is_loading === payload) {
        return state.is_loading;
      }
      state.is_loading = payload;
      return state.is_loading;
    })
  },
  data: {
    _id: "",
    username: "",
    password: "",
    account_name: ""
  },
  resetPasswordData: action(state => {
    state.passwords = null;
  }),
  addPasswordData: action(async (state, payload) => {
    state.data = payload;
    return state.data;
  }),
  addPasswordDataApi: thunk(async (actions, payload) => {
    let data = null;
    try {
      await actions.loading.setLoading(true);
      data = await addPasswordData(payload);
    } catch (err) {
      console.log(err);
    }
    if (!data) {
      notification.error({
        message: "Duplicate data",
        description: `Requested data with username ${payload.username} is exists.`,
        duration: 2
      });
    } else {
      await actions.addPasswordData(data);
    }
    await actions.loading.setLoading(false);
  }),
  getAllPasswordData: action(async (state, payload) => {
    state.passwords = payload;
    return state.passwords;
  }),
  getAllPasswordDataApi: thunk(async (actions, payload) => {
    if (!payload || !payload.token) {
      actions.getAllPasswordData(null);
      return;
    }
    try {
      await actions.loading.setLoading(true);
      const data = await fetchAllPasswordData(payload);
      await actions.getAllPasswordData(data);
    } catch (err) {
      console.log(err);
    }
    await actions.loading.setLoading(false);
  }),
  getSelectedPasswordData: action(async (state, payload) => {
    state.data = payload;
    return state.data;
  }),
  getSelectedPasswordDataApi: thunk(async (actions, payload) => {
    try {
      await actions.loading.setLoading(true);
      const data = await fetchAllPasswordData({
        username: payload.username,
        password: payload.password,
        token: payload.token
      });
      await actions.getSelectedPasswordData(data);
    } catch (err) {
      console.log(err);
    }
    await actions.loading.setLoading(false);
  }),
  updatePasswordData: action(async (state, payload) => {
    state.passwords = state.passwords.filter(item => {
      if (item._id === payload._id) {
        item = payload;
      }

      return item;
    });

    return state.passwords;
  }),
  updatePasswordDataApi: thunk(async (actions, payload) => {
    try {
      await actions.loading.setLoading(true);
      const data = await updatePasswordData(payload);
      await actions.updatePasswordData(data);
    } catch (err) {
      console.log(err);
    }
    await actions.loading.setLoading(false);
  }),
  deletePasswordDataApi: thunk(async (actions, payload) => {
    try {
      await actions.loading.setLoading(true);
      await deletePasswordData({ id: payload._id, token: payload.token });
    } catch (err) {
      console.log(err);
    }
    await actions.loading.setLoading(false);
  })
};

export default PasswordManager;
