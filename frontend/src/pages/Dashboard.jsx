import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Dashboard(){

  const [kpis,setKpis] = useState({});
  const [prioridad,setPrioridad] = useState([]);

  useEffect(()=>{ load(); },[]);

  const load = async ()=>{
    const k = await API.get("/bi/kpis");
    const p = await API.get("/bi/prioridad");

    setKpis(k.data);
    setPrioridad(p.data);
  };

  return (
    <div>

      <h2>Dashboard Ejecutivo</h2>

      {/* KPIs */}
      <div style={{display:"flex",gap:20}}>

        <Card title="Total" value={kpis.total}/>
        <Card title="Abiertos" value={kpis.abiertos}/>
        <Card title="Cerrados" value={kpis.cerrados}/>

      </div>

      {/* GRÁFICOS */}
      <div style={{display:"flex",marginTop:30,gap:30}}>

        <div style={chartCard}>
          <h3>Prioridad</h3>
          <Doughnut data={{
            labels: prioridad.map(x=>x.priority),
            datasets:[{ data: prioridad.map(x=>x.total) }]
          }}/>
        </div>

        <div style={chartCard}>
          <h3>Distribución</h3>
          <Bar data={{
            labels: prioridad.map(x=>x.priority),
            datasets:[{ data: prioridad.map(x=>x.total) }]
          }}/>
        </div>

      </div>

    </div>
  );
}

/* ===== COMPONENTES ===== */

function Card({title,value}){
  return (
    <div style={{
      background:"#020617",
      padding:20,
      width:200
    }}>
      <h4>{title}</h4>
      <h2>{value || 0}</h2>
    </div>
  );
}

const chartCard = {
  background:"#020617",
  padding:20,
  width:400
};