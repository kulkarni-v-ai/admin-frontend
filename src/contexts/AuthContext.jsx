import { createContext, useState, useEffect } from "react";
import api from "../utils/api";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize auth state from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("adminToken");
        const storedUser = localStorage.getItem("admin");

        if (storedToken && storedUser) {
            try {
                const decoded = jwtDecode(storedToken);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (err) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await api.post("/admin/login", { username, password });
            const { token, admin } = response.data;

            localStorage.setItem("adminToken", token);
            localStorage.setItem("admin", JSON.stringify(admin));

            setToken(token);
            setUser(admin);

            return { success: true };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message || "Login failed. Please try again.",
            };
        }
    };

    const logout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
        setToken(null);
        setUser(null);
        window.location.href = "/";
    };

    const hasRole = (allowedRoles) => {
        if (!user || (!user.role && allowedRoles.length > 0)) return false;
        // For backward compatibility while migrating, if user has no role but token exists, 
        // we default to assuming they are an admin if no specific roles were provided.
        if (!user.role) return true;
        return allowedRoles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    );
};
