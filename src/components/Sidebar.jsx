import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* =====================================
          LOGO
      ====================================== */}

      <div className="logo">
        <div className="logo-icon">P</div>

        <div>
          <h2>ParkEase</h2>
          <span>Slot Management</span>
        </div>
      </div>

      {/* =====================================
          USER NAVIGATION
      ====================================== */}

      {user?.role === "user" && (
        <>
          <div className="menu-title">
            USER
          </div>

          <nav>

            {/* Home */}
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>⌂</span>
              Home
            </NavLink>

            {/* Book Parking */}
            <NavLink
              to="/book"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>+</span>
              Book Parking
            </NavLink>

            {/* Reservations */}
            <NavLink
              to="/reservations"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>◉</span>
              Reservations
            </NavLink>

            {/* My Parking */}
            <NavLink
              to="/my-parking"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>▣</span>
              My Parking
            </NavLink>

            {/* History */}
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>◷</span>
              History
            </NavLink>

          </nav>
        </>
      )}

      {/* =====================================
          ADMIN NAVIGATION
      ====================================== */}

      {user?.role === "admin" && (
        <>
          <div className="menu-title admin-title">
            ADMIN
          </div>

          <nav>

            {/* Dashboard */}
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>⌂</span>
              Dashboard
            </NavLink>

            {/* Parking Slots */}
            <NavLink
              to="/admin/slots"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>▦</span>
              Parking Slots
            </NavLink>

            {/* Parking Records */}
            <NavLink
              to="/admin/records"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>▤</span>
              Parking Records
            </NavLink>

            {/* Reservations */}
            <NavLink
              to="/admin/reservations"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>◉</span>
              Reservations
            </NavLink>

            {/* Reports */}
            <NavLink
              to="/admin/reports"
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>▥</span>
              Reports
            </NavLink>

          </nav>
        </>
      )}

      {/* =====================================
          USER INFORMATION
      ====================================== */}

      <div className="sidebar-user">

        <strong>
          {user?.name}
        </strong>

        <span>
          {user?.role === "admin"
            ? "Administrator"
            : "User"}
        </span>

        <button
          onClick={handleLogout}
          className="logout-btn"
        >
          Logout
        </button>

      </div>

      {/* =====================================
          SIDEBAR FOOTER
      ====================================== */}

      <div className="sidebar-bottom">
        <p>Parking Management</p>
      </div>

    </aside>
  );
}

export default Sidebar;