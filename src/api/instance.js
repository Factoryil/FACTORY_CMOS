import axios from "axios";
import { obtenerToken } from "../utils/authUtils";

const instance = axios.create({
  baseURL: "http://localhost/api_cmos",
});

// Interceptor para agregar el token si está disponible
instance.interceptors.request.use(
  (config) => {
    const token = obtenerToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejo global de errores
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Error en la API:", error);
    return Promise.reject(error);
  }
);

export default instance;
