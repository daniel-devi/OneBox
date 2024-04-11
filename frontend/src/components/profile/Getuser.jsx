import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Getuser.css";

export default function GetUser() {
  const [userData, setUserData] = useState([]);
  const [userProfile, setUserProfile] = useState([]);

  const navigate = useNavigate();

  let userId = "";

  useEffect(() => {
    getFiles();
  }, []);

  function handleEditClick() {
    navigate("/profile-edit");
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
      })
      .catch((err) => console.log(err));
  };

  // Get User Profile
  const getUserProfile = () => {
    api
      .get(`/api/profile/${userId}`)
      .then((res) => res.data)
      .then((data) => {
        setUserProfile(data[0]);
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    console.log(); // Log user data when it updates
  }, [userData]);

  useEffect(() => {
    console.log(); // Log user Profile when it updates
  }, [userProfile]);
  return (
    <>
      <h2>Profile</h2>

      <div className="container mt-4 mb-4 p-3 d-flex justify-content-center box">
        <div className="profile-card p-4">
          <div className=" image d-flex flex-column justify-content-center align-items-center">
            <button className="btn btn-secondary">
              <img src={userProfile.profile_picture} height={100} width={100} />
            </button>
            <span className="name mt-3">
              {userData.first_name} {userData.last_name}
            </span>
            <span className="idd">@{userData.username}</span>
            <div className="d-flex flex-row justify-content-center align-items-center gap-2">
              <span className="idd1">Email: {userData.email}</span>
              <span>
                <i className="fa fa-copy" />
              </span>
            </div>
            <div className="d-flex flex-row justify-content-center align-items-center mt-3"></div>
            <div className=" d-flex mt-2">
              <button className="btn1 btn-dark" onClick={handleEditClick}>
                Edit Profile
              </button>
            </div>
            <div className="text mt-3">
              <span>{userProfile.bio}.</span>
            </div>

            <span className="join">Joined {userData.date_joined}</span>
          </div>
        </div>
      </div>
    </>
  );
}
