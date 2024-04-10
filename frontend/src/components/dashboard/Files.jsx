import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import "./File.css";

export default function File() {
  const [files, setFiles] = useState([]);
  const [fileInput, setFileInput] = useState([]);
  const [userName, setUserName] = useState("");
  const [userFavorite, setUserFavorite] = useState("");

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
      .catch((err) => console.log(err));
  };

  // Convert Date //////////////////////////
  const convertToRegularTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  //Create File ///////////////////////////////
  const CreateFile = (e) => {
    console.log(fileInput[0]);
    const formData = new FormData();
    formData.append("file", fileInput[0]);
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

  /// Update File Favorite //////////////////////////
  const FavoriteUpdateFile = (uid, favorite) => {
    let fav = favorite;
    console.log(fav);
    fav === true ? (fav = false) : (fav = true);
    console.log(fav);
    api
      .put(`/api/file/update/favorite/${uid}`, { favorite: fav })
      .then((res) => {
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

    function handlesProfilePageClick() {
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

            <a onClick={handlesProfilePageClick}>Profile</a>
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
        {files.length > 0 ? (
          files.map((data) => (
            <div id="curve" key={data.uid} className="card">
              <a href={`http://127.0.0.1:8000/${data.file}`}>
                <embed src={`http://127.0.0.1:8000/${data.file}`} type="" />
              </a>
              <div className="footer">
                <div className="connections">
                  <div className="connection like">
                    {data.favorite === true ? (
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC60lEQVR4nO2YSUhVURjHfypZUWlQpkWDFOUiW1S2iCAQWphFmyaCKIMQyoigQKigaNM6hAaigsho2ESthAiSgmolDdpk0yabB0p7vNI49H9wEOPdcwfffXB/cODx3v3/z3fuO8N3PkhISEhISEhwZgRQBxwDOoAeIAW8BG4CB4DZHnzMMweBdmlT8uqQd536Cp0CYC3wFBjw0K4BlUP4VOo3Lx5PgDVhDmI00Gp10AnsA2qAcg1yElALHAe+67kfwGbLpwH4qd++6dlaaQvktQjYD3RZ/Z0DRoUxiNsy/KJgirJoxilIo+kHmtT69Z2ZOmOzeBQBW4Cv0txSLL4wb+mCjJ4Dcxz1ZiqmNYB+fV7t6FEFdCuG84rJmQ0y+OxjEBm2WlNku0+PKsVgPNa5ioutN7GJYJxSC0KDYulWbJ5ZKeEDoDBgECVqQSgEHimmFS7C0xI1Ex/2KqaTLqL7Ei0gPtQoJnNoeuajRBOIDxMV0wcXUUoip4UVMcWKycTmmfcSlREfyhWTyck8k9kh5hMfFlo7qWcyuVUj8WGbYjrrItop0UXiw2XFtMNFVKn8qFdJYK4pBfqAP8A0V3G73sAeck+zYrnhR7xK4nc5/ldKrF203o+BSZnvyaCF3HFUMdwJmhakNTeXMfwsV9/pMI6Cw1ZqMNQ9PCpmAp/U96EwDM21s02Gr4AZRM9U6z503cP12jNlqmoY48dABdEx2arWdEWRuJp/4o06MCnM9LA74F8fnerjtZ8zw6WjZ9aaWRqi92LgrbxfALOImCnWtmxO240heJr61y953tX0GhZGAmesColJ5Mb48DGFtyOWT2uQ+lUQdgO/FcRDoNpBO8+6LphzYhc5ZokK0QNKMpuyFNIKlMH2WevBrI9YYPKhE9YUafvPPC8bVMS+BIwnhqy3Chc9g5K8en2X2fFMSTXWVABXrSJ2i1qmiH1F9++8oVFrJjONelULzkuqdVKbNpc8p1QtISEhgcD8BZSX5H28QAygAAAAAElFTkSuQmCC"
                        onClick={() =>
                          FavoriteUpdateFile(data.uid, data.favorite)
                        }
                      />
                    ) : (
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB70lEQVR4nO2Yv0sdQRSFvydGicFCiUIKwTaJ8a9IoRHSJY19EGxEAum1sbaKgZSaQKzsFAUhahOIGn9AgggWARWxM+EJccLALR6LqzM7s+9dYT44zbLvzjlvZ3ZmLyQSiUQikfDmHjAIvAe2gWOgChwBX4EJoM+hTp/cuya/rUqtLak9IGNFpwK8Bn4BxkHLwONr6jwBVhxr/AReydhRuA98chy8VpfAWE2dcbnmW2dWPASH2CgweK3sFJoMrLEeEsY+0rlAAzH1peg0G1Zg3mRk16kXLcChAuMmowPx5sxLBaZNjoZ8gnxUYNjk6INPkB0Fhk2O7KbpzJkCwyZHpz5Bimxc9dKlT5BzBYZNjuxscWZPgWGTI7t+nfmswLDJkT1tODOqwLDJ0YhPkF7gSoFpk9E/oAdPlhUYNxktUoAXCoybjOyXYyHWFJg3olUCeKZkc6wCTwnknYIgb4lApeA3eyzNx2xAPAA2GxBiE2gjMt3AjzqG2AceURIdwLc6PYmHlEynvArLCrEif1hdaAamSwgxU1ar9DbsAe5PhAC2xhsajO3xfg8IsQv0o4RWYEpOp64BrmQqBfd1y+A58NshxIlvf6oRdAELN4RYKnN/iE1FFu9FTYC/cm5r4g7SL42MPU0LuijtokQikSCY/wtr6za2rYeWAAAAAElFTkSuQmCC"
                        onClick={() =>
                          FavoriteUpdateFile(data.uid, data.favorite)
                        }
                      />
                    )}
                  </div>
                  <div className="connection delete">
                    <img
                      onClick={() => deleteFile(data.uid)}
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAj0lEQVR4nOXQsQmAUBAD0CA4xK/cwsotfuUWv7K2tLFyCxdxEodQFG2srC45QdBAysuDA/6SFsBxa6cMHQ/1PeAbGRyvGSxA4wAaC1A7gNoCVA6gsgCFAygsQA5gE8b369aUWQBmEJkEYGKAUQBGBugFoGeAJACJAaIARAYoBaBkgCAAgQEyAAsxvl43H8wJ42Pzg7ru6aMAAAAASUVORK5CYII="
                    />
                  </div>
                  <div className="connection folder">
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA70lEQVR4nO2ZMQrCQBREp4rgYaxsjGew8FAaray8mJUHSMwVxObLwhcCCbLRYGbjPJhqN7DD223yASFELBmAI4AbAItI2LcFIYfIAs08ACxBRuWHyyP3n3z/FcAcRJgnlhmAi39zRsJFAgsA9w+u5LepABT+rgcpEtg0ruWvsx+yyBisG2aSLvL2vJMrUo903/ukjimSWlq8FlbgJ/+rN5IKpiJkmIyQYTJChskIGSYjZJiMkGEyQobJCBkmI2SYjJBhMkKGyQgZNnkjlS+EIUoqg56ya7Eg+LNuPbPrKpJ5mbHmgX1SeonOYagQAi2eGqmWy/FZdjgAAAAASUVORK5CYII="
                      style={{ width: "20px" }}
                    />
                  </div>
                  <div className="connection download">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAg0lEQVR4nO2UOwqAMBBE3zWsLCxsLLSw8vYGPYSghYVgIR4hErAQ/58EQfNgIBCYIRN24U9kgBwlTATImWzAAmkr+l5F1Yrplso7ATHQnTDvgeTuKyKg3TFXdyEP8YF6xbwBAjThAsXEXP2Ph2YcIB+3qjpb9CMuDJY8kDAdkBoo4CUG+aZ0PJTVTQsAAAAASUVORK5CYII=" />
                  </div>
                  <div className="connection share">
                    <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nO2UOwrCQBCGv0oIWJjCgOmscgf1MkEbvUEOIB5HWysPYKeF2krsBe0jgQksy+a1YQvFH7YYZvf/Zmcf8BcsgcBVI1ZABpxdQYbASSAXYPQVEB+IgR1wBd5innVtlwckwFMzzJoCigkmhcBRmbMHFkAEjMW0tvoyQAjcJZe3ZKbkgqbmZQBPqfwADLpcUxMgUW6Hbt76oekAXzlQtS3W0gGxcqC4AGwlnrsC3CSOXAFeEvddAaoeXpVK19kaNvZ5SGKCvabikZqSm5pPLGsx1iZATyDFTmxGKua514/oA2Jde6sWveH4AAAAAElFTkSuQmCC" />{" "}
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
                  <div className="name">{data.file_name}</div>
                  <div className="created">
                    {convertToRegularTime(data.date_created)}
                  </div>
                </div>
              </div>
              <div className="card-blur" />
            </div>
          ))
        ) : (
          <div id="curve" className="card">
            <div className="footer">
              <div className="connections">
                <div className="connection like">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABy0lEQVR4nO2WSytFURiGH4SS68HouEb+gglDhi45/4ABCr8CEwN+CBEDIYlyLffCwN0plzKiKNpa9ardOftysHcMvLXa9X3v977rW3vvtRb845eRBsSACSAOvADnwCTQoryd2wpMifOimnGgI4HriXJgHbA8xiJQJu6SD3dNPF/TuAougG7FMvUcAB6Uv9KwFOtP4PYAl8rHvczTbJ3OA/kuvAiwYutoWTEnGI0F8Vbdlj1m69TN9BN5muQGkOvDzbd1bt55EiaUNMsbNHqlbT64JNwoWRGCcZW0jUcSXpXMCsE4W9rGIwl3IXZcKe1bp+Sckp0hGHdJe9YpOaDk/ld2mxSQDhxIu8+JYP7FZxHaAjRul+YTUORGGhLpBMgJwDRHWhYw6LcxnIk4GoDxmLTOpO2JRuBdo+kHps3SeAMaUi0a1kwfgbpvmNap1tLrSxkZwIwKjz0OASdEVGNqp6X1JZjNf1cCO0BxCjWFwKZqDoECvokocCqhbR/zYnEs1ZjaH6FCVxpLK1DiwDH/55btglBNQKjVOW2E9xK6iWq3szTBGgJGue2juQbqNa4VO9I9LBREXC535lpTSsjIBkaAex2lI4r942/iA8sUk7Pv/epZAAAAAElFTkSuQmCC" />
                </div>
                <div className="connection delete">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAj0lEQVR4nOXQsQmAUBAD0CA4xK/cwsotfuUWv7K2tLFyCxdxEodQFG2srC45QdBAysuDA/6SFsBxa6cMHQ/1PeAbGRyvGSxA4wAaC1A7gNoCVA6gsgCFAygsQA5gE8b369aUWQBmEJkEYGKAUQBGBugFoGeAJACJAaIARAYoBaBkgCAAgQEyAAsxvl43H8wJ42Pzg7ru6aMAAAAASUVORK5CYII=" />
                </div>
                <div className="connection folder">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA70lEQVR4nO2ZMQrCQBREp4rgYaxsjGew8FAaray8mJUHSMwVxObLwhcCCbLRYGbjPJhqN7DD223yASFELBmAI4AbAItI2LcFIYfIAs08ACxBRuWHyyP3n3z/FcAcRJgnlhmAi39zRsJFAgsA9w+u5LepABT+rgcpEtg0ruWvsx+yyBisG2aSLvL2vJMrUo903/ukjimSWlq8FlbgJ/+rN5IKpiJkmIyQYTJChskIGSYjZJiMkGEyQobJCBkmI2SYjJBhMkKGyQgZNnkjlS+EIUoqg56ya7Eg+LNuPbPrKpJ5mbHmgX1SeonOYagQAi2eGqmWy/FZdjgAAAAASUVORK5CYII="
                    style={{ width: "20px" }}
                  />
                </div>
                <div className="connection download">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAg0lEQVR4nO2UOwqAMBBE3zWsLCxsLLSw8vYGPYSghYVgIR4hErAQ/58EQfNgIBCYIRN24U9kgBwlTATImWzAAmkr+l5F1Yrplso7ATHQnTDvgeTuKyKg3TFXdyEP8YF6xbwBAjThAsXEXP2Ph2YcIB+3qjpb9CMuDJY8kDAdkBoo4CUG+aZ0PJTVTQsAAAAASUVORK5CYII=" />
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
                <div className="name">No File Created</div>
                <div className="job"></div>
              </div>
            </div>
            <div className="card-blur" />
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
              onChange={(e) => setFileInput(e.target.files)}
              onClick={getUser}
            />
          </label>
          <button className="btn">Button</button>
        </form>
      </div>
    </>
  );
}
