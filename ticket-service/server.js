const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let tickets = [];
let id = 1;

/* CREAR */
app.post("/tickets",(req,res)=>{
  const ticket = {
    id: id++,
    title: req.body.title,
    status: "abierto",
    priority: req.body.priority || "media",
    tecnico: req.body.tecnico || "sin_asignar",
    createdAt: new Date(),
    history: ["Ticket creado"]
  };

  tickets.push(ticket);
  res.json(ticket);
});

/* LISTAR */
app.get("/tickets",(req,res)=>{
  res.json(tickets);
});

/* EDITAR */
app.put("/tickets/:id",(req,res)=>{
  const t = tickets.find(x=>x.id == req.params.id);
  if(!t) return res.sendStatus(404);

  t.title = req.body.title || t.title;
  t.priority = req.body.priority || t.priority;
  t.tecnico = req.body.tecnico || t.tecnico;

  t.history.push("Ticket actualizado");

  res.json(t);
});

/* CERRAR */
app.put("/tickets/:id/close",(req,res)=>{
  const t = tickets.find(x=>x.id == req.params.id);
  t.status = "cerrado";
  t.history.push("Ticket cerrado");
  res.json(t);
});

/* REABRIR */
app.put("/tickets/:id/open",(req,res)=>{
  const t = tickets.find(x=>x.id == req.params.id);
  t.status = "abierto";
  t.history.push("Ticket reabierto");
  res.json(t);
});

app.listen(3001,()=>console.log("Ticket service 3001"));