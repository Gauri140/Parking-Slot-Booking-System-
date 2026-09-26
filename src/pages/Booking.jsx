import { useEffect, useState } from "react";
import api from "../services/api";

function Booking() {
  const [slots, setSlots] = useState([]);

  const [vehicleType, setVehicleType] = useState("Car");

  const [form, setForm] = useState({
    name: "",
    vehicleNumber: "",
    slotNumber: "",
  });

  const [booking, setBooking] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [loading, setLoading] = useState(false);

  // =====================================
  // LOAD PARKING SLOTS
  // =====================================

  const loadSlots = async () => {
    try {
      const response = await api.get("/slots");

      setSlots(response.data);
    } catch (error) {
      console.error("Unable to load slots:", error);

      setMessage("Unable to load parking slots.");
      setMessageType("error");
    }
  };

  const loadMyBooking = async () => {
  try {
    const response = await api.get("/parking/my-active");

    setBooking(response.data);
  } catch (error) {
    // 404 simply means the user currently has no active parking
    if (error.response?.status !== 404) {
      console.error(
        "Unable to load active booking:",
        error
      );
    }

    setBooking(null);
  }
};

  useEffect(() => {
  loadSlots();
  loadMyBooking();
}, []);

  // =====================================
  // AVAILABLE SLOTS
  // =====================================

  const availableSlots = slots.filter(
    (slot) =>
      slot.status === "Available" &&
      slot.vehicleType === vehicleType
  );

  // =====================================
  // HANDLE FORM INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================
  // SELECT SLOT
  // =====================================

  const selectSlot = (slotNumber) => {
    setForm((previous) => ({
      ...previous,
      slotNumber,
    }));

    setMessage("");
    setMessageType("");
  };

  // =====================================
  // VEHICLE TYPE
  // =====================================

  const changeVehicleType = (type) => {
    setVehicleType(type);

    // Clear old slot selection
    setForm((previous) => ({
      ...previous,
      slotNumber: "",
    }));

    setMessage("");
    setMessageType("");
  };

  // =====================================
  // BOOK PARKING
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");
    setBooking(null);

    if (!form.slotNumber) {
      setMessage("Please select a parking slot.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/parking/entry",
        {
          name: form.name,
          vehicleNumber:
            form.vehicleNumber.toUpperCase(),
          vehicleType,
          slotNumber: form.slotNumber,
        }
      );

      setBooking(response.data.record);

      setMessage(response.data.message);
      setMessageType("success");

      // Clear form
      setForm({
        name: "",
        vehicleNumber: "",
        slotNumber: "",
      });

      // Reload slot status
      await loadSlots();

    } catch (error) {
      console.error("Booking error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to complete booking."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">

      {/* =================================
          PAGE HEADER
      ================================= */}

      <div className="page-header">
        <div>
          <h1>Book Parking</h1>

          <p>
            Select your vehicle type and choose an
            available parking slot.
          </p>
        </div>
      </div>


      {/* =================================
          MAIN BOOKING AREA
      ================================= */}

      <div className="booking-page-grid">

        {/* LEFT SIDE */}

        <div>

          {/* VEHICLE TYPE */}

          <div className="booking-card">

            <div className="booking-card-header">

              <div>
                <h2>1. Choose Vehicle</h2>

                <p>
                  Select the type of vehicle you are parking.
                </p>
              </div>

            </div>


            <div className="vehicle-choice">

              <button
                type="button"
                className={
                  vehicleType === "Car"
                    ? "vehicle-option selected"
                    : "vehicle-option"
                }
                onClick={() =>
                  changeVehicleType("Car")
                }
              >
                <span className="vehicle-icon">
                  C
                </span>

                <div>
                  <strong>Car</strong>
                  <small>₹50 / hour</small>
                </div>
              </button>


              <button
                type="button"
                className={
                  vehicleType === "Bike"
                    ? "vehicle-option selected"
                    : "vehicle-option"
                }
                onClick={() =>
                  changeVehicleType("Bike")
                }
              >
                <span className="vehicle-icon">
                  B
                </span>

                <div>
                  <strong>Bike</strong>
                  <small>₹20 / hour</small>
                </div>
              </button>

            </div>

          </div>


          {/* AVAILABLE SLOTS */}

          <div className="booking-card">

            <div className="booking-card-header">

              <div>
                <h2>2. Select Parking Slot</h2>

                <p>
                  Available {vehicleType.toLowerCase()} slots.
                </p>
              </div>

              <span className="slot-count">
                {availableSlots.length} available
              </span>

            </div>


            {availableSlots.length === 0 ? (

              <div className="no-slots">

                <strong>
                  No slots available
                </strong>

                <p>
                  There are no available{" "}
                  {vehicleType.toLowerCase()} slots right now.
                </p>

              </div>

            ) : (

              <div className="booking-slot-grid">

                {availableSlots.map((slot) => {

                  const isSelected =
                    form.slotNumber ===
                    slot.slotNumber;

                  return (
                    <button
                      key={slot._id}
                      type="button"
                      className={
                        isSelected
                          ? "booking-slot selected-slot"
                          : "booking-slot"
                      }
                      onClick={() =>
                        selectSlot(
                          slot.slotNumber
                        )
                      }
                    >

                      <div className="booking-slot-number">
                        {slot.slotNumber}
                      </div>

                      <div className="booking-slot-info">
                        Floor {slot.floor}
                      </div>

                      <div className="booking-slot-status">
                        {isSelected
                          ? "Selected"
                          : "Available"}
                      </div>

                    </button>
                  );

                })}

              </div>

            )}

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div>

          <div className="booking-card sticky-card">

            <div className="booking-card-header">

              <div>
                <h2>3. Vehicle Details</h2>

                <p>
                  Enter your details to confirm parking.
                </p>
              </div>

            </div>


            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <div className="booking-form-group">

                <label htmlFor="name">
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />

              </div>


              {/* VEHICLE NUMBER */}

              <div className="booking-form-group">

                <label htmlFor="vehicleNumber">
                  Vehicle Number
                </label>

                <input
                  id="vehicleNumber"
                  name="vehicleNumber"
                  type="text"
                  value={form.vehicleNumber}
                  onChange={handleChange}
                  placeholder="Example: MH12AB1234"
                  required
                />

              </div>


              {/* SELECTED SLOT */}

              <div className="selected-slot-box">

                <span>
                  Selected Slot
                </span>

                <strong>
                  {form.slotNumber ||
                    "Choose a slot"}
                </strong>

              </div>


              {/* SUBMIT BUTTON */}

              <button
                type="submit"
                className="primary-btn booking-submit"
                disabled={loading}
              >
                {loading
                  ? "Booking..."
                  : "Confirm Parking"}
              </button>

            </form>


            {/* MESSAGE */}

            {message && (
              <div
                className={
                  messageType === "success"
                    ? "booking-message success"
                    : "booking-message error"
                }
              >
                {message}
              </div>
            )}

          </div>

        </div>

      </div>


      {/* =================================
          PARKING TICKET
      ================================= */}

      {booking && (
        <div className="ticket-card">

          <div className="ticket-heading">

            <div>

              <span>
                BOOKING CONFIRMED
              </span>

              <h2>
                Parking Ticket
              </h2>

            </div>

            <div className="ticket-status">
              PARKED
            </div>

          </div>


          <div className="ticket-line"></div>


          <div className="ticket-grid">

            <div>
              <span>Name</span>
              <strong>
                {booking.name}
              </strong>
            </div>

            <div>
              <span>Vehicle Number</span>
              <strong>
                {booking.vehicleNumber}
              </strong>
            </div>

            <div>
              <span>Vehicle Type</span>
              <strong>
                {booking.vehicleType}
              </strong>
            </div>

            <div>
              <span>Parking Slot</span>
              <strong>
                {booking.slotNumber}
              </strong>
            </div>

            <div>
              <span>Entry Time</span>
              <strong>
                {new Date(
                  booking.entryTime
                ).toLocaleString()}
              </strong>
            </div>

            <div>
              <span>Rate</span>
              <strong>
                ₹
                {booking.vehicleType === "Car"
                  ? 50
                  : 20}
                /hour
              </strong>
            </div>

          </div>


          <div className="ticket-footer">

            <p>
              Keep your vehicle number handy when
              you leave the parking area.
            </p>

          </div>

        </div>
      )}

    </div>
  );
}

export default Booking;