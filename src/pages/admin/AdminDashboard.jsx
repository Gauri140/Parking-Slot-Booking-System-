import { useEffect, useState } from "react";
import api from "../../services/api";
import StatCard from "../../components/StatCard";

function AdminDashboard() {
  const [slots, setSlots] = useState([]);
  const [activeParking, setActiveParking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setMessage("");

      const [slotsResponse, activeResponse] =
        await Promise.all([
          api.get("/slots"),
          api.get("/parking/active"),
        ]);

      setSlots(slotsResponse.data);
      setActiveParking(activeResponse.data);
    } catch (error) {
      console.error(
        "Unable to load dashboard:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const totalSlots = slots.length;

  const availableSlots = slots.filter(
    (slot) => slot.status === "Available"
  ).length;

  const occupiedSlots = slots.filter(
    (slot) => slot.status === "Occupied"
  ).length;

  const occupancyPercentage =
    totalSlots > 0
      ? Math.round(
          (occupiedSlots / totalSlots) * 100
        )
      : 0;

  return (
    <div className="page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>

          <p>
            Monitor the parking area and daily activity.
          </p>
        </div>
      </div>

      {/* ERROR */}

      {message && (
        <div className="form-message">
          {message}
        </div>
      )}

      {/* STATS */}

      <div className="stats-grid">

        <StatCard
          title="Total Slots"
          value={loading ? "—" : totalSlots}
        />

        <StatCard
          title="Available Slots"
          value={loading ? "—" : availableSlots}
          className="available-stat"
        />

        <StatCard
          title="Occupied Slots"
          value={loading ? "—" : occupiedSlots}
          className="occupied-stat"
        />

      </div>

      {/* OVERVIEW */}

      <div className="welcome-card">

        <h2>Parking Occupancy</h2>

        <p>
          Current occupancy of the parking area.
        </p>

        <div className="simple-bar">
          <div
            className="bar-fill"
            style={{
              width: `${occupancyPercentage}%`,
            }}
          ></div>
        </div>

        <div className="bar-label">
          <span>
            {occupancyPercentage}% occupied
          </span>

          <span>
            {occupiedSlots} of {totalSlots} slots
          </span>
        </div>

      </div>

      {/* ACTIVE PARKING */}

      <div className="welcome-card">

        <h2>Active Parking</h2>

        <p>
          Vehicles currently parked in the area.
        </p>

        {loading ? (
          <p>Loading active parking...</p>
        ) : activeParking.length === 0 ? (
          <p>No vehicles are currently parked.</p>
        ) : (
          <div className="active-parking-list">

            {activeParking.slice(0, 5).map((record) => (
              <div
                key={record._id}
                className="active-parking-item"
              >
                <div>
                  <strong>
                    {record.vehicleNumber}
                  </strong>

                  <p>
                    {record.name} · {record.vehicleType}
                  </p>
                </div>

                <div>
                  <strong>
                    {record.slotNumber}
                  </strong>

                  <p>
                    {new Date(
                      record.entryTime
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;