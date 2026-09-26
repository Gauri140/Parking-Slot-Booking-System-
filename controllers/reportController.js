const ParkingRecord = require("../models/ParkingRecord");

// ======================================
// PARKING REPORTS
// ADMIN ONLY
// ======================================

const getReports = async (req, res) => {
  try {
    // Total records
    const totalRecords = await ParkingRecord.countDocuments();

    // Completed parking records
    const completedRecords = await ParkingRecord.countDocuments({
      status: "Completed",
    });

    // Total revenue from completed parking
    const revenueResult = await ParkingRecord.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // Car parking count
    const carResult = await ParkingRecord.aggregate([
      {
        $match: {
          vehicleType: "Car",
        },
      },
      {
        $count: "count",
      },
    ]);

    const carCount =
      carResult.length > 0
        ? carResult[0].count
        : 0;

    // Bike parking count
    const bikeResult = await ParkingRecord.aggregate([
      {
        $match: {
          vehicleType: "Bike",
        },
      },
      {
        $count: "count",
      },
    ]);

    const bikeCount =
      bikeResult.length > 0
        ? bikeResult[0].count
        : 0;

    // Most used parking slots
    const mostUsedSlots = await ParkingRecord.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },
      {
        $group: {
          _id: "$slotNumber",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    res.json({
      totalRecords,
      completedRecords,
      totalRevenue,
      carCount,
      bikeCount,
      mostUsedSlots,
    });
  } catch (error) {
    console.error("REPORT ERROR:", error);

    res.status(500).json({
      message: "Unable to generate reports.",
    });
  }
};

module.exports = {
  getReports,
};