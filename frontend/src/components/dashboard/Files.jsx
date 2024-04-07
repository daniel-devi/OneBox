import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import "./File.css";

export default function File() {
  const [files, setFiles] = useState([]);
  const [fileInput, setFileInput] = useState("");
  const [userName, setUserName] = useState("");

  /// Fetch Notes On load
  useEffect(() => {
    getFiles();
  }, []);

  /// Get Files ///////////////
  const getFiles = () => {
    api
      .get("/api/file")
      .then((res) => res.data)
      .then((data) => {
        setFiles(data);
        console.log(data);
      })
      .catch((err) => alert(err));
  };

  /// Get USer ///////////////////
  const getUser = () => {
    let user = files.map((userFile) => userFile.user);
    api
      .get(`/api/user/details/${user}`)
      .then((res) => res.data)
      .then((data) => {
        let name = data[0].username;
        setUserName(name);
      })
      .catch((err) => alert(err));
  };

  // Convert Date //////////////////////////
  const convertToRegularTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  //Create File ///////////////////////////////
  const CreateFile = (e) => {
    console.log(fileInput);
    const formData = new FormData();
    formData.append('file', fileInput[0]);
    console.log(formData)
    e.preventDefault();
    setTimeout(() => {
      api
        .post("/api/file/create", { FormData, user: userName })
        .then((res) => {
          if (res.status === 201) {
            alert("Note created!");
            getFiles();
          } else {
            alert("Failed to make note.");
          }
        })
        .catch((err) => console.log(err));
    }, 2000);
  };

  /// Delete File /////////////////////////////////
  const deleteFile = (id) => {
    api
      .delete(`/api/file/delete/${id}`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted!");
        else alert("Failed to delete note.");
        getFiles();
      })
      .catch((error) => console.log(error));
  };

  function Navbar({ search, dashboard }) {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState("");

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
    ////////////////////////////

    const handleInputChange = async (event) => {
      // Delay function for 3.5 seconds
      const delayedCall = setTimeout(() => {
        // Call API after delay
        try {
          api
            .get(`api/search/file/${inputValue}`)
            .then((res) => res.data)
            .then((data) => {
              setFiles(data);
              console.log(data);
            });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }, 500); // 0.5 seconds in milliseconds

      return () => clearTimeout(delayedCall); // Clear timeout on component unmount
    };

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
              onClick={handleInputChange}
            >
              <path
                d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
                stroke="#000000"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <input
              type="search"
              name=""
              id="search"
              placeholder="Search"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
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

            <a>Files</a>

            <a>Settings</a>
          </div>

          {search === "search" ? <Search /> : ""}

          {dashboard === "dashboard" ? <CheckUser /> : ""}
        </nav>
      </>
    );
  }

  return (
    <>
      <Navbar search="search" />
      <div className="file-container">
        <div className="tooltip">
          <a></a>
        </div>
        {files.length > 0 ? (
          files.map((file) => (
            <div className="file-list" key={file.uid}>
              <span id="file-name">
                {file.file_name}
                <h1>:</h1>
                <span><embed src={file.file} type="" /></span>
              </span>

              <span>{file.favorite === true ? "🌟" : "⭐"}</span>
              <div className="file" style={{ display: "none" }}></div>
              <small>Created: {convertToRegularTime(file.date_created)}</small>
              <br />
              <small>Edited: {convertToRegularTime(file.date_updated)}</small>
              <br />
              <br />
              <small id="delete" onClick={() => deleteFile(file.uid)}>
                Delete
              </small>
            </div>
          ))
        ) : (
          <div className="file-list">
            <p>No files available</p>
          </div>
        )}
        <form className="add-file" onSubmit={CreateFile}>
          <label htmlFor="images" className="drop-container" id="dropcontainer">
            <span className="drop-title">Drop files here</span>
            or
            <input
              type="file"
              id="images"
              accept="image/*"
              required
              onChange={(e) => setFileInput(e.target.value)}
              onClick={getUser}
            />
          </label>
          <button className="btn btn-primary">Button</button>
        </form>
      </div>
    </>
  );
}
