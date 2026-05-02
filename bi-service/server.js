const express = require("express");
const axios = require("axios");

const app = express();

const TICKET_URL = process.env.TICKET_URL || "https://ticket-service-bo5t.onrender.com";

/* ================= ETL ================= */
app.get("/bi/etl", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    const data = r.data;

    const transform = data.map(t=>{
      const title = (t.title || "").toLowerCase();

      let categoria = "General";

      if(title.includes("internet") || title.includes("red")){
        categoria = "Red";
      }
      else if(
        title.includes("teclado") ||
        title.includes("mouse") ||
        title.includes("maouse") || // corrección
        title.includes("raton")
      ){
        categoria = "Perifericos";
      }
      else if(
        title.includes("pantalla") ||
        title.includes("monitor")
      ){
        categoria = "Hardware";
      }
      else if(
        title.includes("ofimatica") ||
        title.includes("software")
      ){
        categoria = "Software";
      }

      return {
        id: t.id,
        titulo: t.title,
        categoria,
        estado: t.status,
        tecnico: t.technician || "Sin asignar"
      };
    });

    res.json({
      proceso: "ETL ejecutado",
      total: transform.length,
      data: transform
    });

  }catch(e){
    res.status(500).json({error:"etl error"});
  }
});

/* ================= PREDICCIÓN ================= */
app.get("/bi/prediccion", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    const data = r.data;

    const conteo = {
      Red:0,
      Perifericos:0,
      Hardware:0,
      Software:0
    };

    data.forEach(t=>{
      const title = (t.title || "").toLowerCase();

      if(title.includes("internet") || title.includes("red")){
        conteo.Red++;
      }
      else if(
        title.includes("teclado") ||
        title.includes("mouse") ||
        title.includes("maouse") ||
        title.includes("raton")
      ){
        conteo.Perifericos++;
      }
      else if(
        title.includes("pantalla") ||
        title.includes("monitor")
      ){
        conteo.Hardware++;
      }
      else if(
        title.includes("ofimatica") ||
        title.includes("software")
      ){
        conteo.Software++;
      }
    });

    // encontrar la categoría dominante
    let maxCat = "Red";
    let maxVal = 0;

    for(let c in conteo){
      if(conteo[c] > maxVal){
        maxVal = conteo[c];
        maxCat = c;
      }
    }

    res.json({
      conteo,
      prediccion: `Próxima falla probable: ${maxCat}`,
      recomendacion:
        maxCat === "Red"
          ? "Revisar conectividad y routers"
          : maxCat === "Perifericos"
          ? "Verificar teclados y mouse"
          : maxCat === "Hardware"
          ? "Revisar componentes físicos"
          : "Validar software instalado"
    });

  }catch(e){
    res.status(500).json({error:"pred error"});
  }
});

/* ================= START ================= */
app.listen(3004, ()=>{
  console.log("BI final funcionando correctamente");
});