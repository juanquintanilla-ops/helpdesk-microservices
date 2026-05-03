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
    await axios.post(API + "/tickets", form);
    setForm({titulo:"",descripcion:"",tecnico:""});
    setView("list");
    cargar();
  };

  const cambiarEstado = async (id, estado)=>{
    console.log("CLICK", id, estado); // 👈 DEBUG

    await axios.put(API + "/tickets/" + id, { estado });

    await cargar();
  };

  const colorEstado = (estado)=>{
    if(estado==="Abierto") return "#22c55e";
    if(estado==="En proceso") return "#f59e0b";
    return "#ef4444";
  };

  const logout = ()=>{
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div style={{display:"flex", height:"100vh"}}>

      {/* SIDEBAR */}
      <div style={{
        width:"230px",
        background:"#020617",
        color:"#fff",
        padding:"20px",
        display:"flex",
        flexDirection:"column",
        gap:"10px"
      }}>
        <h2 style={{
          background:"linear-gradient(90deg,#ef4444,#22c55e,#3b82f6)",
          WebkitBackgroundClip:"text",
          WebkitTextFillColor:"transparent"
        }}>
          Nexus Pro
        </h2>

        <button onClick={()=>setView("list")}>📋 Tickets</button>
        <button onClick={()=>setView("create")}>➕ Crear</button>

        <button onClick={logout} style={{marginTop:"auto"}}>
          Salir
        </button>
      </div>

      {/* CONTENIDO */}
      <div style={{
        flex:1,
        padding:"20px",
        background:"#0f172a",
        color:"#fff"
      }}>

        {view === "list" && (
          <>
            <h2>Tickets</h2>

            <table style={{width:"100%"}}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
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
                    <td>{t.tecnico}</td>

                    <td>
                      <span style={{
                        background:colorEstado(t.estado),
                        padding:"6px 10px",
                        borderRadius:"6px"
                      }}>
                        {t.estado}
                      </span>
                    </td>

                    <td>
                      {t.estado !== "Cerrado" ? (
                        <button
                          style={{
                            background:"#ef4444",
                            color:"#fff",
                            padding:"6px 12px",
                            border:"none",
                            borderRadius:"6px",
                            cursor:"pointer"
                          }}
                          onClick={()=>cambiarEstado(t.id,"Cerrado")}
                        >
                          Cerrar
                        </button>
                      ) : (
                        <button
                          style={{
                            background:"#22c55e",
                            color:"#fff",
                            padding:"6px 12px",
                            border:"none",
                            borderRadius:"6px",
                            cursor:"pointer"
                          }}
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

            <input placeholder="Título"
              value={form.titulo}
              onChange={e=>setForm({...form,titulo:e.target.value})}/>

            <textarea placeholder="Descripción"
              value={form.descripcion}
              onChange={e=>setForm({...form,descripcion:e.target.value})}/>

            <input placeholder="Técnico"
              value={form.tecnico}
              onChange={e=>setForm({...form,tecnico:e.target.value})}/>

            <button onClick={crear}>Guardar</button>
          </>
        )}

      </div>
    </div>
  );
}