const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const TICKET_URL = process.env.TICKET_URL || "http://localhost:3001";

/* ================= AUTH ================= */
app.post("/login",(req,res)=>{
  const { email, password } = req.body;

  if(password !== "123456"){
    return res.status(401).json({error:"credenciales incorrectas"});
  }

  return res.json({ email, role:"admin" });
});

/* ================= TICKETS ================= */

/* GET */
app.get("/tickets", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    res.json(r.data);
  }catch(e){
    console.log("GET ERROR:", e.message);
    res.status(500).json({error:"tickets error"});
  }
});

/* CREATE 🔴 */
app.post("/tickets", async (req,res)=>{
  try{
    const r = await axios.post(`${TICKET_URL}/tickets`, req.body);
    res.json(r.data);
  }catch(e){
    console.log("POST ERROR:", e.message);
    res.status(500).json({error:"create error"});
  }
});

/* STATUS */
app.put("/tickets/:id/status", async (req,res)=>{
  try{
    const r = await axios.put(
      `${TICKET_URL}/tickets/${req.params.id}/status`,
      req.body
    );
    res.json(r.data);
  }catch(e){
    console.log("STATUS ERROR:", e.message);
    res.status(500).json({error:"status error"});
  }
});

/* ================= FRONTEND ================= */
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log("Gateway OK en puerto", PORT);
});