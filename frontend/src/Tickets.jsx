import { useEffect, useState } from "react";
import axios from "axios";

const API = "https://ticket-service-bo5t.onrender.com";

export default function Tickets(){

  const [tickets,setTickets] = useState([]);

  useEffect(()=>{
    axios.get(API+"/tickets")
      .then(r=>setTickets(r.data))
      .catch(console.error);
  },[]);

  return (
    <div style={{padding:"20px"}}>
      <h2>Tickets</h2>

      <table border="1">
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