const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

/* ---------------- AUTH ---------------- */
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

/* ---------------- DATA EN MEMORIA ---------------- */
let tickets = [
  { id:1, title:"Error impresora", status:"Abierto" },
  { id:2, title:"PC lento", status:"Cerrado" }
];

/* ---------------- TICKETS ---------------- */
app.get("/tickets",(req,res)=>{
  res.json(tickets);
});

app.post("/tickets",(req,res)=>{
  const newTicket = {
    id: Date.now(),
    title: req.body.title,
    status:"Abierto"
  };
  tickets.push(newTicket);
  res.json(newTicket);
});

app.put("/tickets/:id/close",(req,res)=>{
  const t = tickets.find(x=>x.id == req.params.id);
  if(t) t.status = "Cerrado";
  res.json({ok:true});
});

/* ---------------- BI ---------------- */
app.get("/bi/kpis",(req,res)=>{
  res.json({
    total: tickets.length,
    abiertos: tickets.filter(t=>t.status==="Abierto").length,
    cerrados: tickets.filter(t=>t.status==="Cerrado").length
  });
});

app.get("/bi/mttr",(req,res)=>{
  res.json({ mttr: 4 });
});

app.get("/bi/coordinador",(req,res)=>{
  res.json([
    { priority:"Alta", total:10 },
    { priority:"Media", total:20 },
    { priority:"Baja", total:5 }
  ]);
});

app.get("/bi/tecnico/:name",(req,res)=>{
  res.json([
    { status:"Abierto", total:3 },
    { status:"Cerrado", total:7 }
  ]);
});

app.get("/bi/gerencia",(req,res)=>{
  res.json([
    { fecha:"Lun", total:5 },
    { fecha:"Mar", total:8 },
    { fecha:"Mie", total:6 }
  ]);
});

/* ---------------- FRONTEND ---------------- */
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.use((req,res)=>{
  res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
});

/* ---------------- SERVER ---------------- */
app.listen(3000,()=>{
  console.log("Servidor ONLINE listo en puerto 3000");
});