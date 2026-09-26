import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Home() {
  const [slots, setSlots] = useState([]);
  const [vehicleType, setVehicleType] = useState("Car");

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
  try {
    const response = await api.get("/slots");

    console.log("Slots received:", response.data);

    setSlots(response.data);
  } catch (error) {
    console.error(
      "Unable to load slots:",
      error.response?.data || error.message
    );
  }
};

  const availableSlots = slots.filter(
    (slot) =>
      slot.status === "Available" &&
      slot.vehicleType === vehicleType
  );

  const occupiedCount = slots.filter(
    (slot) => slot.status === "Occupied"
  ).length;

  return (
    <div className="page">
      <div className="home-intro">
        <div>
          <p className="small-heading">
            WELCOME TO PARKEASE
          </p>

          <h1>
            Find your parking space before you reach the gate.
          </h1>

          <p>
            Check current availability, select a suitable slot
            and park without searching around.
          </p>

          <Link
            to="/book"
            className="primary-btn home-button"
          >
            Book Parking
          </Link>
        </div>

        <div className="availability-box">
          <span>Available for {vehicleType}</span>

          <strong>{availableSlots.length}</strong>

          <p>parking slots available</p>

          <select
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
          </select>

          <div className="mini-stats">
            <div>
              <b>{slots.length}</b>
              <span>Total</span>
            </div>

            <div>
              <b>{availableSlots.length}</b>
              <span>Available</span>
            </div>

            <div>
              <b>{occupiedCount}</b>
              <span>Occupied</span>
            </div>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <h2>Current Parking Slots</h2>
          <p>Green slots are available for parking.</p>
        </div>
      </div>

      <div className="home-slot-grid">
        {slots.map((slot) => {
          const available = slot.status === "Available";

          return (
            <div
              key={slot._id}
              className={`home-slot ${
                available
                  ? "home-slot-free"
                  : "home-slot-busy"
              }`}
            >
              <strong>{slot.slotNumber}</strong>

              <span>
                Floor {slot.floor} · {slot.vehicleType}
              </span>

              <small>{slot.status}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;