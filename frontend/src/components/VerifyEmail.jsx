import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState(""); // Separate state for password
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [buttonText, setButtonText] = useState("Verify and Signup");

  const navigate = useNavigate();

  // Retrieve user data from localStorage
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { username, email, university, Name } = userInfo || {};

  // Ensure that the required user information is available
  if (!username || !email || !university) {
    alert("Missing user information. Please check the data");
    return; // Exit the component if essential data is missing
  }

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value); // Update password state
  };

  // Function to handle OTP verification and user registration
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("OTP is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setIsButtonDisabled(true);
      setButtonText("Verifying...");

      console.log("Verifying OTP for:", email, otp); // Debugging

      // Step 1: Verify OTP
      const otpResponse = await axios.post("http://localhost:8080/otp/verify-otp", { email, otp });

      if (otpResponse.status === 200) {
        alert("OTP verified successfully");

        // Step 2: Register the user
        const registerResponse = await axios.post("http://localhost:8080/user/register", {
          username,
          email,
          password, // Use the entered password
          Name,
          university, // Pass the university value from localStorage
        });

        if (registerResponse.status === 201) {
          alert("Account created successfully!");
          navigate("/"); // Redirect to login page after successful registration
        } else {
          setError("Error creating account. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);

      // Check if the error is due to network or server issues
      if (error.response) {
        setError(error.response.data.message || "Invalid OTP or error occurred. Please try again.");
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setIsButtonDisabled(false);
      setButtonText("Verify and Signup");
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
            <header>Verify Email</header>
          </div>
          <form onSubmit={handleVerifyOtp}>
            <div className="input-box">
              <input
                type="text"
                className="input-field"
                placeholder="Enter OTP"
                id="otp"
                name="otp"
                value={otp}
                onChange={handleOtpChange}
                style={{ marginBottom: "20px" }} // Add space below the OTP input
              />
            </div>

            <div className="input-box">
              <input
                type="password"
                className="input-field"
                placeholder="Create Password"
                id="password"
                name="password"
                value={password}
                onChange={handlePasswordChange} // Use correct handler
                style={{ marginBottom: "20px" }} // Add space below the password input
              />
            </div>

            {error && <div className="error-message">{error}</div>} {/* Display error messages */}

            <div className="input-box">
              <input
                type="submit"
                className="submit"
                value={buttonText}
                id="resubmit"
                disabled={isButtonDisabled} // Disable the button after submission
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
