import { Link } from "react-router-dom";

export default function MainLayout({ children }){

  return (
    <div style={{display:"flex",height:"100vh",background:"#0b1220",color:"#e5e7eb"}}>

      {/* SIDEBAR */}
      <div style={{
        width:240,
        background:"#020617",
        padding:20,
        borderRight:"1px solid #1f2937"
      }}>
        <h2 style={{marginBottom:30}}>NEXUS PRO</h2>

        <Link to="/dashboard" style={link}>📊 Dashboard</Link>
        <Link to="/tickets" style={link}>🎫 Tickets</Link>
      </div>

      {/* CONTENT */}
      <div style={{flex:1}}>

        {/* TOPBAR */}
        <div style={{
          height:60,
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          padding:"0 20px",
          borderBottom:"1px solid #1f2937",
          background:"#020617"
        }}>
          <span>Sistema de Soporte</span>

          <button style={btnLogout} onClick={()=>{
            localStorage.clear();
            window.location="/";
          }}>
            Logout
          </button>
        </div>

        <div style={{padding:30}}>
          {children}
        </div>

      </div>
    </div>
  );
}

const link = {
  display:"block",
  padding:12,
  borderRadius:8,
  marginBottom:10,
  color:"#9ca3af",
  textDecoration:"none",
  background:"#020617"
};

const btnLogout = {
  background:"#dc2626",
  color:"#fff",
  border:"none",
  padding:"8px 14px",
  borderRadius:8,
  cursor:"pointer"
};