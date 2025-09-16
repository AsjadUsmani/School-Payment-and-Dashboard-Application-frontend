// src/pages/StatusCheck.jsx
import React, { useState } from "react";
import { Container, Typography, Paper, TextField, Button } from "@mui/material";
import api from "../services/api";

export default function StatusCheck() {
  const [id, setId] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleCheck = async () => {
    if (!id.trim()) return setErr("Please enter custom_order_id");
    setLoading(true);
    setResult(null);
    setErr("");
    try {
      const res = await api.get(`/transaction-status/${encodeURIComponent(id.trim())}`);
      setResult(res.data);
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to fetch status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Check Transaction Status</Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          label="custom_order_id"
          fullWidth
          value={id}
          onChange={(e) => setId(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleCheck} disabled={loading}>
          {loading ? "Checking..." : "Check Status"}
        </Button>
        {err && <Typography color="error" sx={{ mt: 2 }}>{err}</Typography>}
      </Paper>

      {result && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Result</Typography>
          <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{JSON.stringify(result, null, 2)}</pre>
        </Paper>
      )}
    </Container>
  );
}
