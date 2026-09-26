import { useEffect, useState } from "react";
import api from "../../services/api";
import SlotCard from "../../components/SlotCard";

function ParkingSlots() {
  const [slots, setSlots] = useState([]);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    slotNumber: "",
    floor: 1,
    vehicleType: "Car",
  });

  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Load all parking slots
  const fetchSlots = async () => {
    try {
      const response = await api.get("/slots");
      setSlots(response.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // Form input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Add or update slot
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/slots/${editingId}`, form);
      } else {
        await api.post("/slots", form);
      }

      setForm({
        slotNumber: "",
        floor: 1,
        vehicleType: "Car",
      });

      setEditingId(null);
      setShowForm(false);

      fetchSlots();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  // Edit slot
  const handleEdit = (slot) => {
    setForm({
      slotNumber: slot.slotNumber,
      floor: slot.floor,
      vehicleType: slot.vehicleType,
      status: slot.status,
    });

    setEditingId(slot._id);
    setShowForm(true);
  };

  // Delete slot
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this slot?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/slots/${id}`);
      fetchSlots();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Unable to delete slot"
      );
    }
  };

  // Search slots
  const filteredSlots = slots.filter((slot) =>
    slot.slotNumber
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page">

      {/* Header */}

      <div className="page-header">
        <div>
          <h1>Parking Slots</h1>
          <p>
            Manage parking spaces and view their current status.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setEditingId(null);

            setForm({
              slotNumber: "",
              floor: 1,
              vehicleType: "Car",
            });

            setShowForm(true);
          }}
        >
          + Add Slot
        </button>
      </div>


      {/* Search */}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search slot number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>


      {/* Form */}

      {showForm && (
        <div className="form-card">

          <div className="form-header">
            <h2>
              {editingId
                ? "Edit Parking Slot"
                : "Add Parking Slot"}
            </h2>

            <button
              type="button"
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div>
                <label>Slot Number</label>

                <input
                  type="text"
                  name="slotNumber"
                  value={form.slotNumber}
                  onChange={handleChange}
                  placeholder="Example: A01"
                  required
                />
              </div>


              <div>
                <label>Floor</label>

                <input
                  type="number"
                  name="floor"
                  value={form.floor}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>


              <div>
                <label>Vehicle Type</label>

                <select
                  name="vehicleType"
                  value={form.vehicleType}
                  onChange={handleChange}
                >
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                </select>
              </div>

            </div>

            <button
              type="submit"
              className="primary-btn"
            >
              {editingId
                ? "Update Slot"
                : "Save Slot"}
            </button>

          </form>
        </div>
      )}


      {/* Slot cards */}

      <div className="slot-grid">

        {filteredSlots.map((slot) => (
          <SlotCard
            key={slot._id}
            slot={slot}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

      </div>


      {/* Empty state */}

      {filteredSlots.length === 0 && (
        <div className="empty-state">
          <h3>No parking slots found</h3>
          <p>
            Try another search or add a new slot.
          </p>
        </div>
      )}

    </div>
  );
}

export default ParkingSlots;