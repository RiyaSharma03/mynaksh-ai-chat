export const FEEDBACK_REASONS = {
  inaccurate: 'Inaccurate',
  too_generic: 'Too Generic',
  didnt_help: "Didn't Help",
  too_long: 'Too Long',
} as const;

export type FeedbackReason = keyof typeof FEEDBACK_REASONS;

export interface Feedback {
  rating: 'like' | 'dislike' | null;
  reasons: FeedbackReason[];
}
