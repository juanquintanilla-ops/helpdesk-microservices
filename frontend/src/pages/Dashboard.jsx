import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

export default function Dashboard(){

  const [role,setRole] = useState("");
  const [data,setData] = useState([]);

  useEffect(()=>{

    const raw = localStorage.getItem("user");

    // 🔴 VALIDACIÓN CLAVE
    if(!raw || raw === "undefined"){
      window.location.href = "/";
      return;
    }

    let user;

    try{
      user = JSON.parse(raw);
    }catch(e){
      console.error("Error parsing user:", e);
      window.location.href = "/";
      return;
    }

    setRole(user.role);
    loadData(user);

  },[]);

  const loadData = async (user)=>{
    try{

      if(user.role === "admin"){
        const res = await API.get("/bi/coordinador");
        setData(Array.isArray(res.data) ? res.data : []);
      } else {
        setData([]);
      }

    }catch(e){
      console.error(e);
      setData([]);
    }
  };

  const chartData = {
    labels: data.map(x => x?.status || "N/A"),
    datasets: [{
      label: "Tickets",
      data: data.map(x => x?.total || 0)
    }]
  };

  return (
    <div>

      <h1 style={{color:"#fff"}}>Dashboard ({role})</h1>

      {data.length === 0 ? (
        <p style={{color:"#ccc"}}>
          No hay datos aún. Ve a Tickets.
        </p>
      ) : (
        <div style={{background:"#1e293b", padding:20}}>
          <Bar data={chartData}/>
        </div>
      )}

    </div>
  );
}