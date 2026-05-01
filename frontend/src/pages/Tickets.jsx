import { useEffect, useState } from "react";
import API from "../services/api";

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
    await API.post("/tickets",{ title, priority });
    setTitle("");
    load();
  };

  const closeTicket = async (id)=>{
    await API.put(`/tickets/${id}/close`);
    load();
  };

  return (
    <div>

      <h2>Gestión de Tickets</h2>

      {/* CREAR */}
      <div style={card}>
        <input placeholder="Título" value={title}
          onChange={e=>setTitle(e.target.value)} />

        <select value={priority} onChange={e=>setPriority(e.target.value)}>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>

        <button onClick={create}>Crear Ticket</button>
      </div>

      {/* TABLA */}
      <table style={table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map(t=>(
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.title}</td>

              <td>
                <span style={badgeStatus(t.status)}>
                  {t.status}
                </span>
              </td>

              <td>
                <span style={badgePriority(t.priority)}>
                  {t.priority}
                </span>
              </td>

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

/* ===== STYLES ===== */

const card = {
  background:"#020617",
  padding:15,
  marginBottom:20,
  display:"flex",
  gap:10
};

const table = {
  width:"100%",
  background:"#020617"
};

const badgeStatus = (s)=>({
  padding:"4px 8px",
  borderRadius:6,
  background:
    s==="cerrado" ? "#16a34a" :
    s==="abierto" ? "#f59e0b" : "#3b82f6"
});

const badgePriority = (p)=>({
  padding:"4px 8px",
  borderRadius:6,
  background:
    p==="alta" ? "#dc2626" :
    p==="media" ? "#f59e0b" : "#22c55e"
});