const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
app.use(express.json());

const TICKET_URL = process.env.TICKET_URL;
const BI_URL = process.env.BI_URL;

/* ================= LOGIN ================= */
app.post("/api/login",(req,res)=>{
  const { email, password } = req.body;

  if(password === "123456"){
    return res.json({ email, role:"admin" });
  }

  return res.status(401).json({error:"bad"});
});

/* ================= TICKETS ================= */
app.get("/api/tickets", async (req,res)=>{
  const r = await axios.get(`${TICKET_URL}/tickets`);
  res.json(r.data);
});

app.post("/api/tickets", async (req,res)=>{
  const r = await axios.post(`${TICKET_URL}/tickets`, req.body);
  res.json(r.data);
});

app.put("/api/tickets/:id/status", async (req,res)=>{
  const r = await axios.put(
    `${TICKET_URL}/tickets/${req.params.id}/status`,
    req.body
  );
  res.json(r.data);
});

/* ================= BI ================= */
app.get("/api/bi/etl", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/etl`);
  res.json(r.data);
});

app.get("/api/bi/kpis", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/kpis`);
  res.json(r.data);
});

app.get("/api/bi/prediccion", async (req,res)=>{
  const r = await axios.get(`${BI_URL}/bi/prediccion`);
  res.json(r.data);
});

/* ================= FRONTEND ================= */
const distPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(distPath));

app.get("*",(req,res)=>{
  res.sendFile(path.join(distPath,"index.html"));
});

/* ================= START ================= */
app.listen(process.env.PORT || 10000, ()=>{
  console.log("Gateway corriendo");
});