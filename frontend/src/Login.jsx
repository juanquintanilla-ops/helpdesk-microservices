import { useState } from "react";

export default function Login({ setUser }){

  const [user,setUserInput] = useState("");
  const [pass,setPass] = useState("");
  const [error,setError] = useState("");

  const handleLogin = (e)=>{
    e.preventDefault();

    // Credenciales tipo correo
    if(user === "admin@nexuspro.com" && pass === "1234"){
      const u = { user, role:"admin" };
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
    }else{
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div style={container}>
      <div style={overlay} />

      <form onSubmit={handleLogin} style={card}>

        <h1 style={brand}>Nexus Pro</h1>
        <p style={subtitle}>Sistema de Gestión Helpdesk</p>

        <input
          style={input}
          placeholder="Correo corporativo"
          value={user}
          onChange={e=>setUserInput(e.target.value)}
        />

        <input
          style={input}
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={e=>setPass(e.target.value)}
        />

        <button style={button}>
          Ingresar
        </button>

        {error && <p style={errorStyle}>{error}</p>}

        <div style={demoBox}>
          <p style={{margin:0, fontWeight:"bold"}}>Credenciales demo</p>
          <p style={{margin:0}}>admin@nexuspro.com</p>
          <p style={{margin:0}}>1234</p>
        </div>

      </form>
    </div>
  );
}

/* ===== ESTILOS NEXUS PRO ===== */

const container = {
  height:"100vh",
  display:"flex",
  justifyContent:"center",
  alignItems:"center",
  background:"linear-gradient(135deg, #0f172a, #020617)",
  position:"relative",
  overflow:"hidden"
};

const overlay = {
  position:"absolute",
  width:"600px",
  height:"600px",
  background:"radial-gradient(circle, rgba(59,130,246,0.3), transparent 70%)",
  filter:"blur(80px)"
};

const card = {
  position:"relative",
  background:"rgba(30,41,59,0.9)",
  backdropFilter:"blur(10px)",
  padding:"40px",
  borderRadius:"16px",
  display:"flex",
  flexDirection:"column",
  gap:"15px",
  width:"340px",
  boxShadow:"0 20px 60px rgba(0,0,0,0.7)",
  border:"1px solid rgba(255,255,255,0.1)"
};

const brand = {
  textAlign:"center",
  margin:0,
  background:"linear-gradient(90deg,#ef4444,#22c55e,#3b82f6)",
  WebkitBackgroundClip:"text",
  WebkitTextFillColor:"transparent",
  fontSize:"28px",
  fontWeight:"bold"
};

const subtitle = {
  textAlign:"center",
  color:"#94a3b8",
  fontSize:"13px",
  marginBottom:"10px"
};

const input = {
  padding:"12px",
  borderRadius:"10px",
  border:"1px solid #334155",
  background:"#020617",
  color:"#fff",
  outline:"none"
};

const button = {
  padding:"12px",
  borderRadius:"10px",
  border:"none",
  background:"linear-gradient(90deg,#ef4444,#22c55e,#3b82f6)",
  color:"#fff",
  fontWeight:"bold",
  cursor:"pointer",
  transition:"0.2s"
};

const errorStyle = {
  color:"#ef4444",
  textAlign:"center",
  fontSize:"13px"
};

const demoBox = {
  marginTop:"10px",
  background:"#020617",
  padding:"10px",
  borderRadius:"8px",
  color:"#94a3b8",
  fontSize:"12px",
  textAlign:"center",
  border:"1px solid #334155"
};