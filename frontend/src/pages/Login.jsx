import { useState } from "react";
import API from "../services/api";

export default function Login(){

  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const login = async ()=>{
    try{
      const res = await API.post("/login",{email,password});
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href="/dashboard";
    }catch{
      alert("Error de login");
    }
  };

  return (
    <div style={{padding:40}}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={e=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={e=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={login}>Entrar</button>

      <p>admin@test.com / 123456</p>
    </div>
  );
}