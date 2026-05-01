import axios from "axios";

/*
✔ En producción (Render):
  usa misma URL del navegador → "" (vacío)

✔ En local:
  usa localhost
*/

const API = axios.create({
  baseURL: window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : ""
});

export default API;