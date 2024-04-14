import React, { useState, useEffect } from "react";
import { useRef } from "react";
import "./MyFolder.css";
import api from "../api";
// External Dependencies

export default function MyFolder() {
  const [folder, setFolder] = useState([]);
  const [folderNameInput, setFolderNameInput] = useState("");
  const [files, setFiles] = useState([]);
  const [inputValue, setInputValue] = useState("");

  let trashFolderId = "";

  let value = "";
  let inTrash = "none";

  let userId = "";
  /// Fetch Notes On load
  useEffect(() => {
    getFiles();
  }, []);

  /// Get Files ///////////////
  const getFiles = () => {
    api
      .get("/api/file/first")
      .then((res) => res.data)
      .then((data) => {
        userId = data[0].user;
        let Data = data;
        setFiles(Data);
        getFolders();
        userId = data[0].user;
      })
      .catch((err) => console.log(err));
  };

  /// Create Folder Api ///////////////
  const createFolder = (e) => {
    userId = files[0].user;
    e.preventDefault();
    api
      .post("/api/folder/create", {
        user: userId,
        folder_name: folderNameInput,
      })
      .then((res) => res.data)
      .then((data) => {
        getFolders();
        setFolderNameInput("");
      })
      .catch((err) => console.log(err));
  };

  /// Get User Folder ///////////////////
  const getFolders = () => {
    userId = files[0].user;
    api
      .get(`/api/folder/no-trash/${userId}`)
      .then((res) => res.data)
      .then((data) => {
        const Data = data;
        setFolder(Data);
      })
      .catch((err) => console.log(err));
  };

  /// Update Folder Favorite //////////////////////////
  const FavoriteUpdateFolder = (uid, favorite) => {
    let fav = favorite;
    console.log(fav);
    fav === true ? (fav = false) : (fav = true);
    console.log(fav);
    api
      .put(`/api/folder/update/favorite/${uid}`, { favorite: fav })
      .then((res) => {
        getFiles();
      })
      .catch((error) => console.log(error));
  };

  /// Delete Folder /////////////////////////////////
  const deleteFolder = (id) => {
    api
      .delete(`/api/folder/delete/${id}`)
      .then((res) => {
        if (res.status === 204) alert("Folder deleted!");
        else alert("Failed to delete note.");
        getFiles();
      })
      .catch((error) => console.log(error));
  };

  /// Get Files ///////////////
  const getFilesForFolder = (uid) => {
    api
      .get(`/api/folder/file-filter/${uid}`)
      .then((res) => res.data)
      .then((data) => {
        setFiles(data);
        console.log(data);
      })
      .catch((err) => console.log(err));
  };

  /// Get User Trash Folder ///////////////////
  const getTrashFolder = (fileUid) => {
    let userTrashId = files[0].user; // User Id Only for the Trash
    api
      .get(`/api/folder/trash/${userTrashId}`)
      .then((res) => res.data)
      .then((data) => {
        trashFolderId = data[0].id;
        console.log(trashFolderId);
        moveToTrashFile(fileUid, trashFolderId);
      })
      .catch((err) => console.log(err));
  };

  /// Move File to Trash  /////////////////////////////////
  const moveToTrashFile = (uid, id) => {
    api
      .put(`/api/file/update/trash/${uid}`, { folder: id, trash: true })
      .then((res) => res.data)
      .then((data) => {
        getFiles();
      })
      .catch((error) => console.log(error));
  };
  /// Update File Favorite //////////////////////////
  const FavoriteUpdateFile = (uid, favorite) => {
    let fav = favorite;
    fav === true ? (fav = false) : (fav = true);
    console.log(fav);
    api
      .put(`/api/file/update/favorite/${uid}`, { favorite: fav })
      .then((res) => {
        getFiles();
      })
      .catch((error) => console.log(error));
  };
  // Convert Date //////////////////////////
  const convertToRegularTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  /// Copy to CLipboard Link to File

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    alert("Link Copied to ClipBoard");
    window.open(value, "_blank");
  };

  const openLink = (value) => {
    alert("You will leave this page");
    window.open(`http://127.0.0.1:8000${value}`, "_blank");
  };
  const handleInputChange = async (event) => {
    userId = folder[0].user;
    const delayedCall = setTimeout(() => {
      // Call API after delay
      try {
        api
          .get(`api/search/folder/${inputValue}/${userId}/`)
          .then((res) => res.data)
          .then((data) => {
            setFolder(data);
            setInputValue("");
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 500); // 0.5 seconds in milliseconds

    return () => clearTimeout(delayedCall); // Clear timeout on component unmount
  };

  /// Get Favorite ///////////////////
  const getFavorites = () => {
    let user = folder[0].user;
    api
      .get(`/api/folder/favorite/${user}`)
      .then((res) => res.data)
      .then((data) => {
        setFolder(data);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="search-folder">
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
        <button onClick={handleInputChange}>Search</button>
      </div>
      <div className="filter-folder">
        <button onClick={getFolders}>
          <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABdklEQVR4nO2Wy0oDUQyGP9dutSrUQkV9m6KCVaogLhUvDH0Fn0LEy0a8oKKgvou3vRfUjRvrZSQQ4TC2nvFMWlz0h8Awyck/ySQngTb+IQpABJwBN8CLyiVwDiwC/daEW0ANiD0iNmsWHzAOPDtOt4EKMAB0qgzqux3n4+RMKZS0D/hQR4cauQ9F4EDPfAJzIcQdwAowE3A2UuJ3YDSEPAuqGvkj0N1q8hMl3/AZllWsUNCCe/0talHcq1im5rvYokYG+04/yrMVKk5n/MBEncvAKuVD6u8qqegC7uoQPwA9GQjdDMYJ2fMZHGcgloBuGwSUSxpfq1LSY4GRtL/wSJWT2CFV0VabUNWp2jTnNHzekLycpks2NWpJe0uRA558t02zMKYjTUbbcsD5WR2pMlr/jHkljvW+lSHvQ1F7P9YlopdAlJy013S9mQKGE6vPNLALvDkzWNamTMgDqymXPemGdeOOQJwt6Hp7kVhvT4Ela8I2sMAXUBKRy27a3h0AAAAASUVORK5CYII=" />
        </button>
        <button onClick={getFavorites}>
          <img
            style={{ width: "30px" }}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAADmElEQVR4nO2cS2wNURiAvyrq2VXbTR9BsSLBsvFYWiBBrVjUxqN0TyX2ykJSS2FlUami9ViQkCiVIEFChJAgEpRKKxG1YOTIP8nJzb2993ZmzLlz/i85yb239/znzpeZ/7xmCoqiKIqiKIqiKEqGaAL6ge9AUGb5DbwFLgBteCpvbBriggLlGFCFR/TLgV8BGqdRfwawCDgKTEqsbjwivGynIy+XjcAf4AfQgieEl15cnJN4x/GEuAWukXjfgHl4QNwCDQ9i7JSSKCZtDQDLcFTgbgcklVLG4sj9SQh0HSPtqhz3+ajBfBRoaJbjHicivgqM7dhVYEwCzwBfHEjsQaX1zGn/8KDSe+Yg4lwY33vmUKCP8u4Bw1F75lCgjwwDd6L68FlgPlRgRFRghBzonMB6WZ2+D3wGfgGvgYvAdmBWnjrms3bgEvBG6pi6I8BhoM6XHNgFTBQZcz0GVll1VgNPitQxMTtJDicE9lpxLwObgAZgNrAEOAi8kr+b5f+1wDp5bT57Kd9ZLHVM3c3AoBX3JBkV2GWJMZdpIebK9DEcd43L69PAnCnqtVui92ctB9Zbl+1U8uwdvT7rN/TJZ8XYYYmvy1IO7LYu21JZALyQYl6XypC0dYh4SVXgiMQyOa8cVkophy3S1l0yJHBUYplLOWkapC0zxMlMDpyUWDUkT420ZdrMTA58L7HMqkbStEhb72KOm6rA6xJrJ8mzS9oya3iZEdgpsW6RPLelrX1ZyoELrX2VrSTHNqsDKWfo43wONByQeF+BVuKnVWLHMRPJR+oCq2R/JZBOJU6JrVZHNZTQjZypCzTUAo9ilmjLeyjpIirO5UCbekvip4j3T7dJjFBeXGuCTubA3DPxpjXg7aB8OqwB+o2YzrypcEqgYSZwymrnBFBNcarlu2G9XomFbwJD9sryfDj4NWdnIWqtTW5TZw/J4HQOzMd6a8Hhmaw452JWrJ/Ld0alTlI4nwMLPZcSdi4fZR8kZAXwQf72tIDgpHFeIDJ7GLRWlTdIGbcWZOeTDhUhEOkQzkrbP6UEsk9SSifjZQ7Mxcwkeqzf0POfHxOryByYjyNSXKAiBbqECvQpB6ZNZnKgS6jANAXm5gTf3kcWmJsTfHtv0Es4ImULDO+mMpN832m25uclM2Ct0fkssQm4Ji7MP+IomeXWNqEW/j3qtbRc+43yeFOxe5qDDJcJOfPKlqcoiqIoiqIoiqLgKn8BLZ9G7gnYagoAAAAASUVORK5CYII="
          />
        </button>
      </div>
      <div className="tabSet">
        {folder.length < 0 ? (
          <p>No Folder</p>
        ) : (
          <>
            {folder.map((data, index) => (
              <>
                <input
                  type="radio"
                  name="tabSet"
                  id={`tab${index + 1}`}
                  aria-controls={data.folder_name}
                  defaultChecked=""
                  placeholder={index + 1}
                />
                <label
                  htmlFor={`tab${index + 1}`}
                  onClick={() => getFilesForFolder(data.uid)}
                >
                  {data.folder_name}
                </label>
              </>
            ))}
          </>
        )}

        <a href="#modal-opened" className="link-1" id="modal-closed">
          ADD Folder
        </a>
        <div className="tab-panels">
          {folder.map((data) => (
            <section id={data.folder_name} className="tab-panel" key={data.uid}>
              <h2>{data.folder_name}</h2>
              <div className="actions">
                <div className="action like">
                  {data.favorite === false ? (
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC60lEQVR4nO2YSUhVURjHfypZUWlQpkWDFOUiW1S2iCAQWphFmyaCKIMQyoigQKigaNM6hAaigsho2ESthAiSgmolDdpk0yabB0p7vNI49H9wEOPdcwfffXB/cODx3v3/z3fuO8N3PkhISEhISEhwZgRQBxwDOoAeIAW8BG4CB4DZHnzMMweBdmlT8uqQd536Cp0CYC3wFBjw0K4BlUP4VOo3Lx5PgDVhDmI00Gp10AnsA2qAcg1yElALHAe+67kfwGbLpwH4qd++6dlaaQvktQjYD3RZ/Z0DRoUxiNsy/KJgirJoxilIo+kHmtT69Z2ZOmOzeBQBW4Cv0txSLL4wb+mCjJ4Dcxz1ZiqmNYB+fV7t6FEFdCuG84rJmQ0y+OxjEBm2WlNku0+PKsVgPNa5ioutN7GJYJxSC0KDYulWbJ5ZKeEDoDBgECVqQSgEHimmFS7C0xI1Ex/2KqaTLqL7Ei0gPtQoJnNoeuajRBOIDxMV0wcXUUoip4UVMcWKycTmmfcSlREfyhWTyck8k9kh5hMfFlo7qWcyuVUj8WGbYjrrItop0UXiw2XFtMNFVKn8qFdJYK4pBfqAP8A0V3G73sAeck+zYrnhR7xK4nc5/ldKrF203o+BSZnvyaCF3HFUMdwJmhakNTeXMfwsV9/pMI6Cw1ZqMNQ9PCpmAp/U96EwDM21s02Gr4AZRM9U6z503cP12jNlqmoY48dABdEx2arWdEWRuJp/4o06MCnM9LA74F8fnerjtZ8zw6WjZ9aaWRqi92LgrbxfALOImCnWtmxO240heJr61y953tX0GhZGAmesColJ5Mb48DGFtyOWT2uQ+lUQdgO/FcRDoNpBO8+6LphzYhc5ZokK0QNKMpuyFNIKlMH2WevBrI9YYPKhE9YUafvPPC8bVMS+BIwnhqy3Chc9g5K8en2X2fFMSTXWVABXrSJ2i1qmiH1F9++8oVFrJjONelULzkuqdVKbNpc8p1QtISEhgcD8BZSX5H28QAygAAAAAElFTkSuQmCC"
                      onClick={() =>
                        FavoriteUpdateFolder(data.uid, data.favorite)
                      }
                    />
                  ) : (
                    <img
                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB70lEQVR4nO2Yv0sdQRSFvydGicFCiUIKwTaJ8a9IoRHSJY19EGxEAum1sbaKgZSaQKzsFAUhahOIGn9AgggWARWxM+EJccLALR6LqzM7s+9dYT44zbLvzjlvZ3ZmLyQSiUQikfDmHjAIvAe2gWOgChwBX4EJoM+hTp/cuya/rUqtLak9IGNFpwK8Bn4BxkHLwONr6jwBVhxr/AReydhRuA98chy8VpfAWE2dcbnmW2dWPASH2CgweK3sFJoMrLEeEsY+0rlAAzH1peg0G1Zg3mRk16kXLcChAuMmowPx5sxLBaZNjoZ8gnxUYNjk6INPkB0Fhk2O7KbpzJkCwyZHpz5Bimxc9dKlT5BzBYZNjuxscWZPgWGTI7t+nfmswLDJkT1tODOqwLDJ0YhPkF7gSoFpk9E/oAdPlhUYNxktUoAXCoybjOyXYyHWFJg3olUCeKZkc6wCTwnknYIgb4lApeA3eyzNx2xAPAA2GxBiE2gjMt3AjzqG2AceURIdwLc6PYmHlEynvArLCrEif1hdaAamSwgxU1ar9DbsAe5PhAC2xhsajO3xfg8IsQv0o4RWYEpOp64BrmQqBfd1y+A58NshxIlvf6oRdAELN4RYKnN/iE1FFu9FTYC/cm5r4g7SL42MPU0LuijtokQikSCY/wtr6za2rYeWAAAAAElFTkSuQmCC"
                      onClick={() =>
                        FavoriteUpdateFolder(data.uid, data.favorite)
                      }
                    />
                  )}
                </div>
                <div className="action delete">
                  <img
                    onClick={() => deleteFolder(data.uid)}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAj0lEQVR4nOXQsQmAUBAD0CA4xK/cwsotfuUWv7K2tLFyCxdxEodQFG2srC45QdBAysuDA/6SFsBxa6cMHQ/1PeAbGRyvGSxA4wAaC1A7gNoCVA6gsgCFAygsQA5gE8b369aUWQBmEJkEYGKAUQBGBugFoGeAJACJAaIARAYoBaBkgCAAgQEyAAsxvl43H8wJ42Pzg7ru6aMAAAAASUVORK5CYII="
                  />
                </div>

                <div className="action share">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nO2UOwrCQBCGv0oIWJjCgOmscgf1MkEbvUEOIB5HWysPYKeF2krsBe0jgQksy+a1YQvFH7YYZvf/Zmcf8BcsgcBVI1ZABpxdQYbASSAXYPQVEB+IgR1wBd5innVtlwckwFMzzJoCigkmhcBRmbMHFkAEjMW0tvoyQAjcJZe3ZKbkgqbmZQBPqfwADLpcUxMgUW6Hbt76oekAXzlQtS3W0gGxcqC4AGwlnrsC3CSOXAFeEvddAaoeXpVK19kaNvZ5SGKCvabikZqSm5pPLGsx1iZATyDFTmxGKua514/oA2Jde6sWveH4AAAAAElFTkSuQmCC"
                    /*
                    onClick={() =>
                      copyToClipboard(
                        `http://localhost:5173/share/${data.uid}`,
                        `${data.uid}`
                      )
                    }
                    */
                  />
                </div>
                <div className="file-container">
                  {files.length > 0 ? (
                    files.map((data) => (
                      <div className="file-con" key={data.uid}>
                        {(inTrash = data.trash)}
                        {inTrash === true ? (
                          ""
                        ) : (
                          <div key={data.uid} className="file-card" id="curve">
                            <p style={{ display: "none" }}>
                              {(inTrash = data.trash)}
                            </p>
                            <embed
                              src={`http://127.0.0.1:8000/${data.file}`}
                              type=""
                              className="embed"
                            />
                            <div className="footer">
                              <div className="connections">
                                <div className="connection see">
                                  <img
                                    width={"30px"}
                                    onClick={() => openLink(data.file)}
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAABkklEQVR4nO2WvUoDQRSFPwsjoomk8wHEUpNgL9aKnVjYii/hT2FEIwgS8hBKgp1gY6ddYpGHWPNjKRKrRAZuYBj3zu5iRIs9cJs7557D3Duzs5AixT/AGlAGHoEOMJDoSO4UKE3ScBt4AUYxowls/cRwGXhIYOjGPbCU1HQX+AgR6wGHQAGYkygCR7Lm8t+BnTiGU8A5MAwRqQNZT61Za4TUGa0z0VZNa0rb6r5CRyPMfARUNY0rpaAXsVMXOaCvaF265APPITEztZERgVcgACqSs3Hs0dsfk1aBTw/RrNuohHBMzkbRozcAVgypFXEt3DYHIRyTs5GN0GwZUvsXjHMRmm1D2lCuzzgKMVp9kaDVQ2B9TKx6iObjYCMj5oHncJ149K5dsecJXacF4E3RegKm3YK8Z96NBB+QO89c81rhorwumnkuYqeaaVO0vZgFbhWBvnwczLs7L1GSmWrtvRHNWDAt21OuTtwIRCPOiL4hKy+LthutK+WEB1LFDLApr5c5/V3r16cruZpwDDdFCv4MXw/YJO5+W1zLAAAAAElFTkSuQmCC"
                                  ></img>
                                </div>
                                <div className="connection like">
                                  {data.favorite === false ? (
                                    <img
                                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC60lEQVR4nO2YSUhVURjHfypZUWlQpkWDFOUiW1S2iCAQWphFmyaCKIMQyoigQKigaNM6hAaigsho2ESthAiSgmolDdpk0yabB0p7vNI49H9wEOPdcwfffXB/cODx3v3/z3fuO8N3PkhISEhISEhwZgRQBxwDOoAeIAW8BG4CB4DZHnzMMweBdmlT8uqQd536Cp0CYC3wFBjw0K4BlUP4VOo3Lx5PgDVhDmI00Gp10AnsA2qAcg1yElALHAe+67kfwGbLpwH4qd++6dlaaQvktQjYD3RZ/Z0DRoUxiNsy/KJgirJoxilIo+kHmtT69Z2ZOmOzeBQBW4Cv0txSLL4wb+mCjJ4Dcxz1ZiqmNYB+fV7t6FEFdCuG84rJmQ0y+OxjEBm2WlNku0+PKsVgPNa5ioutN7GJYJxSC0KDYulWbJ5ZKeEDoDBgECVqQSgEHimmFS7C0xI1Ex/2KqaTLqL7Ei0gPtQoJnNoeuajRBOIDxMV0wcXUUoip4UVMcWKycTmmfcSlREfyhWTyck8k9kh5hMfFlo7qWcyuVUj8WGbYjrrItop0UXiw2XFtMNFVKn8qFdJYK4pBfqAP8A0V3G73sAeck+zYrnhR7xK4nc5/ldKrF203o+BSZnvyaCF3HFUMdwJmhakNTeXMfwsV9/pMI6Cw1ZqMNQ9PCpmAp/U96EwDM21s02Gr4AZRM9U6z503cP12jNlqmoY48dABdEx2arWdEWRuJp/4o06MCnM9LA74F8fnerjtZ8zw6WjZ9aaWRqi92LgrbxfALOImCnWtmxO240heJr61y953tX0GhZGAmesColJ5Mb48DGFtyOWT2uQ+lUQdgO/FcRDoNpBO8+6LphzYhc5ZokK0QNKMpuyFNIKlMH2WevBrI9YYPKhE9YUafvPPC8bVMS+BIwnhqy3Chc9g5K8en2X2fFMSTXWVABXrSJ2i1qmiH1F9++8oVFrJjONelULzkuqdVKbNpc8p1QtISEhgcD8BZSX5H28QAygAAAAAElFTkSuQmCC"
                                      onClick={() =>
                                        FavoriteUpdateFile(
                                          data.uid,
                                          data.favorite
                                        )
                                      }
                                    />
                                  ) : (
                                    <img
                                      src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB70lEQVR4nO2Yv0sdQRSFvydGicFCiUIKwTaJ8a9IoRHSJY19EGxEAum1sbaKgZSaQKzsFAUhahOIGn9AgggWARWxM+EJccLALR6LqzM7s+9dYT44zbLvzjlvZ3ZmLyQSiUQikfDmHjAIvAe2gWOgChwBX4EJoM+hTp/cuya/rUqtLak9IGNFpwK8Bn4BxkHLwONr6jwBVhxr/AReydhRuA98chy8VpfAWE2dcbnmW2dWPASH2CgweK3sFJoMrLEeEsY+0rlAAzH1peg0G1Zg3mRk16kXLcChAuMmowPx5sxLBaZNjoZ8gnxUYNjk6INPkB0Fhk2O7KbpzJkCwyZHpz5Bimxc9dKlT5BzBYZNjuxscWZPgWGTI7t+nfmswLDJkT1tODOqwLDJ0YhPkF7gSoFpk9E/oAdPlhUYNxktUoAXCoybjOyXYyHWFJg3olUCeKZkc6wCTwnknYIgb4lApeA3eyzNx2xAPAA2GxBiE2gjMt3AjzqG2AceURIdwLc6PYmHlEynvArLCrEif1hdaAamSwgxU1ar9DbsAe5PhAC2xhsajO3xfg8IsQv0o4RWYEpOp64BrmQqBfd1y+A58NshxIlvf6oRdAELN4RYKnN/iE1FFu9FTYC/cm5r4g7SL42MPU0LuijtokQikSCY/wtr6za2rYeWAAAAAElFTkSuQmCC"
                                      onClick={() =>
                                        FavoriteUpdateFile(
                                          data.uid,
                                          data.favorite
                                        )
                                      }
                                    />
                                  )}
                                </div>
                                <div className="connection delete">
                                  <img
                                    onClick={() => getTrashFolder(data.uid)}
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAj0lEQVR4nOXQsQmAUBAD0CA4xK/cwsotfuUWv7K2tLFyCxdxEodQFG2srC45QdBAysuDA/6SFsBxa6cMHQ/1PeAbGRyvGSxA4wAaC1A7gNoCVA6gsgCFAygsQA5gE8b369aUWQBmEJkEYGKAUQBGBugFoGeAJACJAaIARAYoBaBkgCAAgQEyAAsxvl43H8wJ42Pzg7ru6aMAAAAASUVORK5CYII="
                                  />
                                </div>
                                <div className="connection download">
                                  <img
                                    //onClick={() => fileDownload(data.uid)}
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAg0lEQVR4nO2UOwqAMBBE3zWsLCxsLLSw8vYGPYSghYVgIR4hErAQ/58EQfNgIBCYIRN24U9kgBwlTATImWzAAmkr+l5F1Yrplso7ATHQnTDvgeTuKyKg3TFXdyEP8YF6xbwBAjThAsXEXP2Ph2YcIB+3qjpb9CMuDJY8kDAdkBoo4CUG+aZ0PJTVTQsAAAAASUVORK5CYII="
                                  />
                                </div>
                                <div className="connection share">
                                  <img
                                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA5ElEQVR4nO2UOwrCQBCGv0oIWJjCgOmscgf1MkEbvUEOIB5HWysPYKeF2krsBe0jgQksy+a1YQvFH7YYZvf/Zmcf8BcsgcBVI1ZABpxdQYbASSAXYPQVEB+IgR1wBd5innVtlwckwFMzzJoCigkmhcBRmbMHFkAEjMW0tvoyQAjcJZe3ZKbkgqbmZQBPqfwADLpcUxMgUW6Hbt76oekAXzlQtS3W0gGxcqC4AGwlnrsC3CSOXAFeEvddAaoeXpVK19kaNvZ5SGKCvabikZqSm5pPLGsx1iZATyDFTmxGKua514/oA2Jde6sWveH4AAAAAElFTkSuQmCC"
                                    onClick={() =>
                                      copyToClipboard(
                                        `http://localhost:5173/share/${data.uid}`,
                                        `${data.uid}`
                                      )
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
                                <div className="name">{data.file_name}</div>

                                <div className="created">
                                  {convertToRegularTime(data.date_created)}
                                </div>
                              </div>
                            </div>
                            <div className="card-blur" />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ position: "relative", top: "5%" }}>
                      <h1>No File</h1>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>

        <>
          <div className="modal-container" id="modal-opened">
            <div className="modal">
              <div className="modal__details">
                <h1 className="modal__title">Create New Folder</h1>
                <p className="modal__description">
                  Store All your Files in an organized Manner
                </p>
              </div>
              <br />
              <label htmlFor="create-folder-input" id="folder-input-label">
                Folder Name
              </label>
              <br />
              <input
                type="text"
                name=""
                id="create-folder-input"
                onChange={(e) => setFolderNameInput(e.target.value)}
                value={folderNameInput}
              />
              <br />
              <button className="modal__btn" onClick={createFolder}>
                Button →
              </button>
              <a href="#modal-closed" className="link-2" />
            </div>
          </div>
        </>
      </div>
    </>
  );
}
