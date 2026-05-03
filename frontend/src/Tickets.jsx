import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ticket-service-bo5t.onrender.com";

export default function Tickets(){

  const [tickets,setTickets] = useState([]);

  useEffect(()=>{ cargar(); },[]);

  const cargar = async ()=>{
    const res = await axios.get(API + "/tickets");
    setTickets(res.data);
  };

  const cambiarEstado = async (id, estado)=>{
    await axios.put(API + "/tickets/" + id, { estado });
    cargar();
  };

  const getColor = (estado)=>{
    if(estado.toLowerCase()==="abierto") return "#22c55e";
    if(estado.toLowerCase()==="en proceso") return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={{padding:"20px", background:"#0f172a", color:"#fff"}}>

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
                  background:getColor(t.estado),
                  padding:"5px 10px",
                  borderRadius:"6px"
                }}>
                  {t.estado}
                </span>
              </td>

              <td>
                {t.estado.toLowerCase() !== "cerrado" ? (
                  <button
                    onClick={()=>cambiarEstado(t.id,"Cerrado")}
                    style={{background:"#ef4444", color:"#fff"}}
                  >
                    Cerrar
                  </button>
                ) : (
                  <button
                    onClick={()=>cambiarEstado(t.id,"Abierto")}
                    style={{background:"#22c55e", color:"#fff"}}
                  >
                    Reabrir
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