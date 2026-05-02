import { useState } from "react";
import Login from "./Login";
import Tickets from "./Tickets";

export default function App(){
  const [user,setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  if(!user){
    return <Login setUser={setUser} />;
  }

  return <Tickets />;
}