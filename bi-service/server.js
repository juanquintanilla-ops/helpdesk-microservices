const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());

const db = new sqlite3.Database("../ticket-service/db.sqlite");

app.get("/bi/tecnico/:name",(req,res)=>{
 db.all(`SELECT status, COUNT(*) total FROM tickets WHERE assigned_to=? GROUP BY status`,
 [req.params.name],(e,r)=>res.json(r));
});

app.get("/bi/coordinador",(req,res)=>{
 db.all(`SELECT priority, COUNT(*) total FROM tickets GROUP BY priority`,
 [],(e,r)=>res.json(r));
});

app.get("/bi/kpis",(req,res)=>{
 db.all(`SELECT COUNT(*) total,
 SUM(CASE WHEN status='Abierto' THEN 1 ELSE 0 END) abiertos,
 SUM(CASE WHEN status='Cerrado' THEN 1 ELSE 0 END) cerrados
 FROM tickets`,[],(e,r)=>res.json(r[0]));
});

app.get("/bi/mttr",(req,res)=>{
 db.all(`SELECT AVG((julianday(closed_at)-julianday(created_at))*24*60) as mttr FROM tickets WHERE closed_at IS NOT NULL`,
 [],(e,r)=>res.json(r[0]));
});

app.get("/bi/gerencia",(req,res)=>{
 db.all(`SELECT DATE(created_at) fecha, COUNT(*) total FROM tickets GROUP BY DATE(created_at)`,
 [],(e,r)=>res.json(r));
});

app.listen(3004);