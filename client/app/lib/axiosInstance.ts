import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// ✅ Interceptor reads token fresh on EVERY request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("Attaching token to request:", token); // Debug log

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error) 
);

// ✅ Interceptor handles 401 (token expired/invalid)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
        console.log("Error message:", error.response?.data?.message);
      console.warn("token",localStorage.getItem("token"));
      // localStorage.removeItem("token");
      // window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default instance;