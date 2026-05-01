import axios from "axios";

const API = axios.create({
  baseURL: window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : ""
});

export default API;