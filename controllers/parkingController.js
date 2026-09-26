const ParkingRecord = require("../models/ParkingRecord");
const ParkingSlot = require("../models/ParkingSlot");

const calculateFee = require("../utils/feeCalculator");

// ======================================
// VEHICLE ENTRY
// USER ONLY
// ======================================

const vehicleEntry = async (req, res) => {
  try {
    const {
      name,
      vehicleNumber,
      vehicleType,
      slotNumber,
    } = req.body;

    if (!name || !vehicleNumber || !vehicleType || !slotNumber) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const normalizedVehicle = vehicleNumber.trim().toUpperCase();
    const normalizedSlot = slotNumber.trim().toUpperCase();

    // Check whether this user already has an active vehicle
    const existingVehicle = await ParkingRecord.findOne({
      user: req.user.userId,
      status: "Parked",
    });

    if (existingVehicle) {
      return res.status(400).json({
        message: "You already have a vehicle parked.",
      });
    }

    // Check whether this vehicle is already parked
    const existingVehicleNumber = await ParkingRecord.findOne({
      vehicleNumber: normalizedVehicle,
      status: "Parked",
    });

    if (existingVehicleNumber) {
      return res.status(400).json({
        message: "This vehicle is already parked.",
      });
    }

    // Find slot
    const slot = await ParkingSlot.findOne({
      slotNumber: normalizedSlot,
    });

    if (!slot) {
      return res.status(404).json({
        message: "Parking slot not found.",
      });
    }

    // Check slot status
    if (slot.status === "Occupied") {
      return res.status(400).json({
        message: "Selected slot is already occupied.",
      });
    }

    // Check vehicle type
    if (slot.vehicleType !== vehicleType) {
      return res.status(400).json({
        message: `This slot is only for ${slot.vehicleType}.`,
      });
    }

    // Create parking record
    const record = await ParkingRecord.create({
      user: req.user.userId,
      name,
      vehicleNumber: normalizedVehicle,
      vehicleType,
      slotNumber: normalizedSlot,
      status: "Parked",
    });

    // Update slot status
    slot.status = "Occupied";
    await slot.save();

    res.status(201).json({
      message: "Vehicle parked successfully.",
      record,
    });
  } catch (error) {
    console.error("VEHICLE ENTRY ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================
// ACTIVE PARKING
// ADMIN
// ======================================

const getActiveParking = async (req, res) => {
  try {
    const records = await ParkingRecord.find({
      status: "Parked",
    })
      .populate("user", "name email")
      .sort({
        entryTime: -1,
      });

    res.json(records);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================
// ALL RECORDS
// ADMIN
// ======================================

const getAllRecords = async (req, res) => {
  try {
    const records = await ParkingRecord.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.json(records);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================
// CURRENT USER PARKING
// USER
// ======================================

const getMyActiveParking = async (req, res) => {
  try {
    const record = await ParkingRecord.findOne({
      user: req.user.userId,
      status: "Parked",
    }).sort({
      entryTime: -1,
    });

    if (!record) {
      return res.status(404).json({
        message: "No active parking found",
      });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error("GET MY ACTIVE PARKING ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================
// CURRENT USER HISTORY
// USER
// ======================================

const getMyHistory = async (req, res) => {
  try {
    const records = await ParkingRecord.find({
      user: req.user.userId,
    }).sort({
      createdAt: -1,
    });

    res.json(records);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================
// FIND USER VEHICLE
// USER
// ======================================

const findVehicle = async (req, res) => {
  try {
    const vehicleNumber =
      req.params.vehicleNumber.trim().toUpperCase();

    const record = await ParkingRecord.findOne({
      user: req.user.userId,
      vehicleNumber,
      status: "Parked",
    });

    if (!record) {
      return res.status(404).json({
        message: "No active parking found for this vehicle.",
      });
    }

    res.json(record);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================
// VEHICLE EXIT
// USER
// ======================================

const vehicleExit = async (req, res) => {
  try {
    const { vehicleNumber } = req.body;

    if (!vehicleNumber) {
      return res.status(400).json({
        message: "Vehicle number is required.",
      });
    }

    const record = await ParkingRecord.findOne({
      user: req.user.userId,
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      status: "Parked",
    });

    if (!record) {
      return res.status(404).json({
        message: "No active parking found.",
      });
    }

    const fee = calculateFee(
      record.entryTime,
      record.vehicleType
    );

    record.exitTime = new Date();
    record.durationHours = fee.durationHours;
    record.ratePerHour = fee.ratePerHour;
    record.amount = fee.amount;
    record.status = "Completed";

    await record.save();

    // Free parking slot
    await ParkingSlot.findOneAndUpdate(
      {
        slotNumber: record.slotNumber,
      },
      {
        status: "Available",
      }
    );

    res.json({
      message: "Vehicle exit completed.",
      record,
    });
  } catch (error) {
    console.error("VEHICLE EXIT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ======================================
// EXPORTS
// ======================================

module.exports = {
  vehicleEntry,
  getActiveParking,
  getAllRecords,
  getMyActiveParking,
  getMyHistory,
  findVehicle,
  vehicleExit,
};