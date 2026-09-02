export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, e.g. "2026-09-02". */
  date: string;
  content: React.ReactNode;
};
