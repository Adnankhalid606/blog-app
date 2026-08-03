import api from "./api";

let accessToken = null;

export const setToken = (token) => {
  return accessToken = token;
};

export const getToken = () => {
  return accessToken;
};

api.interceptors.request.use((config)=>{
    const token = getToken();
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})