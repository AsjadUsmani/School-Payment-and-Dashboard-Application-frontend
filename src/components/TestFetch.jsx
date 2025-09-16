import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function TestFetch() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE}/`, { withCredentials: true })
      .then(res => setMessage(res.data.message))
      .catch(err => setMessage("Error: " + err.message));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-xl font-semibold text-indigo-600">
        {message || "Loading..."}
      </h1>
    </div>
  );
}
