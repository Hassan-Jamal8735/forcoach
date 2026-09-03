export type SearchResultItem = {
  id: string;
  title: string;
  subtitle: string | null;
  href: string;
};

export type SearchResults = {
  studios: SearchResultItem[];
  events: SearchResultItem[];
  invoices: SearchResultItem[];
};
