import { useEffect, useState } from "react";
import axios from "axios";

const BI_API = "https://bi-service-h7ei.onrender.com";
const TICKET_API = "https://ticket-service-bo5t.onrender.com";

export default function Dashboard(){

  const [data,setData] = useState(null);
  const [tickets,setTickets] = useState([]);

  useEffect(()=>{
    cargarBI();
    cargarTickets();
  },[]);

  const cargarBI = async ()=>{
    try{
      const res = await axios.get(BI_API + "/bi/prediccion");
      setData(res.data);
    }catch(err){
      console.error(err);
    }
  };

  const cargarTickets = async ()=>{
    try{
      const res = await axios.get(TICKET_API + "/tickets");
      setTickets(res.data);
    }catch(err){
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Dashboard BI</h2>
      <p>Total tickets: {tickets.length}</p>

      {data && (
        <>
          <p>Predicción: {data.prediccionProximoPeriodo}</p>
          <p>Tendencia: {data.tendencia}</p>
        </>
      )}
    </div>
  );
}