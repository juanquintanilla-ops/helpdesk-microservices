const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

/* ===============================
   VARIABLES (PRODUCCIÓN)
================================ */
const TICKET_URL = process.env.TICKET_URL;
const BI_URL = process.env.BI_URL;

/* ===============================
   LOGIN DEMO
================================ */
app.post("/login",(req,res)=>{
  const { email, password } = req.body;

  if(password !== "123456"){
    return res.status(401).json({error:"credenciales incorrectas"});
  }

  if(email === "admin@test.com"){
    return res.json({ email, role:"admin" });
  }

  if(email === "tec@test.com"){
    return res.json({ email, role:"tecnico" });
  }

  if(email === "bi@test.com"){
    return res.json({ email, role:"bi" });
  }

  if(email === "gerencia@test.com"){
    return res.json({ email, role:"gerencia" });
  }

  res.status(401).json({error:"usuario no existe"});
});

/* ===============================
   TICKETS (PROXY)
================================ */
app.get("/tickets", async (req,res)=>{
  const r = await axios.get(`${TICKET_URL}/tickets`);
  res.json(r.data);
});

app.post("/tickets", async (req,res)=>{
  const r = await axios.post(`${TICKET_URL}/tickets`,req.body);
  res.json(r.data);
});

app.put("/tickets/:id/close", async (req,res)=>{
  const r = await axios.put(`${TICKET_URL}/tickets/${req.params.id}/close`);
  res.json(r.data);
});

/* ===============================
   BI (PROXY)
================================ */
app.get("/bi/kpis", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/kpis`);
  res.json(r.data);
});

app.get("/bi/mttr", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/mttr`);
  res.json(r.data);
});

app.get("/bi/prioridad", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/prioridad`);
  res.json(r.data);
});

app.get("/bi/tecnicos", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/tecnicos`);
  res.json(r.data);
});

app.get("/bi/sla", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/sla`);
  res.json(r.data);
});

/* ===============================
   FRONTEND
================================ */
app.use(express.static(path.join(__dirname,"../frontend/dist")));

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
});

/* =============================== */

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log("Gateway corriendo en puerto", PORT);
});