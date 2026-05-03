import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ticket-service-bo5t.onrender.com";

export default function Tickets(){

  const [tickets,setTickets] = useState([]);
  const [view,setView] = useState("list");

  const [form,setForm] = useState({
    titulo:"",
    descripcion:"",
    tecnico:"",
    estado:"Abierto"
  });

  useEffect(()=>{ cargar(); },[]);

  const cargar = async ()=>{
    const res = await axios.get(API + "/tickets");
    setTickets(res.data);
  };

  const crear = async ()=>{
    await axios.post(API + "/tickets", form);
    setForm({titulo:"",descripcion:"",tecnico:"",estado:"Abierto"});
    setView("list");
    cargar();
  };

  const cambiarEstado = async (id, estado)=>{
    await axios.put(API + "/tickets/" + id, { estado });
    cargar();
  };

  const getColor = (estado)=>{
    if(estado==="Abierto") return "#22c55e";
    if(estado==="En proceso") return "#f59e0b";
    return "#ef4444";
  };

  const exportar = ()=> window.open(API + "/tickets/export");

  const importar = async (e)=>{
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    await axios.post(API + "/tickets/import", formData);
    cargar();
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

        <button style={menuBtn} onClick={()=>setView("list")}>📋 Tickets</button>
        <button style={menuBtn} onClick={()=>setView("create")}>➕ Crear</button>
        <button style={menuBtn} onClick={exportar}>📤 Exportar</button>

        <label style={menuBtn}>
          📥 Importar
          <input type="file" hidden onChange={importar}/>
        </label>

        <button style={logoutBtn} onClick={logout}>Salir</button>
      </div>

      {/* CONTENIDO */}
      <div style={content}>

        {view === "list" && (
          <>
            <h2>Tickets</h2>

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
                        background:getColor(t.estado),
                        padding:"5px 10px",
                        borderRadius:"6px",
                        color:"#fff"
                      }}>
                        {t.estado}
                      </span>
                    </td>

                    <td>
                      {t.estado !== "Cerrado" ? (
                        <button
                          style={cerrarBtn}
                          onClick={()=>cambiarEstado(t.id,"Cerrado")}
                        >
                          Cerrar
                        </button>
                      ) : (
                        <button
                          style={reabrirBtn}
                          onClick={()=>cambiarEstado(t.id,"Abierto")}
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
              <input placeholder="Título" value={form.titulo}
                onChange={e=>setForm({...form,titulo:e.target.value})} style={input}/>

              <textarea placeholder="Descripción"
                value={form.descripcion}
                onChange={e=>setForm({...form,descripcion:e.target.value})}
                style={{...input,height:"100px"}}/>

              <input placeholder="Técnico"
                value={form.tecnico}
                onChange={e=>setForm({...form,tecnico:e.target.value})}
                style={input}/>

              <button style={btn} onClick={crear}>Guardar</button>
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
  width:"230px",
  background:"#020617",
  color:"#fff",
  padding:"20px",
  display:"flex",
  flexDirection:"column",
  gap:"10px"
};

const logo = {
  background:"linear-gradient(90deg,#ef4444,#22c55e,#3b82f6)",
  WebkitBackgroundClip:"text",
  WebkitTextFillColor:"transparent"
};

const menuBtn = {
  padding:"10px",
  borderRadius:"8px",
  background:"#1e293b",
  color:"#fff",
  border:"none",
  cursor:"pointer"
};

const logoutBtn = {
  marginTop:"auto",
  background:"#ef4444",
  color:"#fff",
  padding:"10px",
  border:"none",
  borderRadius:"8px"
};

const content = {
  flex:1,
  padding:"20px",
  background:"#0f172a",
  color:"#fff"
};

const table = {
  width:"100%",
  borderCollapse:"collapse"
};

const cerrarBtn = {
  background:"#ef4444",
  color:"#fff",
  border:"none",
  padding:"6px 10px",
  borderRadius:"6px",
  cursor:"pointer"
};

const reabrirBtn = {
  background:"#22c55e",
  color:"#fff",
  border:"none",
  padding:"6px 10px",
  borderRadius:"6px",
  cursor:"pointer"
};

const formBox = { display:"flex", flexDirection:"column", gap:"10px" };

const input = {
  padding:"10px",
  borderRadius:"8px",
  border:"none"
};

const btn = {
  background:"linear-gradient(90deg,#ef4444,#22c55e,#3b82f6)",
  color:"#fff",
  padding:"10px",
  border:"none",
  borderRadius:"8px"
};