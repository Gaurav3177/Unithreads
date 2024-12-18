// utils/auth.js
export const isAuthenticated = () => {
  // Check if a token exists in the cookies
  const token = document.cookie.split('; ').find(row => row.startsWith('token='));
  return token ? true : false;  // Return true if token exists, else false
};
