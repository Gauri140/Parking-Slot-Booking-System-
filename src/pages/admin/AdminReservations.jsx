import { useEffect, useMemo, useState } from "react";
import api from "../../services/api";
import "./AdminReservations.css";

function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/reservations/admin");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.reservations || [];

      setReservations(data);
    } catch (err) {
      console.error("Unable to load admin reservations:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load reservations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const filteredReservations = useMemo(() => {
    if (filter === "All") {
      return reservations;
    }

    return reservations.filter(
      (reservation) => reservation.status === filter
    );
  }, [reservations, filter]);

  const stats = {
    total: reservations.length,
    reserved: reservations.filter(
      (item) => item.status === "Reserved"
    ).length,
    completed: reservations.filter(
      (item) => item.status === "Completed"
    ).length,
    cancelled: reservations.filter(
      (item) => item.status === "Cancelled"
    ).length,
    expired: reservations.filter(
      (item) => item.status === "Expired"
    ).length,
  };

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const statusClass = (status) => {
    switch (status) {
      case "Reserved":
        return "status-badge reserved";

      case "Completed":
        return "status-badge completed";

      case "Cancelled":
        return "status-badge cancelled";

      case "Expired":
        return "status-badge expired";

      default:
        return "status-badge";
    }
  };

  return (
    <div className="reservations-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <section className="reservations-header">

        <div>
          <span className="section-kicker">
            PARKING MANAGEMENT
          </span>

          <h1>Reservations</h1>

          <p>
            Monitor upcoming and historical parking reservations
            across the facility.
          </p>
        </div>

        <button
          type="button"
          className="reservation-refresh-btn"
          onClick={loadReservations}
          disabled={loading}
        >
          <span className="refresh-icon">↻</span>

          {loading ? "Refreshing..." : "Refresh"}
        </button>

      </section>

      {/* =====================================
          ERROR
      ====================================== */}

      {error && (
        <div className="reservation-error">
          <span>!</span>
          {error}
        </div>
      )}

      {/* =====================================
          STATS
      ====================================== */}

      <section className="reservation-stats">

        <div className="reservation-stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Total Reservations
            </span>

            <span className="stat-icon neutral">
              ◉
            </span>
          </div>

          <strong>{stats.total}</strong>

          <span className="stat-description">
            All reservations
          </span>
        </div>

        <div className="reservation-stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Active
            </span>

            <span className="stat-icon available">
              ●
            </span>
          </div>

          <strong>{stats.reserved}</strong>

          <span className="stat-description">
            Currently reserved
          </span>
        </div>

        <div className="reservation-stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Completed
            </span>

            <span className="stat-icon completed">
              ✓
            </span>
          </div>

          <strong>{stats.completed}</strong>

          <span className="stat-description">
            Successfully completed
          </span>
        </div>

        <div className="reservation-stat-card">
          <div className="stat-card-top">
            <span className="stat-label">
              Cancelled
            </span>

            <span className="stat-icon cancelled">
              ×
            </span>
          </div>

          <strong>{stats.cancelled}</strong>

          <span className="stat-description">
            Cancelled reservations
          </span>
        </div>

      </section>

      {/* =====================================
          RESERVATION TABLE
      ====================================== */}

      <section className="reservation-panel">

        <div className="reservation-panel-header">

          <div>
            <h2>Reservation Activity</h2>

            <p>
              Review reservation schedules, customers and assigned slots.
            </p>
          </div>

          <div className="reservation-count">
            {filteredReservations.length}{" "}
            {filteredReservations.length === 1
              ? "reservation"
              : "reservations"}
          </div>

        </div>

        {/* FILTERS */}

        <div className="reservation-filters">

          {[
            {
              label: "All",
              count: stats.total,
            },
            {
              label: "Reserved",
              count: stats.reserved,
            },
            {
              label: "Completed",
              count: stats.completed,
            },
            {
              label: "Cancelled",
              count: stats.cancelled,
            },
            {
              label: "Expired",
              count: stats.expired,
            },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setFilter(item.label)}
              className={
                filter === item.label
                  ? "reservation-filter active"
                  : "reservation-filter"
              }
            >
              {item.label}

              <span>{item.count}</span>
            </button>
          ))}

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="reservation-empty">
            <div className="loading-spinner"></div>

            <h3>Loading reservations</h3>

            <p>
              Fetching the latest reservation activity.
            </p>
          </div>
        ) : filteredReservations.length === 0 ? (

          /* EMPTY */

          <div className="reservation-empty">

            <div className="empty-icon">
              ◉
            </div>

            <h3>No reservations found</h3>

            <p>
              There are no reservations matching the selected filter.
            </p>

          </div>

        ) : (

          /* TABLE */

          <div className="reservation-table-wrapper">

            <table className="reservation-table">

              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Slot</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {filteredReservations.map((reservation) => (

                  <tr key={reservation._id}>

                    {/* CUSTOMER */}

                    <td>
                      <div className="customer-cell">

                        <div className="customer-avatar">
                          {(reservation.user?.name || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="customer-info">

                          <strong>
                            {reservation.user?.name ||
                              "Unknown User"}
                          </strong>

                          <span>
                            {reservation.user?.email ||
                              "No email"}
                          </span>

                        </div>

                      </div>
                    </td>

                    {/* VEHICLE */}

                    <td>
                      <div className="vehicle-cell">

                        <strong>
                          {reservation.vehicleNumber || "-"}
                        </strong>

                        <span>
                          {reservation.vehicleType || "-"}
                        </span>

                      </div>
                    </td>

                    {/* SLOT */}

                    <td>
                      <div className="slot-cell">

                        <strong>
                          {reservation.slot?.slotNumber || "-"}
                        </strong>

                        {reservation.slot?.floor && (
                          <span>
                            Floor {reservation.slot.floor}
                          </span>
                        )}

                      </div>
                    </td>

                    {/* DATE */}

                    <td>
                      <div className="date-cell">
                        {formatDate(
                          reservation.reservationDate ||
                            reservation.startTime
                        )}
                      </div>
                    </td>

                    {/* TIME */}

                    <td>
                      <div className="time-cell">

                        <strong>
                          {formatTime(reservation.startTime)}
                        </strong>

                        <span>
                          to {formatTime(reservation.endTime)}
                        </span>

                      </div>
                    </td>

                    {/* STATUS */}

                    <td>
                      <span
                        className={statusClass(
                          reservation.status
                        )}
                      >
                        <span className="status-dot"></span>

                        {reservation.status}
                      </span>
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default AdminReservations;