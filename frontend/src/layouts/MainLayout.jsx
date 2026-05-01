import { useNavigate, useLocation } from "react-router-dom";

export default function MainLayout({ children }){

  const navigate = useNavigate();
  const location = useLocation();

  const logout = ()=>{
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isActive = (path)=> location.pathname === path;

  return (
    <div style={layout}>

      {/* SIDEBAR */}
      <div style={sidebar}>

        <h2 style={logo}>NEXUS PRO</h2>

        <button
          style={isActive("/tickets") ? btnActive : btn}
          onClick={()=>navigate("/tickets")}
        >
          Tickets
        </button>

        <button
          style={isActive("/dashboard") ? btnActive : btn}
          onClick={()=>navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button style={logoutBtn} onClick={logout}>
          Logout
        </button>

      </div>

      {/* CONTENIDO */}
      <div style={content}>
        {children}
      </div>

    </div>
  );
}

/* ================= ESTILOS ================= */

const layout = {
  display:"flex",
  minHeight:"100vh",
  background:"#020617"
};

const sidebar = {
  width:240,
  background:"#020617",
  borderRight:"1px solid #1f2937",
  padding:20,
  display:"flex",
  flexDirection:"column",
  gap:10
};

const logo = {
  color:"#fff",
  marginBottom:20
};

const btn = {
  padding:12,
  background:"#1f2937",
  color:"#e5e7eb",
  border:"none",
  borderRadius:8,
  cursor:"pointer",
  textAlign:"left"
};

const btnActive = {
  ...btn,
  background:"#2563eb",
  color:"#fff"
};

const logoutBtn = {
  marginTop:"auto",
  padding:12,
  background:"#dc2626",
  color:"#fff",
  border:"none",
  borderRadius:8,
  cursor:"pointer"
};

const content = {
  flex:1,
  padding:25,
  color:"#e5e7eb"
};