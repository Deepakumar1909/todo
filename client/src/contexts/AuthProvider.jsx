
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

const AuthProvider = (props) => {
    const navigate = useNavigate();

    const [authToken, setAuthToken] = useState(() => {
        // Retrieve the token from localStorage during initialization
        return localStorage.getItem("token");
    });

    // Save the token to localStorage whenever it changes
    useEffect(() => {
        if (authToken) {
            localStorage.setItem("token", authToken);
        } else {
            localStorage.removeItem("token");
        }
    }, [authToken]);

    const logout = () => {
        setAuthToken(null); // Clear the state
        localStorage.removeItem("token"); // Remove from LocalStorage
        navigate("/login"); // Navigate to the login page
    };

    return (
        <AuthContext.Provider value={{ authToken, setAuthToken, logout }}>
            {props.children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthProvider;
