import axios from "axios";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../eviroment";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL:  `${server}/api/v1/users`,
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (name, userName, password) => {
    try {
      const response = await client.post("/register", { name, userName, password });
      if (response.status === 201) {
        return response.data.message;
      }
    } catch (err) {
      console.error("Registration error:", err);
      throw new Error(err.response?.data?.message || "Failed to register");
    }
  };

  const handleLogin = async (userName, password) => {
    try {
      const response = await client.post("/login", { userName, password });

      if (response.status === 200) {
      
        localStorage.setItem("token", response.data.token);
       
      }
    } catch (err) {
      console.error("Login error:", err);
      throw new Error(err.response?.data?.message || "Failed to login");
    }
  };

  const getHistoryOfUser = async () => {
    try {
      const response = await client.get("/get_all_activity", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (err) {
      console.error("Fetch history error:", err);
      throw new Error(err.response?.data?.message || "Failed to fetch history");
    }
  };

  const addToUserHistory = async (meetingCode) => {
    try {
      const response = await client.post(
        "/add_to_activity",
        { meeting_code: meetingCode },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response;
    } catch (err) {
      console.error("Add to history error:", err);
      throw new Error(err.response?.data?.message || "Failed to add to history");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    navigate("/login");
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
    logout,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
