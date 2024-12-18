import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toggleForm } from "../utils/formToggle";

const RegisterForm = () => {
  const [input, setInput] = useState({
    username: "",
    email: "",
    university: "",
  });
  const [buttonText, setButtonText] = useState("Verify and Sign Up");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // To show error messages
  const navigate = useNavigate();

  const universities = [
    "Chitkara University",
    "Chandigarh University",
    "Amity University",
    "Punjab University",
    "University of Delhi (DU)"
    // "Banaras Hindu University (BHU)",
    // "Indian Institute of Technology (IIT) Madras",
    // "Amity University",
    // "Manipal Academy of Higher Education",
    // "Birla Institute of Technology and Science (BITS) Pilani",
  ]; // Add more Indian universities as needed

  // Change handler for input fields
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Function to check if the username or email already exists
  const checkUserExistence = async () => {
    try {
      const response = await axios.post("http://localhost:8080/user/user/check", {
        username: input.username,
        email: input.email,
      });

      if (response.data.exists) {
        alert("Username or Email is already taken. Please try a different one.");
        return true;
      }
      return false;
    } catch (error) {
      setErrorMessage("Error checking user existence. Please try again.");
      return true;
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // First, check if the username or email exists
    const isUserExist = await checkUserExistence();
    if (isUserExist) {
      return; // If the user already exists, don't proceed
    }

    // Store data in localStorage
    localStorage.setItem("userInfo", JSON.stringify(input));

    // Send OTP request
    try {
      const response = await axios.post("http://localhost:8080/otp/send-otp", {
        email: input.email,
      });

      if (response.status === 200) {
        alert("OTP has been sent to your email!");
        navigate("/verifyemail");
        setIsButtonDisabled(true); // Disable the button once OTP is sent
      }
    } catch (error) {
      alert("Error sending OTP. Please try again.");
    }
  };

  return (
    <div className="top1">
      <div className="register-container" id="register">
        <div className="top">
          <span>
            Already have an account?{" "}
            <a href="#" onClick={() => toggleForm("login")}>
              Login
            </a>
          </span>
          <header>Sign Up</header>
        </div>
        <form onSubmit={handleSubmit} className="formtemp">
          <div className="input-box">
            <input
              type="text"
              className="input-field"
              placeholder="Name"
              id="re"
              name="Name"
              value={input.Name}
              onChange={changeEventHandler}
            />
            <i className="bx bx-user"></i>
          </div>

          <div className="input-box">
            <input
              type="text"
              className="input-field"
              placeholder="Username"
              id="re"
              name="username"
              value={input.username}
              onChange={changeEventHandler}
            />
            <i className="bx bx-user"></i>
          </div>
          <div className="input-box">
            <input
              type="email"
              className="input-field"
              placeholder="Email"
              id="re-email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
            />
            <i className="bx bx-user"></i>
          </div>
          <div className="input-box">
  <select
    className="input-field select-field"
    id="university"
    name="university"
    value={input.university}
    onChange={changeEventHandler}
    style={{ color: "white",  }} // Set the text color to white and background to black
  >
    <option value="" style={{ color:"black"  }}>Select Your University</option> {/* Make the default option text white */}
    {universities.map((university, index) => (
      <option key={index} value={university} style={{ color: "black" }}>
        {university}
      </option>
    ))}
  </select>
  <i className="bx bx-user"></i>
</div>


          {/* Display error message if any */}
          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          {/* Verify and Signup input */}
          <div className="input-box">
            <input
              type="submit"
              className="submit"
              value={buttonText}
              id="submit"
              disabled={isButtonDisabled} // Disable once OTP is sent
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;

