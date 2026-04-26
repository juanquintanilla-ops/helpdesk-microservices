import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Dashboard(){

  const [role,setRole] = useState("");
  const [data,setData] = useState([]);
  const [kpis,setKpis] = useState({});
  const [mttr,setMttr] = useState(0);

  const exportBI = ()=>{
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BI");

    const file = XLSX.write(wb,{ bookType:"xlsx", type:"array" });
    saveAs(new Blob([file]), "bi.xlsx");
  };

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
    <div style={{padding:20}}>
      <h1>Dashboard ({role})</h1>

      {/* BOTONES CORRECTAMENTE UBICADOS */}
      <button onClick={()=>window.location.href="/tickets"}>
        Ir a Tickets
      </button>

      <button onClick={exportBI}>
        Descargar BI en Excel
      </button>

      {role === "tecnico" && <Bar data={chartData}/>}
      {role === "admin" && <Bar data={chartData}/>}
      {role === "gerencia" && <Line data={chartData}/>}

      {role === "bi" && (
        <>
          <p>Total: {kpis.total}</p>
          <p>Abiertos: {kpis.abiertos}</p>
          <p>Cerrados: {kpis.cerrados}</p>
          <p>MTTR: {mttr}</p>
        </>
      )}
    </div>
  );
}