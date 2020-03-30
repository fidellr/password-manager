import axios from "axios";
import qs from "querystring";
import { get, set } from "js-cookie";
import {
  ALL_PASSWORD_DATA_URL,
  ADD_PASSWORD_DATA_URL,
  SINGLE_PASSWORD_DATA_URL
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

export const fetchAllPasswordData = async payload => {
  let username = null;
  let password = null;

  if (payload && payload.username) username = payload.username;
  if (payload && payload.password) password = payload.password;

  const queryString = qs.stringify({ username, password });
  const { data, headers } = await instance.get(
    `${ALL_PASSWORD_DATA_URL}?${queryString}`,
    {
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
  );
  const token = await headers["authorization"].replace("Bearer", "");
  const existingTokenData = JSON.parse(get("xen-user"));

  set("xen-user", { ...existingTokenData, token });
  return data;
};

export const addPasswordData = async payload => {
  const payloadToDispatch = {
    account_name: payload.account_name,
    username: payload.username,
    password: payload.password
  };

  const { data, headers } = await instance.post(
    `${ADD_PASSWORD_DATA_URL}`,
    payloadToDispatch,
    {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
  );
  const existingTokenData = JSON.parse(get("xen-user"));
  const token = await headers["authorization"].replace("Bearer", "");

  set("xen-user", { ...existingTokenData, token });
  return data;
};

export const updatePasswordData = async payload => {
  const payloadToDispatch = {
    account_name: payload.account_name,
    username: payload.username,
    password: payload.password
  };

  const { data, headers } = await instance.put(
    `${SINGLE_PASSWORD_DATA_URL}/${payload._id}`,
    payloadToDispatch,
    {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${payload.token}`
      }
    }
  );

  const existingTokenData = JSON.parse(get("xen-user"));
  const token = await headers["authorization"].replace("Bearer", "");
  set("xen-user", { ...existingTokenData, token });
  return data;
};

export const deletePasswordData = async ({ id, token: tokenPayload}) => {
  const { headers } = await instance.delete(
    `${SINGLE_PASSWORD_DATA_URL}/${id}`,
    {
      withCredentials: false,
      headers: {
        Authorization: `Bearer ${tokenPayload}`
      }
    }
  );

  const existingTokenData = JSON.parse(get("xen-user"));
  const token = await headers["authorization"].replace("Bearer", "");
  set("xen-user", { ...existingTokenData, token });
};
