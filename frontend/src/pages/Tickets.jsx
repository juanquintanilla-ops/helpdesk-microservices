import { useEffect, useState } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TECNICOS = ["Juan","Ana","Carlos","Sofia"];

export default function Tickets(){

  const [tickets,setTickets] = useState([]);

  const [form,setForm] = useState({
    title:"",
    description:"",
    priority:"media",
    technician:"",
    comments:""
  });

  const load = async ()=>{
    const res = await API.get("/tickets");
    setTickets(res.data);
  };

  useEffect(()=>{ load(); },[]);

  /* ================= CREAR ================= */
  const create = async ()=>{
    if(!form.title) return alert("Falta título");

    await API.post("/tickets",{
      ...form,
      status:"abierto"
    });

    setForm({
      title:"",
      description:"",
      priority:"media",
      technician:"",
      comments:""
    });

    load();
  };

  /* ================= CAMBIAR ESTADO ================= */
  const changeStatus = async (id, status)=>{
    await API.put(`/tickets/${id}/status`,{status});
    load();
  };

  /* ================= EXPORTAR ================= */
  const exportExcel = ()=>{
    const ws = XLSX.utils.json_to_sheet(tickets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");

    const file = XLSX.write(wb,{bookType:"xlsx",type:"array"});
    saveAs(new Blob([file]),"tickets.xlsx");
  };

  /* ================= IMPORTAR ================= */
  const uploadExcel = async (e)=>{
    const file = e.target.files[0];
    const data = await file.arrayBuffer();

    const wb = XLSX.read(data);
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

    for(const r of rows){
      await API.post("/tickets",{
        ...r,
        status:"abierto"
      });
    }

    load();
  };

  return (
    <div style={container}>

      <h2 style={title}>Gestión de Tickets</h2>

      {/* ================= FORM ================= */}
      <div style={card}>

        <div style={cardHeader}>Crear Ticket</div>

        <div style={grid}>

          <div>
            <label style={label}>Título</label>
            <input style={input}
              value={form.title}
              onChange={e=>setForm({...form,title:e.target.value})}/>
          </div>

          <div>
            <label style={label}>Prioridad</label>
            <select style={input}
              value={form.priority}
              onChange={e=>setForm({...form,priority:e.target.value})}>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div>
            <label style={label}>Asignar Técnico</label>
            <select style={input}
              value={form.technician}
              onChange={e=>setForm({...form,technician:e.target.value})}>
              <option value="">Sin asignar</option>
              {TECNICOS.map(t=>(
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>

          <div style={{gridColumn:"1 / 3"}}>
            <label style={label}>Descripción</label>
            <textarea style={textarea}
              value={form.description}
              onChange={e=>setForm({...form,description:e.target.value})}/>
          </div>

          <div style={{gridColumn:"1 / 3"}}>
            <label style={label}>Comentario / Solución</label>
            <textarea style={textarea}
              value={form.comments}
              onChange={e=>setForm({...form,comments:e.target.value})}/>
          </div>

        </div>

        <div style={actions}>
          <button style={btnPrimary} onClick={create}>Crear</button>
          <button style={btnSuccess} onClick={exportExcel}>Exportar</button>

          <label style={btnPurple}>
            Importar
            <input type="file" hidden onChange={uploadExcel}/>
          </label>
        </div>

      </div>

      {/* ================= TABLA ================= */}
      <div style={card}>

        <div style={cardHeader}>Tickets</div>

        <table style={table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Técnico</th>
              <th>Estado</th>
              <th>Prioridad</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map(t=>(
              <tr key={t.id} style={row}>

                <td>{t.id}</td>
                <td>{t.title}</td>
                <td>{t.technician || "—"}</td>

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

                <td style={{display:"flex",gap:5}}>

                  {t.status !== "cerrado" && (
                    <button style={btnDanger}
                      onClick={()=>changeStatus(t.id,"cerrado")}>
                      Cerrar
                    </button>
                  )}

                  {t.status === "cerrado" && (
                    <button style={btnWarning}
                      onClick={()=>changeStatus(t.id,"abierto")}>
                      Reabrir
                    </button>
                  )}

                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

/* ================= UI ================= */

const container = {color:"#e5e7eb"};
const title = {marginBottom:20};

const card = {
  background:"#111827",
  border:"1px solid #1f2937",
  borderRadius:12,
  marginBottom:25,
  overflow:"hidden"
};

const cardHeader = {
  padding:15,
  background:"#020617",
  borderBottom:"1px solid #1f2937",
  fontWeight:"bold"
};

const grid = {
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:20,
  padding:20
};

const label = {marginBottom:5,color:"#9ca3af",display:"block"};

const input = {
  width:"100%",
  padding:10,
  borderRadius:8,
  background:"#020617",
  color:"#fff",
  border:"1px solid #1f2937"
};

const textarea = {...input,minHeight:90};

const actions = {padding:20,display:"flex",gap:10};

const table = {width:"100%",borderCollapse:"collapse"};

const row = {borderTop:"1px solid #1f2937"};

const btnPrimary = {background:"#2563eb",color:"#fff",padding:"10px 16px",borderRadius:8};
const btnSuccess = {background:"#16a34a",color:"#fff",padding:"10px 16px",borderRadius:8};
const btnPurple = {background:"#9333ea",color:"#fff",padding:"10px 16px",borderRadius:8,cursor:"pointer"};
const btnDanger = {background:"#dc2626",color:"#fff",padding:"6px 10px",borderRadius:6};
const btnWarning = {background:"#f59e0b",color:"#000",padding:"6px 10px",borderRadius:6};

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