import axios from "axios";
import Swal from "sweetalert2";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 403) {
        await Swal.fire({
          title: "Sesión expirada",
          text: "Por seguridad debes iniciar sesión nuevamente.",
          icon: "warning",
          background: "#0A0F1C",
          color: "white",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Ir al login",
        });

        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
