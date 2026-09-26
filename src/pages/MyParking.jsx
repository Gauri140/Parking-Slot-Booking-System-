import { useState } from "react";
import api from "../services/api";

function MyParking() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [record, setRecord] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const searchVehicle = async (e) => {
    e.preventDefault();

    if (!vehicleNumber.trim()) {
      setMessage("Please enter your vehicle number.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setRecord(null);

      const response = await api.get(
        `/parking/vehicle/${vehicleNumber.trim().toUpperCase()}`
      );

      setRecord(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Vehicle not found."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.post("/parking/exit", {
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
      });

      setRecord(response.data.record);

      setMessage(
        `Vehicle exit completed. Final amount: ₹${response.data.record.amount}`
      );
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to process vehicle exit."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>My Parking</h1>

          <p>
            Check your active parking and complete your vehicle exit.
          </p>
        </div>
      </div>

      {/* SEARCH VEHICLE */}

      <div className="form-card parking-search">
        <form onSubmit={searchVehicle}>

          <label htmlFor="vehicleNumber">
            Vehicle Number
          </label>

          <div className="search-row">

            <input
              id="vehicleNumber"
              type="text"
              value={vehicleNumber}
              onChange={(e) =>
                setVehicleNumber(e.target.value)
              }
              placeholder="Example: MH12AB1234"
            />

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Searching..." : "Find Vehicle"}
            </button>

          </div>
        </form>
      </div>

      {/* MESSAGE */}

      {message && !record && (
        <div className="form-message">
          {message}
        </div>
      )}

      {/* PARKING DETAILS */}

      {record && (
        <div className="parking-result">

          <div className="result-header">

            <div>
              <h2>{record.vehicleNumber}</h2>

              <p>{record.name}</p>
            </div>

            <span className="status green">
              {record.status}
            </span>

          </div>

          <div className="result-grid">

            <div>
              <span>Parking Slot</span>
              <strong>{record.slotNumber}</strong>
            </div>

            <div>
              <span>Vehicle Type</span>
              <strong>{record.vehicleType}</strong>
            </div>

            <div>
              <span>Entry Time</span>
              <strong>
                {new Date(
                  record.entryTime
                ).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Exit Time</span>
              <strong>
                {record.exitTime
                  ? new Date(
                      record.exitTime
                    ).toLocaleString()
                  : "Still parked"}
              </strong>
            </div>

            <div>
              <span>Duration</span>
              <strong>
                {record.durationHours > 0
                  ? `${record.durationHours} hour(s)`
                  : "Currently parked"}
              </strong>
            </div>

            <div>
              <span>Amount</span>
              <strong>
                ₹{record.amount}
              </strong>
            </div>

          </div>

          {/* EXIT BUTTON */}

          {record.status === "Parked" && (
            <button
              type="button"
              className="primary-btn exit-btn"
              onClick={handleExit}
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : "Complete Vehicle Exit"}
            </button>
          )}

          {/* EXIT MESSAGE */}

          {message && (
            <div className="form-message">
              {message}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default MyParking;