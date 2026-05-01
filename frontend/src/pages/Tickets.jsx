import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TECNICOS = ["Juan","Ana","Carlos","Sofia"];

export default function Tickets(){

  const [tickets,setTickets] = useState([]);
  const [loading,setLoading] = useState(false);

  const [form,setForm] = useState({
    title:"",
    description:"",
    priority:"media",
    technician:"",
    comments:""
  });

  const [filters,setFilters] = useState({
    q:"",
    status:"todos",
    priority:"todos",
    technician:"todos"
  });

  /* ================= LOAD ================= */
  const load = async ()=>{
    setLoading(true);
    try{
      const res = await API.get("/tickets");
      setTickets(res.data || []);
    }catch(e){
      console.log(e);
      alert("Error cargando tickets");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ load(); },[]);

  /* ================= CREATE ================= */
  const create = async ()=>{
    if(!form.title.trim()) return alert("Título requerido");

    try{
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

      await load();
    }catch(e){
      console.log(e);
      alert("Error creando ticket");
    }
  };

  /* ================= STATUS ================= */
  const changeStatus = async (id, status)=>{
    try{
      await API.put(`/tickets/${id}/status`,{status});
      await load();
    }catch(e){
      console.log(e);
      alert("Error cambiando estado");
    }
  };

  /* ================= EXPORT ================= */
  const exportExcel = ()=>{
    if(!tickets.length) return alert("No hay datos");

    const ws = XLSX.utils.json_to_sheet(tickets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");

    const file = XLSX.write(wb,{bookType:"xlsx",type:"array"});
    saveAs(new Blob([file]),"tickets.xlsx");
  };

  /* ================= IMPORT ================= */
  const uploadExcel = async (e)=>{
    const file = e.target.files[0];
    if(!file) return;

    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

    for(const r of rows){
      await API.post("/tickets",{
        ...r,
        status:"abierto"
      });
    }

    await load();
  };

  /* ================= FILTER ================= */
  const filtered = useMemo(()=>{
    return tickets.filter(t=>{
      const q = filters.q.toLowerCase();

      return (
        (t.title?.toLowerCase().includes(q) ||
         t.description?.toLowerCase().includes(q)) &&

        (filters.status==="todos" || t.status===filters.status) &&
        (filters.priority==="todos" || t.priority===filters.priority) &&
        (filters.technician==="todos" || t.technician===filters.technician)
      );
    });
  },[tickets,filters]);

  return (
    <div style={container}>

      <h2 style={title}>Gestión Profesional de Tickets</h2>

      {/* ================= CREAR ================= */}
      <div style={card}>
        <div style={cardHeader}>Nuevo Ticket</div>

        <div style={grid}>
          <input style={input} placeholder="Título"
            value={form.title}
            onChange={e=>setForm({...form,title:e.target.value})}/>

          <select style={input}
            value={form.priority}
            onChange={e=>setForm({...form,priority:e.target.value})}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>

          <select style={input}
            value={form.technician}
            onChange={e=>setForm({...form,technician:e.target.value})}>
            <option value="">Sin técnico</option>
            {TECNICOS.map(t=><option key={t}>{t}</option>)}
          </select>

          <textarea style={textarea} placeholder="Descripción"
            value={form.description}
            onChange={e=>setForm({...form,description:e.target.value})}/>

          <textarea style={textarea} placeholder="Comentario / solución"
            value={form.comments}
            onChange={e=>setForm({...form,comments:e.target.value})}/>
        </div>

        <div style={actions}>
          <button style={btnPrimary} onClick={create}>Crear</button>
          <button style={btnSuccess} onClick={exportExcel}>Exportar Excel</button>

          <label style={btnPurple}>
            Importar Excel
            <input type="file" hidden onChange={uploadExcel}/>
          </label>
        </div>
      </div>

      {/* ================= FILTROS ================= */}
      <div style={card}>
        <div style={cardHeader}>Filtros</div>

        <div style={gridFilters}>
          <input style={input} placeholder="Buscar..."
            onChange={e=>setFilters({...filters,q:e.target.value})}/>

          <select style={input}
            onChange={e=>setFilters({...filters,status:e.target.value})}>
            <option value="todos">Estado</option>
            <option value="abierto">Abierto</option>
            <option value="cerrado">Cerrado</option>
          </select>

          <select style={input}
            onChange={e=>setFilters({...filters,priority:e.target.value})}>
            <option value="todos">Prioridad</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>

          <select style={input}
            onChange={e=>setFilters({...filters,technician:e.target.value})}>
            <option value="todos">Técnico</option>
            {TECNICOS.map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      {/* ================= TABLA ================= */}
      <div style={card}>
        <div style={cardHeader}>Tickets ({filtered.length})</div>

        {loading ? <p style={{padding:20}}>Cargando...</p> : (
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
              {filtered.map(t=>(
                <tr key={t.id} style={row}>
                  <td>{t.id}</td>
                  <td>{t.title}</td>
                  <td>{t.technician || "—"}</td>

                  <td><span style={status(t.status)}>{t.status}</span></td>
                  <td><span style={priority(t.priority)}>{t.priority}</span></td>

                  <td style={{display:"flex",gap:6}}>
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
        )}
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
  marginBottom:20
};

const cardHeader = {
  padding:15,
  borderBottom:"1px solid #1f2937",
  fontWeight:"bold"
};

const grid = {
  display:"grid",
  gridTemplateColumns:"1fr 1fr",
  gap:15,
  padding:20
};

const gridFilters = {
  display:"grid",
  gridTemplateColumns:"repeat(4,1fr)",
  gap:10,
  padding:20
};

const input = {
  padding:10,
  borderRadius:8,
  background:"#020617",
  color:"#fff",
  border:"1px solid #1f2937"
};

const textarea = {...input,minHeight:70,gridColumn:"1 / 3"};

const actions = {display:"flex",gap:10,padding:20};

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