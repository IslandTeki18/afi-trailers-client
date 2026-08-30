"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { PICKUP_ADDRESS } from "./rentalTerms";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function pickupDate(start: number) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/Denver",
  }).format(new Date(start));
}

function confirmationUrl(bookingId: string) {
  return `${process.env.SITE_URL ?? ""}/bookings/${bookingId}/confirmation`;
}

async function sendEmail(to: string, subject: string, html: string) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to,
      subject,
      html,
    });
  } catch (error) {
    console.error("Email notification failed", error);
  }
}

async function sendSms(to: string, body: string) {
  try {
    const sid = process.env.TWILIO_ACCOUNT_SID!;
    const token = process.env.TWILIO_AUTH_TOKEN!;
    const from = process.env.TWILIO_FROM!;
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${sid}:${token}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: to, From: from, Body: body.slice(0, 320) }),
      }
    );
    if (!response.ok) throw new Error(await response.text());
  } catch (error) {
    console.error("SMS notification failed", error);
  }
}

export const sendBookingConfirmation = internalAction({
  args: { bookingId: v.id("bookings") },
  handler: async (ctx, { bookingId }) => {
    const { booking, renter } = await ctx.runQuery(
      internal.stripeData.bookingContext,
      { bookingId }
    );
    const pickup = pickupDate(booking.start);
    const link = confirmationUrl(bookingId);
    const hitch = booking.addOns.adjustableHitch
      ? "Adjustable hitch is included with your booking."
      : "Expected hookup: 2-5/16 ball and 7-blade connector.";

    await sendEmail(
      renter.email,
      `Your AFI trailer pickup: ${pickup}`,
      `<p>Your pickup is ${pickup} at ${PICKUP_ADDRESS}.</p>
<p>Before you come: bring your driver's license, check your truck tires, and confirm ${hitch.toLowerCase()}</p>
<p>Cancellation policy: full refund 24+ hours before one-day rentals or 48+ hours before multi-day rentals; shorter notice may keep part of the rental fee.</p>
<p><a href="${link}">View booking confirmation</a></p>`
    );

    if (renter.phone) {
      await sendSms(
        renter.phone,
        `AFI pickup ${pickup} at ${PICKUP_ADDRESS}. Bring license, check truck tires, ${hitch} ${link}`
      );
    }
  },
});

export const sendInvoiceLink = internalAction({
  args: {
    bookingId: v.id("bookings"),
    url: v.string(),
    amount: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, { bookingId, url, amount, reason }) => {
    const { renter } = await ctx.runQuery(internal.stripeData.bookingContext, {
      bookingId,
    });
    await sendEmail(
      renter.email,
      `AFI trailer invoice: ${money(amount)}`,
      `<p>An additional ${money(amount)} invoice is ready for your trailer rental.</p>
<p>Reason: ${reason}</p>
<p><a href="${url}">Pay invoice</a></p>`
    );
    if (renter.phone) {
      await sendSms(
        renter.phone,
        `AFI trailer invoice ${money(amount)} for ${reason}: ${url}`
      );
    }
  },
});
