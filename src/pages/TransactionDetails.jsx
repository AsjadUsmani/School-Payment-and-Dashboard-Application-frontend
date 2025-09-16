// src/pages/TransactionDetails.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Container, Typography, Paper, Autocomplete, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import api from "../services/api";

export default function TransactionDetails() {
  const [all, setAll] = useState([]);
  const [school, setSchool] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    // fetch all transactions to populate school dropdown (client-only)
    let mounted = true;
    api.get("/transactions")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.transactions || res.data);
        if (mounted) setAll(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setAll([]);
      });
    return () => (mounted = false);
  }, []);

  const schoolOptions = useMemo(() => {
    const s = new Set();
    all.forEach(t => {
      if (t.school_id) s.add(t.school_id);
    });
    return Array.from(s);
  }, [all]);

  const fetchBySchool = async () => {
    if (!school) return;
    setLoading(true);
    setErr("");
    try {
      const res = await api.get(`/transactions/school/${encodeURIComponent(school)}`);
      setTransactions(Array.isArray(res.data) ? res.data : (res.data.transactions || res.data));
    } catch (e) {
      setErr(e.response?.data?.message || "Failed to fetch transactions for this school");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Transaction Details by School</Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Autocomplete
          options={schoolOptions}
          value={school}
          onChange={(e, v) => setSchool(v || "")}
          freeSolo
          renderInput={(params) => <TextField {...params} label="Select or type School ID" />}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={fetchBySchool} disabled={!school || loading}>
          {loading ? "Fetching..." : "Fetch Transactions"}
        </Button>
        {err && <Typography color="error" sx={{ mt: 2 }}>{err}</Typography>}
      </Paper>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>collect_id</TableCell>
                <TableCell>gateway</TableCell>
                <TableCell>order_amount</TableCell>
                <TableCell>transaction_amount</TableCell>
                <TableCell>status</TableCell>
                <TableCell>payment_time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length ? (
                transactions.map((t, i) => (
                  <TableRow key={t.collect_id ?? i}>
                    <TableCell>{t.collect_id}</TableCell>
                    <TableCell>{t.gateway ?? t.gateway_name}</TableCell>
                    <TableCell>{t.order_amount}</TableCell>
                    <TableCell>{t.transaction_amount ?? "-"}</TableCell>
                    <TableCell>{t.status}</TableCell>
                    <TableCell>{t.payment_time ? new Date(t.payment_time).toLocaleString() : "-"}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} align="center">No data</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
