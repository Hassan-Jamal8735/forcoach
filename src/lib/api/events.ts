export type EventSource = "google_calendar" | "csv" | "manual" | "ics";
export type EventStatus = "assigned" | "unassigned" | "excluded";

export type Event = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_time: string;
  end_time: string;
  source: EventSource;
  studio_id: string | null;
  status: EventStatus;
  external_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ImportEventRow = {
  title: string;
  startTime: string;
  endTime: string;
  studioId?: string;
  notes?: string;
};

export type ImportEventsResult = {
  activity: {
    id: string;
    status: string;
    records_processed: number;
    records_created: number;
    records_skipped: number;
  };
  created: number;
  skipped: number;
};

export type EventInput = {
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  studioId?: string | null;
  status?: EventStatus;
  notes?: string;
};

export type ImportActivity = {
  id: string;
  user_id: string;
  source: "google_calendar" | "csv" | "ics";
  status: "running" | "success" | "partial" | "failed";
  records_processed: number;
  records_created: number;
  records_updated: number;
  records_skipped: number;
  error_message: string | null;
  started_at: string;
  finished_at: string | null;
};
