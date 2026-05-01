import { useState } from "react";
import API from "../services/api";

export default function Login(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const login = async ()=>{
    try{
      const res = await API.post("/login",{ email, password });

      localStorage.setItem("user", JSON.stringify(res.data));

      window.location.href = "/dashboard";

    }catch{
      alert("Error de login");
    }
  };

  return (
    <div style={{padding:50}}>

      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
      />

      <br/><br/>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e=>setPassword(e.target.value)}
      />

      <br/><br/>

      <button onClick={login}>
        Ingresar
      </button>

    </div>
  );
}