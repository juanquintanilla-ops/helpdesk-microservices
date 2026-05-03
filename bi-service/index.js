const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const TICKET_API = "https://ticket-service-bo5t.onrender.com";

app.get("/bi/prediccion", async (req,res)=>{

  try{
    const response = await axios.get(TICKET_API + "/tickets");
    const tickets = response.data;

    if(!tickets || tickets.length === 0){
      return res.json({
        total: 0,
        prediccion: "No hay datos suficientes",
        tendencia: "Sin tendencia",
        distribucion: []
      });
    }

    // ===== ETL =====
    const conteo = {};

    tickets.forEach(t=>{
      const tipo = (t.titulo || "sin tipo").toLowerCase();
      conteo[tipo] = (conteo[tipo] || 0) + 1;
    });

    const distribucion = Object.keys(conteo).map(k=>({
      tipo:k,
      total:conteo[k]
    }));

    const top = Object.keys(conteo)
      .sort((a,b)=>conteo[b]-conteo[a])[0];

    const tendencia = tickets.length > 5
      ? "Alta demanda de soporte"
      : "Demanda estable";

    res.json({
      total: tickets.length,
      prediccion: `Posible próxima incidencia: ${top}`,
      tendencia,
      distribucion
    });

  }catch(err){
    console.error(err);
    res.status(500).json({
      total: 0,
      prediccion: "Error en BI",
      tendencia: "Error",
      distribucion: []
    });
  }

});

const PORT = process.env.PORT || 3002;
app.listen(PORT, ()=>console.log("BI listo en puerto " + PORT));