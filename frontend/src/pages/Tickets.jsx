import { useEffect, useState } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Tickets(){

  const [tickets,setTickets] = useState([]);
  const [title,setTitle] = useState("");
  const [priority,setPriority] = useState("media");

  const load = async ()=>{
    const res = await API.get("/tickets");
    setTickets(res.data);
  };

  useEffect(()=>{ load(); },[]);

  const create = async ()=>{
    if(!title) return alert("Escribe un título");

    await API.post("/tickets",{
      title,
      priority
    });

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
    <div style={{padding:20,background:"#0f172a",color:"#fff",minHeight:"100vh"}}>
      <h1>Gestión de Tickets</h1>

      <div style={{marginBottom:20}}>
        <input
          placeholder="Título"
          value={title}
          onChange={e=>setTitle(e.target.value)}
          style={{padding:8,marginRight:10}}
        />

        <select
          value={priority}
          onChange={e=>setPriority(e.target.value)}
        >
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>

        <button onClick={create} style={{marginLeft:10}}>
          Crear
        </button>

        <button onClick={exportExcel} style={{marginLeft:10}}>
          Excel
        </button>
      </div>

      <table style={{width:"100%",background:"#1e293b"}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {tickets.map(t=>(
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.title}</td>
              <td>{t.status}</td>
              <td>{t.priority}</td>
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