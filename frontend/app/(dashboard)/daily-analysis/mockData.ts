export const channelFluxData = [
  { name: "Organic Search", value: 45000 },
  { name: "Paid Social", value: 32000 },
  { name: "Direct", value: 28000 },
  { name: "Referral", value: 15000 },
  { name: "Email", value: 12000 },
];

export const audienceTidesData = [
  { time: "00:00", returning: 1200, new: 400 },
  { time: "04:00", returning: 800, new: 200 },
  { time: "08:00", returning: 3400, new: 1500 },
  { time: "12:00", returning: 5600, new: 2800 },
  { time: "16:00", returning: 4800, new: 2100 },
  { time: "20:00", returning: 6100, new: 3200 },
];

// Efficiency Heatmap mock data (7 days × 24 hours)
export const matrixMockData = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => ({
    day_of_week: day,
    hour_of_day: hour,
    roas: parseFloat(
      (1.5 + Math.sin((hour / 24) * Math.PI * 2) * 1.2 + Math.random() * 0.8).toFixed(2)
    ),
  }))
).flat();
