const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createReservation,
  getMyReservations,
  cancelReservation,
} = require("../controllers/reservationController");

const Reservation = require("../models/Reservation");

// User-only access
const userOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({
      message: "User access required.",
    });
  }
  next();
};

// Admin-only access
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required.",
    });
  }
  next();
};

// Create reservation
router.post(
  "/",
  authMiddleware,
  userOnly,
  createReservation
);

// Get my reservations
router.get(
  "/my",
  authMiddleware,
  userOnly,
  getMyReservations
);

// Cancel reservation
router.delete(
  "/:id",
  authMiddleware,
  userOnly,
  cancelReservation
);

// Admin: get all reservations
router.get(
  "/admin",
  authMiddleware,
  adminOnly,
  async (req, res) => {
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
  }
);

module.exports = router;