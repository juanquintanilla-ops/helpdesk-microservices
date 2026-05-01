const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

/* ===== URLs de microservicios ===== */
const TICKET_URL = process.env.TICKET_URL || "http://localhost:3001";
const BI_URL = process.env.BI_URL || "http://localhost:3004";

/* ================= AUTH ================= */
app.post("/login",(req,res)=>{
  const { email, password } = req.body;

  if(password !== "123456"){
    return res.status(401).json({error:"credenciales incorrectas"});
  }

  return res.json({ email, role:"admin" });
});

/* ================= TICKETS ================= */
app.get("/tickets", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    res.json(r.data);
  }catch(e){
    console.log(e.message);
    res.status(500).json({error:"tickets error"});
  }
});

app.post("/tickets", async (req,res)=>{
  try{
    const r = await axios.post(`${TICKET_URL}/tickets`, req.body);
    res.json(r.data);
  }catch(e){
    console.log(e.message);
    res.status(500).json({error:"create error"});
  }
});

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

/* ================= BI (opcional) ================= */
app.get("/bi/kpis", async (req,res)=>{
  try{
    const r = await axios.get(`${BI_URL}/bi/kpis`);
    res.json(r.data);
  }catch(e){
    res.status(500).json({error:"bi error"});
  }
});

/* ================= FRONTEND ================= */
/* Sirve el build de Vite */
const distPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(distPath));

/* SPA fallback: cualquier ruta -> index.html */
app.get("*", (req,res)=>{
  res.sendFile(path.join(distPath, "index.html"));
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 10000;

app.listen(PORT,()=>{
  console.log("Gateway corriendo en puerto", PORT);
});