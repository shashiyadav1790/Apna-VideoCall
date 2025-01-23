import axios from "axios";
import httpStatus from "http-status";
import PropTypes from "prop-types";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../enviroment";

export const AuthContext = createContext({});

const client = axios.create({
    baseURL: `${server}/api/v1/users`,
});

export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null); // Initialize userData
    const navigate = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            const request = await client.post("/register", { name, username, password });
            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            console.error("Registration error:", err);
            throw err;
        }
    };

    const handleLogin = async (username, password) => {
        try {
            const request = await client.post("/login", { username, password });
            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                navigate("/home");
                return request.data.message;
            }
        } catch (err) {
            console.error("Login error:", err);
            throw err;
        }
    };

    const getHistoryOfUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");
        try {
            const request = await client.get("/get_all_activity", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return request.data;
        } catch (err) {
            console.error("Error fetching user history:", err);
            throw err;
        }
    };

    const addToUserHistory = async (meetingCode) => {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in.");
        try {
            const request = await client.post(
                "/add_to_activity",
                { meeting_code: meetingCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return request;
        } catch (err) {
            console.error("Error adding to user history:", err);
            throw err;
        }
    };

    const data = {
        userData,
        setUserData,
        addToUserHistory,
        getHistoryOfUser,
        handleRegister,
        handleLogin,
    };

    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};