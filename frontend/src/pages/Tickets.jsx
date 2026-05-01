import { useState, useEffect } from "react";
import API from "../services/api";

export default function Tickets(){

  const [tickets,setTickets] = useState([]);
  const [form,setForm] = useState({
    title:"",
    priority:"media",
    tecnico:"tec1"
  });

  const [selected,setSelected] = useState(null);

  useEffect(()=>{ load(); },[]);

  const load = async ()=>{
    const res = await API.get("/tickets");
    setTickets(res.data);
  };

  /* CREAR */
  const create = async ()=>{
    await API.post("/tickets",form);
    setForm({ title:"", priority:"media", tecnico:"tec1" });
    load();
  };

  /* EDITAR */
  const update = async ()=>{
    await API.put(`/tickets/${selected.id}`, selected);
    setSelected(null);
    load();
  };

  /* ESTADOS */
  const closeTicket = async (id)=>{
    await API.put(`/tickets/${id}/close`);
    load();
  };

  const reopen = async (id)=>{
    await API.put(`/tickets/${id}/open`);
    load();
  };

  /* SLA */
  const getSLA = (date)=>{
    const diff = (new Date() - new Date(date)) / 3600000;

    if(diff > 24) return {text:"Vencido", color:"#ef4444"};
    if(diff > 12) return {text:"En riesgo", color:"#eab308"};
    return {text:"OK", color:"#22c55e"};
  };

  return (
    <div>

      <h2 style={{color:"#fff"}}>Sistema ITSM</h2>

      {/* CREAR */}
      <div style={box}>
        <input
          placeholder="Título"
          value={form.title}
          onChange={e=>setForm({...form,title:e.target.value})}
        />

        <select onChange={e=>setForm({...form,priority:e.target.value})}>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>

        <select onChange={e=>setForm({...form,tecnico:e.target.value})}>
          <option value="tec1">tec1</option>
          <option value="tec2">tec2</option>
        </select>

        <button onClick={create}>Crear</button>
      </div>

      {/* TABLA */}
      <table style={table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Prioridad</th>
            <th>Técnico</th>
            <th>SLA</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {tickets.map(t=>{
            const sla = getSLA(t.createdAt);

            return (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.title}</td>

                <td>
                  <span style={priorityStyle(t.priority)}>
                    {t.priority}
                  </span>
                </td>

                <td>{t.tecnico}</td>

                <td style={{color:sla.color}}>
                  {sla.text}
                </td>

                <td>{t.status}</td>

                <td>

                  <button onClick={()=>setSelected(t)}>Editar</button>

                  {t.status !== "cerrado" ? (
                    <button onClick={()=>closeTicket(t.id)}>Cerrar</button>
                  ):(
                    <button onClick={()=>reopen(t.id)}>Reabrir</button>
                  )}

                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* MODAL */}
      {selected && (
        <div style={modal}>
          <div style={modalBox}>

            <h3>Editar</h3>

            <input
              value={selected.title}
              onChange={e=>setSelected({...selected,title:e.target.value})}
            />

            <br/>

            <select
              value={selected.priority}
              onChange={e=>setSelected({...selected,priority:e.target.value})}
            >
              <option>alta</option>
              <option>media</option>
              <option>baja</option>
            </select>

            <br/>

            <button onClick={update}>Guardar</button>
            <button onClick={()=>setSelected(null)}>Cancelar</button>

            <hr/>

            <h4>Historial</h4>
            {selected.history?.map((h,i)=>(
              <div key={i}>{h}</div>
            ))}

          </div>
        </div>
      )}

    </div>
  );
}

/* ESTILOS */

const box = {
  display:"flex",
  gap:10,
  marginBottom:20
};

const table = {
  width:"100%",
  background:"#1e293b",
  color:"#fff"
};

const modal = {
  position:"fixed",
  top:0,left:0,width:"100%",height:"100%",
  background:"rgba(0,0,0,0.7)",
  display:"flex",justifyContent:"center",alignItems:"center"
};

const modalBox = {
  background:"#1e293b",
  padding:20,
  color:"#fff"
};

const priorityStyle = (p)=>{
  if(p==="alta") return {color:"#ef4444"};
  if(p==="media") return {color:"#eab308"};
  return {color:"#22c55e"};
};