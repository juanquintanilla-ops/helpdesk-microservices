import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ticket-service-bo5t.onrender.com";
const BI_API = "https://bi-service-h7ei.onrender.com";

const TECNICOS = ["Juan Pérez", "Ana Gómez", "Carlos Ruiz", "Laura Díaz"];

export default function Tickets(){

  const [tickets,setTickets] = useState([]);
  const [view,setView] = useState("list");
  const [bi,setBi] = useState(null);
  const [loadingBI,setLoadingBI] = useState(false);

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
    setLoadingBI(true);
    const res = await axios.get(BI_API + "/bi/prediccion");
    setBi(res.data);
    setLoadingBI(false);
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
    if(e==="en proceso") return "#3b82f6";
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

        <button style={menuBtn} onClick={()=>setView("list")}>📋 Tickets</button>
        <button style={menuBtn} onClick={()=>setView("create")}>➕ Crear</button>

        <button style={menuBtn} onClick={()=>{
          setView("bi");
          cargarBI();
        }}>
          📊 BI
        </button>

        <button style={logoutBtn} onClick={logout}>Salir</button>
      </div>

      {/* CONTENIDO */}
      <div style={content}>

        {/* ================= LISTA ================= */}
        {view === "list" && (
          <>
            <h2>Gestión de Tickets</h2>

            <div style={actionsBar}>
              <button style={exportBtn} onClick={exportar}>Exportar Excel</button>
              <label style={importBtn}>
                Importar Excel
                <input type="file" onChange={importar} hidden />
              </label>
            </div>

            <table style={table}>
              <thead>
                <tr style={{background:"#1e293b"}}>
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
                  <tr key={t.id} style={{borderBottom:"1px solid #1e293b"}}>
                    <td>{t.id}</td>
                    <td>{t.titulo}</td>
                    <td>{t.descripcion}</td>
                    <td>{t.tecnico}</td>

                    <td>
                      <span style={{
                        ...badge,
                        background:estadoColor(t.estado)
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

        {/* ================= CREAR ================= */}
        {view === "create" && (
          <>
            <h2>Nuevo Ticket</h2>

            <div style={formBox}>
              <input placeholder="Título"
                value={form.titulo}
                onChange={e=>setForm({...form,titulo:e.target.value})}
                style={input}
              />

              <textarea placeholder="Descripción"
                value={form.descripcion}
                onChange={e=>setForm({...form,descripcion:e.target.value})}
                style={{...input,height:"100px"}}
              />

              <select
                value={form.tecnico}
                onChange={e=>setForm({...form,tecnico:e.target.value})}
                style={input}
              >
                {TECNICOS.map(t=><option key={t}>{t}</option>)}
              </select>

              <button style={guardarBtn} onClick={crear}>
                Guardar Ticket
              </button>
            </div>
          </>
        )}

        {/* ================= BI ================= */}
        {view === "bi" && (
          <>
            <h2>Dashboard BI</h2>

            {loadingBI && <p>Cargando BI...</p>}

            {!loadingBI && bi && (
              <>
                {/* KPI */}
                <div style={kpiContainer}>
                  <div style={kpiCard}>
                    <h4>Total</h4>
                    <h1>{bi.total}</h1>
                  </div>

                  <div style={kpiCard}>
                    <h4>Tendencia</h4>
                    <h2>{bi.tendencia}</h2>
                  </div>

                  <div style={kpiCard}>
                    <h4>Predicción</h4>
                    <p>{bi.prediccion}</p>
                  </div>
                </div>

                {/* 🔥 ETL PRO (SIN ROMPER NADA) */}
                <div style={etlCard}>
                  <div style={etlFlow}>
                    <div style={etlStep}>
                      <div style={{...etlCircle, background:"#3b82f6"}}>E</div>
                      <span>Extract</span>
                    </div>

                    <div style={etlArrow}>→</div>

                    <div style={etlStep}>
                      <div style={{...etlCircle, background:"#22c55e"}}>T</div>
                      <span>Transform</span>
                    </div>

                    <div style={etlArrow}>→</div>

                    <div style={etlStep}>
                      <div style={{...etlCircle, background:"#ef4444"}}>L</div>
                      <span>Load</span>
                    </div>
                  </div>

                  <p style={etlText}>
                    Datos extraídos de tickets, transformados por tipo de incidencia y cargados en el modelo predictivo.
                  </p>
                </div>

                {/* GRÁFICA */}
                <div style={chartPro}>
                  {bi.distribucion.map((d,i)=>(
                    <div key={i} style={barContainer}>
                      <div style={{
                        height: d.total * 40,
                        width:"50px",
                        background:"linear-gradient(180deg,#3b82f6,#22c55e)",
                        borderRadius:"10px 10px 0 0",
                        color:"#fff",
                        display:"flex",
                        alignItems:"flex-end",
                        justifyContent:"center"
                      }}>
                        {d.total}
                      </div>
                      <span>{d.tipo}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  );
}

/* 🎨 ESTILOS */

const layout={display:"flex",height:"100vh"};
const sidebar={width:"240px",background:"#020617",padding:"20px",display:"flex",flexDirection:"column",gap:"10px",color:"#fff"};
const logo={fontSize:"22px",background:"linear-gradient(90deg,#ef4444,#22c55e,#3b82f6)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"};

const menuBtn={padding:"10px",background:"#1e293b",color:"#fff",border:"none",borderRadius:"8px"};
const logoutBtn={marginTop:"auto",background:"#ef4444",color:"#fff",padding:"10px",border:"none"};

const content={flex:1,padding:"20px",background:"#0f172a",color:"#fff"};

const table={width:"100%",borderCollapse:"collapse"};
const badge={padding:"6px 10px",borderRadius:"20px",color:"#fff",fontSize:"12px"};

const cerrarBtn={background:"#ef4444",color:"#fff",padding:"6px 12px",border:"none",borderRadius:"6px"};
const reabrirBtn={background:"#22c55e",color:"#fff",padding:"6px 12px",border:"none",borderRadius:"6px"};

const actionsBar={display:"flex",gap:"10px",marginBottom:"15px"};
const exportBtn={background:"#3b82f6",color:"#fff",padding:"8px 12px",border:"none",borderRadius:"6px"};
const importBtn={background:"#22c55e",color:"#fff",padding:"8px 12px",borderRadius:"6px"};

const formBox={display:"flex",flexDirection:"column",gap:"10px",maxWidth:"400px"};
const input={padding:"10px",borderRadius:"6px",border:"none"};
const guardarBtn={background:"#3b82f6",color:"#fff",padding:"10px",border:"none"};

const kpiContainer={display:"flex",gap:"20px",marginBottom:"20px"};
const kpiCard={background:"#1e293b",padding:"20px",borderRadius:"10px"};

const etlCard={background:"#1e293b",padding:"15px",borderRadius:"12px",marginBottom:"20px"};
const etlFlow={display:"flex",justifyContent:"center",alignItems:"center",gap:"20px"};
const etlStep={display:"flex",flexDirection:"column",alignItems:"center"};
const etlCircle={width:"40px",height:"40px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"bold"};
const etlArrow={fontSize:"20px",color:"#94a3b8"};
const etlText={textAlign:"center",fontSize:"13px",opacity:0.8,marginTop:"10px"};

const chartPro={display:"flex",gap:"30px",alignItems:"flex-end",background:"#1e293b",padding:"20px",borderRadius:"12px"};
const barContainer={display:"flex",flexDirection:"column",alignItems:"center",gap:"5px"};