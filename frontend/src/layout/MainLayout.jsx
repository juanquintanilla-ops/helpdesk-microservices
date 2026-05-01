import { Link } from "react-router-dom";

export default function MainLayout({ children }){

  return (
    <div style={{display:"flex",height:"100vh",background:"#0b1120",color:"#fff"}}>

      {/* SIDEBAR */}
      <div style={{
        width:220,
        background:"#020617",
        padding:20,
        borderRight:"1px solid #1e293b"
      }}>
        <h2>HelpDesk</h2>

        <nav style={{marginTop:30,display:"flex",flexDirection:"column",gap:10}}>
          <Link to="/dashboard" style={link}>📊 Dashboard</Link>
          <Link to="/tickets" style={link}>🎫 Tickets</Link>
        </nav>
      </div>

      {/* CONTENT */}
      <div style={{flex:1}}>
        {/* TOPBAR */}
        <div style={{
          height:60,
          background:"#020617",
          borderBottom:"1px solid #1e293b",
          display:"flex",
          alignItems:"center",
          justifyContent:"space-between",
          padding:"0 20px"
        }}>
          <span>Sistema de Soporte</span>

          <button onClick={()=>{
            localStorage.clear();
            window.location="/";
          }}>
            Logout
          </button>
        </div>

        {/* PAGE */}
        <div style={{padding:20}}>
          {children}
        </div>
      </div>
    </div>
  );
}

const link = {
  color:"#94a3b8",
  textDecoration:"none",
  padding:10,
  borderRadius:6,
  background:"#020617"
};