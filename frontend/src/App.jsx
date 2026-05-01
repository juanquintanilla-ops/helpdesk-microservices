import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import MainLayout from "./layout/MainLayout";

export default function App(){
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Login/>} />

        <Route path="/dashboard" element={
          <MainLayout>
            <Dashboard/>
          </MainLayout>
        }/>

        <Route path="/tickets" element={
          <MainLayout>
            <Tickets/>
          </MainLayout>
        }/>

      </Routes>

    </BrowserRouter>
  );
}