import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

// Public pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// User pages
import Home from "./pages/Home";
import Booking from "./pages/Booking";
import Reservations from "./pages/Reservations";
import MyParking from "./pages/MyParking";
import History from "./pages/History";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ParkingSlots from "./pages/admin/ParkingSlots";
import ParkingRecords from "./pages/admin/ParkingRecords";
import AdminReservations from "./pages/admin/AdminReservations";
import Reports from "./pages/admin/Reports";

// Reusable layout for authenticated pages
function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* =====================================
              PUBLIC ROUTES
          ====================================== */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* =====================================
              USER ROUTES
          ====================================== */}

          {/* Home */}
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRole="user">
                <AppLayout>
                  <Home />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Book Parking */}
          <Route
            path="/book"
            element={
              <ProtectedRoute allowedRole="user">
                <AppLayout>
                  <Booking />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Reservations */}
          <Route
            path="/reservations"
            element={
              <ProtectedRoute allowedRole="user">
                <AppLayout>
                  <Reservations />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Current Parking */}
          <Route
            path="/my-parking"
            element={
              <ProtectedRoute allowedRole="user">
                <AppLayout>
                  <MyParking />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Parking History */}
          <Route
            path="/history"
            element={
              <ProtectedRoute allowedRole="user">
                <AppLayout>
                  <History />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* =====================================
              ADMIN ROUTES
          ====================================== */}

          {/* Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Manage Parking Slots */}
          <Route
            path="/admin/slots"
            element={
              <ProtectedRoute allowedRole="admin">
                <AppLayout>
                  <ParkingSlots />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Parking Records */}
          <Route
            path="/admin/records"
            element={
              <ProtectedRoute allowedRole="admin">
                <AppLayout>
                  <ParkingRecords />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Reservations */}
          <Route
            path="/admin/reservations"
            element={
              <ProtectedRoute allowedRole="admin">
                <AppLayout>
                  <AdminReservations />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Reports */}
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRole="admin">
                <AppLayout>
                  <Reports />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* =====================================
              FALLBACK
          ====================================== */}

          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;