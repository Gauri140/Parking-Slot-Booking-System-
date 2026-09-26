import { useEffect, useState } from "react";
import api from "../../services/api";

function ParkingRecords() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadRecords = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/parking/records");
      setRecords(response.data);
    } catch (error) {
      console.error(
        "Unable to load parking records:",
        error
      );

      setMessage(
        error.response?.data?.message ||
          "Unable to load parking records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = records.filter((record) => {
    const searchText = search.toLowerCase();

    return (
      record.vehicleNumber
        ?.toLowerCase()
        .includes(searchText) ||
      record.slotNumber
        ?.toLowerCase()
        .includes(searchText) ||
      record.name
        ?.toLowerCase()
        .includes(searchText) ||
      record.vehicleType
        ?.toLowerCase()
        .includes(searchText) ||
      record.status
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  return (
    <div className="page">

      <div className="page-header">
        <div>
          <h1>Parking Records</h1>
          <p>
            View and search all parking transactions.
          </p>
        </div>
      </div>

      {message && (
        <div className="form-message">
          {message}
        </div>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search vehicle, slot, name or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="empty-state">
          <p>Loading parking records...</p>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="empty-state">
          <h3>No parking records found</h3>
          <p>
            No transactions match your search.
          </p>
        </div>
      ) : (
        <div className="records-table-wrapper">
          <table className="records-table">

            <thead>
              <tr>
                <th>User</th>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Slot</th>
                <th>Entry</th>
                <th>Exit</th>
                <th>Duration</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record._id}>

                  <td>
                    <strong>{record.name}</strong>

                    {record.user?.email && (
                      <small>
                        {record.user.email}
                      </small>
                    )}
                  </td>

                  <td>{record.vehicleNumber}</td>

                  <td>{record.vehicleType}</td>

                  <td>{record.slotNumber}</td>

                  <td>
                    {new Date(
                      record.entryTime
                    ).toLocaleString()}
                  </td>

                  <td>
                    {record.exitTime
                      ? new Date(
                          record.exitTime
                        ).toLocaleString()
                      : "—"}
                  </td>

                  <td>
                    {record.durationHours > 0
                      ? `${record.durationHours} hr`
                      : "—"}
                  </td>

                  <td>
                    ₹{record.amount || 0}
                  </td>

                  <td>
                    <span
                      className={
                        record.status === "Completed"
                          ? "history-status completed"
                          : "history-status parked"
                      }
                    >
                      {record.status}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}

export default ParkingRecords;