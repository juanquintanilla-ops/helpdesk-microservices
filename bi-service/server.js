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

      if(title.includes("internet") || title.includes("red")) categoria = "Red";
      else if(title.includes("teclado") || title.includes("mouse")) categoria = "Periféricos";
      else if(title.includes("pantalla")) categoria = "Hardware";
      else if(title.includes("ofimatica")) categoria = "Software";

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

/* ================= PREDICCIÓN DE FALLA ================= */
app.get("/bi/prediccion", async (req,res)=>{
  try{
    const r = await axios.get(`${TICKET_URL}/tickets`);
    const data = r.data;

    const conteo = {
      Red:0,
      "Periféricos":0,
      Hardware:0,
      Software:0,
      General:0
    };

    data.forEach(t=>{
      const title = (t.title || "").toLowerCase();

      if(title.includes("internet") || title.includes("red")) conteo.Red++;
      else if(title.includes("teclado") || title.includes("mouse")) conteo["Periféricos"]++;
      else if(title.includes("pantalla")) conteo.Hardware++;
      else if(title.includes("ofimatica")) conteo.Software++;
      else conteo.General++;
    });

    // encontrar categoría dominante
    let maxCat = "General";
    let maxVal = 0;

    for(let c in conteo){
      if(conteo[c] > maxVal){
        maxVal = conteo[c];
        maxCat = c;
      }
    }

    res.json({
      conteo,
      prediccion: `El próximo incidente más probable es: ${maxCat}`,
      recomendacion:
        maxCat === "Red"
          ? "Revisar conectividad e infraestructura"
          : maxCat === "Periféricos"
          ? "Verificar dispositivos de entrada"
          : maxCat === "Hardware"
          ? "Revisar componentes físicos"
          : maxCat === "Software"
          ? "Validar aplicaciones instaladas"
          : "Monitoreo general"
    });

  }catch(e){
    res.status(500).json({error:"pred error"});
  }
});

app.listen(3004, ()=>{
  console.log("BI predicción de fallas listo");
});