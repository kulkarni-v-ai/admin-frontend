import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../api";

const AdminProfile = () => {
    const { user, login } = useAuth();
    const [profile, setProfile] = useState({
        name: "",
        emailAddress: "",
        contactNumber: "",
        address: ""
    });
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get("/api/admin/profile");
            setProfile({
                name: data.name || "",
                emailAddress: data.emailAddress || "",
                contactNumber: data.contactNumber || "",
                address: data.address || ""
            });
            setEmployeeId(data.employeeId || "");
        } catch (err) {
            setError("Failed to load profile details.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        
        // Confirmation prompt for anyone
        const confirmSave = window.confirm("Are you sure you want to save these profile changes?");
        if (!confirmSave) return;

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const updateData = { ...profile };
            if (password) updateData.password = password;

            const { data } = await api.put("/api/admin/profile", updateData);
            setSuccess("Profile updated successfully!");
            setPassword("");
            
            // Re-sync auth context if username was updated, though not editing username here
            // login(data.admin.username, password)
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "8px" }}>My Profile</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Manage your team member profile and personal details.</p>

            {error && (
                <div style={{ padding: "12px", backgroundColor: "#fee2e2", color: "#b91c1c", borderRadius: "8px", marginBottom: "20px" }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{ padding: "12px", backgroundColor: "#d1fae5", color: "#047857", borderRadius: "8px", marginBottom: "20px" }}>
                    {success}
                </div>
            )}

            <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid var(--border-color)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <form onSubmit={handleSave}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "8px" }}>Employee ID</label>
                            <input
                                type="text"
                                value={employeeId}
                                disabled
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", backgroundColor: "#f9fafb", cursor: "not-allowed", color: "var(--text-muted)" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "8px" }}>Username</label>
                            <input
                                type="text"
                                value={user?.username || ""}
                                disabled
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", backgroundColor: "#f9fafb", cursor: "not-allowed", color: "var(--text-muted)" }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "8px" }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", outline: "none" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "8px" }}>Email Address</label>
                            <input
                                type="email"
                                name="emailAddress"
                                value={profile.emailAddress}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", outline: "none" }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "8px" }}>Contact Number</label>
                            <input
                                type="tel"
                                name="contactNumber"
                                value={profile.contactNumber}
                                onChange={handleChange}
                                placeholder="+1 234 567 8900"
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", outline: "none" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "8px" }}>New Password (Optional)</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Leave blank to keep current"
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", outline: "none" }}
                            />
                        </div>
                        
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "8px" }}>Residential Address</label>
                            <textarea
                                name="address"
                                value={profile.address}
                                onChange={handleChange}
                                placeholder="Full street address..."
                                rows="3"
                                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", outline: "none", resize: "vertical" }}
                            ></textarea>
                        </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                padding: "10px 24px",
                                backgroundColor: "var(--primary)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "600",
                                cursor: loading ? "not-allowed" : "pointer",
                                opacity: loading ? 0.7 : 1
                            }}
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminProfile;
