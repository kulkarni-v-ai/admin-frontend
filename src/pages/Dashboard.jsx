import { Routes, Route, Link, Navigate } from "react-router-dom";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";

function Dashboard() {
  const logout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 200,
          padding: 20,
          background: "#111",
          minHeight: "100vh",
        }}
      >
        <h2 style={{ color: "white" }}>Admin</h2>

        <Link to="products" style={{ display: "block", margin: 10 }}>
          Products
        </Link>

        <Link to="orders" style={{ display: "block", margin: 10 }}>
          Orders
        </Link>

        <button onClick={logout}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: 40 }}>
        <Routes>
          <Route path="/" element={<Navigate to="products" />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Routes>
      </div>
    </div>
  );
}

export default Dashboard;