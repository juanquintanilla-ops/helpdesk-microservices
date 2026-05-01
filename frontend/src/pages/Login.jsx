import { useState } from "react";
import API from "../services/api";

export default function Login(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async ()=>{
    try{
      const res = await API.post("/login",{email,password});

      localStorage.setItem("user", JSON.stringify(res.data));

      window.location.href = "/tickets";

    }catch{
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2>NEXUS PRO</h2>

        <input style={input} placeholder="Correo"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />

        <input style={input} type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />

        <button style={btn} onClick={login}>
          Ingresar
        </button>
      </div>
    </div>
  );
}

const container = {
  height:"100vh",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  background:"#020617"
};

const card = {
  background:"#111827",
  padding:30,
  borderRadius:12,
  display:"flex",
  flexDirection:"column",
  gap:10,
  width:300,
  color:"#fff"
};

const input = {
  padding:10,
  borderRadius:8,
  border:"1px solid #1f2937",
  background:"#020617",
  color:"#fff"
};

const btn = {
  padding:10,
  background:"#2563eb",
  color:"#fff",
  border:"none",
  borderRadius:8
};