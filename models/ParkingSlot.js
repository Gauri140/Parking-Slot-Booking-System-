const mongoose = require("mongoose");

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true,
  },

  floor: {
    type: Number,
    required: true,
  },

  vehicleType: {
    type: String,
    required: true,
    enum: ["Car", "Bike"],
  },

  status: {
    type: String,
    default: "Available",
    enum: ["Available", "Occupied"],
  },
});

module.exports = mongoose.model("ParkingSlot", parkingSlotSchema);