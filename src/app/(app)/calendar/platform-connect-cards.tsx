"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "@/lib/toast";
import { createIcsFeed } from "./actions";

type Platform = {
  key: string;
  label: string;
  // Full lockup (icon + wordmark) — shown alone, without a separate text
  // label, since the logo already reads the platform name. Only set when
  // we have a real, verified-good asset; otherwise fall back to a colored
  // initials badge + text label.
  logo?: string;
  initials?: string;
  color?: string;
  tagline: string;
  instructions: React.ReactNode;
};

const PLATFORMS: Platform[] = [
  {
    key: "mindbody",
    label: "Mindbody",
    logo: "/brand/platforms/mindbody.png",
    tagline: "International fitness platform",
    instructions: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Open the <strong>Mindbody Business</strong> app on your phone — not
          the regular Mindbody app clients use to book classes.
        </li>
        <li>
          Log in with your <strong>staff</strong> login. This won&apos;t
          appear on an owner login, even if you also teach.
        </li>
        <li>
          Tap <strong>More</strong> in the bottom bar, then{" "}
          <strong>Settings</strong>.
        </li>
        <li>
          Scroll to the <strong>Schedule</strong> section and tap{" "}
          <strong>Export My Schedule</strong>.
        </li>
        <Image
          src="/help/mindbody-export-settings.png"
          alt="Mindbody Business app Settings screen, showing Export My Schedule under the Schedule section"
          width={923}
          height={1300}
          className="my-2 rounded-md border"
        />
        <li>
          In the popup, tap <strong>Copy Link</strong>, then paste it below.
        </li>
        <Image
          src="/help/mindbody-export-popup.png"
          alt="Export My Schedule popup with Export, Copy Link, and Cancel options"
          width={923}
          height={1300}
          className="my-2 rounded-md border"
        />
        <p className="text-xs">
          Schedules sync per studio — if you teach at more than one Mindbody
          studio, repeat this once for each one.
        </p>
      </ol>
    ),
  },
  {
    key: "bsport",
    label: "Bsport",
    logo: "/brand/platforms/bsport.png",
    tagline: "Premium studios · France & Europe",
    instructions: (
      <ol className="list-decimal space-y-2 pl-5">
        <li>Log in to Bsport from a browser or the app.</li>
        <li>
          Look under your <strong>Settings</strong> or{" "}
          <strong>Calendar</strong> section for an <strong>export</strong> or{" "}
          <strong>sync</strong> option.
        </li>
        <li>Copy the link it gives you and paste it below.</li>
        <p className="text-xs">
          Can&apos;t find it? Send us a screenshot of your settings menu and
          we&apos;ll point you to the exact spot.
        </p>
      </ol>
    ),
  },
];

function ConnectPlatformDialog({
  platform,
  studios,
}: {
  platform: Platform;
  studios: { id: string; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [studioId, setStudioId] = useState("none");
  const [error, setError] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  function handleConnect() {
    setError(undefined);
    startTransition(async () => {
      const result = await createIcsFeed(
        url,
        platform.label,
        studioId !== "none" ? studioId : undefined,
      );
      if (result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setUrl("");
      setStudioId("none");
      toast(
        `${platform.label} connected — ${result.result?.created ?? 0} classes imported`,
      );
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Connect {platform.label}</Button>} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect {platform.label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="text-sm text-muted-foreground">
            {platform.instructions}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${platform.key}-url`}>Schedule link</Label>
            <Input
              id={`${platform.key}-url`}
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${platform.key}-studio`}>
              Default studio (optional)
            </Label>
            <Select value={studioId} onValueChange={(v) => setStudioId(v ?? "none")}>
              <SelectTrigger id={`${platform.key}-studio`} className="w-full">
                <SelectValue>
                  {(value: string) =>
                    value === "none"
                      ? "No default studio"
                      : (studios.find((s) => s.id === value)?.name ??
                        "No default studio")
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No default studio</SelectItem>
                {studios.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button disabled={isPending || !url} onClick={handleConnect}>
              {isPending ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PlatformConnectCards({
  studios,
}: {
  studios: { id: string; name: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {PLATFORMS.map((platform) => (
        <Card key={platform.key}>
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center gap-3">
              {platform.logo ? (
                <Image
                  src={platform.logo}
                  alt={platform.label}
                  width={36}
                  height={36}
                  className="size-9 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div
                  className={`flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white ${platform.color}`}
                >
                  {platform.initials}
                </div>
              )}
              <div>
                <p className="font-medium">{platform.label}</p>
                <p className="text-xs text-muted-foreground">
                  {platform.tagline}
                </p>
              </div>
            </div>
            <ConnectPlatformDialog platform={platform} studios={studios} />
          </CardContent>
        </Card>
      ))}
      <Card className="opacity-60">
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#7c3aed] text-sm font-semibold text-white">
              M
            </div>
            <div>
              <p className="font-medium">Momence</p>
              <Badge variant="outline" className="mt-0.5">
                Coming soon
              </Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Integration under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
