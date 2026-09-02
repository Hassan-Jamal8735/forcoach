import type { BlogPost } from "../types";

export const post: BlogPost = {
  slug: "how-to-invoice-fitness-studios",
  title: "How to Invoice Fitness Studios as a Freelance Instructor",
  description:
    "A practical guide to invoicing the studios you teach at — what to include, how to track hours across multiple locations, and how to avoid the most common mistakes.",
  date: "2026-09-02",
  content: (
    <>
      <p>
        If you teach at more than one studio, invoicing quickly turns into
        one of the most tedious parts of the job — tracking which classes
        happened where, at what rate, and chasing down payment. Here&apos;s
        how to do it properly.
      </p>

      <h2>What every invoice should include</h2>
      <ul>
        <li>Your name and SIRET (or equivalent business registration)</li>
        <li>The studio&apos;s name and billing details</li>
        <li>A clear billing period (e.g. one calendar month)</li>
        <li>
          Each class listed individually — date, class name, duration, rate,
          and amount
        </li>
        <li>A subtotal, VAT if applicable, and a total</li>
        <li>A due date</li>
      </ul>
      <p>
        Studios that manage multiple instructors will often ask for this
        level of detail anyway, so it&apos;s worth building the habit even
        if your current studio doesn&apos;t require it.
      </p>

      <h2>Track hours as you go, not at the end of the month</h2>
      <p>
        The single biggest source of invoicing errors is trying to
        reconstruct a month of classes from memory right before billing is
        due. If your schedule already lives in a calendar (Google Calendar,
        or an export from your studio&apos;s booking platform), that data
        can drive your invoice directly instead of being retyped.
      </p>

      <h2>Different studios, different rates</h2>
      <p>
        Many instructors are paid differently by different studios — hourly
        at one, a flat rate per class at another. Keeping that straight by
        hand across five studios is where mistakes creep in. Whatever
        system you use, make sure each studio&apos;s rate is set once and
        applied automatically, rather than calculated by hand every time.
      </p>

      <h2>Keep a permanent record</h2>
      <p>
        Once an invoice has actually been sent, don&apos;t edit it — issue a
        credit note or a new invoice instead. Studios and accountants both
        expect an invoice number, once issued, to represent a real,
        unchanging document.
      </p>

      <p>
        This is exactly the workflow FORCOACH is built around: your classes
        come in from your calendar automatically, each studio has its own
        rate, and generating an invoice for a period is one click instead of
        an afternoon of spreadsheet work.
      </p>
    </>
  ),
};
