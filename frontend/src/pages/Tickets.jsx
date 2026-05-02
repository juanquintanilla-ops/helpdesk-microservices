import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";

export default function Tickets(){

  const [tickets,setTickets] = useState([]);
  const [view,setView] = useState("tickets");

  useEffect(()=>{
    cargar();
  },[]);

  const cargar = async ()=>{
    try{
      const res = await axios.get("http://localhost:3001/tickets");
      setTickets(res.data);
    }catch(err){
      console.error(err);
    }
  };

  const exportar = () => {
    window.open("http://localhost:3001/tickets/export");
  };

  const importar = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:3001/tickets/import", formData);
    cargar();
  };

  const logout = ()=>{
    localStorage.removeItem("user");
    window.location.reload();
  };

  if(view === "bi"){
    return (
      <div style={{padding:"20px"}}>
        <button onClick={()=>setView("tickets")}>← Volver</button>
        <Dashboard />
      </div>
    );
  }

  return (
    <div style={{padding:"20px"}}>

      <div style={top}>
        <h2>Tickets</h2>

        <div style={{display:"flex", gap:"10px"}}>
          <button onClick={()=>setView("bi")}>Ver BI</button>
          <button onClick={logout}>Salir</button>
        </div>
      </div>

      <div style={{display:"flex", gap:"10px", marginBottom:"15px"}}>
        <button onClick={exportar}>Exportar Excel</button>
        <input type="file" onChange={importar} />
      </div>

      <table border="1" cellPadding="5">
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

    </div>
  );
}

const top = {
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:"20px"
};