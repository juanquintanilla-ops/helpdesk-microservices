import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard(){

  const [etl,setEtl] = useState([]);
  const [pred,setPred] = useState({});

  useEffect(()=>{
    load();
  },[]);

  const load = async ()=>{
    const e = await API.get("/bi/etl");
    const p = await API.get("/bi/prediccion");

    setEtl(e.data.data || []);
    setPred(p.data);
  };

  // agrupar por categoría
  const data = Object.values(
    etl.reduce((acc,t)=>{
      acc[t.categoria] = acc[t.categoria] || {name:t.categoria, total:0};
      acc[t.categoria].total++;
      return acc;
    },{})
  );

  return (
    <div style={{color:"#fff"}}>

      <h2>BI Predictivo de Fallas</h2>

      {/* GRÁFICA */}
      <div style={card}>
        <h3>Incidencias por Categoría</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>
            <Bar dataKey="total"/>
          </BarChart>
        </ResponsiveContainer>

      </div>

      {/* PREDICCIÓN */}
      <div style={card}>
        <h3>Predicción</h3>
        <p><b>{pred.prediccion}</b></p>
        <p>{pred.recomendacion}</p>
      </div>

      {/* ETL */}
      <div style={card}>
        <h3>ETL (Transformación)</h3>

        <table style={{width:"100%"}}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Categoría</th>
            </tr>
          </thead>
          <tbody>
            {etl.map(t=>(
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.titulo}</td>
                <td>{t.categoria}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

const card = {
  background:"#111827",
  padding:20,
  marginTop:20,
  borderRadius:10
};