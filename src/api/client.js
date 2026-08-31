import axios from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "http://nematdoust.osdl.ir/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;