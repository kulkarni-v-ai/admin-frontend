import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/api";
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiTag, FiHash } from "react-icons/fi";
import { motion } from "framer-motion";

const CARD_BG     = "rgba(255,255,255,0.03)";
const CARD_BORDER = "rgba(255,255,255,0.07)";
const INPUT_STYLE = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#e2e8f0",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
};
const DISABLED_INPUT_STYLE = {
    ...INPUT_STYLE,
    background: "rgba(255,255,255,0.02)",
    color: "#475569",
    cursor: "not-allowed",
    border: "1px solid rgba(255,255,255,0.05)",
};
const LABEL_STYLE = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.75rem",
    fontWeight: 600,
    color: "#64748b",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
};

const AdminProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({ name: "", emailAddress: "", contactNumber: "", address: "" });
    const [employeeId, setEmployeeId] = useState("");
    const [roleTag, setRoleTag] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState("");
    const [error, setError]   = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get("/admin/profile");
            setProfile({
                name: data.name || "",
                emailAddress: data.emailAddress || "",
                contactNumber: data.contactNumber || "",
                address: data.address || ""
            });
            setEmployeeId(data.employeeId || "");
            setRoleTag(data.roleTag || "");
        } catch {
            setFetchError("Failed to load profile details.");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!window.confirm("Save these profile changes?")) return;
        setLoading(true); setError(""); setSuccess("");
        try {
            const updateData = { ...profile };
            if (password) updateData.password = password;
            await api.put("/admin/profile", updateData);
            setSuccess("Profile updated successfully!");
            setPassword("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: "28px", maxWidth: "860px", margin: "0 auto" }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "28px" }}>
                <h1 style={{ fontSize: "1.875rem", fontWeight: 800, color: "#fff", margin: 0 }}>My Profile</h1>
                <p style={{ color: "#475569", fontSize: "0.875rem", marginTop: "6px" }}>
                    Manage your team member profile and personal details.
                </p>
            </motion.div>

            {/* Alerts */}
            {fetchError && (
                <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: "10px", marginBottom: "20px", fontSize: "0.875rem" }}>
                    ⚠️ {fetchError}
                </div>
            )}
            {error && (
                <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", borderRadius: "10px", marginBottom: "20px", fontSize: "0.875rem" }}>
                    {error}
                </div>
            )}
            {success && (
                <div style={{ padding: "12px 16px", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399", borderRadius: "10px", marginBottom: "20px", fontSize: "0.875rem" }}>
                    ✅ {success}
                </div>
            )}

            {/* Form Card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}`, borderRadius: "18px", padding: "28px" }}
            >
                <form onSubmit={handleSave}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                        {/* Employee ID */}
                        <div>
                            <label style={LABEL_STYLE}><FiHash size={12} /> Employee ID</label>
                            <input type="text" value={employeeId || "—"} disabled style={DISABLED_INPUT_STYLE} />
                        </div>
                        {/* Username */}
                        <div>
                            <label style={LABEL_STYLE}><FiUser size={12} /> Username</label>
                            <input type="text" value={user?.username || ""} disabled style={DISABLED_INPUT_STYLE} />
                        </div>
                        {/* Full Name */}
                        <div>
                            <label style={LABEL_STYLE}><FiUser size={12} /> Full Name</label>
                            <input type="text" name="name" value={profile.name} onChange={handleChange} placeholder="Your full name" style={INPUT_STYLE} />
                        </div>
                        {/* Email */}
                        <div>
                            <label style={LABEL_STYLE}><FiMail size={12} /> Email Address</label>
                            <input type="email" name="emailAddress" value={profile.emailAddress} onChange={handleChange} placeholder="name@example.com" style={INPUT_STYLE} />
                        </div>
                        {/* Phone */}
                        <div>
                            <label style={LABEL_STYLE}><FiPhone size={12} /> Contact Number</label>
                            <input type="tel" name="contactNumber" value={profile.contactNumber} onChange={handleChange} placeholder="+91 98765 43210" style={INPUT_STYLE} />
                        </div>
                        {/* New Password */}
                        <div>
                            <label style={LABEL_STYLE}><FiLock size={12} /> New Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current" style={INPUT_STYLE} />
                        </div>
                        {/* Role Tag */}
                        <div>
                            <label style={LABEL_STYLE}><FiTag size={12} /> Role Tag</label>
                            <input type="text" value={roleTag || "None assigned"} disabled style={DISABLED_INPUT_STYLE} />
                        </div>
                    </div>

                    {/* Address — full width */}
                    <div style={{ marginBottom: "24px" }}>
                        <label style={LABEL_STYLE}><FiMapPin size={12} /> Residential Address</label>
                        <textarea
                            name="address"
                            value={profile.address}
                            onChange={handleChange}
                            placeholder="Full street address…"
                            rows={3}
                            style={{ ...INPUT_STYLE, resize: "vertical", lineHeight: 1.6 }}
                        />
                    </div>

                    {/* Save Button */}
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.03 }}
                            whileTap={{ scale: loading ? 1 : 0.97 }}
                            style={{
                                padding: "11px 28px",
                                background: loading ? "rgba(212,175,55,0.4)" : "linear-gradient(135deg, #d4af37, #b8962c)",
                                color: "#000",
                                border: "none",
                                borderRadius: "10px",
                                fontWeight: 700,
                                fontSize: "0.875rem",
                                cursor: loading ? "not-allowed" : "pointer",
                                boxShadow: loading ? "none" : "0 4px 16px rgba(212,175,55,0.3)",
                            }}
                        >
                            {loading ? "Saving…" : "Save Changes"}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminProfile;
