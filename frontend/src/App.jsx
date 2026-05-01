import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Tickets from "./pages/Tickets";
import Dashboard from "./pages/Dashboard";

function getUser(){
  try{
    const u = localStorage.getItem("user");
    if(!u || u === "undefined") return null;
    return JSON.parse(u);
  }catch{
    return null;
  }
}

export default function App(){

  const user = getUser();

  if(!user){
    return (
      <div style={{
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"#020617",
        color:"#fff"
      }}>
        Sesión no válida. Haz login otra vez.
      </div>
    );
  }

  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/tickets"/>}/>
          <Route path="/tickets" element={<Tickets/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}