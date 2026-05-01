const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json());

const TICKET_URL = process.env.TICKET_URL;

/* ================= LOGIN ================= */
app.post("/login",(req,res)=>{
  const { email, password } = req.body;

  if(password !== "123456"){
    return res.status(401).json({error:"bad"});
  }

  res.json({email,role:"admin"});
});

/* ================= API ================= */
app.get("/tickets", async (req,res)=>{
  const r = await axios.get(`${TICKET_URL}/tickets`);
  res.json(r.data);
});

app.post("/tickets", async (req,res)=>{
  const r = await axios.post(`${TICKET_URL}/tickets`, req.body);
  res.json(r.data);
});

app.put("/tickets/:id/status", async (req,res)=>{
  const r = await axios.put(
    `${TICKET_URL}/tickets/${req.params.id}/status`,
    req.body
  );
  res.json(r.data);
});

/* ================= FRONTEND ================= */
const distPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(distPath));

/* ⚠️ CLAVE: SOLO rutas que NO sean API */
app.get(/^\/(?!api|tickets|login).*/, (req,res)=>{
  res.sendFile(path.join(distPath, "index.html"));
});

/* ================= START ================= */
app.listen(process.env.PORT || 10000, ()=>{
  console.log("Gateway OK");
});