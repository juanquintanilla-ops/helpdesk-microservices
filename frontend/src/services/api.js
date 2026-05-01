import axios from "axios";

const API = axios.create({
  baseURL: "https://helpdesk-app-b2ae.onrender.com"
});

export default API;