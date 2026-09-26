function SlotCard({ slot, onEdit, onDelete }) {
  const isAvailable = slot.status === "Available";

  return (
    <div
      className={`slot-card ${
        isAvailable ? "available" : "occupied"
      }`}
    >
      <div className="slot-top">
        <h3>{slot.slotNumber}</h3>

        <span
          className={`status ${
            isAvailable ? "green" : "red"
          }`}
        >
          {slot.status}
        </span>
      </div>

      <div className="slot-details">
        <p>
          <strong>Floor:</strong> {slot.floor}
        </p>

        <p>
          <strong>Vehicle:</strong> {slot.vehicleType}
        </p>
      </div>

      <div className="slot-actions">
        <button onClick={() => onEdit(slot)}>
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(slot._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default SlotCard;