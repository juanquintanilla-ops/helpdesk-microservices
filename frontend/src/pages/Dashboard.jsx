import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from "recharts";

export default function Dashboard(){

  const [data,setData] = useState(null);
  const [tickets,setTickets] = useState([]);

  useEffect(()=>{
    cargarBI();
    cargarTickets();
  },[]);

  const cargarBI = async ()=>{
    try{
      const res = await axios.get("http://localhost:3002/bi/prediccion");
      setData(res.data);
    }catch(err){
      console.error(err);
    }
  };

  const cargarTickets = async ()=>{
    try{
      const res = await axios.get("http://localhost:3001/tickets");
      setTickets(res.data);
    }catch(err){
      console.error(err);
    }
  };

  /* ================= KPIs ================= */

  const abiertos = tickets.filter(t => t.estado === "abierto").length;
  const cerrados = tickets.filter(t => t.estado === "cerrado").length;

  return (
    <div style={{padding:"20px"}}>

      <h2>Dashboard BI</h2>

      {/* ================= KPIs ================= */}

      <div style={kpiContainer}>
        <div style={card}>
          <h3>Tickets Totales</h3>
          <p>{tickets.length}</p>
        </div>

        <div style={card}>
          <h3>Abiertos</h3>
          <p>{abiertos}</p>
        </div>

        <div style={card}>
          <h3>Cerrados</h3>
          <p>{cerrados}</p>
        </div>
      </div>

      {/* ================= GRÁFICO HISTÓRICO ================= */}

      {data && (
        <>
          <h3>Histórico</h3>

          <LineChart width={500} height={300} data={data.historico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>

          {/* ================= PREDICCIÓN ================= */}

          <h3>Predicción</h3>

          <BarChart width={500} height={300} data={[
            { name: "Actual", value: data.historico[data.historico.length-1].total },
            { name: "Predicción", value: data.prediccionProximoPeriodo }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>

          <p><b>Tendencia:</b> {data.tendencia}</p>
          <p><b>Recomendación:</b> {data.recomendacion}</p>
        </>
      )}

    </div>
  );
}

/* ================= ESTILOS ================= */

const kpiContainer = {
  display:"flex",
  gap:"20px",
  marginBottom:"30px"
};

const card = {
  background:"#1e293b",
  color:"#fff",
  padding:"20px",
  borderRadius:"10px",
  minWidth:"120px",
  textAlign:"center"
};