export type StudioBreakdownEntry = {
  studioId: string;
  studioName: string;
  hours: number;
  earnings: number;
  classCount: number;
};

export type EarningsSummary = {
  from: string;
  to: string;
  totalHours: number;
  totalEarnings: number;
  classCount: number;
  avgClassRate: number;
  bestStudio: string | null;
  pendingCount: number;
  studioBreakdown: StudioBreakdownEntry[];
};

export type EarningsTimeseriesPoint = {
  bucket: string;
  hours: number;
  earnings: number;
};

export type EarningsTimeseries = {
  granularity: "day" | "week" | "month";
  points: EarningsTimeseriesPoint[];
};
