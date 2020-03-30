import axios from "axios";
import qs from "querystring";
import { set, remove } from "js-cookie";
import {
  ALL_USER_DATA_URL,
  SIGN_IN_USER_DATA_URL,
  SIGN_UP_USER_DATA_URL,
  SIGN_OUT_USER_DATA_URL
} from "..";

const instance = axios.create({
  headers: {
    post: {
      "Content-Type": "application/json"
    },
    get: {
      "Content-Type": "application/json"
    }
  }
});

export const fetchAllPasswordData = async () => {
  const { data } = await instance.get(ALL_USER_DATA_URL);
  return data;
};

export const getByPasswordAndEmail = async (password, email) => {
  const queryString = qs.stringify({ password, email });
  const { data } = await instance.get(`${ALL_USER_DATA_URL}?${queryString}`);
  return data;
};

export const signInPasswordAndEmail = async payload => {
  const { data, headers } = await instance.post(
    SIGN_IN_USER_DATA_URL,
    payload,
    { withCredentials: false }
  );
  const token = await headers["authorization"].replace("Bearer", "").trim();
  set("xen-user", { token, data });
  return data;
};

export const registerPasswordData = async payload => {
  try {
    const { data, headers } = await instance.post(
      SIGN_UP_USER_DATA_URL,
      payload,
      {
        withCredentials: false
      }
    );
    const token = await headers["authorization"].replace("Bearer", "").trim();
    set("xen-user", { token, data });
    return data;
  } catch (err) {
    console.log(err);
    return;
  }
};

export const logoutUser = async token => {
  try {
    await instance.post(SIGN_OUT_USER_DATA_URL, null, {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    remove("xen-user");
  } catch (err) {}
};
