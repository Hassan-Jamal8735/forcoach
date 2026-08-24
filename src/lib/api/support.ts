export type SupportMessage = {
  id: string;
  user_id: string;
  sender: "user" | "admin";
  body: string;
  read_at: string | null;
  created_at: string;
};
