import { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../hooks/useAuth";

function AdminOrders() {
  const { hasRole } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders");
      setOrders(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      // Update local state optimizing a re-fetch
      setOrders((prev) =>
        prev.map(order => order._id === id ? { ...order, status } : order)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update order status.");
    }
  };

  // Roles mapped to capabilities
  // All authenticated staff (Superadmin, Admin, Manager) can update basic order status
  const canUpdateStatus = hasRole(["superadmin", "admin", "manager"]);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading orders...</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, color: "#111827" }}>Orders Management</h2>
      </div>

      {error && (
        <div style={{ padding: "12px", backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "6px", marginBottom: "20px" }}>
          {error}
        </div>
      )}

      {/* Grid Layout for Orders */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "15px"
      }}>
        {orders.map((order) => {
          const date = new Date(order.createdAt).toLocaleDateString("en-IN", {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          });

          return (
            <div key={order._id} style={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "20px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "20px"
            }}>
              {/* Order Info */}
              <div style={{ flex: 1, minWidth: "250px" }}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "15px" }}>
                  <span style={{ fontSize: "16px", fontWeight: "bold", color: "#111827" }}>Order #{order._id.slice(-6).toUpperCase()}</span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>{date}</span>
                </div>

                <div style={{ backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px", marginBottom: "15px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Items:</p>
                  <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "14px", color: "#4b5563" }}>
                    {order.items.map((item, i) => (
                      <li key={i} style={{ marginBottom: "4px" }}>
                        {item.name} <span style={{ color: "#9ca3af" }}>× {item.qty}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Status & Total */}
              <div style={{
                minWidth: "200px",
                backgroundColor: "#f9fafb",
                padding: "20px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "15px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", color: "#4b5563" }}>Total Amount</span>
                  <span style={{ fontSize: "18px", fontWeight: "bold", color: "#059669" }}>₹{order.total}</span>
                </div>

                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: "15px" }}>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500", color: "#374151" }}>Order Status</label>

                  {canUpdateStatus ? (
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        backgroundColor: "white",
                        color: "#111827",
                        fontWeight: "500",
                        cursor: "pointer"
                      }}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <div style={{
                      width: "100%", padding: "8px 12px", borderRadius: "6px",
                      backgroundColor: "#e5e7eb", color: "#4b5563", fontWeight: "500",
                      textAlign: "center"
                    }}>
                      {order.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {orders.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", backgroundColor: "#f9fafb", borderRadius: "8px" }}>
          No orders found.
        </div>
      )}
    </div>
  );
}

export default AdminOrders;