const Reservation = require("../models/Reservation");
const ParkingSlot = require("../models/ParkingSlot");

const createReservation = async (req, res) => {
  try {
    const {
      slotId,
      vehicleNumber,
      vehicleType,
      reservationDate,
      startTime,
      endTime,
    } = req.body;

    if (
      !slotId ||
      !vehicleNumber ||
      !vehicleType ||
      !reservationDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        message: "All reservation fields are required.",
      });
    }

    const slot = await ParkingSlot.findById(slotId);

    if (!slot) {
      return res.status(404).json({
        message: "Parking slot not found.",
      });
    }

    if (slot.status !== "Available") {
      return res.status(400).json({
        message: "This parking slot is currently unavailable.",
      });
    }

    if (slot.vehicleType !== vehicleType) {
      return res.status(400).json({
        message: `This slot is only available for ${slot.vehicleType}.`,
      });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Invalid reservation time.",
      });
    }

    if (end <= start) {
      return res.status(400).json({
        message: "End time must be after start time.",
      });
    }

    if (start <= new Date()) {
      return res.status(400).json({
        message: "Reservation must be for a future time.",
      });
    }

    // Prevent overlapping reservations.
    const conflict = await Reservation.findOne({
      slot: slotId,
      status: "Reserved",
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (conflict) {
      return res.status(400).json({
        message: "This slot is already reserved for the selected time.",
      });
    }

    // Prevent the same user from creating overlapping reservations.
    const userConflict = await Reservation.findOne({
      user: req.user.userId,
      status: "Reserved",
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (userConflict) {
      return res.status(400).json({
        message: "You already have another reservation during this time.",
      });
    }

    const reservation = await Reservation.create({
      user: req.user.userId,
      slot: slotId,
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      vehicleType,
      reservationDate,
      startTime: start,
      endTime: end,
      status: "Reserved",
    });

    const populatedReservation = await Reservation.findById(reservation._id)
      .populate("slot")
      .populate("user", "name email");

    res.status(201).json(populatedReservation);
  } catch (error) {
    console.error("Create reservation error:", error);

    res.status(500).json({
      message: "Unable to create reservation.",
    });
  }
};

const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({
      user: req.user.userId,
    })
      .populate("slot")
      .sort({ startTime: 1 });

    res.json(reservations);
  } catch (error) {
    console.error("Get reservations error:", error);

    res.status(500).json({
      message: "Unable to load reservations.",
    });
  }
};

const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user.userId,
      status: "Reserved",
    });

    if (!reservation) {
      return res.status(404).json({
        message: "Active reservation not found.",
      });
    }

    reservation.status = "Cancelled";
    await reservation.save();

    res.json({
      message: "Reservation cancelled successfully.",
      reservation,
    });
  } catch (error) {
    console.error("Cancel reservation error:", error);

    res.status(500).json({
      message: "Unable to cancel reservation.",
    });
  }
};

module.exports = {
  createReservation,
  getMyReservations,
  cancelReservation,
};
const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("user", "name email")
      .populate("slot", "slotNumber floor vehicleType status")
      .sort({ createdAt: -1 });

    res.json(reservations);
  } catch (error) {
    console.error("Get all reservations error:", error);

    res.status(500).json({
      message: "Unable to load reservations.",
    });
  }
};