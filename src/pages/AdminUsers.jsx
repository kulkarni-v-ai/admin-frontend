import { useEffect, useState } from "react";
import api from "../utils/api";
import { FiPlus, FiTrash2, FiX, FiShield } from "react-icons/fi";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("manager"); // default role

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Fallback data in case the endpoint doesn't exist yet on the backend
            try {
                const res = await api.get("/admin/users");
                setUsers(res.data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError("The /admin/users endpoint does not exist on the backend yet. Showing placeholder UI.");
                    setUsers([
                        { _id: "1", username: "super_admin", role: "superadmin" },
                        { _id: "2", username: "store_manager", role: "manager" }
                    ]);
                } else {
                    throw err;
                }
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setUsername("");
        setPassword("");
        setRole("manager");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            // Typically /admin/register or /admin/users
            const res = await api.post("/admin/register", { username, password, role });

            // Update UI optimistically or refetch
            if (res.data) {
                setUsers([...users, res.data.admin || res.data]);
            } else {
                await fetchUsers();
            }

            closeModal();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to create user. Verify backend endpoints.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteUser = async (id, userRole) => {
        if (userRole === "superadmin") {
            alert("Cannot delete another superadmin for safety reasons.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this user track?")) return;

        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            console.error(err);
            setError("Failed to delete user. The endpoint might not be implemented.");
        }
    };

    if (loading) {
        return <div style={{ textAlign: "center", padding: "40px" }}>Loading users...</div>;
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ margin: 0, color: "#111827", display: "flex", alignItems: "center", gap: "10px" }}>
                    <FiShield style={{ color: "#dc2626" }} />
                    Superadmin: User Management
                </h2>
                <button
                    onClick={openModal}
                    style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        padding: "10px 16px", backgroundColor: "#3b82f6", color: "white",
                        border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "500"
                    }}
                >
                    <FiPlus /> Create New User
                </button>
            </div>

            {error && (
                <div style={{ padding: "12px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "6px", marginBottom: "20px" }}>
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #e5e7eb", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead style={{ backgroundColor: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                        <tr>
                            <th style={{ padding: "12px 20px", color: "#6b7280", fontWeight: "600", fontSize: "14px" }}>Username</th>
                            <th style={{ padding: "12px 20px", color: "#6b7280", fontWeight: "600", fontSize: "14px" }}>Role</th>
                            <th style={{ padding: "12px 20px", color: "#6b7280", fontWeight: "600", fontSize: "14px", textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u._id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                <td style={{ padding: "16px 20px", fontWeight: "500", color: "#111827" }}>{u.username}</td>
                                <td style={{ padding: "16px 20px" }}>
                                    <span style={{
                                        fontSize: "12px",
                                        backgroundColor: u.role === "superadmin" ? "#fef2f2" : u.role === "admin" ? "#eff6ff" : "#ecfdf5",
                                        color: u.role === "superadmin" ? "#dc2626" : u.role === "admin" ? "#2563eb" : "#059669",
                                        padding: "4px 10px",
                                        borderRadius: "12px",
                                        fontWeight: "600",
                                        textTransform: "capitalize"
                                    }}>
                                        {u.role || "Manager"}
                                    </span>
                                </td>
                                <td style={{ padding: "16px 20px", textAlign: "right" }}>
                                    <button
                                        onClick={() => deleteUser(u._id, u.role)}
                                        disabled={u.role === "superadmin"}
                                        style={{
                                            padding: "8px", backgroundColor: u.role === "superadmin" ? "#f3f4f6" : "#fee2e2",
                                            color: u.role === "superadmin" ? "#9ca3af" : "#dc2626",
                                            border: "none", borderRadius: "4px", cursor: u.role === "superadmin" ? "not-allowed" : "pointer"
                                        }}
                                        title={u.role === "superadmin" ? "Cannot delete superadmin" : "Delete user"}
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div style={{
                    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
                    alignItems: "center", zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: "white", padding: "30px", borderRadius: "8px",
                        width: "100%", maxWidth: "400px",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h2 style={{ margin: 0 }}>Create New User</h2>
                            <button onClick={closeModal} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280" }}>
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Username</label>
                                <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }} />
                            </div>

                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Password</label>
                                <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }} />
                            </div>

                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Assigned Role</label>
                                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box", backgroundColor: "white" }}>
                                    <option value="manager">Manager (View/Update Orders)</option>
                                    <option value="admin">Admin (Manage Products & Orders)</option>
                                    <option value="superadmin">Superadmin (Full System Control)</option>
                                </select>
                                <p style={{ fontSize: "12px", color: "#6b7280", margin: "8px 0 0 0" }}>Superadmins have the highest level of system access.</p>
                            </div>

                            <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "flex-end" }}>
                                <button type="button" onClick={closeModal} style={{ padding: "10px 16px", backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", color: "#374151", fontWeight: "500" }}>Cancel</button>
                                <button type="submit" disabled={isSubmitting} style={{ padding: "10px 16px", backgroundColor: "#3b82f6", border: "none", borderRadius: "6px", cursor: isSubmitting ? "not-allowed" : "pointer", color: "white", fontWeight: "500", opacity: isSubmitting ? 0.7 : 1 }}>
                                    {isSubmitting ? "Creating..." : "Create User"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;
