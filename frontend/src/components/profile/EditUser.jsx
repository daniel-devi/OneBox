import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./EditUser.css";

export default function EditGetUser() {
  const [userData, setUserData] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [userProfileInput, setUserProfileInput] = useState();
  const [userid, setUserid] = useState();

  const navigate = useNavigate();
  let userId = "";

  useEffect(() => {
    getFiles();
  }, []);

  function handleReturnProfileClick() {
    navigate("/profile");
  }

  const getFiles = () => {
    api
      .get("/api/file/first")
      .then((res) => res.data)
      .then((data) => {
        const [{ user }] = data;
        userId = user;
        getUser();
      })
      .catch((err) => alert(err));
  };

  const getUser = () => {
    api
      .get(`/api/user/details/${userId}`)
      .then((res) => res.data)
      .then((data) => {
        setUserData(data[0]);
        getUserProfile();
        setProfileData({
          first_name: data[0].first_name,
          last_name: data[0].last_name,
          email: data[0].email,
        });
      })
      .catch((err) => alert(err));
  };

  // Get User Profile
  const getUserProfile = () => {
    api
      .get(`/api/profile/${userId}`)
      .then((res) => res.data)
      .then((data) => {
        setUserProfile(data[0]);
        setUserid(userId);
      })
      .catch((err) => alert(err));
  };

  // Change User Detail
  const ChangeUserDetail = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("first_name", profileData.first_name);
    formData.append("last_name", profileData.last_name);
    formData.append("email", profileData.email);
    api
      .put(`/api/update_profile/${userid}/`, formData)
      .then((res) => res.data)
      .then((data) => {
        userId = userid
        getUser()
      })
      .catch((err) => alert(err));
    };

  // Change User Profile Picture
  const changeUserProfile = (e) => {
    e.preventDefault();
    let Data = new FormData();
    Data.append("profile_picture", userProfileInput[0]);
    console.log(userId);

    api
      .put(`/api/profile/change/${userId}`)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        console.log(userProfileInput);
      })
      .catch((err) => console.log(err));
  };

  // Onchange Input Box
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(); // Log user data when it updates
  }, [userData]);

  useEffect(() => {
    console.log(); // Log user Profile when it updates
  }, [userProfile]);

  return (
    <>
      <h2>EDIT</h2>

      <div className="container mt-4 mb-4 p-3 d-flex justify-content-center box">
        <div className="card p-4">
          <a
            onClick={handleReturnProfileClick}
            style={{
              position: "relative",
              textAlign: "left",
              fontSize: "1.0rem",
              margin: "5px 0",
            }}
          >
            {"<"} Back
          </a>
          <div className=" image d-flex flex-column justify-content-center align-items-center">
            <button className="btn btn-secondary">
              <img src={userProfile.profile_picture} height={100} width={100} />
            </button>
            <form className="profile-pic-edit" onSubmit={changeUserProfile}>
              <input
                type="file"
                name=""
                id="input"
                onChange={(e) => setUserProfileInput(e.target.value)}
                required={true}
              />
              <button className="change-btn">Change</button>
            </form>
            <span className="name mt-3">
              {userData.first_name} {userData.last_name}
            </span>
            <div className="name-update">
              <label htmlFor="">First Name</label>
              <input
                type="text"
                name="first_name"
                id=""
                value={profileData.first_name}
                onChange={handleInputChange}
              />
              <label htmlFor="">Last Name</label>
              <input
                type="text"
                name="last_name"
                id=""
                value={profileData.last_name}
                onChange={handleInputChange}
              />
            </div>
            <span className="idd">@{userData.username}</span>
            <div className="d-flex flex-row justify-content-center align-items-center gap-2">
              <span className="idd1">Email: {userData.email}</span>
            </div>
            <div className="email">
              <label htmlFor="">Email</label>
              <input
                type="text"
                name="email"
                id=""
                onChange={handleInputChange}
                value={profileData.email}
              />
            </div>
            <div className="d-flex flex-row justify-content-center align-items-center mt-3"></div>
            <div className=" d-flex mt-2">
              <button className="btn1 btn-dark" onClick={ChangeUserDetail}>
                Save Profile
              </button>
            </div>
            <div className="text mt-3">
              <span>{userProfile.bio}.</span>
            </div>
            <span className="join">Joined {userData.date_joined}</span>
          </div>
          <span>Change Password</span>
        </div>
      </div>
    </>
  );
}
