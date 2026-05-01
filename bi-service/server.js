const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

/* KPIs */
app.get("/bi/kpis", async (req,res)=>{
  const r = await axios.get("http://localhost:3001/tickets");
  const tickets = r.data;

  const total = tickets.length;
  const abiertos = tickets.filter(t=>t.status==="abierto").length;
  const cerrados = tickets.filter(t=>t.status==="cerrado").length;

  res.json({ total, abiertos, cerrados });
});

/* MTTR */
app.get("/bi/mttr", async (req,res)=>{
  const r = await axios.get("http://localhost:3001/tickets");
  const tickets = r.data.filter(t=>t.status==="cerrado");

  if(tickets.length === 0){
    return res.json({ mttr:0 });
  }

  const total = tickets.reduce((acc,t)=>{
    return acc + ((new Date() - new Date(t.createdAt))/3600000);
  },0);

  res.json({ mttr: (total / tickets.length).toFixed(2) });
});

/* PRIORIDAD */
app.get("/bi/prioridad", async (req,res)=>{
  const r = await axios.get("http://localhost:3001/tickets");
  const tickets = r.data;

  const result = {};

  tickets.forEach(t=>{
    result[t.priority] = (result[t.priority] || 0) + 1;
  });

  res.json(Object.keys(result).map(k=>({ priority:k, total:result[k] })));
});

/* TECNICOS */
app.get("/bi/tecnicos", async (req,res)=>{
  const r = await axios.get("http://localhost:3001/tickets");
  const tickets = r.data;

  const result = {};

  tickets.forEach(t=>{
    result[t.tecnico] = (result[t.tecnico] || 0) + 1;
  });

  res.json(Object.keys(result).map(k=>({ tecnico:k, total:result[k] })));
});

/* SLA */
app.get("/bi/sla", async (req,res)=>{
  const r = await axios.get("http://localhost:3001/tickets");
  const tickets = r.data;

  let ok=0, riesgo=0, vencido=0;

  tickets.forEach(t=>{
    const diff = (new Date() - new Date(t.createdAt))/3600000;

    if(diff > 24) vencido++;
    else if(diff > 12) riesgo++;
    else ok++;
  });

  res.json([
    { estado:"OK", total:ok },
    { estado:"Riesgo", total:riesgo },
    { estado:"Vencido", total:vencido }
  ]);
});

app.listen(3004,()=>console.log("BI service 3004"));