import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/mainscreen.css";
import { useNavigate } from "react-router-dom";

import LeftSidebar from "./leftsidebar";
import MainContent from "./MainContent";
import RightSidebar from "./RightSidebar";

const MainScreen = () => {
  const [userProfile, setUserProfile] = useState(null); // To store the user profile data
  const navigate = useNavigate(); // Use navigate hook for redirection

  // Fetch user profile data on component mount and set up polling
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user/getprofile", {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUserProfile(response.data.user); // Store the user profile data
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        // Check if the error is related to token expiration
        if (error.response && error.response.status === 401) {
          // Token expired or not valid, log the user out
          handleLogout();
        }
      }
    };

    // Initial fetch
    fetchUserProfile();

    // Polling every 2 seconds to check if the user is still authorized
    const interval = setInterval(fetchUserProfile, 2000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures it runs only once on mount

  // Function to handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:8080/user/logout", {}, { withCredentials: true });

      if (response.status === 200) {
        navigate("/"); // Redirect to home page after logout
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <div className="main-screen-container">
        <nav className="navbar">
          <div className="logo">
            <span>Uni-Threads</span>
          </div>
          <div className="search-bar" style={{ flex: "1" }}>
            <input type="text" placeholder="Search" />
          </div>
          <div className="nav-icons">
            <a href="#" className="icon">Home</a>
            <a href="#" className="icon">Chats</a>
            <a href="#" className="icon">Settings</a>
          </div>
          <div className="profile">
            {userProfile ? (
              <>
                <img
                  src={userProfile.profilePicture || "/profile.jpg"}
                  alt="Profile Picture"
                  style={{
                    width: "51px",
                    height: "51px",
                    borderRadius: "50%",
                    marginRight: "10px",
                  }}
                />
                <span className="profile-name">{userProfile.username}</span>
              </>
            ) : (
              <span>Loading...</span>
            )}
            <button className="logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </nav>

        <div className="dashboard">
          <LeftSidebar userProfile={userProfile} />
          <MainContent />
          <RightSidebar/>
        </div>
      </div>
    </>
  );
};

export default MainScreen;
