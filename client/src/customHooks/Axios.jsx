import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import { useContext } from "react";

const useAxios = () => {
  const { token } = useContext(AuthContext);

  const instance = axios.create({
    baseURL: `${window.location.origin}/api/`,
  });
  

  instance.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

export default useAxios;
