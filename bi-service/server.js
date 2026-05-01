const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const TICKET_URL = process.env.TICKET_URL || "http://localhost:3001";

/* ===============================
   KPIs
================================ */
app.get("/bi/kpis", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    const tickets = r.data;

    const total = tickets.length;
    const abiertos = tickets.filter(t=>t.status==="abierto").length;
    const cerrados = tickets.filter(t=>t.status==="cerrado").length;

    res.json({ total, abiertos, cerrados });
  }catch(e){
    res.status(500).json({error:"kpis error"});
  }
});

/* ===============================
   MTTR
================================ */
app.get("/bi/mttr", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    const tickets = r.data.filter(t=>t.status==="cerrado");

    if(tickets.length === 0){
      return res.json({ mttr: 0 });
    }

    const totalTiempo = tickets.reduce((acc,t)=>{
      const inicio = new Date(t.createdAt);
      const fin = new Date(t.closedAt);
      return acc + (fin - inicio);
    },0);

    const mttr = totalTiempo / tickets.length / 1000 / 60; // minutos

    res.json({ mttr: mttr.toFixed(2) });
  }catch(e){
    res.status(500).json({error:"mttr error"});
  }
});

/* ===============================
   PRIORIDAD
================================ */
app.get("/bi/prioridad", async (req,res)=>{
  const r = await axios.get(`${TICKET_URL}/tickets`);
  const tickets = r.data;

  const result = {};

  tickets.forEach(t=>{
    const p = t.priority || "media";
    result[p] = (result[p] || 0) + 1;
  });

  const data = Object.keys(result).map(k=>({
    priority:k,
    total:result[k]
  }));

  res.json(data);
});

/* ===============================
   TECNICOS
================================ */
app.get("/bi/tecnicos", async (req,res)=>{
  const r = await axios.get(`${TICKET_URL}/tickets`);
  const tickets = r.data;

  const result = {};

  tickets.forEach(t=>{
    const tech = t.assignedTo || "sin_asignar";
    result[tech] = (result[tech] || 0) + 1;
  });

  const data = Object.keys(result).map(k=>({
    tecnico:k,
    total:result[k]
  }));

  res.json(data);
});

/* ===============================
   SLA
================================ */
app.get("/bi/sla", async (req,res)=>{
  const r = await axios.get(`${TICKET_URL}/tickets`);
  const tickets = r.data;

  let cumplidos = 0;

  tickets.forEach(t=>{
    if(t.status==="cerrado"){
      const inicio = new Date(t.createdAt);
      const fin = new Date(t.closedAt);
      const horas = (fin - inicio)/1000/60/60;

      if(horas <= 24){
        cumplidos++;
      }
    }
  });

  res.json({
    total: tickets.length,
    cumplidos
  });
});

/* =============================== */

const PORT = process.env.PORT || 3004;

app.listen(PORT,()=>{
  console.log("BI corriendo en puerto", PORT);
});