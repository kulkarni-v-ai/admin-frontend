import { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { FiPlus, FiTrash2, FiX, FiShield, FiEdit2 } from "react-icons/fi";
import { AuthContext } from "../contexts/AuthContext";

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
    const { user: currentUser } = useContext(AuthContext);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);

    const [view, setView] = useState("team"); // "team" or "customers"

    // Customer Edit State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState({ street: "", city: "", state: "", zip: "" });
    const [fetchingPincode, setFetchingPincode] = useState(false);

    useEffect(() => {
        const fetchLocation = async () => {
            if (view === "customers" && isEditMode && address.zip && address.zip.length === 6) {
                try {
                    setFetchingPincode(true);
                    const res = await fetch(`https://api.postalpincode.in/pincode/${address.zip}`);
                    const data = await res.json();

                    if (data[0].Status === "Success") {
                        const postOffice = data[0].PostOffice[0];
                        setAddress(prev => ({
                            ...prev,
                            city: postOffice.District,
                            state: postOffice.State
                        }));
                    }
                } catch (err) {
                    console.error("Pincode lookup failed", err);
                } finally {
                    setFetchingPincode(false);
                }
            }
        };

        fetchLocation();
    }, [address.zip, view, isEditMode]);

    useEffect(() => {
        fetchData();
    }, [view]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            if (view === "team") {
                try {
                    const res = await api.get("/admin/users");
                    // Ensure every user has an _id (handle both 'id' and '_id')
                    const normalized = res.data.map(u => ({ ...u, _id: u._id || u.id }));
                    setUsers(normalized);
                } catch (err) {
                    if (err.response?.status === 404) {
                        setUsers([
                            { _id: "1", username: "super_admin", role: "superadmin" },
                            { _id: "2", username: "store_manager", role: "manager" }
                        ]);
                    } else throw err;
                }
            } else {
                // Fetch Customers from the new consolidated endpoint
                const res = await api.get("/admin/customers");
                const normalized = res.data.map(u => ({ ...u, _id: u._id || u.id, username: u.name || u.email }));
                setUsers(normalized);
            }
        } catch (err) {
            console.error(err);
            const status = err.response?.status;
            const message = err.response?.data?.message || err.message;
            setError(`Failed to load ${view} (${status || 'Network Error'}): ${message}`);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (userToEdit = null) => {
        if (userToEdit) {
            setIsEditMode(true);
            setEditingUserId(userToEdit._id);

            if (view === "team") {
                setUsername(userToEdit.username || "");
                setRole(userToEdit.role || "manager");
                setPassword("");
            } else {
                setName(userToEdit.name || "");
                setEmail(userToEdit.email || "");
                setAddress({
                    street: userToEdit.address?.street || "",
                    city: userToEdit.address?.city || "",
                    state: userToEdit.address?.state || "",
                    zip: userToEdit.address?.zip || ""
                });
            }
        } else {
            setIsEditMode(false);
            setEditingUserId(null);
            setUsername("");
            setPassword("");
            setRole("manager");
            setName("");
            setEmail("");
            setAddress({ street: "", city: "", state: "", zip: "" });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingUserId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            if (isEditMode) {
                if (view === "team") {
                    const isSelf = editingUserId === currentUser.id || editingUserId === currentUser._id;
                    const endpoint = isSelf ? "/admin/profile" : `/admin/users/${editingUserId}`;
                    await api.put(endpoint, { username, role, ...(password && { password }) });
                    setUsers(users.map(u => u._id === editingUserId ? { ...u, username, role } : u));
                } else {
                    const endpoint = `/admin/customers/${editingUserId}`;
                    const res = await api.put(endpoint, { name, email, address });
                    setUsers(users.map(u => u._id === editingUserId ? { ...u, name, email, address, username: name || email } : u));
                }
            } else {
                const res = await api.post("/admin/register", { username, password, role });
                if (view === "team") {
                    const newUser = res.data.admin || res.data;
                    const normalized = { ...newUser, _id: newUser._id || newUser.id };
                    setUsers([...users, normalized]);
                }
            }
            closeModal();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} user.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteUser = async (id, userRole) => {
        if (userRole === "superadmin" && id !== currentUser?.id && id !== currentUser?._id) {
            alert("Cannot delete another superadmin.");
            return;
        }

        if (!window.confirm(`Are you sure you want to delete this ${view === 'team' ? 'team member' : 'customer'}?`)) return;

        try {
            const endpoint = view === "team" ? `/admin/users/${id}` : `/admin/customers/${id}`;
            await api.delete(endpoint);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            console.error(err);
            setError("Failed to delete user. Not implemented for customers yet.");
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
                    User Management
                </h2>
                <div style={{ display: "flex", gap: "10px", backgroundColor: "#f3f4f6", padding: "4px", borderRadius: "8px" }}>
                    <button
                        onClick={() => setView("team")}
                        style={{
                            padding: "6px 16px", borderRadius: "6px", border: "none", cursor: "pointer",
                            backgroundColor: view === "team" ? "white" : "transparent",
                            boxShadow: view === "team" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                            fontWeight: "600", color: view === "team" ? "#111827" : "#6b7280"
                        }}
                    >Team Members</button>
                    <button
                        onClick={() => setView("customers")}
                        style={{
                            padding: "6px 16px", borderRadius: "6px", border: "none", cursor: "pointer",
                            backgroundColor: view === "customers" ? "white" : "transparent",
                            boxShadow: view === "customers" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                            fontWeight: "600", color: view === "customers" ? "#111827" : "#6b7280"
                        }}
                    >Customers</button>
                </div>
                {view === "team" && (
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
                )}
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
                                <td style={{ padding: "16px 20px", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                                    <button
                                        onClick={() => openModal(u)}
                                        style={{
                                            padding: "8px", backgroundColor: "#eff6ff",
                                            color: "#2563eb", border: "none", borderRadius: "4px", cursor: "pointer"
                                        }}
                                        title={`Edit ${view === 'team' ? 'team member' : 'customer'} details`}
                                    >
                                        <FiEdit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => deleteUser(u._id, u.role)}
                                        disabled={u.role === "superadmin" && u._id !== (currentUser?.id || currentUser?._id)}
                                        style={{
                                            padding: "8px", backgroundColor: (u.role === "superadmin" && u._id !== (currentUser?.id || currentUser?._id)) ? "#f3f4f6" : "#fee2e2",
                                            color: (u.role === "superadmin" && u._id !== (currentUser?.id || currentUser?._id)) ? "#9ca3af" : "#dc2626",
                                            border: "none", borderRadius: "4px", cursor: (u.role === "superadmin" && u._id !== (currentUser?.id || currentUser?._id)) ? "not-allowed" : "pointer"
                                        }}
                                        title={u.role === "superadmin" && u._id !== (currentUser?.id || currentUser?._id) ? "Cannot delete other superadmin" : "Delete user"}
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
                            <h2 style={{ margin: 0 }}>{isEditMode ? "Edit User Details" : "Create New User"}</h2>
                            <button onClick={closeModal} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#6b7280" }}>
                                <FiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {view === "team" ? (
                                <>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Username</label>
                                        <input required type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }} />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Password {isEditMode && "(Leave blank to keep current)"}</label>
                                        <input required={!isEditMode} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isEditMode ? "••••••••" : ""} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }} />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Assigned Role</label>
                                        <select value={role} disabled={isEditMode && editingUserId === (currentUser?.id || currentUser?._id)} onChange={(e) => setRole(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box", backgroundColor: (isEditMode && editingUserId === (currentUser?.id || currentUser?._id)) ? "#f3f4f6" : "white" }}>
                                            <option value="manager">Manager (View/Update Orders)</option>
                                            <option value="admin">Admin (Manage Products & Orders)</option>
                                            <option value="superadmin">Superadmin (Full System Control)</option>
                                        </select>
                                        {isEditMode && editingUserId === (currentUser?.id || currentUser?._id) && (
                                            <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>You cannot change your own role to prevent accidental lockout.</p>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Full Name</label>
                                        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", marginBottom: "5px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Email Address</label>
                                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }} />
                                    </div>
                                    <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "10px" }}>
                                        <label style={{ display: "block", marginBottom: "5px", fontSize: "12px", fontWeight: "bold", color: "#6b7280" }}>SHIPPING ADDRESS</label>
                                        <input placeholder="Street" type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box", marginBottom: "8px" }} />
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                            <input placeholder="City" type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }} />
                                            <input placeholder="State" type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box" }} />
                                        </div>
                                        <div style={{ position: "relative" }}>
                                            <input placeholder="Zip Code" type="text" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value.replace(/\D/g, '').slice(0, 6) })} style={{ width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #d1d5db", boxSizing: "border-box", marginTop: "8px" }} />
                                            {fetchingPincode && <span style={{ position: "absolute", right: "10px", top: "18px", fontSize: "10px", color: "#3b82f6" }}>Looking up...</span>}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div style={{ display: "flex", gap: "10px", marginTop: "10px", justifyContent: "flex-end" }}>
                                <button type="button" onClick={closeModal} style={{ padding: "10px 16px", backgroundColor: "white", border: "1px solid #d1d5db", borderRadius: "6px", cursor: "pointer", color: "#374151", fontWeight: "500" }}>Cancel</button>
                                <button type="submit" disabled={isSubmitting} style={{ padding: "10px 16px", backgroundColor: "#3b82f6", border: "none", borderRadius: "6px", cursor: isSubmitting ? "not-allowed" : "pointer", color: "white", fontWeight: "500", opacity: isSubmitting ? 0.7 : 1 }}>
                                    {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Details" : "Create User")}
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
