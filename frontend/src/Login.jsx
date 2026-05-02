import { useState } from "react";

export default function Login({ setUser }){

  const [user,setUserInput] = useState("");
  const [pass,setPass] = useState("");

  const handleLogin = (e)=>{
    e.preventDefault();

    if(user==="admin" && pass==="1234"){
      const u = {user};
      localStorage.setItem("user", JSON.stringify(u));
      setUser(u);
    }else{
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#0f172a"
    }}>
      <form onSubmit={handleLogin} style={{
        background:"#1e293b",
        padding:"30px",
        borderRadius:"10px",
        color:"#fff",
        display:"flex",
        flexDirection:"column",
        gap:"10px"
      }}>
        <h2>Helpdesk</h2>

        <input placeholder="Usuario" onChange={e=>setUserInput(e.target.value)} />
        <input type="password" placeholder="Clave" onChange={e=>setPass(e.target.value)} />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}