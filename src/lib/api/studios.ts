export type CompensationType = "hourly" | "per_class" | "tiered";
export type StudioStatus = "active" | "inactive";

export type RateTier = {
  min_attendance: number;
  /** Null means "and up" — an open-ended top bracket. */
  max_attendance: number | null;
  rate: number;
};

export type RateTierInput = {
  minAttendance: number;
  maxAttendance?: number;
  rate: number;
};

export type Studio = {
  id: string;
  user_id: string;
  name: string;
  reference_id: string | null;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  compensation_type: CompensationType;
  compensation_value: number;
  /** Only present (and meaningful) when compensation_type is "tiered". */
  rate_tiers?: RateTier[];
  status: StudioStatus;
  match_keywords: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type StudioInput = {
  name: string;
  referenceId?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
  compensationType: CompensationType;
  compensationValue?: number;
  rateTiers?: RateTierInput[];
  status?: StudioStatus;
  matchKeywords?: string[];
};

export type StudioSuggestion = {
  label: string;
  keyword: string;
  classCount: number;
  sampleTitle: string;
  /** Derived from the class title because the class had no usable location. */
  fromTitle: boolean;
};

export type SuggestedStudioInput = {
  name: string;
  keyword?: string;
  compensationType: CompensationType;
  compensationValue: number;
};
