import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const VerifyForm = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [buttonText, setButtonText] = useState("Send OTP");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSendOtp = async () => {
    if (!email) {
      setError("Email is required.");
      alert("Please enter an email address.");
      return;
    }

    setLoading(true); // Start loading
    setError("");

    try {
      const checkEmailResponse = await axios.post("http://localhost:8080/user/user/check", { email });

      if (!checkEmailResponse.data.exists) {
        alert("Email not found. Please register first.");
        setLoading(false); // Stop loading
        navigate("/");
        return;
      }

      const response = await axios.post("http://localhost:8080/otp/send-otp", { email });

      if (response.status === 200) {
        setOtpSent(true);
        setButtonText("OTP Sent ✔");
        setIsButtonDisabled(true);
        localStorage.setItem("email", email);
      }
    } catch (error) {
      setError("Error sending OTP. Please try again.");
      setButtonText("Send OTP");
      setIsButtonDisabled(false);
      alert("Error sending OTP. Please try again.");
    } finally {
      setLoading(false); // Stop loading in all cases
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("OTP is required.");
      alert("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/otp/verify-otp", { email, otp });
      if (response.status === 200) {
        alert("OTP verified successfully!");
        navigate("/newpass");
      }
    } catch (error) {
      alert("Invalid OTP. Please try again.");
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
          <form onSubmit={handleVerifyOtp}>
            <div className="input-box">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="email"
                  className="input-field"
                  placeholder="Email"
                  id="le"
                  name="Email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <button
                  type="button"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    border: "none",
                    borderRadius: "20px",
                    padding: "10px 20px",
                    color: "black",
                    fontWeight: "500",
                    cursor: loading ? "not-allowed" : "pointer", // Disable pointer when loading
                    fontSize: "12px",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                    textAlign: "center",
                  }}
                  onClick={handleSendOtp}
                  disabled={isButtonDisabled || loading} // Disable button when loading
                >
                  {loading ? "Sending..." : buttonText} {/* Show loading text */}
                </button>
              </div>
              <i className="bx bx-user"></i>
            </div>
            {error && <div style={{ color: "red" }}>{error}</div>}

            {/* OTP input and verify button appear only after OTP is sent */}
            {otpSent && (
              <>
                <div className="input-box">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter OTP"
                    id="otp"
                    name="OTP"
                    value={otp}
                    onChange={handleOtpChange}
                  />
                  <i className="bx bx-lock-alt"></i>
                </div>
                <div className="input-box">
                  <input type="submit" className="submit" value="Verify" id="lsubmit" />
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyForm;
