const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/bi/prediccion", (req, res) => {
  res.json({
    historico: [
      { fecha: "Ene", total: 10 },
      { fecha: "Feb", total: 15 },
      { fecha: "Mar", total: 20 }
    ],
    prediccionProximoPeriodo: 25,
    tendencia: "Alta",
    recomendacion: "Incrementar soporte técnico"
  });
});

app.listen(3002, () => {
  console.log("BI service corriendo en 3002");
});