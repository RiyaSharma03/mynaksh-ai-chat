/**
 * The shape the backend sends, before normalization. Everything beyond
 * id/type is optional because a server response can't be trusted to be complete.
 */
export interface WireRecommendation {
  id?: string;
  type?: string;
  title?: string;
  subtitle?: string;
  data?: Record<string, unknown>;
}

export interface WireMessage {
  id?: string;
  type?: string;
  text?: string;
  createdAt?: string;
  replyToId?: string;
  author?: { name?: string };
  recommendations?: WireRecommendation[];
}
