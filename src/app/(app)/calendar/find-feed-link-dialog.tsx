"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Where to find the calendar export link on the platforms coaches actually
 * use. Mindbody's steps come from a coach walking through it live with us —
 * everything else is the general pattern most booking platforms follow.
 */
export function FindFeedLinkDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs"
          >
            <HelpCircle className="mr-1 size-3" />
            Where do I find this link?
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Finding your calendar link</DialogTitle>
        </DialogHeader>
        <Accordion className="w-full">
          <AccordionItem value="mindbody">
            <AccordionTrigger className="text-left">Mindbody</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  Open the <strong>Mindbody Business</strong> app on your
                  phone — not the regular Mindbody app clients use to book
                  classes.
                </li>
                <li>
                  Log in with your <strong>staff</strong> login. This
                  won&apos;t appear on an owner login, even if you also
                  teach.
                </li>
                <li>
                  Tap <strong>More</strong> in the bottom bar, then{" "}
                  <strong>Settings</strong>.
                </li>
                <li>
                  Scroll to the <strong>Schedule</strong> section and tap{" "}
                  <strong>Export My Schedule</strong>.
                </li>
                <li>
                  In the popup, tap <strong>Copy Link</strong>.
                </li>
                <li>Paste that link into the Feed URL field here.</li>
              </ol>
              <p className="mt-2 text-xs">
                Schedules sync per studio, so if you teach at more than one
                Mindbody studio, repeat this for each one.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="bsport">
            <AccordionTrigger className="text-left">Bsport</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <ol className="list-decimal space-y-2 pl-5">
                <li>Log in to Bsport from a browser or the app.</li>
                <li>
                  Look under your <strong>Settings</strong> or{" "}
                  <strong>Calendar</strong> section for an{" "}
                  <strong>export</strong> or <strong>sync</strong> option.
                </li>
                <li>
                  Copy the link it gives you and paste it into the Feed URL
                  field here.
                </li>
              </ol>
              <p className="mt-2 text-xs">
                If you can&apos;t find it, send us a screenshot of your
                settings menu and we&apos;ll point you to the exact spot.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="other">
            <AccordionTrigger className="text-left">
              Another platform
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              <p>
                Most booking platforms have this under{" "}
                <strong>Settings</strong>, usually worded as{" "}
                <strong>&ldquo;Export calendar&rdquo;</strong>,{" "}
                <strong>&ldquo;Sync calendar&rdquo;</strong>, or{" "}
                <strong>&ldquo;iCal / ICS link&rdquo;</strong>. It gives you a
                link ending in <code>.ics</code> — paste that here.
              </p>
              <p className="mt-2 text-xs">
                Not finding it? Let us know which platform you use and
                we&apos;ll help you track it down.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
}
