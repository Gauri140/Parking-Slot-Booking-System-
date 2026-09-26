const mongoose = require("mongoose");

const parkingRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    vehicleNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    vehicleType: {
      type: String,
      enum: ["Car", "Bike"],
      required: true,
    },

    slotNumber: {
      type: String,
      required: true,
      uppercase: true,
    },

    entryTime: {
      type: Date,
      default: Date.now,
    },

    exitTime: {
      type: Date,
      default: null,
    },

    durationHours: {
      type: Number,
      default: 0,
    },

    ratePerHour: {
      type: Number,
      default: 0,
    },

    amount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Parked", "Completed"],
      default: "Parked",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "ParkingRecord",
  parkingRecordSchema
);