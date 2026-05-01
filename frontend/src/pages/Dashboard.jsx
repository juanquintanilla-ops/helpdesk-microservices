import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Dashboard(){

  const [kpis,setKpis] = useState({});
  const [data,setData] = useState([]);

  useEffect(()=>{
    load();
  },[]);

  const load = async ()=>{
    const k = await API.get("/bi/kpis");
    const p = await API.get("/bi/prioridad");

    setKpis(k.data);
    setData(p.data);
  };

  return (
    <div style={{color:"#fff"}}>

      <h2>Dashboard Ejecutivo</h2>

      <div style={{display:"flex",gap:20}}>
        <Card title="Total" value={kpis.total}/>
        <Card title="Abiertos" value={kpis.abiertos}/>
        <Card title="Cerrados" value={kpis.cerrados}/>
      </div>

      <div style={{display:"flex",gap:40,marginTop:30}}>

        <div style={chart}>
          <Doughnut data={{
            labels:data.map(x=>x.priority),
            datasets:[{data:data.map(x=>x.total)}]
          }}/>
        </div>

        <div style={chart}>
          <Bar data={{
            labels:data.map(x=>x.priority),
            datasets:[{data:data.map(x=>x.total)}]
          }}/>
        </div>

      </div>

    </div>
  );
}

function Card({title,value}){
  return (
    <div style={{
      background:"#111827",
      padding:20,
      width:200
    }}>
      <h4>{title}</h4>
      <h2>{value || 0}</h2>
    </div>
  );
}

const chart = {background:"#111827",padding:20,width:400};