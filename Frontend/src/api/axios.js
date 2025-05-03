import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter dynamiquement le bon token à chaque requête
api.interceptors.request.use(
  (config) => {
    // On essaye d'abord avec jwtTokenadmin, sinon jwtTokensurv
    const adminToken = localStorage.getItem("jwtTokenadmin");
    const survToken = localStorage.getItem("jwtTokensurv");

    const token = adminToken || survToken;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
