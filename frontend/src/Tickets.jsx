import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ticket-service-bo5t.onrender.com";

export default function Tickets(){

  const [tickets,setTickets] = useState([]);
  const [view,setView] = useState("list");
  const [loading,setLoading] = useState(true);

  const [form,setForm] = useState({
    titulo:"",
    tecnico:"",
    estado:"Abierto"
  });

  useEffect(()=>{
    cargar();
  },[]);

  const cargar = async ()=>{
    try{
      const res = await axios.get(API + "/tickets");
      setTickets(res.data);
    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  const crear = async ()=>{
    try{
      await axios.post(API + "/tickets", form);
      setForm({titulo:"", tecnico:"", estado:"Abierto"});
      setView("list");
      cargar();
    }catch(err){
      console.error(err);
    }
  };

  const exportar = ()=>{
    window.open(API + "/tickets/export");
  };

  const importar = async (e)=>{
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append("file", file);

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

        <button style={menuBtn} onClick={()=>setView("list")}>
          📋 Tickets
        </button>

        <button style={menuBtn} onClick={()=>setView("create")}>
          ➕ Crear Ticket
        </button>

        <button style={menuBtn} onClick={exportar}>
          📤 Exportar Excel
        </button>

        <label style={menuBtn}>
          📥 Importar Excel
          <input type="file" hidden onChange={importar}/>
        </label>

        <button style={logoutBtn} onClick={logout}>
          🚪 Cerrar sesión
        </button>
      </div>

      {/* CONTENT */}
      <div style={content}>

        {view === "list" && (
          <>
            <h2>Listado de Tickets</h2>

            {loading ? <p>Cargando...</p> : (
              <table style={table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Técnico</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {tickets.map(t=>(
                    <tr key={t.id}>
                      <td>{t.id}</td>
                      <td>{t.titulo}</td>
                      <td>{t.tecnico}</td>
                      <td>{t.estado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {view === "create" && (
          <>
            <h2>Crear Ticket</h2>

            <div style={formBox}>

              <input
                placeholder="Título"
                value={form.titulo}
                onChange={e=>setForm({...form, titulo:e.target.value})}
                style={input}
              />

              <input
                placeholder="Técnico"
                value={form.tecnico}
                onChange={e=>setForm({...form, tecnico:e.target.value})}
                style={input}
              />

              <select
                value={form.estado}
                onChange={e=>setForm({...form, estado:e.target.value})}
                style={input}
              >
                <option>Abierto</option>
                <option>En proceso</option>
                <option>Cerrado</option>
              </select>

              <button style={btn} onClick={crear}>
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

const layout = {
  display:"flex",
  height:"100vh",
  fontFamily:"Arial"
};

const sidebar = {
  width:"240px",
  background:"#020617",
  color:"#fff",
  display:"flex",
  flexDirection:"column",
  padding:"20px",
  gap:"10px"
};

const logo = {
  background:"linear-gradient(90deg,#ef4444,#22c55e,#3b82f6)",
  WebkitBackgroundClip:"text",
  WebkitTextFillColor:"transparent"
};

const menuBtn = {
  padding:"10px",
  border:"none",
  borderRadius:"8px",
  background:"#1e293b",
  color:"#fff",
  cursor:"pointer",
  textAlign:"left"
};

const logoutBtn = {
  marginTop:"auto",
  padding:"10px",
  border:"none",
  borderRadius:"8px",
  background:"#ef4444",
  color:"#fff",
  cursor:"pointer"
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

const btn = {
  padding:"10px",
  border:"none",
  borderRadius:"8px",
  background:"linear-gradient(90deg,#ef4444,#22c55e,#3b82f6)",
  color:"#fff",
  cursor:"pointer"
};