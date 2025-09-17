import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Box, Button, TextField, Typography } from "@mui/material";

export default function CreatePayment() {
  const [schoolId, setSchoolId] = useState("");
  const [trusteeId, setTrusteeId] = useState("");
  const [studentInfo, setStudentInfo] = useState({ name: "", id: "", email: "" });
  const [gatewayName, setGatewayName] = useState("");
  const [amount, setAmount] = useState("");
  const [callbackUrl, setCallbackUrl] = useState(import.meta.env.VITE_CLIENT_URL);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/create-payment", {
        school_id: schoolId,
        trustee_id: trusteeId,
        student_info: studentInfo,
        gateway_name: gatewayName,
        amount,
        callback_url: callbackUrl,
      });

      window.location.href = res.data.paymentPageUrl;  // Redirect to Payment Page
    } catch (err) {
      setError(err.response?.data?.message || "Payment creation failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Create Payment</Typography>
      
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <TextField label="School ID" fullWidth value={schoolId} onChange={(e) => setSchoolId(e.target.value)} required />
        <TextField label="Trustee ID" fullWidth value={trusteeId} onChange={(e) => setTrusteeId(e.target.value)} required />
        <TextField label="Student Name" fullWidth value={studentInfo.name} onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })} required />
        <TextField label="Student ID" fullWidth value={studentInfo.id} onChange={(e) => setStudentInfo({ ...studentInfo, id: e.target.value })} required />
        <TextField label="Student Email" fullWidth value={studentInfo.email} onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })} required />
        <TextField label="Gateway Name" fullWidth value={gatewayName} onChange={(e) => setGatewayName(e.target.value)} required />
        <TextField label="Amount" fullWidth type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        {/* Optional: Add callback URL field or use env var */}
        
        {error && <Typography color="error">{error}</Typography>}

        <Button type="submit" variant="contained" color="primary">
          Create Payment
        </Button>
      </form>
    </Box>
  );
}
