import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("access")}`,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/token/refresh",
          {
            refresh: localStorage.getItem("refresh"),
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        localStorage.setItem("access", response.data.access);
        axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.access}`;
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error(
          "Error refreshing token:",
          err.response?.data || err.message
        );
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(new Error(error.response?.data || error.message));
  }
);

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request Error:", error.message);
    return Promise.reject(new Error(error.response?.data || error.message));
  }
);

export default axiosInstance;
