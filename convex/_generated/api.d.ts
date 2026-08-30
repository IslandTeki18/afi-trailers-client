/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agreement from "../agreement.js";
import type * as bookings from "../bookings.js";
import type * as handoff from "../handoff.js";
import type * as http from "../http.js";
import type * as lib_auth from "../lib/auth.js";
import type * as lib_status from "../lib/status.js";
import type * as notifications from "../notifications.js";
import type * as photos from "../photos.js";
import type * as qualification from "../qualification.js";
import type * as rentalTerms from "../rentalTerms.js";
import type * as renters from "../renters.js";
import type * as stripe from "../stripe.js";
import type * as stripeData from "../stripeData.js";
import type * as stripeWebhooks from "../stripeWebhooks.js";
import type * as vehicles from "../vehicles.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agreement: typeof agreement;
  bookings: typeof bookings;
  handoff: typeof handoff;
  http: typeof http;
  "lib/auth": typeof lib_auth;
  "lib/status": typeof lib_status;
  notifications: typeof notifications;
  photos: typeof photos;
  qualification: typeof qualification;
  rentalTerms: typeof rentalTerms;
  renters: typeof renters;
  stripe: typeof stripe;
  stripeData: typeof stripeData;
  stripeWebhooks: typeof stripeWebhooks;
  vehicles: typeof vehicles;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
