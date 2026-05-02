import { useState } from "react";

export default function Login({ setUser }){

  const [user,setUserInput] = useState("");
  const [pass,setPass] = useState("");
  const [error,setError] = useState("");

  const handleLogin = () => {

    if(user === "admin" && pass === "1234"){
      const userData = { user };

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData); // 👈 ESTO REEMPLAZA EL RELOAD
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
          onChange={(e)=>setUserInput(e.target.value)}
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

/* estilos iguales */