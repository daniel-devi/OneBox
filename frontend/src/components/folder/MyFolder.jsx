import React, { useState, useEffect } from "react";
import { useRef } from "react";
import "./MyFolder.css";
import api from "../api";

export default function MyFolder() {
  const [folder, setFolder] = useState([]);
  const [folderNameInput, setFolderNameInput] = useState("");

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
        getFolders();
      })
      .catch((err) => console.log(err));
  };

  /// Create Folder Api ///////////////
  const createFolder = (e) => {
    userId = folder[0].user;

    e.preventDefault();
    api
      .get("/api/folder/create", {
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
    api
      .get(`/api/folder/no-trash/${userId}`)
      .then((res) => res.data)
      .then((data) => {
        const Data = data;
        setFolder(Data);
        console.log(folder);
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

  return (
    <>
      <div className="tabSet">
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
            <label htmlFor={`tab${index + 1}`}>{data.folder_name}</label>
          </>
        ))}

        <a href="#modal-opened" className="link-1" id="modal-closed">
          ADD Folder
        </a>
        <div className="tab-panels">
          {folder.map((data) => (
            <section id={data.folder_name} className="tab-panel" key={data.uid}>
              <h2>{data.folder_name}</h2>
              <div className="tools">
                <div className="connection like">
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
                <div className="connection delete">
                  <img
                    onClick={() => deleteFolder(data.uid)}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAj0lEQVR4nOXQsQmAUBAD0CA4xK/cwsotfuUWv7K2tLFyCxdxEodQFG2srC45QdBAysuDA/6SFsBxa6cMHQ/1PeAbGRyvGSxA4wAaC1A7gNoCVA6gsgCFAygsQA5gE8b369aUWQBmEJkEYGKAUQBGBugFoGeAJACJAaIARAYoBaBkgCAAgQEyAAsxvl43H8wJ42Pzg7ru6aMAAAAASUVORK5CYII="
                  />
                </div>

                <div className="connection share">
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
