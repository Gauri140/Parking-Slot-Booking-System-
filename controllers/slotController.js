const ParkingSlot = require("../models/ParkingSlot");

// Get all slots
const getSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find().sort({
      floor: 1,
      slotNumber: 1,
    });

    res.json(slots);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get one slot
const getSlotById = async (req, res) => {
  try {
    const slot = await ParkingSlot.findById(req.params.id);

    if (!slot) {
      return res.status(404).json({
        message: "Parking slot not found",
      });
    }

    res.json(slot);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Create slot
const createSlot = async (req, res) => {
  try {
    const { slotNumber, floor, vehicleType } = req.body;

    if (!slotNumber || !floor || !vehicleType) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingSlot = await ParkingSlot.findOne({
      slotNumber: slotNumber.toUpperCase(),
    });

    if (existingSlot) {
      return res.status(400).json({
        message: "Slot number already exists",
      });
    }

    const slot = await ParkingSlot.create({
      slotNumber: slotNumber.toUpperCase(),
      floor,
      vehicleType,
      status: "Available",
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Update slot
const updateSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!slot) {
      return res.status(404).json({
        message: "Parking slot not found",
      });
    }

    res.json(slot);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// Delete slot
const deleteSlot = async (req, res) => {
  try {
    const slot = await ParkingSlot.findByIdAndDelete(
      req.params.id
    );

    if (!slot) {
      return res.status(404).json({
        message: "Parking slot not found",
      });
    }

    res.json({
      message: "Parking slot deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
};