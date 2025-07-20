// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import {decodeToken, handleLogout, returnToken} from "@/utils/index.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 important

  useEffect(() => {
    const init = async () => {
      const token = returnToken();
      if (token) {
        try {
          const decoded = decodeToken(token);
          if (decoded?.exp * 1000 < Date.now()) {
            handleLogout("","/auth/sign-in");
            setUserData(null);
          } else {
            setUserData(decoded);
          }
        } catch (e) {
          handleLogout("","/auth/sign-in");
        }
      }
      setLoading(false); // 👈 only after all checks
    };

    init();
  }, []);

  return (
    <AuthContext.Provider value={{ userData, setUserData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
