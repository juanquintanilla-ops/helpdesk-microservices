const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const TICKET_URL = process.env.TICKET_URL || "http://localhost:3001";

/* ================= ETL ================= */
app.get("/bi/etl", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    const data = r.data;

    const transform = data.map(t=>({
      id: t.id,
      titulo: t.title,
      prioridad: t.priority,
      estado: t.status,
      tecnico: t.technician || "Sin asignar",
      esCerrado: t.status === "cerrado" ? 1 : 0
    }));

    res.json({
      proceso: "ETL ejecutado",
      total: transform.length,
      data: transform
    });

  }catch(e){
    res.status(500).json({error:"etl error"});
  }
});

/* ================= KPIs ================= */
app.get("/bi/kpis", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    const data = r.data;

    const total = data.length;
    const cerrados = data.filter(t=>t.status==="cerrado").length;
    const abiertos = total - cerrados;

    const tasaResolucion = total ? (cerrados/total)*100 : 0;

    res.json({
      total,
      abiertos,
      cerrados,
      tasaResolucion: tasaResolucion.toFixed(2)
    });

  }catch(e){
    res.status(500).json({error:"kpi error"});
  }
});

/* ================= PREDICCIÓN ================= */
app.get("/bi/prediccion", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    const data = r.data;

    const abiertos = data.filter(t=>t.status==="abierto").length;
    const cerrados = data.filter(t=>t.status==="cerrado").length;

    const tendencia = abiertos > cerrados ? "ALTA DEMANDA" : "ESTABLE";

    res.json({
      abiertos,
      cerrados,
      prediccion: tendencia,
      recomendacion:
        abiertos > cerrados
          ? "Se recomienda asignar más técnicos"
          : "Capacidad operativa adecuada"
    });

  }catch(e){
    res.status(500).json({error:"pred error"});
  }
});

/* ================= START ================= */
app.listen(3004, ()=>{
  console.log("BI service corriendo en 3004");
});