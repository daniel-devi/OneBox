import { useNavigate } from "react-router-dom";
import GetUser from "../components/settings/Getuser";

export default function Setting(){
    const navigate = useNavigate()
     function handleLogoutClick(){
        navigate("/logout")
     }
     let user = GetUser()
    return(
        <>
        <h2>Settings</h2>
        <GetUser/>
        <button onClick={handleLogoutClick}>Logout</button>
        </>
    )
}