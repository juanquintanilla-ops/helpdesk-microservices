import { useState } from "react";
import Login from "./pages/Login";
import Tickets from "./pages/Tickets";

export default function App(){

  const [user,setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  if(!user){
    return <Login setUser={setUser} />;
  }

  return <Tickets />;
}