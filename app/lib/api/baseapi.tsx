import axios from "axios";

const baseApi = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

baseApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const isAuthRequest =
        config.url === "/api/auth/login" ||
        config.url === "/api/auth/register";

      if (!isAuthRequest) {
        const token = localStorage.getItem("token");

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default baseApi;