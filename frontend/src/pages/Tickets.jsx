import { useEffect, useState } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Tickets(){

  const [tickets,setTickets] = useState([]);
  const [form,setForm] = useState({
    title:"",
    description:"",
    priority:"media"
  });

  const load = async ()=>{
    const res = await API.get("/tickets");
    setTickets(res.data);
  };

  useEffect(()=>{ load(); },[]);

  const create = async ()=>{
    await API.post("/tickets",form);
    setForm({title:"",description:"",priority:"media"});
    load();
  };

  const changeStatus = async (id,status)=>{
    await API.put(`/tickets/${id}/status`,{status});
    load();
  };

  /* ===== EXPORTAR EXCEL PRO ===== */
  const exportExcel = ()=>{
    const data = tickets.map(t=>({
      ID:t.id,
      Titulo:t.title,
      Estado:t.status,
      Prioridad:t.priority
    }));

    const ws = XLSX.utils.json_to_sheet(data);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");

    const file = XLSX.write(wb,{bookType:"xlsx",type:"array"});
    saveAs(new Blob([file]),"tickets_pro.xlsx");
  };

  /* ===== CARGA MASIVA ===== */
  const uploadExcel = async (e)=>{
    const file = e.target.files[0];
    const data = await file.arrayBuffer();

    const wb = XLSX.read(data);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    for(const r of rows){
      await API.post("/tickets",{
        title:r.title,
        description:r.description,
        priority:r.priority
      });
    }

    alert("Carga masiva completada");
    load();
  };

  return (
    <div style={{color:"#fff"}}>

      <h2>Gestión Profesional de Tickets</h2>

      <div style={card}>
        <input placeholder="Título"
          value={form.title}
          onChange={e=>setForm({...form,title:e.target.value})}/>

        <textarea placeholder="Descripción"
          value={form.description}
          onChange={e=>setForm({...form,description:e.target.value})}/>

        <select value={form.priority}
          onChange={e=>setForm({...form,priority:e.target.value})}>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>

        <button style={btnPrimary} onClick={create}>
          Crear Ticket
        </button>

        <button style={btnSecondary} onClick={exportExcel}>
          Exportar Excel
        </button>

        <label style={btnUpload}>
          Cargar Excel
          <input type="file" hidden onChange={uploadExcel}/>
        </label>
      </div>

      <table style={table}>
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

              <td>
                <span style={status(t.status)}>
                  {t.status}
                </span>
              </td>

              <td>
                <span style={priority(t.priority)}>
                  {t.priority}
                </span>
              </td>

              <td>
                <button onClick={()=>changeStatus(t.id,"cerrado")}>
                  Cerrar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

/* ===== ESTILO EMPRESA ===== */

const card = {background:"#111827",padding:20,marginBottom:20};
const table = {width:"100%",background:"#020617"};

const btnPrimary = {background:"#2563eb",color:"#fff",padding:10,borderRadius:6};
const btnSecondary = {background:"#16a34a",color:"#fff",padding:10,borderRadius:6};
const btnUpload = {background:"#9333ea",color:"#fff",padding:10,borderRadius:6,cursor:"pointer"};

const status = s => ({
  background: s==="cerrado" ? "#16a34a" : "#f59e0b",
  padding:"4px 8px",
  borderRadius:6
});

const priority = p => ({
  background:
    p==="alta" ? "#dc2626" :
    p==="media" ? "#f59e0b" : "#22c55e",
  padding:"4px 8px",
  borderRadius:6
});