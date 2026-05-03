const express = require("express");
const axios = require("axios");
const app = express();

const TICKET_API = "https://ticket-service-bo5t.onrender.com";

app.get("/bi/prediccion", async (req,res)=>{

  const response = await axios.get(TICKET_API + "/tickets");
  const tickets = response.data;

  // ===== ETL =====

  // Extract
  const data = tickets;

  // Transform
  const conteo = {};
  data.forEach(t=>{
    const tipo = t.titulo.toLowerCase();
    conteo[tipo] = (conteo[tipo] || 0) + 1;
  });

  // Load (predicción simple)
  let prediccion = Object.keys(conteo)
    .sort((a,b)=>conteo[b]-conteo[a])[0];

  const distribucion = Object.keys(conteo).map(k=>({
    tipo:k,
    total:conteo[k]
  }));

  res.json({
    prediccion,
    distribucion
  });

});

app.listen(3002, ()=>console.log("BI listo"));