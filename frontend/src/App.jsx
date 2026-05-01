import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Tickets from "./pages/Tickets";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

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

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<Login/>}/>

        {/* SI NO HAY LOGIN → FORZAR LOGIN */}
        {!user && (
          <Route path="*" element={<Navigate to="/login"/>}/>
        )}

        {/* SI HAY LOGIN → APP */}
        {user && (
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<Navigate to="/tickets"/>}/>
                <Route path="/tickets" element={<Tickets/>}/>
                <Route path="/dashboard" element={<Dashboard/>}/>
              </Routes>
            </MainLayout>
          }/>
        )}

      </Routes>
    </BrowserRouter>
  );
}