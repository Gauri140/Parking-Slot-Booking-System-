const calculateFee = (entryTime, vehicleType) => {
  const currentTime = new Date();

  const difference =
    currentTime.getTime() - entryTime.getTime();

  let durationHours = Math.ceil(
    difference / (1000 * 60 * 60)
  );

  if (durationHours < 1) {
    durationHours = 1;
  }

  const ratePerHour =
    vehicleType === "Car" ? 50 : 20;

  const amount = durationHours * ratePerHour;

  return {
    durationHours,
    ratePerHour,
    amount,
  };
};

module.exports = calculateFee;