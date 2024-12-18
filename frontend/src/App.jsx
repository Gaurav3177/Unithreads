import React, { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import axios from "axios";  
import Navbar from "./components/Navbar";
import MainScreen from "./components/MainScreen";
import Newpass from "./components/newpass";
import VerifyForm from "./components/verifyForm";
import VerifyEmail from "./components/VerifyEmail.jsx";
import "./App.css"
import Profile from "./components/profile.jsx";
import Community from "./components/community.jsx";



const RedirectToMain = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  useEffect(() => {

    const checkAuthentication = async () => {
      try {
  
        const response = await axios.get("http://localhost:8080/user/checkauth", { withCredentials: true });
        
       
        setIsAuthenticated(response.data.isAuthenticated);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();  
  }, []);


  if (isAuthenticated === null) {
    return <div>Loading...</div>;  
  }


  return isAuthenticated ? <Navigate to="/main" /> : <Navbar />;
};

const browserRouter = createBrowserRouter([
  {
    path: "/",
    element: <RedirectToMain />,  
  },
  {
    path: "/main",
    element: <MainScreen />,
  },
  {
    path: "/verify",
    element: <VerifyForm />,
  },
  {
    path: "/newpass",
    element: <Newpass />,
  },
  {
    path: "/verifyemail",
    element: <VerifyEmail />,
  },
  {
    path:"/profilepage",
    element:<Profile/>
  },
  {
    path:"/community",
    element:<Community/>
  }
]);


const App = () => {
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
};

export default App;
