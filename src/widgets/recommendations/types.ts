import type { ComponentType } from 'react';
import type { Recommendation } from '../../types/recommendation';

/** What a card may do when pressed. Injected, so definitions stay plain data + functions. */
export interface RecommendationActions {
  showAlert(title: string, message?: string): void;
  /** Sends a chat message on the user's behalf, e.g. to start a consultation. */
  sendMessage(text: string): void;
}

/**
 * Everything that makes one recommendation type distinct. The shared card
 * renders any definition, so a new type is a new definition, never a change
 * to chat, list or card code.
 */
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
