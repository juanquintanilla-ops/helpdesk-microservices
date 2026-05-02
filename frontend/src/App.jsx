import Login from "./pages/Login";
import Tickets from "./pages/Tickets";

export default function App(){

  const user = localStorage.getItem("user");

  return user ? <Tickets /> : <Login />;
}