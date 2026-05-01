import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard(){

  const [kpis,setKpis] = useState({});
  const [pred,setPred] = useState({});
  const [etl,setEtl] = useState([]);

  useEffect(()=>{
    load();
  },[]);

  const load = async ()=>{
    const k = await API.get("/bi/kpis");
    const p = await API.get("/bi/prediccion");
    const e = await API.get("/bi/etl");

    setKpis(k.data);
    setPred(p.data);
    setEtl(e.data.data);
  };

  return (
    <div style={container}>

      <h2>BI Ejecutivo</h2>

      {/* KPIs */}
      <div style={grid}>
        <Card title="Total" value={kpis.total}/>
        <Card title="Abiertos" value={kpis.abiertos}/>
        <Card title="Cerrados" value={kpis.cerrados}/>
        <Card title="Resolución %" value={kpis.tasaResolucion}/>
      </div>

      {/* PREDICCIÓN */}
      <div style={card}>
        <h3>Predicción</h3>
        <p><b>Estado:</b> {pred.prediccion}</p>
        <p><b>Recomendación:</b> {pred.recomendacion}</p>
      </div>

      {/* ETL */}
      <div style={card}>
        <h3>ETL (Datos Transformados)</h3>

        <table style={table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Técnico</th>
            </tr>
          </thead>
          <tbody>
            {etl.map(t=>(
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.prioridad}</td>
                <td>{t.estado}</td>
                <td>{t.tecnico}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

function Card({title,value}){
  return (
    <div style={kpi}>
      <h4>{title}</h4>
      <h2>{value || 0}</h2>
    </div>
  );
}

/* estilos */
const container = {color:"#fff"};
const grid = {
  display:"grid",
  gridTemplateColumns:"repeat(4,1fr)",
  gap:20,
  marginBottom:20
};

const kpi = {
  background:"#111827",
  padding:20,
  borderRadius:10
};

const card = {
  background:"#111827",
  padding:20,
  marginTop:20,
  borderRadius:10
};

const table = {
  width:"100%",
  marginTop:10
};