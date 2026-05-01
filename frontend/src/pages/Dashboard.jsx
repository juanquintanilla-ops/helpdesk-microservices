import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Dashboard(){

  const [kpis,setKpis] = useState({});
  const [prioridad,setPrioridad] = useState([]);
  const [tecnicos,setTecnicos] = useState([]);

  useEffect(()=>{ load(); },[]);

  const load = async ()=>{
    const k = await API.get("/bi/kpis");
    const p = await API.get("/bi/prioridad");
    const t = await API.get("/bi/tecnicos");

    setKpis(k.data);
    setPrioridad(p.data);
    setTecnicos(t.data);
  };

  const prioridadChart = {
    labels: prioridad.map(x=>x.priority),
    datasets:[{ data: prioridad.map(x=>x.total) }]
  };

  const tecnicoChart = {
    labels: tecnicos.map(x=>x.tecnico),
    datasets:[{ data: tecnicos.map(x=>x.total) }]
  };

  return (
    <div style={{background:"#0f172a",color:"#fff",minHeight:"100vh",padding:20}}>
      <h1>Dashboard Ejecutivo</h1>

      <div style={{display:"flex",gap:20}}>
        <div style={{background:"#1e293b",padding:20}}>
          <h3>Total</h3>
          <h2>{kpis.total}</h2>
        </div>

        <div style={{background:"#1e293b",padding:20}}>
          <h3>Abiertos</h3>
          <h2>{kpis.abiertos}</h2>
        </div>

        <div style={{background:"#1e293b",padding:20}}>
          <h3>Cerrados</h3>
          <h2>{kpis.cerrados}</h2>
        </div>
      </div>

      <div style={{display:"flex",marginTop:30,gap:40}}>
        <div style={{width:300}}>
          <h3>Prioridad</h3>
          <Doughnut data={prioridadChart}/>
        </div>

        <div style={{width:400}}>
          <h3>Tickets por técnico</h3>
          <Bar data={tecnicoChart}/>
        </div>
      </div>
    </div>
  );
}