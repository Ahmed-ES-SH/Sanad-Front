import axios from "axios";

const baseURL = process.env.API_BASE_URL || "http://localhost:5000";

export const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
