import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ticket-service-bo5t.onrender.com";
const BI_API = "https://bi-service-h7ei.onrender.com";

const TECNICOS = ["Juan Pérez", "Ana Gómez", "Carlos Ruiz", "Laura Díaz"];

export default function Tickets(){

  const [tickets,setTickets] = useState([]);
  const [view,setView] = useState("list");
  const [bi,setBi] = useState(null);

  const [form,setForm] = useState({
    titulo:"",
    descripcion:"",
    tecnico: TECNICOS[0]
  });

  useEffect(()=>{ cargar(); },[]);

  const cargar = async ()=>{
    const res = await axios.get(API + "/tickets");
    setTickets(res.data);
  };

  const cargarBI = async ()=>{
    const res = await axios.get(BI_API + "/bi/prediccion");
    setBi(res.data);
  };

  const crear = async ()=>{
    await axios.post(API + "/tickets", {
      ...form,
      estado:"abierto"
    });
    setForm({titulo:"",descripcion:"",tecnico:TECNICOS[0]});
    setView("list");
    cargar();
  };

  const cambiarEstado = async (id, estado)=>{
    await axios.put(API + "/tickets/" + id, { estado });
    cargar();
  };

  const exportar = ()=> window.open(API + "/tickets/export");

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

        <button style={menuBtn} onClick={()=>{setView("bi"); cargarBI();}}>
          📊 BI
        </button>

        <button style={logoutBtn} onClick={logout}>
          Salir
        </button>
      </div>

      {/* CONTENIDO */}
      <div style={content}>

        {/* ===== TICKETS ===== */}
        {view === "list" && (
          <>
            <h2>Gestión de Tickets</h2>

            <div style={{marginBottom:"15px", display:"flex", gap:"10px"}}>
              <button style={exportBtn} onClick={exportar}>Exportar Excel</button>

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
                        color:"#fff"
                      }}>
                        {t.estado}
                      </span>
                    </td>

                    <td>
                      {t.estado.toLowerCase() !== "cerrado" ? (
                        <button style={cerrarBtn}
                          onClick={()=>cambiarEstado(t.id,"cerrado")}>
                          Cerrar
                        </button>
                      ) : (
                        <button style={reabrirBtn}
                          onClick={()=>cambiarEstado(t.id,"abierto")}>
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

        {/* ===== CREAR ===== */}
        {view === "create" && (
          <>
            <h2>Nuevo Ticket</h2>

            <div style={formBox}>
              <input placeholder="Título"
                value={form.titulo}
                onChange={e=>setForm({...form,titulo:e.target.value})}
                style={input}/>

              <textarea placeholder="Descripción"
                value={form.descripcion}
                onChange={e=>setForm({...form,descripcion:e.target.value})}
                style={{...input,height:"100px"}}/>

              <select value={form.tecnico}
                onChange={e=>setForm({...form,tecnico:e.target.value})}
                style={input}>
                {TECNICOS.map(t=><option key={t}>{t}</option>)}
              </select>

              <button style={guardarBtn} onClick={crear}>
                Guardar Ticket
              </button>
            </div>
          </>
        )}

        {/* ===== BI ===== */}
        {view === "bi" && bi && (
          <>
            <h2>Business Intelligence</h2>

            {/* ETL visible */}
            <div style={etlBox}>
              <p><b>Extract:</b> Datos de tickets</p>
              <p><b>Transform:</b> Agrupación por tipo de falla</p>
              <p><b>Load:</b> Modelo predictivo simple</p>
            </div>

            <h3>Predicción próxima falla:</h3>
            <h1 style={{color:"#3b82f6"}}>
              {bi.prediccion}
            </h1>

            {/* GRÁFICO */}
            <div style={chart}>
              {bi.distribucion.map((d,i)=>(
                <div key={i} style={{textAlign:"center"}}>
                  <div style={{
                    height: d.total * 20,
                    width:"40px",
                    background:"#22c55e",
                    margin:"auto"
                  }}></div>
                  <p>{d.tipo}</p>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

/* ===== ESTILOS ===== */
const layout={display:"flex",height:"100vh"};
const sidebar={width:"240px",background:"#020617",padding:"20px",display:"flex",flexDirection:"column",gap:"10px",color:"#fff"};
const logo={fontSize:"22px",background:"linear-gradient(90deg,#ef4444,#22c55e,#3b82f6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"};
const menuBtn={padding:"10px",background:"#1e293b",color:"#fff",border:"none",borderRadius:"8px"};
const logoutBtn={marginTop:"auto",background:"#ef4444",color:"#fff",padding:"10px",border:"none"};
const content={flex:1,padding:"20px",background:"#0f172a",color:"#fff"};
const table={width:"100%"};
const cerrarBtn={background:"#ef4444",color:"#fff"};
const reabrirBtn={background:"#22c55e",color:"#fff"};
const formBox={display:"flex",flexDirection:"column",gap:"10px"};
const input={padding:"10px"};
const guardarBtn={background:"#3b82f6",color:"#fff"};
const exportBtn={background:"#3b82f6",color:"#fff"};
const importBtn={background:"#22c55e",color:"#fff",padding:"5px"};
const etlBox={background:"#1e293b",padding:"15px",borderRadius:"10px"};
const chart={display:"flex",gap:"20px",alignItems:"end",marginTop:"20px"};