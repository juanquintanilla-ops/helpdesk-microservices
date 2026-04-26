const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

/* ---------------- AUTH ---------------- */
app.post("/login", async (req,res)=>{
  try{
    const r = await axios.post("http://localhost:3002/login",req.body);
    res.json(r.data);
  }catch(e){
    res.status(500).json({error:"auth error"});
  }
});

/* ---------------- TICKETS ---------------- */
app.get("/tickets", async (req,res)=>{
  try{
    const r = await axios.get("http://localhost:3001/tickets");
    res.json(r.data);
  }catch(e){
    res.status(500).json({error:"tickets error"});
  }
});

app.post("/tickets", async (req,res)=>{
  try{
    const r = await axios.post("http://localhost:3001/tickets",req.body);
    res.json(r.data);
  }catch(e){
    res.status(500).json({error:"create error"});
  }
});

app.put("/tickets/:id/close", async (req,res)=>{
  try{
    const r = await axios.put(`http://localhost:3001/tickets/${req.params.id}/close`);
    res.json(r.data);
  }catch(e){
    res.status(500).json({error:"close error"});
  }
});

/* ---------------- BI ---------------- */
app.get("/bi/tecnico/:name", async (req,res)=>{
  const r = await axios.get(`http://localhost:3004/bi/tecnico/${req.params.name}`);
  res.json(r.data);
});

app.get("/bi/coordinador", async (req,res)=>{
  const r = await axios.get("http://localhost:3004/bi/coordinador");
  res.json(r.data);
});

app.get("/bi/kpis", async (req,res)=>{
  const r = await axios.get("http://localhost:3004/bi/kpis");
  res.json(r.data);
});

app.get("/bi/mttr", async (req,res)=>{
  const r = await axios.get("http://localhost:3004/bi/mttr");
  res.json(r.data);
});

app.get("/bi/gerencia", async (req,res)=>{
  const r = await axios.get("http://localhost:3004/bi/gerencia");
  res.json(r.data);
});

/* ---------------- FRONTEND (SIN ERRORES) ---------------- */

// servir archivos estáticos
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// fallback universal (NO usa "*" → evita tu error)
app.use((req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
});

/* ---------------- SERVER ---------------- */
app.listen(3000,()=>{
  console.log("Gateway corriendo en http://localhost:3000");
});