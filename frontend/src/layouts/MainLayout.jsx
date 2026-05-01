import { useNavigate } from "react-router-dom";

export default function MainLayout({ children }){

  const navigate = useNavigate();

  const logout = ()=>{
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div style={layout}>

      <div style={sidebar}>

        <h2 style={logo}>NEXUS PRO</h2>

        <button style={btn} onClick={()=>navigate("/tickets")}>
          Tickets
        </button>

        <button style={btn} onClick={()=>navigate("/dashboard")}>
          Dashboard BI
        </button>

        <button style={logoutBtn} onClick={logout}>
          Logout
        </button>

      </div>

      <div style={content}>
        {children}
      </div>

    </div>
  );
}

const layout = {
  display:"flex",
  minHeight:"100vh",
  background:"#020617"
};

const sidebar = {
  width:220,
  background:"#020617",
  borderRight:"1px solid #1f2937",
  padding:20,
  display:"flex",
  flexDirection:"column",
  gap:10
};

const logo = {color:"#fff", marginBottom:20};

const btn = {
  padding:10,
  background:"#2563eb",
  color:"#fff",
  border:"none",
  borderRadius:8,
  cursor:"pointer"
};

const logoutBtn = {
  marginTop:"auto",
  padding:10,
  background:"#dc2626",
  color:"#fff",
  border:"none",
  borderRadius:8,
  cursor:"pointer"
};

const content = {
  flex:1,
  padding:20,
  color:"#fff"
};