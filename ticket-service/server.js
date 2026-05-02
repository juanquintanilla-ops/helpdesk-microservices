const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

/* ================= DATA ================= */

let tickets = [
  { id: 1, titulo: "Falla internet", tecnico: "Juan", estado: "abierto" },
  { id: 2, titulo: "PC no enciende", tecnico: "Ana", estado: "cerrado" }
];

/* ================= GET ================= */

app.get("/tickets", (req, res) => {
  res.json(tickets);
});

/* ================= POST ================= */

app.post("/tickets", (req, res) => {
  const nuevo = {
    id: Date.now(),
    ...req.body
  };
  tickets.push(nuevo);
  res.json(nuevo);
});

/* ================= EXPORT EXCEL ================= */

app.get("/tickets/export", (req, res) => {

  const ws = XLSX.utils.json_to_sheet(tickets);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Tickets");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  res.setHeader("Content-Disposition", "attachment; filename=tickets.xlsx");
  res.send(buffer);
});

/* ================= IMPORT EXCEL ================= */

app.post("/tickets/import", upload.single("file"), (req, res) => {

  const wb = XLSX.read(req.file.buffer, { type: "buffer" });
  const ws = wb.Sheets[wb.SheetNames[0]];

  const data = XLSX.utils.sheet_to_json(ws);

  tickets = data.map((t, i) => ({
    id: Date.now() + i,
    titulo: t.titulo || t.Título || "Sin título",
    tecnico: t.tecnico || t.Técnico || "N/A",
    estado: t.estado || t.Estado || "abierto"
  }));

  res.json({ mensaje: "Importación exitosa", total: tickets.length });
});

app.listen(3001, () => {
  console.log("Ticket service corriendo en 3001");
});