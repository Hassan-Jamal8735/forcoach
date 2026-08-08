export type CompensationType = "hourly" | "per_class";
export type StudioStatus = "active" | "inactive";

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
  compensationValue: number;
  status?: StudioStatus;
  matchKeywords?: string[];
};
