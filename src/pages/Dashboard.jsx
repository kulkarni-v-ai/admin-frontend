import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";

import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminAnalytics from "./AdminAnalytics";
import SystemMonitoring from "./SystemMonitoring";
import ActivityLogs from "./ActivityLogs";

function Dashboard() {
  return (
    <AdminLayout>
      <Routes>
        {/* Default redirect to analytics */}
        <Route path="/" element={<Navigate to="analytics" replace />} />

        {/* Analytics, Products & Orders: Accessible to all authenticated admin/manager roles */}
        <Route element={<ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager']} />}>
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        {/* Superadmin Only: Users and System monitoring */}
        <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
          <Route path="users" element={<AdminUsers />} />
          <Route path="system-overview" element={<SystemMonitoring />} />
          <Route path="system-logs" element={<ActivityLogs />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="products" replace />} />
      </Routes>
    </AdminLayout>
  );
}

export default Dashboard;