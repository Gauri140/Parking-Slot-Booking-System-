const express = require("express");

const {
  getReports,
} = require("../controllers/reportController");

const protect = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");

const router = express.Router();

// ADMIN ONLY
router.get(
  "/",
  protect,
  allowRoles("admin"),
  getReports
);

module.exports = router;