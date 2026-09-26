import { useEffect, useState } from "react";
import api from "../../services/api";

function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadReports = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await api.get("/reports");
      setReport(response.data);
    } catch (error) {
      console.error("Unable to load reports:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="page reports-page">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>
            View parking and revenue statistics.
          </p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={loadReports}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Reports"}
        </button>
      </div>

      {/* ERROR */}
      {message && (
        <div className="form-message">
          {message}
        </div>
      )}

      {/* LOADING */}
      {loading && !report ? (
        <div className="empty-state">
          <p>Loading reports...</p>
        </div>
      ) : report ? (
        <>
          {/* SUMMARY */}
          <div className="stats-grid">
            <div className="stat-card">
              <p>Total Parking Records</p>
              <h2>{report.totalRecords ?? 0}</h2>
            </div>

            <div className="stat-card">
              <p>Completed Parkings</p>
              <h2>{report.completedRecords ?? 0}</h2>
            </div>

            <div className="stat-card occupied-stat">
              <p>Total Revenue</p>
              <h2>₹{report.totalRevenue ?? 0}</h2>
            </div>
          </div>

          {/* VEHICLE USAGE */}
          <div className="welcome-card">
            <h2>Vehicle Usage</h2>
            <p>
              Distribution of parking by vehicle type.
            </p>

            <div className="report-summary-grid">
              <div className="report-summary-item">
                <span>Cars</span>
                <strong>{report.carCount ?? 0}</strong>
              </div>

              <div className="report-summary-item">
                <span>Bikes</span>
                <strong>{report.bikeCount ?? 0}</strong>
              </div>
            </div>
          </div>

          {/* MOST USED SLOTS */}
          <div className="welcome-card">
            <h2>Most Used Parking Slots</h2>
            <p>
              Slots with the highest number of completed
              parking records.
            </p>

            {report.mostUsedSlots?.length > 0 ? (
              <div className="report-table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>Slot</th>
                      <th>Usage Count</th>
                    </tr>
                  </thead>

                  <tbody>
                    {report.mostUsedSlots.map((slot) => (
                      <tr key={slot._id}>
                        <td>
                          <strong>{slot._id}</strong>
                        </td>
                        <td>{slot.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <p>No slot usage data available.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <h3>No report data available</h3>
          <p>
            Report information will appear here once
            parking records are available.
          </p>
        </div>
      )}
    </div>
  );
}

export default Reports;
