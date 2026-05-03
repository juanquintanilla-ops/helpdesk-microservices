import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ticket-service-bo5t.onrender.com";

export default function Tickets(){

  const [tickets,setTickets] = useState([]);
  const [view,setView] = useState("list");

  const [form,setForm] = useState({
    titulo:"",
    descripcion:"",
    tecnico:""
  });

  useEffect(()=>{ cargar(); },[]);

  const cargar = async ()=>{
    const res = await axios.get(API + "/tickets");
    setTickets(res.data);
  };

  const crear = async ()=>{
    await axios.post(API + "/tickets", {
      ...form,
      estado:"abierto"
    });
    setForm({titulo:"",descripcion:"",tecnico:""});
    setView("list");
    cargar();
  };

  const cambiarEstado = async (id, estado)=>{
    await axios.put(API + "/tickets/" + id, { estado });
    cargar();
  };

  /* ===== EXPORTAR ===== */
  const exportar = ()=>{
    window.open(API + "/tickets/export");
  };

  /* ===== IMPORTAR ===== */
  const importar = async (e)=>{
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    await axios.post(API + "/tickets/import", formData);
    cargar();
  };

  const estadoColor = (estado)=>{
    const e = estado.toLowerCase();
    if(e==="abierto") return "#22c55e";
    if(e==="en proceso") return "#f59e0b";
    return "#ef4444";
  };

  const logout = ()=>{
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div style={layout}>

      {/* SIDEBAR */}
      <div style={sidebar}>
        <h2 style={logo}>Nexus Pro</h2>

        <button style={menuBtn} onClick={()=>setView("list")}>
          📋 Tickets
        </button>

        <button style={menuBtn} onClick={()=>setView("create")}>
          ➕ Crear Ticket
        </button>

        <button style={logoutBtn} onClick={logout}>
          Salir
        </button>
      </div>

      {/* CONTENIDO */}
      <div style={content}>

        {view === "list" && (
          <>
            <h2>Gestión de Tickets</h2>

            {/* 🔴 ACCIONES */}
            <div style={{marginBottom:"15px", display:"flex", gap:"10px"}}>
              <button style={exportBtn} onClick={exportar}>
                Exportar Excel
              </button>

              <label style={importBtn}>
                Importar Excel
                <input type="file" onChange={importar} hidden />
              </label>
            </div>

            <table style={table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Descripción</th>
                  <th>Técnico</th>
                  <th>Estado</th>
                  <th>Acción</th>
                </tr>
              </thead>

              <tbody>
                {tickets.map(t=>(
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.titulo}</td>
                    <td>{t.descripcion}</td>
                    <td>{t.tecnico}</td>

                    <td>
                      <span style={{
                        background:estadoColor(t.estado),
                        padding:"6px 12px",
                        borderRadius:"20px",
                        color:"#fff",
                        fontSize:"12px"
                      }}>
                        {t.estado}
                      </span>
                    </td>

                    <td>
                      {t.estado.toLowerCase() !== "cerrado" ? (
                        <button
                          style={cerrarBtn}
                          onClick={()=>cambiarEstado(t.id,"cerrado")}
                        >
                          Cerrar
                        </button>
                      ) : (
                        <button
                          style={reabrirBtn}
                          onClick={()=>cambiarEstado(t.id,"abierto")}
                        >
                          Reabrir
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {view === "create" && (
          <>
            <h2>Nuevo Ticket</h2>

            <div style={formBox}>
              <input
                placeholder="Título"
                value={form.titulo}
                onChange={e=>setForm({...form,titulo:e.target.value})}
                style={input}
              />

              <textarea
                placeholder="Descripción"
                value={form.descripcion}
                onChange={e=>setForm({...form,descripcion:e.target.value})}
                style={{...input, height:"100px"}}
              />

              <input
                placeholder="Técnico"
                value={form.tecnico}
                onChange={e=>setForm({...form,tecnico:e.target.value})}
                style={input}
              />

              <button style={guardarBtn} onClick={crear}>
                Guardar Ticket
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

/* ===== ESTILOS ===== */

const layout = { display:"flex", height:"100vh" };

const sidebar = {
  width:"240px",
  background:"#020617",
  padding:"20px",
  display:"flex",
  flexDirection:"column",
  gap:"15px",
  color:"#fff"
};

const logo = {
  fontSize:"22px",
  fontWeight:"bold",
  background:"linear-gradient(90deg,#ef4444,#22c55e,#3b82f6)",
  WebkitBackgroundClip:"text",
  WebkitTextFillColor:"transparent"
};

const menuBtn = {
  padding:"12px",
  borderRadius:"10px",
  border:"none",
  background:"#1e293b",
  color:"#fff",
  cursor:"pointer"
};

const logoutBtn = {
  marginTop:"auto",
  padding:"12px",
  background:"#ef4444",
  border:"none",
  borderRadius:"10px",
  color:"#fff",
  cursor:"pointer"
};

const content = {
  flex:1,
  padding:"25px",
  background:"#0f172a",
  color:"#fff"
};

const table = { width:"100%", borderCollapse:"collapse" };

const cerrarBtn = {
  background:"#ef4444",
  color:"#fff",
  padding:"6px 12px",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
};

const reabrirBtn = {
  background:"#22c55e",
  color:"#fff",
  padding:"6px 12px",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
};

const formBox = {
  display:"flex",
  flexDirection:"column",
  gap:"10px",
  maxWidth:"400px"
};

const input = {
  padding:"10px",
  borderRadius:"8px",
  border:"none"
};

const guardarBtn = {
  background:"linear-gradient(90deg,#ef4444,#22c55e,#3b82f6)",
  color:"#fff",
  padding:"10px",
  border:"none",
  borderRadius:"10px",
  cursor:"pointer"
};

const exportBtn = {
  background:"#3b82f6",
  color:"#fff",
  padding:"8px 12px",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
};

const importBtn = {
  background:"#22c55e",
  color:"#fff",
  padding:"8px 12px",
  borderRadius:"8px",
  cursor:"pointer"
};