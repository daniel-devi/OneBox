import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Navbar.css";
import api from "./api.js";
// External Library

export default function Navbar({ search, dashboard, folder }) {
  const navigate = useNavigate();

  ///////////////
  function handleReturnHomeClick() {
    navigate("/");
  }

  /////////////////
  function handleReturnLoginClick() {
    navigate("/login");
  }

  ////////////////
  function handleGotoDashboardPageClick() {
    navigate("/dashboard");
  }
  ////////////////
  function handleGotoFolderPageClick() {
    navigate("/my-folders");
  }
  ////////////////////
  function handleGotoProfilePageClick() {
    navigate("/profile");
  }
  //////////////////////
  function CheckUser() {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
      auth().catch(() => setIsAuthorized(false));
    }, []);

    const auth = async () => {
      const token = localStorage.getItem("access");
      if (token) {
        setIsAuthorized(true);
      }
    };

    return isAuthorized ? (
      <a onClick={handleGotoDashboardPageClick} id="😀">
        Dashboard
      </a>
    ) : (
      <a onClick={handleReturnLoginClick} id="😀">
        Login
      </a>
    );
  }

  ////////////////////
  function Search() {
    return (
      <>
        <div className="search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="800px"
            height="800px"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <input type="search" name="" id="search" placeholder="Search" />
        </div>
      </>
    );
  }
  return (
    <>
      <nav>
        <h2 onClick={handleReturnHomeClick}>OneBox</h2>

        <div className="links">
          <a onClick={handleReturnHomeClick}>Home</a>

          {folder === "" ? (
            <a onClick={handleGotoFolderPageClick}>Folder</a>
          ) : (
            ""
          )}

          <a onClick={handleGotoProfilePageClick}>Profile</a>
        </div>

        {search === "search" ? <Search /> : ""}

        {dashboard === "dashboard" ? <CheckUser /> : ""}
      </nav>
    </>
  );
}
