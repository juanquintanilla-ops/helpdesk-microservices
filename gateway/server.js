const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

/* =====================================
   🔧 CONFIGURACIÓN BASE (IMPORTANTE)
===================================== */

// 👉 En local usa localhost
// 👉 En Render reemplaza por URLs reales de tus servicios
const TICKET_SERVICE = process.env.TICKET_URL || "http://localhost:3001";
const BI_SERVICE = process.env.BI_URL || "http://localhost:3004";

/* =====================================
   🔐 LOGIN (modo demo)
===================================== */
app.post("/login",(req,res)=>{
  const { email, password } = req.body;

  if(password !== "123456"){
    return res.status(401).json({error:"credenciales incorrectas"});
  }

  if(email === "admin@test.com") return res.json({ email, role:"admin" });
  if(email === "tec@test.com") return res.json({ email, role:"tecnico" });
  if(email === "bi@test.com") return res.json({ email, role:"bi" });
  if(email === "gerencia@test.com") return res.json({ email, role:"gerencia" });

  res.status(401).json({error:"usuario no existe"});
});

/* =====================================
   🎫 TICKETS
===================================== */

app.get("/tickets", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_SERVICE}/tickets`);
    res.json(r.data);
  }catch(e){
    res.status(500).json({error:"tickets error"});
  }
});

app.post("/tickets", async (req,res)=>{
  try{
    const r = await axios.post(`${TICKET_SERVICE}/tickets`,req.body);
    res.json(r.data);
  }catch(e){
    res.status(500).json({error:"create error"});
  }
});

app.put("/tickets/:id", async (req,res)=>{
  try{
    const r = await axios.put(`${TICKET_SERVICE}/tickets/${req.params.id}`,req.body);
    res.json(r.data);
  }catch(e){
    res.status(500).json({error:"update error"});
  }
});

app.put("/tickets/:id/close", async (req,res)=>{
  try{
    const r = await axios.put(`${TICKET_SERVICE}/tickets/${req.params.id}/close`);
    res.json(r.data);
  }catch(e){
    res.status(500).json({error:"close error"});
  }
});

app.put("/tickets/:id/open", async (req,res)=>{
  try{
    const r = await axios.put(`${TICKET_SERVICE}/tickets/${req.params.id}/open`);
    res.json(r.data);
  }catch(e){
    res.status(500).json({error:"open error"});
  }
});

/* =====================================
   📊 BI (LO QUE TE FALTABA)
===================================== */

// KPIs
app.get("/bi/kpis", async (req,res)=>{
  const r = await axios.get(`${BI_SERVICE}/bi/kpis`);
  res.json(r.data);
});

// MTTR
app.get("/bi/mttr", async (req,res)=>{
  const r = await axios.get(`${BI_SERVICE}/bi/mttr`);
  res.json(r.data);
});

// 🔥 PRIORIDAD
app.get("/bi/prioridad", async (req,res)=>{
  const r = await axios.get(`${BI_SERVICE}/bi/prioridad`);
  res.json(r.data);
});

// 🔥 TECNICOS
app.get("/bi/tecnicos", async (req,res)=>{
  const r = await axios.get(`${BI_SERVICE}/bi/tecnicos`);
  res.json(r.data);
});

// 🔥 SLA
app.get("/bi/sla", async (req,res)=>{
  const r = await axios.get(`${BI_SERVICE}/bi/sla`);
  res.json(r.data);
});

/* =====================================
   🌐 FRONTEND (RENDER)
===================================== */

app.use(express.static(path.join(__dirname,"../frontend/dist")));

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
});

/* =====================================
   🚀 SERVER
===================================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log("Servidor ONLINE en puerto", PORT);
});