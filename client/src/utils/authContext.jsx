import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/auth/check-auth`, {
      method: "GET",
      withCrentials: true,
    })
      .then((response) => {
        console.log('check-auth response', response)
        return response.json();
      })
      .then((data) => {
        console.log('check-auth data', data)
        if (data?.authenticated) {
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      })
      .catch((err) => console.error("Error checking auth status:", err));
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};
