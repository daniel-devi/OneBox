import { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";
import "../styles/Form.css";
import LoadingIndicator from "./LoadingIndicator";

function AuthForm({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorStyle, setErrorStyle] = useState("");

  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const altLink =
    method === "login" ? (
      <p>
        Don't have an Account{" "}
        <a href="" onClick={handleLoginClick}>
          Register Now
        </a>{" "}
      </p>
    ) : (
      <p>
        {" "}
        Already have an Account{" "}
        <a href="" onClick={handleRegisterClick}>
          Login
        </a>
      </p>
    );

  function handleRegisterClick() {
    navigate("/login");
  }

  function handleLoginClick() {
    navigate("/register");
  }

  function handleHomeClick() {
    navigate("/");
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (error) {
      if (error.code === "ERR_BAD_REQUEST") {
        if (method === 'login'){
          setErrorMessage("Password Or Username is Incorrect");
          setErrorStyle("red");
        }
      } else {
        console.log(error.code);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="body">
      <div className="header">
        <h2 onClick={handleHomeClick}>OneBox</h2>
      </div>
      <form onSubmit={handleSubmit} className="form-container">
        <h1>{name}</h1>
        <input
          className="form-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          id={errorStyle}
          required= "true"
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          id={errorStyle}
          required= "true"
        />
        <span id="error">{errorMessage}</span>
        {loading && <LoadingIndicator />}
        <button className="form-button" type="submit">
          {name}
        </button>
        {altLink}
      </form>
    </div>
  );
}

export default AuthForm;
