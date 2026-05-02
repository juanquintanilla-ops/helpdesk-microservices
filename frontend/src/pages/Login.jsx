import { useState } from "react";

export default function Login(){

  const [user,setUser] = useState("");
  const [pass,setPass] = useState("");
  const [error,setError] = useState("");

  const handleLogin = () => {

    if(user === "admin" && pass === "1234"){
      localStorage.setItem("user", JSON.stringify({user}));
      window.location.reload();
    }else{
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2 style={title}>Helpdesk Login</h2>

        <input
          style={input}
          placeholder="Usuario"
          value={user}
          onChange={(e)=>setUser(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e)=>setPass(e.target.value)}
        />

        <button style={button} onClick={handleLogin}>
          Ingresar
        </button>

        {error && <p style={errorStyle}>{error}</p>}

        <div style={demo}>
          <p><b>Demo:</b></p>
          <p>admin / 1234</p>
        </div>
      </div>
    </div>
  );
}

/* ================= ESTILOS ================= */

const container = {
  height:"100vh",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  background:"#0f172a"
};

const card = {
  background:"#1e293b",
  padding:"40px",
  borderRadius:"12px",
  display:"flex",
  flexDirection:"column",
  gap:"15px",
  width:"320px",
  boxShadow:"0 0 20px rgba(0,0,0,0.5)"
};

const title = {
  color:"#fff",
  textAlign:"center"
};

const input = {
  padding:"10px",
  borderRadius:"8px",
  border:"none"
};

const button = {
  padding:"10px",
  borderRadius:"8px",
  border:"none",
  background:"#3b82f6",
  color:"#fff",
  cursor:"pointer"
};

const errorStyle = {
  color:"red",
  textAlign:"center"
};

const demo = {
  color:"#cbd5f5",
  fontSize:"12px",
  textAlign:"center"
};