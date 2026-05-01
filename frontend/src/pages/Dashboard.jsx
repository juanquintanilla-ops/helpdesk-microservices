import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Dashboard(){

  const [data,setData] = useState([]);
  const [kpis,setKpis] = useState({});
  const [mttr,setMttr] = useState(0);

  useEffect(()=>{
    load();
  },[]);

  const load = async ()=>{
    try{
      const k = await API.get("/bi/kpis");
      const m = await API.get("/bi/mttr");
      const c = await API.get("/bi/coordinador");

      setKpis(k.data || {});
      setMttr(m.data?.mttr || 0);
      setData(c.data || []);

    }catch(e){
      console.error(e);
    }
  };

  const chartData = {
    labels: data.map(x=>x.status),
    datasets:[{
      label:"Tickets",
      data: data.map(x=>x.total)
    }]
  };

  return (
    <div>

      <h1 style={{color:"#fff"}}>Centro de Control</h1>

      <div style={{display:"flex", gap:20}}>
        <Card title="Total" value={kpis.total}/>
        <Card title="Abiertos" value={kpis.abiertos}/>
        <Card title="Cerrados" value={kpis.cerrados}/>
        <Card title="MTTR" value={mttr}/>
      </div>

      <br/>

      {data.length > 0 && (
        <Bar data={chartData}/>
      )}

    </div>
  );
}

function Card({title,value}){
  return (
    <div style={{
      background:"#1e293b",
      padding:20,
      color:"#fff"
    }}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}