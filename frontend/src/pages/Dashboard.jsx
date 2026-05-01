import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard(){

  const [kpis,setKpis] = useState({});
  const [mttr,setMttr] = useState(0);
  const [prioridad,setPrioridad] = useState([]);
  const [tecnicos,setTecnicos] = useState([]);
  const [sla,setSla] = useState([]);

  useEffect(()=>{ load(); },[]);

  const load = async ()=>{
    const k = await API.get("/bi/kpis");
    const m = await API.get("/bi/mttr");
    const p = await API.get("/bi/prioridad");
    const t = await API.get("/bi/tecnicos");
    const s = await API.get("/bi/sla");

    setKpis(k.data);
    setMttr(m.data.mttr);
    setPrioridad(p.data);
    setTecnicos(t.data);
    setSla(s.data);
  };

  /* EXPORT */
  const exportBI = ()=>{
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb,
      XLSX.utils.json_to_sheet(prioridad),"Prioridad");

    XLSX.utils.book_append_sheet(wb,
      XLSX.utils.json_to_sheet(tecnicos),"Tecnicos");

    XLSX.utils.book_append_sheet(wb,
      XLSX.utils.json_to_sheet(sla),"SLA");

    const file = XLSX.write(wb,{ bookType:"xlsx", type:"array" });
    saveAs(new Blob([file]), "bi_final.xlsx");
  };

  return (
    <div>

      <h1 style={{color:"#fff"}}>📊 Dashboard Ejecutivo</h1>

      {/* KPIs */}
      <div style={grid4}>
        <KPI title="Total" value={kpis.total}/>
        <KPI title="Abiertos" value={kpis.abiertos}/>
        <KPI title="Cerrados" value={kpis.cerrados}/>
        <KPI title="MTTR" value={mttr}/>
      </div>

      <button onClick={exportBI}>Exportar BI</button>

      {/* GRAFICOS */}
      <div style={grid2}>

        <Card title="Prioridad">
          <Bar data={{
            labels: prioridad.map(x=>x.priority),
            datasets:[{ data: prioridad.map(x=>x.total) }]
          }}/>
        </Card>

        <Card title="Técnicos">
          <Bar data={{
            labels: tecnicos.map(x=>x.tecnico),
            datasets:[{ data: tecnicos.map(x=>x.total) }]
          }}/>
        </Card>

      </div>

      <Card title="SLA">
        <Doughnut data={{
          labels: sla.map(x=>x.estado),
          datasets:[{ data: sla.map(x=>x.total) }]
        }}/>
      </Card>

    </div>
  );
}

/* COMPONENTES */

function KPI({title,value}){
  return <div style={kpi}><p>{title}</p><h2>{value}</h2></div>;
}

function Card({title,children}){
  return <div style={card}><h3>{title}</h3>{children}</div>;
}

/* ESTILOS */

const grid4={display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:20};
const grid2={display:"grid",gridTemplateColumns:"1fr 1fr",gap:20};
const kpi={background:"#1e293b",padding:20,color:"#fff"};
const card={background:"#1e293b",padding:20,color:"#fff",marginTop:20};