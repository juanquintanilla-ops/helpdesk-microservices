const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const db = new sqlite3.Database("./db.sqlite");

db.run(`CREATE TABLE IF NOT EXISTS tickets(
 id INTEGER PRIMARY KEY,
 title TEXT,
 status TEXT,
 priority TEXT,
 assigned_to TEXT,
 created_at TEXT,
 closed_at TEXT
)`);

app.get("/tickets",(req,res)=>{
 db.all("SELECT * FROM tickets",[],(e,r)=>res.json(r));
});

app.post("/tickets",(req,res)=>{
 const now = new Date().toISOString();

 db.run(`
 INSERT INTO tickets (title,status,priority,assigned_to,created_at)
 VALUES (?,?,?,?,?)
 `,
 [req.body.title,"Abierto","Media","tec1",now],
 function(){ res.json({id:this.lastID});});
});

app.put("/tickets/:id/close",(req,res)=>{
 const now = new Date().toISOString();

 db.run(
 "UPDATE tickets SET status='Cerrado', closed_at=? WHERE id=?",
 [now, req.params.id],
 function(){ res.json({updated:this.changes});}
 );
});

app.listen(3001);