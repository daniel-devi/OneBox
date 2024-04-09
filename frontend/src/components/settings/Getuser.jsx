import React, { useState, useEffect } from "react";
import api from "../api";

export default function GetUser() {
  const [userData, setUserData] = useState([]);
  const [userProfile, setUserProfile] = useState([]);

  let userId = "";

  useEffect(() => {
    getFiles();
  }, []);

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
        getUserProfile()
      })
      .catch((err) => alert(err));
  };

  // Get User Profile
  const getUserProfile = () => {
    api
      .get(`/api/profile/${userId}`)
      .then((res) => res.data)
      .then((data) => {
       console.log(data)
       setUserProfile(data[0].profile_picture)
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    console.log(userData); // Log user data when it updates
  }, [userData]);

  useEffect(() => {
    console.log(userProfile); // Log user Profile when it updates
  }, [userProfile]);
  return (
    <div>
      <p>Profile Pic <img src={userProfile} alt="" /></p>
      <p>Username: {userData.username}</p>
      <p>First Name: {userData.firstName}</p>
      <p>Last Name: {userData.lastName}</p>
      <p>Email {userData.email}</p>
      <p>Date Joined: {userData.dateJoined}</p>
    </div>
  );
}
