import { useNavigate } from "react-router-dom";
import GetUser from "../components/profile/Getuser";
import Navbar from "../components/Navbar";

export default function Profile() {
  const navigate = useNavigate();
  function handleLogoutClick() {
    navigate("/logout");
  }
  let user = GetUser();
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
      <h2>Profile</h2>
      <GetUser />
      <button onClick={handleLogoutClick} className="logout">Logout</button>
    </div>
  );
}
