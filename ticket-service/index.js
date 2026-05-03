const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const XLSX = require("xlsx");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: "uploads/" });

/* ===== BD ===== */

const db = new sqlite3.Database("tickets.db");

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

/* ===== GET ===== */

app.get("/tickets", (req, res) => {
  db.all("SELECT * FROM tickets", [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

/* ===== POST ===== */

app.post("/tickets", (req, res) => {
  const { titulo, descripcion, tecnico, estado } = req.body;

  db.run(
    `INSERT INTO tickets (titulo, descripcion, tecnico, estado)
     VALUES (?,?,?,?)`,
    [titulo, descripcion, tecnico, estado],
    function (err) {
      if (err) return res.status(500).send(err);
      res.json({ id: this.lastID });
    }
  );
});

/* ===== EXPORT EXCEL ===== */

app.get("/tickets/export", (req, res) => {
  db.all("SELECT * FROM tickets", [], (err, rows) => {
    if (err) return res.status(500).send(err);

    const data = rows.map(t => ({
      ID: t.id,
      Titulo: t.titulo,
      Descripcion: t.descripcion,
      Tecnico: t.tecnico,
      Estado: t.estado
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");

    const file = "tickets.xlsx";
    XLSX.writeFile(wb, file);

    res.download(file);
  });
});

/* ===== IMPORT EXCEL ===== */

app.post("/tickets/import", upload.single("file"), (req, res) => {
  const wb = XLSX.readFile(req.file.path);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws);

  data.forEach(row => {
    db.run(
      `INSERT INTO tickets (titulo, descripcion, tecnico, estado)
       VALUES (?,?,?,?)`,
      [
        row.Titulo,
        row.Descripcion,
        row.Tecnico,
        row.Estado
      ]
    );
  });

  res.send("Importado correctamente");
});

/* ===== START ===== */

app.listen(3001, () => {
  console.log("Ticket service corriendo en puerto 3001");
});