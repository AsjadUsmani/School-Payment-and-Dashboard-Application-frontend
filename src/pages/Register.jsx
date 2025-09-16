// Register.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Basic password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${API_BASE}/api/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
      // Redirect to login page after successful registration
      navigate("/", { 
        state: { message: "Registration successful! Please log in." }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const containerBg = theme.palette.mode === 'dark' ? 'bg-gray-900' : 'bg-gray-100';
  const cardBg = theme.palette.mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme.palette.mode === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const inputBg = theme.palette.mode === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${containerBg}`}>
      <div className={`p-8 rounded-lg shadow-lg w-full max-w-md ${cardBg}`}>
        <h1 className="text-2xl font-bold text-indigo-600 mb-6 text-center">Create Account</h1>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${inputBg}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${inputBg}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password (min 6 characters)"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${inputBg}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${textColor}`}>
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm your password"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${inputBg}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-sm ${textColor}`}>
            Already have an account?{" "}
            <Link
              to="/"
              className="text-indigo-600 hover:text-indigo-500 font-medium hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}