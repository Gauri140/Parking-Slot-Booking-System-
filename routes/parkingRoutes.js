const express = require("express");

const {
  vehicleEntry,
  getActiveParking,
  getAllRecords,
  getMyActiveParking,
  getMyHistory,
  findVehicle,
  vehicleExit,
} = require("../controllers/parkingController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// USER
router.post("/entry", protect, allowRoles("user"), vehicleEntry);
router.get("/my-active", protect, allowRoles("user"), getMyActiveParking);
router.get("/my-history", protect, allowRoles("user"), getMyHistory);
router.get(
  "/vehicle/:vehicleNumber",
  protect,
  allowRoles("user"),
  findVehicle
);
router.post("/exit", protect, allowRoles("user"), vehicleExit);

// ADMIN
router.get("/active", protect, allowRoles("admin"), getActiveParking);
router.get("/records", protect, allowRoles("admin"), getAllRecords);

module.exports = router;