import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard(){

  const [pred,setPred] = useState({});
  const [data,setData] = useState([]);

  useEffect(()=>{
    load();
  },[]);

  const load = async ()=>{
    const p = await API.get("/bi/prediccion");
    setPred(p.data);
    setData(p.data.historico || []);
  };

  return (
    <div style={{color:"#fff"}}>

      <h2>BI Predictivo</h2>

      {/* GRÁFICA */}
      <div style={card}>
        <h3>Tendencia de Tickets</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="fecha"/>
            <YAxis/>
            <Tooltip/>
            <Line type="monotone" dataKey="total"/>
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* PREDICCIÓN */}
      <div style={card}>
        <h3>Predicción</h3>
        <p><b>Próximo período:</b> {pred.prediccionProximoPeriodo} tickets</p>
        <p><b>Tendencia:</b> {pred.tendencia}</p>
        <p><b>Acción:</b> {pred.recomendacion}</p>
      </div>

    </div>
  );
}

const card = {
  background:"#111827",
  padding:20,
  marginTop:20,
  borderRadius:10
};