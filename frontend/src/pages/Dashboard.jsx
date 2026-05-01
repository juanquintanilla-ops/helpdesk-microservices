import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard(){

  const [kpis,setKpis] = useState({});
  const [pred,setPred] = useState({});
  const [data,setData] = useState([]);

  useEffect(()=>{
    load();
  },[]);

  const load = async ()=>{
    const k = await API.get("/bi/kpis");
    const p = await API.get("/bi/prediccion");
    const e = await API.get("/bi/etl");

    setKpis(k.data);
    setPred(p.data);
    setData(e.data.data);
  };

  const porCategoria = Object.values(
    data.reduce((acc,t)=>{
      acc[t.categoria] = acc[t.categoria] || {name:t.categoria, total:0};
      acc[t.categoria].total++;
      return acc;
    },{})
  );

  return (
    <div style={container}>

      <h2>Dashboard BI</h2>

      {/* KPIs */}
      <div style={grid}>
        <Card title="Total" value={kpis.total}/>
        <Card title="Abiertos" value={kpis.abiertos}/>
        <Card title="Cerrados" value={kpis.cerrados}/>
      </div>

      {/* GRÁFICA */}
      <div style={card}>
        <h3>Incidencias por Categoría</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={porCategoria}>
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
        <p>{pred.prediccion}</p>
        <p>{pred.recomendacion}</p>
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

const container = {color:"#fff"};

const grid = {
  display:"grid",
  gridTemplateColumns:"repeat(3,1fr)",
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