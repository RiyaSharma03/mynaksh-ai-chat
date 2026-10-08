import type { ComponentType } from 'react';

/**
 * A recommendation attached to an AI message.
 *
 * `type` is deliberately an open string, not a union: the backend can ship a new
 * experience before this app knows about it. Known types get a dedicated card;
 * unknown ones fall back to a generic card instead of crashing.
 */
export interface Recommendation {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  /** Type-specific extras (price, coupon code, …), read by that type's card. */
  data?: Record<string, unknown>;
}

/** What a card can do when pressed (passed in, so definitions stay plain objects). */
export interface RecommendationActions {
  showAlert(title: string, message?: string): void;
  /** Sends a chat message on the user's behalf, e.g. to start a consultation. */
  sendMessage(text: string): void;
}

/** How one recommendation type looks and behaves on the shared card. */
export interface RecommendationDefinition {
  /** Short type label shown on the card, e.g. "Gemstone". */
  label: string;
  icon: string;
  /** Hex colour for the icon tint, label and button. */
  accent: string;
  ctaLabel: string;
  /** Optional type-specific content, e.g. a price or coupon code. */
  Body?: ComponentType<{ recommendation: Recommendation }>;
  /** Defaults to an alert with the title and subtitle. */
  onPress?(
    recommendation: Recommendation,
    actions: RecommendationActions,
  ): void;
}
