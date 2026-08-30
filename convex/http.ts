import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();
const siteOrigin = process.env.SITE_URL;

function corsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Origin": origin === siteOrigin ? origin : siteOrigin,
    Vary: "Origin",
  };
}

http.route({
  path: "/agreement/sign",
  method: "OPTIONS",
  handler: httpAction(async (_, request) =>
    new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) })
  ),
});

http.route({
  path: "/agreement/sign",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const origin = request.headers.get("origin");
    const headers = {
      ...corsHeaders(origin),
      "Content-Type": "application/json",
    };
    if (origin && origin !== siteOrigin) {
      return new Response(JSON.stringify({ error: "ORIGIN_NOT_ALLOWED" }), {
        status: 403,
        headers,
      });
    }

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return new Response(JSON.stringify({ error: "UNAUTHENTICATED" }), {
        status: 401,
        headers,
      });
    }
    const renter = await ctx.runQuery(internal.agreement.renterIdForClerk, {
      clerkUserId: identity.subject,
    });
    if (!renter) {
      return new Response(JSON.stringify({ error: "RENTER_NOT_FOUND" }), {
        status: 404,
        headers,
      });
    }

    try {
      const { bookingId, signatureName, initials } = await request.json();
      const forwarded = request.headers.get("x-forwarded-for");
      const ip =
        forwarded?.split(",")[0]?.trim() ||
        request.headers.get("cf-connecting-ip") ||
        "unknown";
      await ctx.runMutation(internal.agreement.sign, {
        bookingId,
        renterId: renter._id,
        signatureName,
        initials,
        ip,
      });
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
    } catch (error) {
      return new Response(
        JSON.stringify({
          error: error instanceof Error ? error.message : "INVALID_REQUEST",
        }),
        { status: 400, headers }
      );
    }
  }),
});

export default http;
