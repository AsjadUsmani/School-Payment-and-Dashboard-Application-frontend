// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import TransactionDetails from "../pages/TransactionDetails";
import StatusCheck from "../pages/StatusCheck";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/school-transactions"
        element={
          <ProtectedRoute>
            <TransactionDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/check-status"
        element={
          <ProtectedRoute>
            <StatusCheck />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
