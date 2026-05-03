const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const XLSX = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

const db = new sqlite3.Database("tickets.db");

/* ===== TABLA ===== */
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT,
      descripcion TEXT,
      tecnico TEXT,
      estado TEXT
    )
  `);
});

/* ===== DEBUG ===== */
app.get("/ping", (req,res)=>res.send("pong"));

/* ===== GET ===== */
app.get("/tickets", (req, res) => {
  db.all("SELECT * FROM tickets ORDER BY id ASC", [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

/* ===== POST ===== */
app.post("/tickets", (req, res) => {
  const { titulo, descripcion, tecnico } = req.body;

  db.run(
    `INSERT INTO tickets (titulo, descripcion, tecnico, estado)
     VALUES (?,?,?,?)`,
    [titulo, descripcion, tecnico, "Abierto"],
    function (err) {
      if (err) return res.status(500).send(err);
      res.json({ id: this.lastID });
    }
  );
});

/* 🔴 UPDATE (CLAVE REAL) */
app.put("/tickets/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { estado } = req.body;

  console.log("UPDATE ->", id, estado); // 👈 LOG

  db.run(
    `UPDATE tickets SET estado = ? WHERE id = ?`,
    [estado, id],
    function (err) {
      if (err) {
        console.log("ERROR UPDATE", err);
        return res.status(500).send(err);
      }

      console.log("CHANGES:", this.changes); // 👈 LOG

      if (this.changes === 0) {
        return res.status(404).send("Ticket no encontrado");
      }

      res.json({ ok: true });
    }
  );
});

/* ===== EXPORT ===== */
app.get("/tickets/export", (req, res) => {
  db.all("SELECT * FROM tickets", [], (err, rows) => {

    const data = rows.map(t => ({
      Titulo: t.titulo,
      Descripcion: t.descripcion,
      Tecnico: t.tecnico,
      Estado: t.estado
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");

    XLSX.writeFile(wb, "tickets.xlsx");
    res.download("tickets.xlsx");
  });
});

/* ===== IMPORT ===== */
app.post("/tickets/import", upload.single("file"), (req, res) => {
  const wb = XLSX.readFile(req.file.path);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws);

  data.forEach(row => {
    db.run(
      `INSERT INTO tickets (titulo, descripcion, tecnico, estado)
       VALUES (?,?,?,?)`,
      [row.Titulo, row.Descripcion, row.Tecnico, row.Estado || "Abierto"]
    );
  });

  res.send("OK");
});

app.listen(3001, () => console.log("Ticket service OK"));