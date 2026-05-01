const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

/* ================= DB ================= */
const db = new sqlite3.Database("./tickets.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      priority TEXT,
      status TEXT,
      technician TEXT,
      comments TEXT
    )
  `);
});

/* ================= GET ================= */
app.get("/tickets", (req, res) => {
  db.all("SELECT * FROM tickets ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

/* ================= CREATE ================= */
app.post("/tickets", (req, res) => {
  const { title, description, priority, technician, comments } = req.body;

  db.run(
    `INSERT INTO tickets (title, description, priority, status, technician, comments)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, description, priority, "abierto", technician || "", comments || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        id: this.lastID,
        title,
        description,
        priority,
        status: "abierto",
        technician,
        comments
      });
    }
  );
});

/* ================= STATUS ================= */
app.put("/tickets/:id/status", (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  db.run(
    "UPDATE tickets SET status = ? WHERE id = ?",
    [status, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.json({ ok: true });
    }
  );
});

/* ================= START ================= */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Ticket Service OK en puerto", PORT);
});