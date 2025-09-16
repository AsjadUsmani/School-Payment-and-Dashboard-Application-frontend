
---

# 📊 Transactions Dashboard (Frontend)

This is the **React frontend** for the Transactions Dashboard.
It provides a secure UI to **login, register, and view transactions** from your backend APIs, including filters, sorting, pagination, and live status updates.

---

## 🚀 Features

* 🔐 **Authentication** (Login & Register) with protected routes
* 📊 **Dashboard** to view all transactions (with search, filters, and sorting)
* 🏫 **School-wise Transactions**
* 🔎 **Transaction Status Check**
* 🎨 **Dark/Light mode** support (via MUI theme)
* 💳 **Payment integration** ready (links with backend payment APIs)

---

## 📂 Project Structure

```
frontend/
│── src/
│   ├── components/        # Reusable UI components
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/           # Theme and global state
│   │   └── ThemeProvider.jsx
│   ├── pages/             # App pages
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── TransactionDetails.jsx
│   │   └── StatusCheck.jsx
│   ├── routes/            # Route definitions
│   │   └── AppRoutes.jsx
│   ├── services/          # API wrapper (axios)
│   │   └── api.js
│   ├── index.css          # TailwindCSS styles
│   ├── main.jsx           # Entry point
│   └── App.jsx            # Root app component
│
├── .env                   # Environment variables
├── package.json
└── README.md
```

---

## ⚙️ Setup & Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the project root:

   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

   Replace `http://localhost:5000` with your backend server URL.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at:
   👉 `http://localhost:5173`

---

## 🔑 Authentication

* Login API: `POST /api/auth/login`
* Register API: `POST /api/auth/register`
* Session check: `GET /api/auth/me`
* Logout: `GET /api/auth/logout`

> ⚠️ The frontend stores session in **HttpOnly cookies** handled by the backend.

---

## 📡 API Integration

The frontend interacts with your backend using Axios (`src/services/api.js`).
All requests automatically include cookies (`withCredentials: true`).

* **Transactions** → `GET /transactions`
* **Transactions by school** → `GET /transactions/school/:schoolId`
* **Check status** → `GET /transactions/status/:custom_order_id`

---

## 🎨 Styling

* **Material UI (MUI)** for components
* **TailwindCSS** for utility styling
* **Dark/Light mode toggle** via custom ThemeProvider

---

## 🛠 Development Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start development server         |
| `npm run build`   | Build production bundle          |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint checks                |

---

## ✅ To-Do (Future Improvements)

* Add **live transaction updates** (polling or websockets)
* Improve error handling with global alerts
* Add unit tests for components
* Mobile UI optimizations

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---
