import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import ProtectedRoute from "../components/ProtectedRoute";
import { AnimatePresence } from "framer-motion";

import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminAnalytics from "./AdminAnalytics";
import SystemMonitoring from "./SystemMonitoring";
import ActivityLogs from "./ActivityLogs";
import PageTransition from "../components/PageTransition";

function Dashboard() {
  const location = useLocation();

  return (
    <AdminLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Default redirect to analytics */}
          <Route path="/" element={<Navigate to="analytics" replace />} />

          {/* Analytics, Products & Orders: Accessible to all authenticated admin/manager roles */}
          <Route element={<ProtectedRoute allowedRoles={['superadmin', 'admin', 'manager']} />}>
            <Route path="analytics" element={<PageTransition><AdminAnalytics /></PageTransition>} />
            <Route path="products" element={<PageTransition><AdminProducts /></PageTransition>} />
            <Route path="orders" element={<PageTransition><AdminOrders /></PageTransition>} />
          </Route>

          {/* Superadmin Only: Users and System monitoring */}
          <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
            <Route path="users" element={<PageTransition><AdminUsers /></PageTransition>} />
            <Route path="system-overview" element={<PageTransition><SystemMonitoring /></PageTransition>} />
            <Route path="system-logs" element={<PageTransition><ActivityLogs /></PageTransition>} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="products" replace />} />
        </Routes>
      </AnimatePresence>
    </AdminLayout>
  );
}

export default Dashboard;