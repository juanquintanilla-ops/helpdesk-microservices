const express = require("express");
const axios = require("axios");

const app = express();

const TICKET_URL = process.env.TICKET_URL || "https://ticket-service-bo5t.onrender.com";

/* ================= PREDICCIÓN + HISTÓRICO ================= */
app.get("/bi/prediccion", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    const data = r.data;

    // 🔥 generar histórico SIEMPRE (aunque no haya fechas)
    const historico = data.map((t,i)=>({
      fecha: `Día ${i+1}`,
      total: i + 1
    }));

    // tendencia simple
    const total = data.length;

    let tendencia = "ESTABLE";
    if(total > 5) tendencia = "CRECIMIENTO";
    if(total < 3) tendencia = "BAJA DEMANDA";

    // predicción siguiente periodo
    const prediccion = total + 2;

    res.json({
      historico,
      prediccionProximoPeriodo: prediccion,
      tendencia,
      recomendacion:
        tendencia === "CRECIMIENTO"
          ? "Asignar más técnicos"
          : tendencia === "BAJA DEMANDA"
          ? "Optimizar recursos"
          : "Mantener operación"
    });

  }catch(e){
    res.status(500).json({error:"BI error"});
  }
});

app.listen(3004, ()=>{
  console.log("BI REAL listo");
});