import { useEffect, useState } from "react";
import api from "../services/api";

function History() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadHistory = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/parking/my-history");
      setRecords(response.data);
    } catch (error) {
      console.error("Unable to load parking history:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load parking history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Parking History</h1>
          <p>View your previous parking records.</p>
        </div>
      </div>

      {message && (
        <div className="form-message">
          {message}
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <p>Loading parking history...</p>
        </div>
      ) : records.length === 0 ? (
        <div className="empty-state">
          <h3>No parking history</h3>
          <p>
            Your completed parking records will appear here.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {records.map((record) => (
            <div
              key={record._id}
              className="history-card"
            >
              <div className="history-card-header">
                <div>
                  <h3>{record.vehicleNumber}</h3>
                  <p>
                    {record.vehicleType} · Slot {record.slotNumber}
                  </p>
                </div>

                <span
                  className={
                    record.status === "Completed"
                      ? "history-status completed"
                      : "history-status parked"
                  }
                >
                  {record.status}
                </span>
              </div>

              <div className="history-grid">

                <div>
                  <span>Name</span>
                  <strong>{record.name}</strong>
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
                  <span>Rate</span>
                  <strong>
                    ₹{record.ratePerHour || 0}/hour
                  </strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>
                    ₹{record.amount || 0}
                  </strong>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default History;