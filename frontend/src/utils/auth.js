// utils/auth.js
import jwtDecode from "./jwtDecodeWrapper";

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};

export const getUserFromToken = () => {
  const token = getToken();
  if (token) {
    return jwtDecode(token);
  }
  return null;
};
