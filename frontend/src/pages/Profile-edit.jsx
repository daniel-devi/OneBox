import { useNavigate } from "react-router-dom";
import EditGetUser from "../components/profile/EditUser";
import Navbar from "../components/Navbar";

export default function ProfileEdit() {
  const navigate = useNavigate();
  function handleLogoutClick() {
    navigate("/logout");
  }
  return (
    <div  className="body">
      {/* Hello world */}
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
        crossOrigin="anonymous"
      />
      <Navbar dashboard={"dashboard"} />
      <h2>EDIT</h2>
      <EditGetUser/>
      <button onClick={handleLogoutClick} className="logout" >Logout</button>
    </div>
  );
}
