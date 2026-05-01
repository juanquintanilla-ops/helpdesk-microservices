import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

export default function Dashboard(){

  const [data,setData] = useState([]);

  useEffect(()=>{
    load();
  },[]);

  const load = async ()=>{
    const res = await API.get("/tickets");
    setData(res.data || []);
  };

  const total = data.length;
  const abiertos = data.filter(t=>t.status==="abierto").length;
  const cerrados = data.filter(t=>t.status==="cerrado").length;

  const porPrioridad = ["alta","media","baja"].map(p=>({
    name:p,
    value:data.filter(t=>t.priority===p).length
  }));

  const porTecnico = Object.values(
    data.reduce((acc,t)=>{
      const key = t.technician || "Sin asignar";
      acc[key] = acc[key] || {name:key, total:0};
      acc[key].total++;
      return acc;
    },{})
  );

  const porEstado = [
    {name:"Abiertos", value:abiertos},
    {name:"Cerrados", value:cerrados}
  ];

  return (
    <div style={container}>

      <h2 style={title}>Dashboard Ejecutivo</h2>

      <div style={kpiGrid}>
        <Card title="Total Tickets" value={total}/>
        <Card title="Abiertos" value={abiertos}/>
        <Card title="Cerrados" value={cerrados}/>
      </div>

      <div style={chartsGrid}>

        <div style={card}>
          <h4>Prioridad</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={porPrioridad}>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="value"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <h4>Técnicos</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={porTecnico}>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="total"/>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <h4>Estado</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={porEstado} dataKey="value" outerRadius={80}>
                {porEstado.map((_,i)=><Cell key={i}/>)}
              </Pie>
              <Tooltip/>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

function Card({title,value}){
  return (
    <div style={kpi}>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

const container = {color:"#e5e7eb"};
const title = {marginBottom:20};

const kpiGrid = {
  display:"grid",
  gridTemplateColumns:"repeat(3,1fr)",
  gap:20,
  marginBottom:30
};

const kpi = {
  background:"#111827",
  padding:20,
  borderRadius:12,
  border:"1px solid #1f2937"
};

const chartsGrid = {
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:20
};

const card = {
  background:"#111827",
  padding:20,
  borderRadius:12,
  border:"1px solid #1f2937"
};