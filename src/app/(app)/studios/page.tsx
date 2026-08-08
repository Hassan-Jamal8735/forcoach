import { apiFetch } from "@/lib/api/server-client";
import type { Studio } from "@/lib/api/studios";
import { cn } from "@/lib/utils";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import { getUserCurrency } from "@/lib/user-currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StudioFormDialog } from "./studio-form-dialog";
import { DeleteStudioButton } from "./delete-studio-button";
import { CoachMark } from "@/components/onboarding/coach-mark";

function formatCompensation(studio: Studio, currencyCode: CurrencyCode) {
  const amount = formatCurrency(studio.compensation_value, currencyCode);
  return studio.compensation_type === "hourly"
    ? `${amount} / hour`
    : `${amount} / class`;
}

export default async function StudiosPage() {
  const studios = await apiFetch<Studio[]>("/studios");
  const currencyCode = await getUserCurrency();
  const sorted = [...studios].sort((a, b) =>
    a.status === b.status ? 0 : a.status === "active" ? -1 : 1,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Studios</h1>
          <p className="text-muted-foreground mt-1">
            Manage the studios you coach at and their compensation rates.
          </p>
        </div>
        {sorted.length === 0 ? (
          <CoachMark
            id="studios-add"
            align="end"
            title="Start here"
            message="Add each studio you coach at, along with its pay rate (hourly or per class). You'll need this before events can be assigned for earnings tracking."
          >
            <StudioFormDialog trigger={<Button>Add studio</Button>} />
          </CoachMark>
        ) : (
          <StudioFormDialog trigger={<Button>Add studio</Button>} />
        )}
      </div>

      {sorted.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal text-muted-foreground">
              No studios yet
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Add your first studio to start tracking hours and earnings there.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((studio) => (
            <Card
              key={studio.id}
              className={cn(studio.status === "inactive" && "opacity-60")}
            >
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-lg">{studio.name}</CardTitle>
                  {studio.contact_person && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {studio.contact_person}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Badge variant="secondary">
                    {studio.compensation_type === "hourly" ? "Hourly" : "Per class"}
                  </Badge>
                  {studio.status === "inactive" && (
                    <Badge variant="outline">Inactive</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm font-medium">
                  {formatCompensation(studio, currencyCode)}
                </p>
                {(studio.email || studio.phone) && (
                  <p className="text-sm text-muted-foreground">
                    {[studio.email, studio.phone].filter(Boolean).join(" · ")}
                  </p>
                )}
                {studio.notes && (
                  <p className="text-sm text-muted-foreground">{studio.notes}</p>
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <StudioFormDialog
                    studio={studio}
                    trigger={
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    }
                  />
                  <DeleteStudioButton id={studio.id} name={studio.name} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
