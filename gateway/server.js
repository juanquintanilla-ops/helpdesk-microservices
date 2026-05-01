const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

/* ================= URLS DINÁMICAS ================= */
const TICKET_URL = process.env.TICKET_URL || "http://localhost:3001";
const BI_URL = process.env.BI_URL || "http://localhost:3004";

/* ================= AUTH ================= */
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

/* ================= TICKETS ================= */

/* GET */
app.get("/tickets", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    res.json(r.data);
  }catch(e){
    console.log(e.message);
    res.status(500).json({error:"tickets error"});
  }
});

/* CREATE */
app.post("/tickets", async (req,res)=>{
  try{
    const r = await axios.post(`${TICKET_URL}/tickets`, req.body);
    res.json(r.data);
  }catch(e){
    console.log(e.message);
    res.status(500).json({error:"create error"});
  }
});

/* 🔴 CAMBIAR ESTADO (CLAVE) */
app.put("/tickets/:id/status", async (req,res)=>{
  try{
    const r = await axios.put(
      `${TICKET_URL}/tickets/${req.params.id}/status`,
      req.body
    );
    res.json(r.data);
  }catch(e){
    console.log(e.message);
    res.status(500).json({error:"status error"});
  }
});

/* ================= BI ================= */

app.get("/bi/tecnico/:name", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/tecnico/${req.params.name}`);
  res.json(r.data);
});

app.get("/bi/coordinador", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/coordinador`);
  res.json(r.data);
});

app.get("/bi/kpis", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/kpis`);
  res.json(r.data);
});

app.get("/bi/mttr", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/mttr`);
  res.json(r.data);
});

app.get("/bi/gerencia", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/gerencia`);
  res.json(r.data);
});

/* ================= FRONTEND ================= */

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log(`Gateway corriendo en puerto ${PORT}`);
});