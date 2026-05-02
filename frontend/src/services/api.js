import axios from "axios";

export const TICKET_API = axios.create({
  baseURL: "http://localhost:3001"
});

export const BI_API = axios.create({
  baseURL: "http://localhost:3002"
});