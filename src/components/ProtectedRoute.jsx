import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { user, loading, hasRole } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
        // Render an unauthorized message if authenticated but lacking the required role
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>Unauthorized Access</h2>
                <p>You do not have the required permissions to view this page.</p>
                <p>Your Role: {user.role || "Unassigned"}</p>
                <Navigate to="/dashboard" replace />
            </div>
        );
    }

    // Render child routes if authorized
    return <Outlet />;
};

export default ProtectedRoute;
