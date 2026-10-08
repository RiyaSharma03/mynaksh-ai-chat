/**
 * A recommendation attached to an AI message.
 *
 * `type` is deliberately an open string, not a union: the backend can ship a new
 * experience before this app knows about it. Known types get a dedicated card
 * (step 5); unknown ones fall back to a generic card instead of crashing.
 */
export interface Recommendation {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  /** Type-specific extras (price, coupon code, …), read by that type's card. */
  data?: Record<string, unknown>;
}
