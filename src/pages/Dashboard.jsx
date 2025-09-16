// src/pages/Dashboard.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  TextField,
  Autocomplete,
  Button,
  Typography,
} from "@mui/material";
import { ArrowUpward, ArrowDownward, Search as SearchIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";

const columns = [
  { id: "collect_id", label: "Collect ID", sortable: true },
  { id: "school_id", label: "School ID", sortable: true },
  { id: "gateway", label: "Gateway", sortable: true },
  { id: "order_amount", label: "Order Amount", sortable: true },
  { id: "transaction_amount", label: "Transaction Amount", sortable: true },
  { id: "status", label: "Status", sortable: true },
  { id: "custom_order_id", label: "Custom Order ID", sortable: true },
];

export default function Dashboard() {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [statuses, setStatuses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [sortField, setSortField] = useState(searchParams.get("sort") || "payment_time");
  const [sortOrder, setSortOrder] = useState(searchParams.get("order") || "desc");
  const [page, setPage] = useState(Number(searchParams.get("page") || 0));
  const [rowsPerPage, setRowsPerPage] = useState(Number(searchParams.get("limit") || 10));

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText.trim()), 450);
    return () => clearTimeout(t);
  }, [searchText]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/transactions");
      console.log(res)
      const data = Array.isArray(res.data) ? res.data : (res.data.transactions || res.data);
      setAllTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to fetch transactions");
      setAllTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const statusOptions = useMemo(() => {
    const s = new Set();
    allTransactions.forEach((t) => {
      if (t.status) s.add(String(t.status).toLowerCase());
    });
    return Array.from(s);
  }, [allTransactions]);

  const schoolOptions = useMemo(() => {
    const s = new Set();
    allTransactions.forEach((t) => {
      if (t.school_id) s.add(String(t.school_id));
    });
    return Array.from(s);
  }, [allTransactions]);

  const filtered = useMemo(() => {
    const q = debouncedSearch?.toLowerCase?.() || "";

    let list = allTransactions.filter((tx) => {
      if (statuses.length > 0) {
        const st = String(tx.status || "").toLowerCase();
        if (!statuses.map(s => s.toLowerCase()).includes(st)) return false;
      }
      if (schools.length > 0) {
        const sid = String(tx.school_id || "").toLowerCase();
        const matchesSchool = schools.some((s) => sid.includes(String(s).toLowerCase()));
        if (!matchesSchool) return false;
      }
      if (q) {
        const collect = String(tx.collect_id || "").toLowerCase();
        const gateway = String(tx.gateway || "").toLowerCase();
        const school = String(tx.school_id || "").toLowerCase();
        const custom = String(tx.custom_order_id || "").toLowerCase();
        if (!(collect.includes(q) || gateway.includes(q) || school.includes(q) || custom.includes(q))) return false;
      }
      return true;
    });

    const sf = sortField || "payment_time";
    const dir = sortOrder === "asc" ? 1 : -1;
    list.sort((a, b) => {
      const va = a[sf];
      const vb = b[sf];
      const na = Number(va);
      const nb = Number(vb);
      if (!Number.isNaN(na) && !Number.isNaN(nb)) return (na - nb) * dir;
      const sa = String(va ?? "").toLowerCase();
      const sb = String(vb ?? "").toLowerCase();
      if (sa < sb) return -1 * dir;
      if (sa > sb) return 1 * dir;
      return 0;
    });

    return list;
  }, [allTransactions, statuses, schools, debouncedSearch, sortField, sortOrder]);

  const totalCount = filtered.length;
  const paged = useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(0);
  };

  const getStatusBadge = (s) => {
    const v = String(s || "").toLowerCase();
    if (v === "success") return { background: "#ecfccb", color: "#166534" };
    if (v === "pending") return { background: "#fef3c7", color: "#854d0e" };
    if (v === "failed") return { background: "#fee2e2", color: "#991b1b" };
    return { background: theme.palette.mode === "dark" ? "#374151" : "#f3f4f6", color: theme.palette.text.primary };
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 2, color: "primary.main" }}>
        Transactions Dashboard
      </Typography>

      <Paper variant="outlined">
        <TableContainer sx={{ overflowX: "hidden" }}>
          <Table>
            <TableHead sx={{ background: theme.palette.mode === "dark" ? "grey.900" : "grey.100" }}>
              <TableRow>
                {columns.map((col) => (
                  <TableCell
                    key={col.id}
                    sx={{ fontWeight: 600, cursor: col.sortable ? "pointer" : "default" }}
                    onClick={() => col.sortable && handleSort(col.id)}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {col.label}
                      {sortField === col.id ? (
                        sortOrder === "asc" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
                      ) : null}
                    </Box>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                    <Typography>Loading transactions...</Typography>
                  </TableCell>
                </TableRow>
              ) : paged.length ? (
                paged.map((tx, idx) => (
                  <TableRow
                    key={tx.collect_id ?? idx}
                    hover
                    sx={{
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        boxShadow: theme.shadows[4],
                        backgroundColor:
                          theme.palette.mode === "dark"
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(0,0,0,0.02)",
                      },
                    }}
                  >
                    <TableCell sx={{ fontFamily: "ui-monospace" }}>{tx.collect_id}</TableCell>
                    <TableCell>{tx.school_id}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>{tx.gateway}</TableCell>
                    <TableCell align="right">{tx.order_amount ? `₹${tx.order_amount}` : "-"}</TableCell>
                    <TableCell align="right">{tx.transaction_amount ? `₹${tx.transaction_amount}` : "-"}</TableCell>
                    <TableCell>
                      <Box component="span" sx={{ px: 1, py: "2px", borderRadius: 1, ...getStatusBadge(tx.status) }}>
                        {tx.status}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "ui-monospace", wordBreak: "break-all" }}>
                      {tx.custom_order_id ?? "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 6 }}>
                    <Typography>No transactions found.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
    </Box>
  );
}
