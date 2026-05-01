import { Link } from "react-router-dom";

export default function Layout({ children }) {

  const logout = ()=>{
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div style={{display:"flex", height:"100vh", fontFamily:"Arial"}}>

      {/* SIDEBAR */}
      <div style={{
        width:220,
        background:"#111827",
        color:"#fff",
        padding:20
      }}>
        <h2>Helpdesk</h2>

        <div style={{marginTop:30}}>
          <Link to="/dashboard" style={link}>Dashboard</Link>
          <Link to="/tickets" style={link}>Tickets</Link>
        </div>

        <button onClick={logout} style={logoutBtn}>
          Cerrar sesión
        </button>
      </div>

      {/* CONTENT */}
      <div style={{flex:1, padding:20, background:"#0f172a"}}>
        {children}
      </div>
    </div>
  );
}

const link = {
  display:"block",
  marginBottom:15,
  color:"#cbd5e1",
  textDecoration:"none"
};

const logoutBtn = {
  marginTop:40,
  padding:10,
  width:"100%",
  background:"#ef4444",
  border:"none",
  color:"#fff",
  cursor:"pointer"
};