import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard(){

  const [raw,setRaw] = useState([]);
  const [data,setData] = useState([]);

  const [kpis,setKpis] = useState({ total:0, abiertos:0, cerrados:0 });
  const [mttr,setMttr] = useState(0);

  const [estado,setEstado] = useState("todos");
  const [tecnico,setTecnico] = useState("todos");
  const [fechaInicio,setFechaInicio] = useState("");
  const [fechaFin,setFechaFin] = useState("");

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
      setRaw(c.data || []);
      setData(c.data || []);

    }catch(e){
      console.error(e);
    }
  };

  /* FILTROS */
  useEffect(()=>{
    let filtered = [...raw];

    if(estado !== "todos"){
      filtered = filtered.filter(x=>x.status === estado);
    }

    if(tecnico !== "todos"){
      filtered = filtered.filter(x=>x.tecnico === tecnico);
    }

    setData(filtered);

  },[estado, tecnico, fechaInicio, fechaFin]);

  /* EXPORT EXCEL */
  const exportBI = ()=>{
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BI");

    const file = XLSX.write(wb,{ bookType:"xlsx", type:"array" });
    saveAs(new Blob([file]), "bi.xlsx");
  };

  /* DATOS GRAFICOS */

  const barData = {
    labels: data.map(x=>x.status),
    datasets:[{
      label:"Tickets",
      data: data.map(x=>x.total)
    }]
  };

  const pieData = {
    labels:["Abiertos","Cerrados"],
    datasets:[{
      data:[kpis.abiertos, kpis.cerrados]
    }]
  };

  const lineData = {
    labels: data.map((_,i)=>i+1),
    datasets:[{
      label:"Tendencia",
      data: data.map(x=>x.total)
    }]
  };

  return (
    <div>

      <h1 style={{color:"#fff", marginBottom:20}}>
        📊 Power BI Dashboard
      </h1>

      {/* FILTROS */}
      <div style={filters}>
        <select onChange={e=>setEstado(e.target.value)}>
          <option value="todos">Estado</option>
          <option value="abierto">Abierto</option>
          <option value="cerrado">Cerrado</option>
        </select>

        <select onChange={e=>setTecnico(e.target.value)}>
          <option value="todos">Técnico</option>
          <option value="tec1">tec1</option>
        </select>

        <input type="date" onChange={e=>setFechaInicio(e.target.value)}/>
        <input type="date" onChange={e=>setFechaFin(e.target.value)}/>

        <button onClick={exportBI}>Exportar BI</button>
      </div>

      {/* KPIs */}
      <div style={grid4}>
        <KPI title="Total" value={kpis.total}/>
        <KPI title="Abiertos" value={kpis.abiertos}/>
        <KPI title="Cerrados" value={kpis.cerrados}/>
        <KPI title="MTTR" value={mttr}/>
      </div>

      {/* GRAFICOS */}
      <div style={grid2}>
        <Card title="Tickets por Estado">
          <Bar data={barData}/>
        </Card>

        <Card title="Distribución">
          <Doughnut data={pieData}/>
        </Card>
      </div>

      <Card title="Tendencia">
        <Line data={lineData}/>
      </Card>

      {/* TABLA */}
      <Card title="Detalle BI">
        <table style={table}>
          <thead>
            <tr>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((x,i)=>(
              <tr key={i}>
                <td>{x.status}</td>
                <td>{x.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

    </div>
  );
}

/* COMPONENTES */

function KPI({title,value}){
  return (
    <div style={kpi}>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

function Card({title, children}){
  return (
    <div style={card}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

/* ESTILOS */

const filters = {
  display:"flex",
  gap:10,
  marginBottom:20
};

const grid4 = {
  display:"grid",
  gridTemplateColumns:"repeat(4,1fr)",
  gap:20,
  marginBottom:20
};

const grid2 = {
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:20,
  marginBottom:20
};

const kpi = {
  background:"#1e293b",
  padding:20,
  color:"#fff",
  borderRadius:10,
  textAlign:"center"
};

const card = {
  background:"#1e293b",
  padding:20,
  color:"#fff",
  borderRadius:10,
  marginBottom:20
};

const table = {
  width:"100%",
  color:"#fff",
  borderCollapse:"collapse"
};