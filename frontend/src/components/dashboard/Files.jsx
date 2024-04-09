import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import "./File.css";

export default function File() {
  const [files, setFiles] = useState([]);
  const [fileInput, setFileInput] = useState([]);
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
    formData.append("file:", fileInput[0]);
    console.log(formData);
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

    function handleSettingsPageClick() {
      navigate("/settings");
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

            <a>Folder</a>

            <a onClick={handleSettingsPageClick}>Settings</a>
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
          files.map((data) => (
            <div className="file-list" key={data.uid}>
              <span id="file-name">
                {data.file_name}
                <h1>:</h1>
                <span>
                  <embed src={`"http://127.0.0.1:8000"${data.file}`} type="" />
                </span>
              </span>

              <span>{data.favorite === true ? "🌟" : "⭐"}</span>
              <div className="file" style={{ display: "none" }}></div>
              <small>Created: {convertToRegularTime(data.date_created)}</small>
              <br />
              <small>Edited: {convertToRegularTime(data.date_updated)}</small>
              <br />
              <br />
              <small id="delete" onClick={() => deleteFile(data.uid)}>
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
              required={true}
              onChange={(e) => setFileInput(e.target.value)}
              onClick={getUser}
            />
          </label>
          <button className="btn">Button</button>
        </form>
      </div>

      <>
        <div className="background" />
        <div id="curve" className="card">
          <div className="footer">
            <div className="connections">
              <div className="connection like">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABy0lEQVR4nO2WSytFURiGH4SS68HouEb+gglDhi45/4ABCr8CEwN+CBEDIYlyLffCwN0plzKiKNpa9ardOftysHcMvLXa9X3v977rW3vvtRb845eRBsSACSAOvADnwCTQoryd2wpMifOimnGgI4HriXJgHbA8xiJQJu6SD3dNPF/TuAougG7FMvUcAB6Uv9KwFOtP4PYAl8rHvczTbJ3OA/kuvAiwYutoWTEnGI0F8Vbdlj1m69TN9BN5muQGkOvDzbd1bt55EiaUNMsbNHqlbT64JNwoWRGCcZW0jUcSXpXMCsE4W9rGIwl3IXZcKe1bp+Sckp0hGHdJe9YpOaDk/ld2mxSQDhxIu8+JYP7FZxHaAjRul+YTUORGGhLpBMgJwDRHWhYw6LcxnIk4GoDxmLTOpO2JRuBdo+kHps3SeAMaUi0a1kwfgbpvmNap1tLrSxkZwIwKjz0OASdEVGNqp6X1JZjNf1cCO0BxCjWFwKZqDoECvokocCqhbR/zYnEs1ZjaH6FCVxpLK1DiwDH/55btglBNQKjVOW2E9xK6iWq3szTBGgJGue2juQbqNa4VO9I9LBREXC535lpTSsjIBkaAex2lI4r942/iA8sUk7Pv/epZAAAAAElFTkSuQmCC" />
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB70lEQVR4nO2Yv0sdQRSFvydGicFCiUIKwTaJ8a9IoRHSJY19EGxEAum1sbaKgZSaQKzsFAUhahOIGn9AgggWARWxM+EJccLALR6LqzM7s+9dYT44zbLvzjlvZ3ZmLyQSiUQikfDmHjAIvAe2gWOgChwBX4EJoM+hTp/cuya/rUqtLak9IGNFpwK8Bn4BxkHLwONr6jwBVhxr/AReydhRuA98chy8VpfAWE2dcbnmW2dWPASH2CgweK3sFJoMrLEeEsY+0rlAAzH1peg0G1Zg3mRk16kXLcChAuMmowPx5sxLBaZNjoZ8gnxUYNjk6INPkB0Fhk2O7KbpzJkCwyZHpz5Bimxc9dKlT5BzBYZNjuxscWZPgWGTI7t+nfmswLDJkT1tODOqwLDJ0YhPkF7gSoFpk9E/oAdPlhUYNxktUoAXCoybjOyXYyHWFJg3olUCeKZkc6wCTwnknYIgb4lApeA3eyzNx2xAPAA2GxBiE2gjMt3AjzqG2AceURIdwLc6PYmHlEynvArLCrEif1hdaAamSwgxU1ar9DbsAe5PhAC2xhsajO3xfg8IsQv0o4RWYEpOp64BrmQqBfd1y+A58NshxIlvf6oRdAELN4RYKnN/iE1FFu9FTYC/cm5r4g7SL42MPU0LuijtokQikSCY/wtr6za2rYeWAAAAAElFTkSuQmCC" />
              </div>
              <div className="connection delete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="200"
                  height="200"
                  viewBox="0 0 24 24"
                >
                  <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 6.0683594 22 L 17.931641 22 L 19.634766 7 L 4.3652344 7 z"></path>
                </svg>
              </div>
              <div className="connection behance">
                <div className="icon" />
              </div>
              <div className="connection behance">
                <div className="icon" />
              </div>
            </div>
            <svg id="curve">
              <path
                id="p"
                d="M0,200 Q80,100 400,200 V150 H0 V50"
                transform="translate(0 300)"
              />
              <rect
                id="dummyRect"
                x={0}
                y={0}
                height={450}
                width={400}
                fill="transparent"
              />
              {/* slide up*/}
              <animate
                xlinkHref="#p"
                attributeName="d"
                to="M0,50 Q80,100 400,50 V150 H0 V50"
                fill="freeze"
                begin="dummyRect.mouseover"
                end="dummyRect.mouseout"
                dur="0.1s"
                id="bounce1"
              />
              {/* slide up and curve in */}
              <animate
                xlinkHref="#p"
                attributeName="d"
                to="M0,50 Q80,0 400,50 V150 H0 V50"
                fill="freeze"
                begin="bounce1.end"
                end="dummyRect.mouseout"
                dur="0.15s"
                id="bounce2"
              />
              {/* slide down and curve in */}
              <animate
                xlinkHref="#p"
                attributeName="d"
                to="M0,50 Q80,80 400,50 V150 H0 V50"
                fill="freeze"
                begin="bounce2.end"
                end="dummyRect.mouseout"
                dur="0.15s"
                id="bounce3"
              />
              {/* slide down and curve out */}
              <animate
                xlinkHref="#p"
                attributeName="d"
                to="M0,50 Q80,45 400,50 V150 H0 V50"
                fill="freeze"
                begin="bounce3.end"
                end="dummyRect.mouseout"
                dur="0.1s"
                id="bounce4"
              />
              {/* curve in */}
              <animate
                xlinkHref="#p"
                attributeName="d"
                to="M0,50 Q80,50 400,50 V150 H0 V50"
                fill="freeze"
                begin="bounce4.end"
                end="dummyRect.mouseout"
                dur="0.05s"
                id="bounce5"
              />
              <animate
                xlinkHref="#p"
                attributeName="d"
                to="M0,200 Q80,100 400,200 V150 H0 V50"
                fill="freeze"
                begin="dummyRect.mouseout"
                dur="0.15s"
                id="bounceOut"
              />
            </svg>
            <div className="info">
              <div className="name">Filan Fisteku</div>
              <div className="job">Architect Manager</div>
            </div>
          </div>
          <div className="card-blur" />
        </div>
      </>
    </>
  );
}
