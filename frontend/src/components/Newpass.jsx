import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Newpass = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const navigate = useNavigate();
  const email = localStorage.getItem("email");  
  useEffect(() => {
    if (!email) {
      setErrorMessage("Email is missing.");
      navigate("/"); 
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return; 
    setIsSubmitting(true); 

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsSubmitting(false); 
      return;
    }

    if (!password || !confirmPassword) {
      setErrorMessage("Both password and confirm password are required.");
      setIsSubmitting(false); 
      return;
    }


    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setIsSubmitting(false); 
      return;
    }

    try {
     
      if (!email) {
        setErrorMessage("Email is missing.");
        setIsSubmitting(false); 
        return;
      }

      const response = await axios.post(
        "http://localhost:8080/user/update",  
        { email, password ,confirmPassword},  
        { withCredentials: true }
      );

      if (response.data.success) {
        setSuccessMessage("Password updated successfully.");
        setErrorMessage(""); 
        setIsSubmitting(false); 
        setTimeout(() => navigate("/"), 1000); 
      } else {
        setErrorMessage(response.data.message);
        setSuccessMessage(""); 
        setIsSubmitting(false); 
      }
    } catch (error) {
      setErrorMessage("Error updating password.");
      setSuccessMessage(""); 
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wrapper">
      <video autoPlay muted loop id="background-video">
        <source src="/bgvideo.mp4" type="video/mp4" />
      </video>
      <nav className="nav">
        <div className="nav-button"></div>
      </nav>
      <div className="form-box">
        <div className="login-container" id="login">
          <div className="top">
            <header>Forgot Password</header>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="password"
                className="input-field"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="bx bx-lock-alt"></i>
            </div>
            <div className="input-box">
              <input
                type="password"
                className="input-field"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <i className="bx bx-lock-alt"></i>
            </div>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            {successMessage && <div style={{ color: "green" }}>{successMessage}</div>}
            <div className="input-box">
              <input type="submit" className="submit" value="Submit" id="lsubmit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Newpass;
