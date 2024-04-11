import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../components/api";
import Navbar from "../components/Navbar";
import "../styles/Share.css"
export default function SharePage() {
  const [fileData, setFileData] = useState("");
  const { code } = useParams();
  const navigate = useNavigate();
  let shareCode = "";

  useEffect(() => {
    getFiles();
  }, [shareCode]); // Add code as a dependency to useEffect

  const getFiles = () => {
    console.log(code);
    shareCode = code.toString();
    console.log("//", shareCode);
    api
      .get(`/api/file/share/${shareCode}`)
      .then((res) => res.data)
      .then((data) => {
        setFileData(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /// CopytoClipboard //////////////
  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    alert("Link Copied to ClipBoard");
  };


  // Convert Date //////////////////////////
  const convertToRegularTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  return (
    <>
      <Navbar search="search" />
          <div id="curve" key={fileData.uid} className="card">
            <a href={`http://127.0.0.1:8000/${fileData.file}`}>
              <embed src={`http://127.0.0.1:8000/${fileData.file}`} type="" />
            </a>
            <div className="footer">
              <div className="connections">
                <div className="connection download">
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAg0lEQVR4nO2UOwqAMBBE3zWsLCxsLLSw8vYGPYSghYVgIR4hErAQ/58EQfNgIBCYIRN24U9kgBwlTATImWzAAmkr+l5F1Yrplso7ATHQnTDvgeTuKyKg3TFXdyEP8YF6xbwBAjThAsXEXP2Ph2YcIB+3qjpb9CMuDJY8kDAdkBoo4CUG+aZ0PJTVTQsAAAAASUVORK5CYII=" />
                </div>
                <div className="connection share">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nO2UOwrCQBCGv0oIWJjCgOmscgf1MkEbvUEOIB5HWysPYKeF2krsBe0jgQksy+a1YQvFH7YYZvf/Zmcf8BcsgcBVI1ZABpxdQYbASSAXYPQVEB+IgR1wBd5innVtlwckwFMzzJoCigkmhcBRmbMHFkAEjMW0tvoyQAjcJZe3ZKbkgqbmZQBPqfwADLpcUxMgUW6Hbt76oekAXzlQtS3W0gGxcqC4AGwlnrsC3CSOXAFeEvddAaoeXpVK19kaNvZ5SGKCvabikZqSm5pPLGsx1iZATyDFTmxGKua514/oA2Jde6sWveH4AAAAAElFTkSuQmCC"
                    onClick={() =>
                      copyToClipboard(`http://localhost:5173/share/${fileData.uid}`)
                    }
                  />
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
                <div className="name">{fileData.file_name}</div>
                <div className="created">
                  {convertToRegularTime(fileData.date_created)}
                </div>
              </div>
            </div>
            <div className="card-blur" />
          </div>
    </>
  );
}
