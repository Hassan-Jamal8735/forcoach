"use client";

import { useState, useTransition } from "react";
import { createStudio, updateStudio } from "./actions";
import type { Studio } from "@/lib/api/studios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function StudioFormDialog({
  studio,
  trigger,
}: {
  studio?: Studio;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setError(undefined);
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{studio ? "Edit studio" : "Add studio"}</DialogTitle>
        </DialogHeader>
        <form
          action={(formData) => {
            startTransition(async () => {
              const result = studio
                ? await updateStudio(studio.id, {}, formData)
                : await createStudio({}, formData);
              if (result.error) {
                setError(result.error);
              } else {
                setOpen(false);
              }
            });
          }}
          className="space-y-4"
        >
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="name">Studio name *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={studio?.name}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="compensationType">Compensation</Label>
              <Select
                name="compensationType"
                defaultValue={studio?.compensation_type ?? "hourly"}
              >
                <SelectTrigger id="compensationType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly rate</SelectItem>
                  <SelectItem value="per_class">Per class rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="compensationValue">Rate</Label>
              <Input
                id="compensationValue"
                name="compensationValue"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={studio?.compensation_value}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select name="status" defaultValue={studio?.status ?? "active"}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Inactive studios are hidden from new event assignment but keep
              their history.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="referenceId">Reference ID</Label>
              <Input
                id="referenceId"
                name="referenceId"
                defaultValue={studio?.reference_id ?? undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact person</Label>
              <Input
                id="contactPerson"
                name="contactPerson"
                defaultValue={studio?.contact_person ?? undefined}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={studio?.email ?? undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={studio?.phone ?? undefined}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={studio?.address ?? undefined}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="matchKeywords">
              Extra matching words{" "}
              <span className="font-normal text-muted-foreground">
                — optional, usually not needed
              </span>
            </Label>
            <Input
              id="matchKeywords"
              name="matchKeywords"
              defaultValue={(studio?.match_keywords ?? []).join(", ")}
              placeholder="e.g. Victor Hugo"
            />
            <p className="text-xs text-muted-foreground">
              Imported classes are matched to this studio by its name
              automatically. Only add words here if your classes refer to the
              studio differently, for example by street name. Separate with
              commas.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              defaultValue={studio?.notes ?? undefined}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : studio ? "Save changes" : "Add studio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
