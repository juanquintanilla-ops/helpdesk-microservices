import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function Dashboard(){

  const [data,setData] = useState([]);
  const [pred,setPred] = useState({});

  useEffect(()=>{
    load();
  },[]);

  const load = async ()=>{
    const res = await API.get("/bi/prediccion");

    setData(res.data.historico || []);
    setPred(res.data);
  };

  return (
    <div style={{color:"#fff"}}>

      <h2>BI Predictivo</h2>

      <div style={card}>
        <h3>Tendencia</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="fecha"/>
            <YAxis/>
            <Tooltip/>
            <Line dataKey="total"/>
          </LineChart>
        </ResponsiveContainer>

      </div>

      <div style={card}>
        <h3>Predicción</h3>
        <p><b>Próximo periodo:</b> {pred.prediccionProximoPeriodo}</p>
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