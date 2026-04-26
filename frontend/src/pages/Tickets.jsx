import { useState, useEffect } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Tickets(){

  const [title,setTitle] = useState("");
  const [tickets,setTickets] = useState([]);

  const load = async ()=>{
    const res = await API.get("/tickets");
    setTickets(res.data);
  };

  useEffect(()=>{ load(); },[]);

  const create = async ()=>{
    await API.post("/tickets",{ title });
    setTitle("");
    load();
  };

  // EXPORTAR EXCEL
  const exportExcel = ()=>{
    const ws = XLSX.utils.json_to_sheet(tickets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");

    const file = XLSX.write(wb,{ bookType:"xlsx", type:"array" });
    saveAs(new Blob([file]), "tickets.xlsx");
  };

  // 📥 IMPORTAR EXCEL
  const handleFile = async (e)=>{
    const file = e.target.files[0];

    if(!file){
      alert("No seleccionaste archivo");
      return;
    }

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    for(const row of json){
      await API.post("/tickets",{
        title: row.title || "Sin título"
      });
    }

    alert("Tickets cargados correctamente");
    load();
  };

  return (
    <div style={{padding:20}}>
      <h2>Gestión de Tickets</h2>

      <input
        placeholder="Título del ticket"
        value={title}
        onChange={e=>setTitle(e.target.value)}
      />

      <button onClick={create}>Crear Ticket</button>

      <button onClick={exportExcel}>Descargar Excel</button>

      <br/><br/>

      {/* SUBIR EXCEL */}
      <input type="file" accept=".xlsx,.xls" onChange={handleFile}/>

      <hr/>

      {tickets.map(t=>(
        <div key={t.id}>
          {t.title} - {t.status}
        </div>
      ))}
    </div>
  );
}