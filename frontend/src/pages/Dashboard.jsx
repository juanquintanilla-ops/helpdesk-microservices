import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Dashboard(){

  const [role,setRole] = useState("");
  const [data,setData] = useState([]);
  const [kpis,setKpis] = useState({});
  const [mttr,setMttr] = useState(0);

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));

    if(!user){
      window.location.href="/";
      return;
    }

    setRole(user.role);
    loadData(user);
  },[]);

  const loadData = async (user)=>{

    if(user.role === "tecnico"){
      const res = await API.get("/bi/tecnico/tec1");
      setData(res.data);
    }

    if(user.role === "admin"){
      const res = await API.get("/bi/coordinador");
      setData(res.data);
    }

    if(user.role === "bi"){
      const k = await API.get("/bi/kpis");
      const m = await API.get("/bi/mttr");

      setKpis(k.data);
      setMttr(m.data.mttr || 0);
    }

    if(user.role === "gerencia"){
      const res = await API.get("/bi/gerencia");
      setData(res.data);
    }
  };

  const chartData = {
    labels: data.map(x => x.status || x.priority || x.fecha),
    datasets: [{
      label: "Datos",
      data: data.map(x => x.total)
    }]
  };

  return (
    <div>

      <h1 style={{color:"#fff"}}>Dashboard ({role})</h1>

      {/* KPIs */}
      <div style={{display:"flex", gap:20, marginBottom:20}}>

        <Card title="Total" value={kpis.total || 0}/>
        <Card title="Abiertos" value={kpis.abiertos || 0}/>
        <Card title="Cerrados" value={kpis.cerrados || 0}/>
        <Card title="MTTR" value={mttr}/>

      </div>

      {/* GRÁFICO */}
      {data.length > 0 ? (
        <div style={{background:"#1e293b", padding:20, borderRadius:10}}>
          <Bar data={chartData}/>
        </div>
      ) : (
        <p style={{color:"#94a3b8"}}>
          No hay datos aún. Ve a Tickets.
        </p>
      )}

    </div>
  );
}

function Card({title, value}){
  return (
    <div style={{
      background:"#1e293b",
      padding:20,
      borderRadius:10,
      color:"#fff",
      minWidth:120
    }}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}