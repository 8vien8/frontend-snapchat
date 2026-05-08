import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:8080/api"
      : "/api",

  withCredentials: true, // ensure cookie was send to server
});

export default api;
