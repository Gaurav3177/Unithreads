// utils/formToggle.js
export const toggleForm = (formToShow) => {
    const loginForm = document.getElementById("login");
    const registerForm = document.getElementById("register");
  
    if (formToShow === "login") {
      loginForm.style.left = "0";
      registerForm.style.right = "-510px";
      loginForm.style.opacity = 1;
      registerForm.style.opacity = 0;
    } else {
      loginForm.style.left = "-510px";
      registerForm.style.right = "5px";
      loginForm.style.opacity = 0;
      registerForm.style.opacity = 1;
    }
  };
  