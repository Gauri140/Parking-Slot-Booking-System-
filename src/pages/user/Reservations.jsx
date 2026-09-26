import { useEffect, useState } from "react";
import api from "../../services/api";

function Reservations() {
  const [slots, setSlots] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [form, setForm] = useState({
    slotId: "",
    vehicleNumber: "",
    vehicleType: "Car",
    reservationDate: "",
    startTime: "",
    endTime: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [slotsResponse, reservationsResponse] = await Promise.all([
        api.get("/slots"),
        api.get("/reservations/my"),
      ]);

      setSlots(slotsResponse.data);
      setReservations(reservationsResponse.data);
    } catch (err) {
      console.error("Unable to load reservation data:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load reservation information."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => {
      const updated = {
        ...current,
        [name]: value,
      };

      if (name === "vehicleType") {
        updated.slotId = "";
      }

      return updated;
    });

    setMessage("");
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await api.post("/reservations", {
        slotId: form.slotId,
        vehicleNumber: form.vehicleNumber,
        vehicleType: form.vehicleType,
        reservationDate: form.reservationDate,
        startTime: `${form.reservationDate}T${form.startTime}`,
        endTime: `${form.reservationDate}T${form.endTime}`,
      });

      setMessage("Reservation created successfully.");

      setForm({
        slotId: "",
        vehicleNumber: "",
        vehicleType: "Car",
        reservationDate: "",
        startTime: "",
        endTime: "",
      });

      await loadData();
    } catch (err) {
      console.error("Reservation error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to create reservation."
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelReservation = async (id) => {
    try {
      setMessage("");
      setError("");

      await api.delete(`/reservations/${id}`);

      setMessage("Reservation cancelled successfully.");

      await loadData();
    } catch (err) {
      console.error("Cancel reservation error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to cancel reservation."
      );
    }
  };

  const availableSlots = slots.filter(
    (slot) =>
      slot.status === "Available" &&
      slot.vehicleType === form.vehicleType
  );

  if (loading) {
    return (
      <div className="page">
        <div className="empty-state">
          <p>Loading reservations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Reservations</h1>
          <p>Reserve your parking slot before arriving.</p>
        </div>
      </div>

      {message && (
        <div className="form-message">
          {message}
        </div>
      )}

      {error && (
        <div className="form-message">
          {error}
        </div>
      )}

      <div className="welcome-card">
        <h2>Create Reservation</h2>

        <p>
          Select your vehicle, date, time and compatible parking
          slot.
        </p>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Vehicle Number</label>

            <input
              type="text"
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="MH12AB1234"
              required
            />
          </div>

          <div className="form-group">
            <label>Vehicle Type</label>

            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              required
            >
              <option value="Car">Car</option>
              <option value="Bike">Bike</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reservation Date</label>

            <input
              type="date"
              name="reservationDate"
              value={form.reservationDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Start Time</label>

            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>End Time</label>

            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Parking Slot</label>

            <select
              name="slotId"
              value={form.slotId}
              onChange={handleChange}
              required
            >
              <option value="">
                Select an available slot
              </option>

              {availableSlots.map((slot) => (
                <option
                  key={slot._id}
                  value={slot._id}
                >
                  {slot.slotNumber} — Floor {slot.floor}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-btn"
              disabled={saving}
            >
              {saving
                ? "Reserving..."
                : "Reserve Slot"}
            </button>
          </div>
        </form>
      </div>

      <div className="welcome-card">
        <h2>My Reservations</h2>

        {reservations.length === 0 ? (
          <div className="empty-state">
            <p>No reservations yet.</p>
          </div>
        ) : (
          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Slot</th>
                  <th>Type</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>
                      {reservation.vehicleNumber}
                    </td>

                    <td>
                      {reservation.slot?.slotNumber ||
                        "-"}
                    </td>

                    <td>
                      {reservation.vehicleType}
                    </td>

                    <td>
                      {new Date(
                        reservation.startTime
                      ).toLocaleString()}
                    </td>

                    <td>
                      {new Date(
                        reservation.endTime
                      ).toLocaleString()}
                    </td>

                    <td>
                      {reservation.status}
                    </td>

                    <td>
                      {reservation.status ===
                        "Reserved" && (
                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() =>
                            cancelReservation(
                              reservation._id
                            )
                          }
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reservations;