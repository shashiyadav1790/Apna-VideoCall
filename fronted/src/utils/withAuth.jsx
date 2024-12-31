import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const router = useNavigate();
        // Function to check if user is authenticated
        const isAuthenticated = () => {
            const token = localStorage.getItem("token");
            console.log("Token found:", token); // Debugging token check
            return token ? true : false;
        };

        useEffect(() => {
            // Redirect to login page if not authenticated
            if (!isAuthenticated()) {
                router("/auth");
            }
        }, []); // Empty dependency array ensures this only runs on mount

        // Optional: Can return a loading state or placeholder while checking
        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};

export default withAuth;
