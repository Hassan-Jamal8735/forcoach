export type IcsFeed = {
  id: string;
  user_id: string;
  url: string;
  name: string;
  default_studio_id: string | null;
  last_synced_at: string | null;
  created_at: string;
  updated_at: string;
};

export type IcsSyncResult = {
  activity: { id: string; status: string };
  created: number;
  updated: number;
};
