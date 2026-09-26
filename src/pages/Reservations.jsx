import { useEffect, useState } from "react";
import api from "../services/api";
import "./Reservations.css";

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

      const [slotsResponse, reservationsResponse] =
        await Promise.all([
          api.get("/slots"),
          api.get("/reservations/my"),
        ]);

      const slotsData = Array.isArray(slotsResponse.data)
        ? slotsResponse.data
        : slotsResponse.data?.slots || [];

      const reservationsData = Array.isArray(
        reservationsResponse.data
      )
        ? reservationsResponse.data
        : reservationsResponse.data?.reservations || [];

      setSlots(slotsData);
      setReservations(reservationsData);
    } catch (err) {
      console.error("Unable to load reservations:", err);

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

    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "vehicleType"
        ? { slotId: "" }
        : {}),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      await api.post("/reservations", {
        ...form,
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
      console.error("Unable to create reservation:", err);

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
      setError("");
      setMessage("");

      await api.delete(`/reservations/${id}`);

      setMessage("Reservation cancelled.");

      await loadData();
    } catch (err) {
      console.error("Unable to cancel reservation:", err);

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

  const today = new Date().toISOString().split("T")[0];

  const formatDateTime = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusClass = (status) => {
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

  if (loading) {
    return (
      <div className="reservations-page">
        <div className="page-header">
          <div>
            <h1>Reservations</h1>
            <p>
              Reserve your parking slot before arriving.
            </p>
          </div>
        </div>

        <div className="welcome-card">
          <div className="empty-state">
            <p>Loading reservations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reservations-page">

      {/* =====================================
          PAGE HEADER
      ====================================== */}

      <div className="page-header">
        <div>
          <h1>Reservations</h1>

          <p>
            Reserve your parking slot before arriving.
          </p>
        </div>
      </div>

      {/* =====================================
          MESSAGES
      ====================================== */}

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

      {/* =====================================
          CREATE RESERVATION
      ====================================== */}

      <div className="welcome-card">

        <h2>Create Reservation</h2>

        <p>
          Select your vehicle, time and a compatible
          available slot.
        </p>

        <form
          onSubmit={handleSubmit}
          className="form-grid"
        >

          {/* Vehicle Number */}

          <div className="form-group">
            <label htmlFor="vehicleNumber">
              Vehicle Number
            </label>

            <input
              id="vehicleNumber"
              type="text"
              name="vehicleNumber"
              value={form.vehicleNumber}
              onChange={handleChange}
              placeholder="MH12AB1234"
              autoComplete="off"
              required
            />
          </div>

          {/* Vehicle Type */}

          <div className="form-group">
            <label htmlFor="vehicleType">
              Vehicle Type
            </label>

            <select
              id="vehicleType"
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              required
            >
              <option value="Car">
                Car
              </option>

              <option value="Bike">
                Bike
              </option>
            </select>
          </div>

          {/* Date */}

          <div className="form-group">
            <label htmlFor="reservationDate">
              Date
            </label>

            <input
              id="reservationDate"
              type="date"
              name="reservationDate"
              value={form.reservationDate}
              onChange={handleChange}
              min={today}
              required
            />
          </div>

          {/* Start Time */}

          <div className="form-group">
            <label htmlFor="startTime">
              Start Time
            </label>

            <input
              id="startTime"
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* End Time */}

          <div className="form-group">
            <label htmlFor="endTime">
              End Time
            </label>

            <input
              id="endTime"
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </div>

          {/* Parking Slot */}

          <div className="form-group">
            <label htmlFor="slotId">
              Parking Slot
            </label>

            <select
              id="slotId"
              name="slotId"
              value={form.slotId}
              onChange={handleChange}
              required
            >
              <option value="">
                {availableSlots.length === 0
                  ? "No compatible slots available"
                  : "Select slot"}
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

          {/* Submit */}

          <div className="form-actions">
            <button
              type="submit"
              className="primary-btn"
              disabled={
                saving || availableSlots.length === 0
              }
            >
              {saving
                ? "Reserving..."
                : "Reserve Slot"}
            </button>
          </div>

        </form>
      </div>

      {/* =====================================
          MY RESERVATIONS
      ====================================== */}

      <div className="my-reservations-card">

        <div className="my-reservations-header">

          <div>
            <h2>My Reservations</h2>

            <p>
              View and manage your parking reservations.
            </p>
          </div>

        </div>

        {reservations.length === 0 ? (

          <div className="empty-state">
            <h3>No reservations yet</h3>

            <p>
              Your reservations will appear here after
              you reserve a parking slot.
            </p>
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

                    {/* Vehicle */}

                    <td>
                      <strong>
                        {reservation.vehicleNumber || "-"}
                      </strong>
                    </td>

                    {/* Slot */}

                    <td>
                      <strong>
                        {reservation.slot?.slotNumber || "-"}
                      </strong>
                    </td>

                    {/* Type */}

                    <td>
                      {reservation.vehicleType || "-"}
                    </td>

                    {/* Start */}

                    <td>
                      {formatDateTime(
                        reservation.startTime
                      )}
                    </td>

                    {/* End */}

                    <td>
                      {formatDateTime(
                        reservation.endTime
                      )}
                    </td>

                    {/* Status */}

                    <td>
                      <span
                        className={getStatusClass(
                          reservation.status
                        )}
                      >
                        <span className="status-dot"></span>

                        {reservation.status}
                      </span>
                    </td>

                    {/* Cancel */}

                    <td>
                      {reservation.status === "Reserved" && (
                        <button
                          type="button"
                          className="cancel-btn"
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