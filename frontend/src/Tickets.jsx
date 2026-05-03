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
    setView("list");
    cargar();
  };

  const cambiarEstado = async (id, estado)=>{
    await axios.put(API + "/tickets/" + id, { estado });
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
        <button style={menuBtn} onClick={()=>{ setView("bi"); cargarBI(); }}>📊 BI</button>
        <button style={logoutBtn} onClick={logout}>Salir</button>
      </div>

      {/* CONTENIDO */}
      <div style={content}>

        {view === "bi" && (
          <>
            <h2>Dashboard BI</h2>

            {loadingBI && <p>Cargando BI...</p>}

            {!loadingBI && bi && (
              <>
                {/* KPI */}
                <div style={kpiContainer}>
                  <div style={kpiCard}><h4>Total</h4><h1>{bi.total}</h1></div>
                  <div style={kpiCard}><h4>Tendencia</h4><h2>{bi.tendencia}</h2></div>
                  <div style={kpiCard}><h4>Predicción</h4><p>{bi.prediccion}</p></div>
                </div>

                {/* 🔥 ETL ANIMADO */}
                <div style={etlCard}>

                  {/* línea animada */}
                  <div style={etlLine}>
                    <div style={etlFlowAnim}></div>
                  </div>

                  <div style={etlFlow}>
                    <div style={etlStep}>
                      <div style={{...etlCircle, background:"#3b82f6"}}>E</div>
                      <span>Extract</span>
                    </div>

                    <div style={etlStep}>
                      <div style={{...etlCircle, background:"#22c55e"}}>T</div>
                      <span>Transform</span>
                    </div>

                    <div style={etlStep}>
                      <div style={{...etlCircle, background:"#ef4444"}}>L</div>
                      <span>Load</span>
                    </div>
                  </div>

                  <p style={etlText}>
                    Flujo de datos en tiempo real desde tickets hacia el modelo predictivo
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
                        display:"flex",
                        alignItems:"flex-end",
                        justifyContent:"center",
                        color:"#fff"
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

const kpiContainer={display:"flex",gap:"20px",marginBottom:"20px"};
const kpiCard={background:"#1e293b",padding:"20px",borderRadius:"10px"};

const etlCard={background:"#1e293b",padding:"20px",borderRadius:"12px",marginBottom:"20px",position:"relative"};

const etlFlow={display:"flex",justifyContent:"space-around",marginTop:"20px"};
const etlStep={display:"flex",flexDirection:"column",alignItems:"center"};

const etlCircle={
  width:"40px",
  height:"40px",
  borderRadius:"50%",
  display:"flex",
  alignItems:"center",
  justifyContent:"center",
  color:"#fff",
  fontWeight:"bold"
};

const etlText={textAlign:"center",fontSize:"13px",opacity:0.8,marginTop:"10px"};

/* 🔥 ANIMACIÓN */
const etlLine={
  position:"absolute",
  top:"40px",
  left:"10%",
  width:"80%",
  height:"4px",
  background:"#0f172a",
  overflow:"hidden",
  borderRadius:"4px"
};

const etlFlowAnim={
  width:"30%",
  height:"100%",
  background:"linear-gradient(90deg, transparent, #22c55e, transparent)",
  animation:"move 2s linear infinite"
};

/* animación global */
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
@keyframes move {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(300%); }
}
`, styleSheet.cssRules.length);

const chartPro={display:"flex",gap:"30px",alignItems:"flex-end",background:"#1e293b",padding:"20px",borderRadius:"12px"};
const barContainer={display:"flex",flexDirection:"column",alignItems:"center",gap:"5px"};