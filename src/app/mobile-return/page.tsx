import { OpenAppRedirect } from "./open-app-redirect";

const ALLOWED_PREFIXES = ["forcoach://", "exp://", "exps://"];

export default async function MobileReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string; status?: string }>;
}) {
  const { to, status } = await searchParams;
  const safe =
    typeof to === "string" && ALLOWED_PREFIXES.some((p) => to.startsWith(p)) ? to : null;
  const target = safe
    ? `${safe}${safe.includes("?") ? "&" : "?"}billing=${encodeURIComponent(status ?? "done")}`
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
      <p className="font-heading text-2xl font-semibold">FORCOACH</p>
      {target ? (
        <>
          <p className="text-muted-foreground">Taking you back to the app…</p>
          <OpenAppRedirect href={target} />
        </>
      ) : (
        <p className="text-muted-foreground">You can close this page and return to the FORCOACH app.</p>
      )}
    </main>
  );
}
