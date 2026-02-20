import axios from "axios";

const api = axios.create({
    baseURL: "https://shop-backend-yvk4.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Global 401 Handler
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear storage
            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");

            // Only redirect if not already on the login page
            if (window.location.pathname !== "/") {
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
