import { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";

function ActivityLogs() {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [actionFilter, setActionFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLogs = async () => {
        setLoading(true);
        try {
            let url = `/admin/system-logs?page=${page}&limit=20`;
            if (actionFilter) {
                url += `&actionType=${actionFilter}`;
            }
            const res = await api.get(url);
            setLogs(res.data.logs);
            setTotalPages(res.data.pages);
            setPage(res.data.page);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load activity logs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [page, actionFilter]);

    const handleArchive = async (id) => {
        if (!window.confirm("Are you sure you want to selectively archive this log?")) return;
        try {
            await api.patch(`/admin/system-logs/archive/${id}`);
            fetchLogs();
        } catch (err) {
            alert(err.response?.data?.message || "Archiving failed");
        }
    };

    const handleFilterChange = (e) => {
        setActionFilter(e.target.value);
        setPage(1); // Reset to first page whenever filter changes
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Immutable Activity Logs</h1>
                <p>System audit trail for all critical administrative actions</p>
            </div>

            <div className="card" style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                <p style={{ fontWeight: "600", color: "#374151" }}>Filter by Action:</p>
                <select
                    value={actionFilter}
                    onChange={handleFilterChange}
                    className="admin-input"
                    style={{ width: "250px", margin: 0 }}
                >
                    <option value="">All Actions</option>
                    <option value="LOGIN">LOGIN</option>
                    <option value="CREATE_PRODUCT">CREATE_PRODUCT</option>
                    <option value="UPDATE_PRODUCT">UPDATE_PRODUCT</option>
                    <option value="DELETE_PRODUCT">DELETE_PRODUCT</option>
                    <option value="UPDATE_ORDER">UPDATE_ORDER</option>
                    <option value="CREATE_ADMIN">CREATE_ADMIN</option>
                    <option value="DELETE_ADMIN">DELETE_ADMIN</option>
                    <option value="ROLE_CHANGE">ROLE_CHANGE</option>
                </select>
            </div>

            {error ? (
                <div className="error-message">{error}</div>
            ) : loading && logs.length === 0 ? (
                <div className="loading">Fetching secure logs...</div>
            ) : (
                <>
                    <div className="card" style={{ overflowX: "auto" }}>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Action</th>
                                    <th>Actor (Role)</th>
                                    <th>Metadata</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length > 0 ? (
                                    logs.map((log) => (
                                        <tr key={log._id} style={{ opacity: log.isArchived ? 0.6 : 1 }}>
                                            <td style={{ whiteSpace: "nowrap" }}>{new Date(log.timestamp).toLocaleString()}</td>
                                            <td>
                                                <strong>{log.actionType}</strong>
                                                {log.targetId && <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>ID: {log.targetId}</div>}
                                            </td>
                                            <td>
                                                <div>{log.userId?.username || "Unknown"}</div>
                                                <span className={`role-badge role-${log.role}`} style={{ transform: "scale(0.85)", transformOrigin: "left" }}>
                                                    {log.role}
                                                </span>
                                            </td>
                                            <td>
                                                <pre style={{ margin: 0, fontSize: "0.8rem", color: "#4b5563", background: "#f3f4f6", padding: "0.5rem", borderRadius: "4px" }}>
                                                    {JSON.stringify(log.metadata, null, 2)}
                                                </pre>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${log.isArchived ? "status-cancelled" : "status-shipped"}`}>
                                                    {log.isArchived ? "Archived" : "Active"}
                                                </span>
                                            </td>
                                            <td>
                                                {!log.isArchived && user?.role === "superadmin" && (
                                                    <button
                                                        className="btn-delete"
                                                        style={{ background: "#f59e0b" }}
                                                        onClick={() => handleArchive(log._id)}
                                                    >
                                                        Archive
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="6" style={{ textAlign: "center", padding: "2rem" }}>No logs found matching your criteria.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem", marginTop: "1.5rem" }}>
                            <button
                                className="btn-status"
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Previous
                            </button>
                            <span style={{ fontWeight: "500", color: "#374151" }}>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="btn-status"
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default ActivityLogs;
