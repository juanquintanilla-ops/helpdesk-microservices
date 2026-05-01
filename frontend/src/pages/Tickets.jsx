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
    if(!form.title) return alert("Falta título");

    await API.post("/tickets",form);
    setForm({title:"",description:"",priority:"media"});
    load();
  };

  const closeTicket = async (id)=>{
    await API.put(`/tickets/${id}/status`,{status:"cerrado"});
    load();
  };

  const exportExcel = ()=>{
    const ws = XLSX.utils.json_to_sheet(tickets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");

    const file = XLSX.write(wb,{bookType:"xlsx",type:"array"});
    saveAs(new Blob([file]),"tickets.xlsx");
  };

  const uploadExcel = async (e)=>{
    const file = e.target.files[0];
    const data = await file.arrayBuffer();

    const wb = XLSX.read(data);
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

    for(const r of rows){
      await API.post("/tickets",r);
    }

    load();
  };

  return (
    <div style={container}>

      <h2 style={title}>Gestión de Tickets</h2>

      {/* ================= FORM ================= */}
      <div style={card}>

        <div style={cardHeader}>
          <span>Crear Ticket</span>
        </div>

        <div style={formGrid}>

          <div>
            <label style={label}>Título</label>
            <input
              style={input}
              value={form.title}
              onChange={e=>setForm({...form,title:e.target.value})}
            />
          </div>

          <div>
            <label style={label}>Prioridad</label>
            <select
              style={input}
              value={form.priority}
              onChange={e=>setForm({...form,priority:e.target.value})}
            >
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div style={{gridColumn:"1 / 3"}}>
            <label style={label}>Descripción</label>
            <textarea
              style={textarea}
              value={form.description}
              onChange={e=>setForm({...form,description:e.target.value})}
            />
          </div>

        </div>

        <div style={actions}>
          <button style={btnPrimary} onClick={create}>
            Crear
          </button>

          <button style={btnSuccess} onClick={exportExcel}>
            Exportar
          </button>

          <label style={btnPurple}>
            Importar
            <input type="file" hidden onChange={uploadExcel}/>
          </label>
        </div>

      </div>

      {/* ================= TABLA ================= */}
      <div style={card}>

        <div style={cardHeader}>
          <span>Tickets</span>
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
              <tr key={t.id} style={row}>
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
                  <button style={btnDanger}
                    onClick={()=>closeTicket(t.id)}>
                    Cerrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

/* ================= DISEÑO PRO ================= */

const container = {
  color:"#e5e7eb"
};

const title = {
  marginBottom:20
};

const card = {
  background:"#111827",
  border:"1px solid #1f2937",
  borderRadius:12,
  marginBottom:25,
  overflow:"hidden"
};

const cardHeader = {
  padding:15,
  borderBottom:"1px solid #1f2937",
  background:"#020617",
  fontWeight:"bold"
};

const formGrid = {
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:20,
  padding:20
};

const label = {
  display:"block",
  marginBottom:5,
  color:"#9ca3af"
};

const input = {
  width:"100%",
  padding:10,
  borderRadius:8,
  border:"1px solid #1f2937",
  background:"#020617",
  color:"#fff"
};

const textarea = {
  ...input,
  minHeight:100
};

const actions = {
  padding:20,
  display:"flex",
  gap:10
};

const table = {
  width:"100%",
  borderCollapse:"collapse"
};

const row = {
  borderTop:"1px solid #1f2937"
};

const btnPrimary = {
  background:"#2563eb",
  color:"#fff",
  padding:"10px 16px",
  borderRadius:8,
  border:"none"
};

const btnSuccess = {
  background:"#16a34a",
  color:"#fff",
  padding:"10px 16px",
  borderRadius:8,
  border:"none"
};

const btnPurple = {
  background:"#9333ea",
  color:"#fff",
  padding:"10px 16px",
  borderRadius:8,
  cursor:"pointer"
};

const btnDanger = {
  background:"#dc2626",
  color:"#fff",
  padding:"6px 12px",
  borderRadius:6,
  border:"none"
};

const status = s => ({
  background: s==="cerrado" ? "#16a34a" : "#f59e0b",
  padding:"4px 10px",
  borderRadius:20
});

const priority = p => ({
  background:
    p==="alta" ? "#dc2626" :
    p==="media" ? "#f59e0b" : "#22c55e",
  padding:"4px 10px",
  borderRadius:20
});