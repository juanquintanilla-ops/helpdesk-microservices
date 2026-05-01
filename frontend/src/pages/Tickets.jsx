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
    if(!title) return;
    await API.post("/tickets",{ title });
    setTitle("");
    load();
  };

  const closeTicket = async (id)=>{
    await API.put(`/tickets/${id}/close`);
    load();
  };

  const exportExcel = ()=>{
    const ws = XLSX.utils.json_to_sheet(tickets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");

    const file = XLSX.write(wb,{ bookType:"xlsx", type:"array" });
    saveAs(new Blob([file]), "tickets.xlsx");
  };

  return (
    <div>

      <h2 style={{color:"#fff"}}>Gestión de Tickets</h2>

      <div style={{marginBottom:20}}>
        <input
          placeholder="Título"
          value={title}
          onChange={e=>setTitle(e.target.value)}
        />

        <button onClick={create}>Crear</button>
        <button onClick={exportExcel}>Exportar Excel</button>
      </div>

      <table style={{width:"100%", color:"#fff"}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {tickets.map(t=>(
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.title}</td>
              <td>{t.status}</td>
              <td>
                {t.status !== "cerrado" && (
                  <button onClick={()=>closeTicket(t.id)}>
                    Cerrar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}