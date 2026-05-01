const express = require("express");
const axios = require("axios");

const app = express();

const TICKET_URL = process.env.TICKET_URL;

/* ================= ETL ================= */
app.get("/bi/etl", async (req,res)=>{
  const r = await axios.get(`${TICKET_URL}/tickets`);
  const data = r.data;

  const transform = data.map(t=>({
    id: t.id,
    categoria: t.title.toLowerCase().includes("red")
      ? "Red"
      : t.title.toLowerCase().includes("correo")
      ? "Correo"
      : "General",
    prioridad: t.priority,
    estado: t.status,
    tecnico: t.technician || "Sin asignar"
  }));

  res.json({ data: transform });
});

/* ================= KPIs ================= */
app.get("/bi/kpis", async (req,res)=>{
  const r = await axios.get(`${TICKET_URL}/tickets`);
  const data = r.data;

  const total = data.length;
  const cerrados = data.filter(t=>t.status==="cerrado").length;

  res.json({
    total,
    abiertos: total - cerrados,
    cerrados
  });
});

/* ================= PREDICCIÓN REAL ================= */
app.get("/bi/prediccion", async (req,res)=>{
  const r = await axios.get(`${TICKET_URL}/tickets`);
  const data = r.data;

  const conteo = { Red:0, Correo:0, General:0 };

  data.forEach(t=>{
    const title = (t.title || "").toLowerCase();

    if(title.includes("red")) conteo.Red++;
    else if(title.includes("correo")) conteo.Correo++;
    else conteo.General++;
  });

  let max = "General";
  if(conteo.Red > conteo[max]) max = "Red";
  if(conteo.Correo > conteo[max]) max = "Correo";

  res.json({
    conteo,
    prediccion: `Mayor incidencia en: ${max}`,
    recomendacion:
      max === "Red"
        ? "Revisar infraestructura de red"
        : max === "Correo"
        ? "Validar servidor de correo"
        : "Monitoreo general"
  });
});

/* ================= START ================= */
app.listen(3004, ()=>{
  console.log("BI actualizado funcionando");
});