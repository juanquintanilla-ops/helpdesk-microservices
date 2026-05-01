import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import Layout from "./components/Layout";

export default function App(){
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login/>} />

        <Route path="/dashboard" element={
          <Layout>
            <Dashboard/>
          </Layout>
        }/>

        <Route path="/tickets" element={
          <Layout>
            <Tickets/>
          </Layout>
        }/>

      </Routes>
    </BrowserRouter>
  );
}