import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        // Use any protected route to validate cookie
        await axios.get(`${API_BASE}/transactions`, { withCredentials: true });
        if (mounted) setAuthed(true);
      } catch (err) {
        if (mounted) setAuthed(false);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    check();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Checking session...</div>;
  if (!authed) return <Navigate to="/" replace />;
  return children;
}
