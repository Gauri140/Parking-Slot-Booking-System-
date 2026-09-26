const express = require("express");

const {
  getSlots,
  getSlotById,
  createSlot,
  updateSlot,
  deleteSlot,
} = require("../controllers/slotController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// USER + ADMIN
// View parking slots
router.get(
  "/",
  protect,
  allowRoles("user", "admin"),
  getSlots
);

router.get(
  "/:id",
  protect,
  allowRoles("user", "admin"),
  getSlotById
);

// ADMIN ONLY
// Create parking slot
router.post(
  "/",
  protect,
  allowRoles("admin"),
  createSlot
);

// Update parking slot
router.put(
  "/:id",
  protect,
  allowRoles("admin"),
  updateSlot
);

// Delete parking slot
router.delete(
  "/:id",
  protect,
  allowRoles("admin"),
  deleteSlot
);

module.exports = router;