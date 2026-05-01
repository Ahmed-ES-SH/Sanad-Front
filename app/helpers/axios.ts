import axios from "axios";

const baseURL = process.env.API_BASE_URL || "https://sanad-backend.vercel.app";

export const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
